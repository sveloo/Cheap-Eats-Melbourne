'use strict';

//Initialise my variables
var map;
var vm;
var markers;
var bounds;
var contentString;
var restaurantInfoWindow;

// Restaurants data consisting of name, coords (lat & lng coordinates) and cuisine category for filtering.
// This list taken from a recent review by TimeOut magazine of the top 20 restaurants in Melbourne with meals under $20.

// Model information.
var restaurantArray = [
    {name: 'Soi 38', coords: {lat: -37.8124841, lng: 144.9697461}, cuisine: 'Thai'},
    {name: 'ShanDong MaMa', coords: {lat: -37.8126419, lng: 144.9651844}, cuisine: 'Asian'},
    {name: 'Very Good Falafel', coords: {lat: -37.7624218, lng: 144.9605451}, cuisine: 'Kebabs'},
    {name: 'Biggie Smalls', coords: {lat: -37.8057634, lng: 144.9811375}, cuisine: 'Kebabs'},
    {name: 'Naked for Satan', coords: {lat: -37.7987607, lng: 144.9760093}, cuisine: 'Spanish'},
    {name: 'Pellegrini\'s Espresso Bar', coords: {lat: -37.8116955, lng: 144.9690115}, cuisine: 'Italian'},
    {name: 'Grand Trailer Park Taverna', coords: {lat: -37.8121679, lng: 144.970828}, cuisine: 'Burgers'},
    {name: 'Heartattack and Vine', coords: {lat: -37.7976326, lng: 144.9649691}, cuisine: 'Pub Meals'},
    {name: 'Laksa King', coords: {lat: -37.7878707, lng: 144.9274462}, cuisine: 'Asian'},
    {name: 'Trippy Taco', coords: {lat: -37.8065107, lng: 144.9802333}, cuisine: 'Mexican'},
    {name: 'Shujinko', coords: {lat: -37.8113177, lng: 144.9649363}, cuisine: 'Japanese'},
    {name: 'Bimbo Deluxe', coords: {lat: -37.7960887, lng: 144.9768523}, cuisine: 'Pizza'},
    {name: 'Arbory Bar and Eatery', coords: {lat: -37.8189329, lng: 144.9639345}, cuisine: 'Pubmeal'},
    {name: 'Slice Girls West', coords: {lat: -37.8018787, lng: 144.9045083}, cuisine: 'Burgers'},
    {name: 'Middle Fish', coords: {lat: -37.802564, lng: 144.9568226}, cuisine: 'Seafood'},
    {name: 'Game Chicken', coords: {lat: -37.8143223, lng: 144.9587169}, cuisine: 'Korean'},
    {name: 'African Taste', coords: {lat: -37.8037938, lng: 144.8899948}, cuisine: 'African'},
    {name: 'Purple Peanuts Japanese Café', coords: {lat: -37.8186653, lng: 144.9520687}, cuisine: 'Japanese'},
    {name: 'Katarina Zrinski Restaurant', coords: {lat: -37.8043028, lng: 144.9023621}, cuisine: 'Russian'},
    {name: 'Tiba\'s Lebanese Food', coords: {lat: -37.7661628, lng: 144.9603235}, cuisine: 'Kebabs'}
];

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.9701542, lng: 144.4927086},
        mapTypeId: 'terrain',
        zoom: 16
    });

    //Initialise Knockout
    vm = new ViewModel();
    ko.applyBindings(vm);
}


// Error call handle
function googleError() {
    alert('For some reason Google Maps isn\'t loading, have you checked your connection?')
}

//  The restaurant object creator
// var Restaurant = function(data) {
//     this.cuisine = data.cuisine;
//     // etc.

//     this.menu = ko.computed(function(){
//         //
//     });
// };

var ViewModel = function() {

    var self = this;

    // An array to store all the markers and corresponsing Google Map API marker information.
    markers = [];

    // Setting up boundaries using the Google Maps API documentation
    bounds = new google.maps.LatLngBounds();

    // Make the restaurant Array an observable array in this instance
    self.myRestaurants = ko.observableArray(restaurantArray);

    // If using the restaurant object creator then unqoute these lines.
    // self.myRestaurants = ko.observableArray();
    // restaurantArray.forEach(function(restaurant) {
    //     self.myRestaurants.push(new Restaurant(restaurant));
    // });

    // Create the infowindow
    restaurantInfoWindow = new google.maps.InfoWindow();

    // Loop through the restaurantArray to create the markers
    self.myRestaurants().forEach(function(restaurant) {

        var marker = new google.maps.Marker({
            map: map,
            position: restaurant.coords,
            title: restaurant.name,
            cuisine: restaurant.cuisine,
            // Animate the dropping of each marker pin
            animation: google.maps.Animation.DROP
        });

        // // Create a reference to the marker data in the restaurant object.
        restaurant.marker = marker;

        // Push the marker into the markers array.
        markers.push(marker);

        // Fit the map to the boundaries of the markers.
        bounds.extend(marker.position);
        map.fitBounds(bounds);

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            // Set the layout of the infowindow
            contentString = '<div><h4>' + marker.title + '</h4><p>' + marker.cuisine + '</p></div>';
            // Open the infowindow and load the layout
            restaurantInfoWindow.open(map, marker);
            restaurantInfoWindow.setContent(contentString);

            // YELP API AUTHENTICATION
            function nonce_generate() {
                return (Math.floor(Math.random() * 1e12).toString());
            }

            var yelp_url = 'http://api.yelp.com/v2/search';

            var YELP_KEY = 'khBkEOW5FohZSnMNSp9NlQ',
                YELP_TOKEN = 'sv3hcY_HyOH2WdjWuEjCHbDXhhLwnz_X',
                YELP_KEY_SECRET = 'vPFLQCN_HH1v33bDuUTHv479WF8',
                YELP_TOKEN_SECRET = 'xn8agIL0m-1MU_Aw3Ng8UbC9bL0';

            var parameters = {
                oauth_consumer_key: YELP_KEY,
                oauth_token: YELP_TOKEN,
                oauth_nonce: nonce_generate(),
                oauth_timestamp: Math.floor(Date.now()/1000),
                oauth_signature_method: 'HMAC-SHA1',
                oauth_version : '1.0',
                callback: 'cb'              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
            };

            var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
            parameters.oauth_signature = encodedSignature;

            var settings = {
                url: yelp_url,
                data: parameters,
                cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
                dataType: 'jsonp',
                success: function(results) {
                    // Do stuff with results
                    console.log("Yelp! Success");
                },
                error: function() {
                    // Do stuff on fail
                    console.log("Yelp! Fail!");
                }
            };

            // Send AJAX query via jQuery library.
            $.ajax(settings);
        });

    });

    self.populateInfoWindow = function (restaurant){
        console.log(restaurant);
        var marker = restaurant.marker;
        google.maps.event.trigger(marker, 'click');

    };

// Closes the ViewModel
}


