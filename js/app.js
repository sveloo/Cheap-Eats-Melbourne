'use strict';

// Declaring global variables
var map;
var vm;
var markers;
var cuisine;
var cuisines;
var filteredCuisines;
var selectedCuisine;
var bounds;
var contentString;
var restaurantInfoWindow;


// THE MODEL
// An array to store all the restaurant information.
var restaurantArray = [
    {name: 'Soi 38', coords: {lat: -37.8124841, lng: 144.9697461}, cuisine: 'Thai'},
    {name: 'ShanDong MaMa', coords: {lat: -37.8126419, lng: 144.9651844}, cuisine: 'Asian'},
    {name: 'Pellegrini\’s', coords: {lat: -37.8116955, lng: 144.9690115}, cuisine: 'Italian'},
    {name: 'Grand Trailer Park Taverna', coords: {lat: -37.8121679, lng: 144.970828}, cuisine: 'Burgers'},
    {name: 'Shujinko', coords: {lat: -37.8113177, lng: 144.9649363}, cuisine: 'Japanese'},
    {name: 'Game Chicken', coords: {lat: -37.8143223, lng: 144.9587169}, cuisine: 'Korean'},
    {name: 'Purple Peanuts Japanese Café', coords: {lat: -37.8186653, lng: 144.9520687}, cuisine: 'Japanese'},
    {name: 'Pho Dzung City Noodle Shop', coords: {lat: -37.810920, lng: 144.967676}, cuisine: 'Vietnamese'}
];

// An array to store all the markers and corresponsing Google Map API marker information.
markers = [];

// An array to store all the cuisines .
cuisines = [];

// An array to store the user cuisine selection from the dropdown list.
selectedCuisine = [];


// Initialise Google Maps
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.813531, lng: 144.965633},
        mapTypeId: 'terrain',
        zoom: 15
    });

    //Initialise Knockout
    vm = new ViewModel();
    ko.applyBindings(vm);
}


// Initialise the ViewModel
var ViewModel = function() {

    var self = this;

    // Setup boundaries using the Google Maps API.
    bounds = new google.maps.LatLngBounds();

    // Create a single infowindow for reuse so that the map does not open multiple windows.
    restaurantInfoWindow = new google.maps.InfoWindow();

    // Make cuisines array an observarable array in this instance.
    self.myCuisines = ko.observableArray(cuisines);

    // Make the selectedCuisine array an observable array in this instance.
    self.mySelectedCuisine = ko.observableArray(selectedCuisine)

    // Make the restaurant array an observable array in this instance.
    self.myRestaurants = ko.observableArray(restaurantArray);

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

        // Create a reference to the marker data in the restaurant object.
        // Push the marker into the markers array.
        restaurant.marker = marker;
        markers.push(marker);

        // Create a reference to cuisine data in the restaurant array for each restaurant.
        // Push the each restaurant entry cuisine into the cuisines array.
        // Filter the cuisines and pushed to the filtered cuisines array. Got this snippet from Stack Overflow.
        cuisine = restaurant.cuisine;
        cuisines.push(cuisine);
        cuisines = $.unique(cuisines.sort());

        // Fit the map to the boundaries of the markers.
        bounds.extend(marker.position);
        // map.fitBounds(bounds);

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {

            // YELP API AUTHENTICATION
            function nonce_generate() {
                return (Math.floor(Math.random() * 1e12).toString());
            }

            var yelp_url = 'https://api.yelp.com/v2/search?term=' + marker.title;

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
                callback: 'cb',              // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
                term: 'restaurants',
                location: 'Melbourne+Victoria+Australia',
            };

            var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
            parameters.oauth_signature = encodedSignature;

            var settings = {
                url: yelp_url,
                data: parameters,
                cache: true,                // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
                dataType: 'jsonp',
                success: function(results) {
                    // Confirm API succesfully connected
                    console.log("Yelp! Success");

                    // Setup variables for Yelp specific results
                    var yelpUrl = results.businesses[0].url;
                    var yelpSnippet = results.businesses[0].snippet_text;
                    var yelpStars = results.businesses[0].rating_img_url_large;

                    // Setup the layout of the infowindow
                    contentString = '<div id="infoWindow"><h3><a href=' + yelpUrl + ' target="_blank">'
                                        + marker.title + '</a></h3><p><strong>'
                                        + marker.cuisine + '</strong></p><p>'
                                        + yelpSnippet + '</p><p>'
                                        + '<img src="' + yelpStars + '"/></div>';

                    // Open the infowindow and load the layout
                    restaurantInfoWindow.open(map, marker);
                    restaurantInfoWindow.setContent(contentString);
                },
                error: function() {
                    // Error message on API load failure.
                    console.log("Yelp! Fail!");
                }
            };

            // Send AJAX query via jQuery library.
            $.ajax(settings);
        });

    });

    self.myMarkers = ko.observableArray(markers);

    self.mySelectedCuisine = function(selectedCuisine) {
        console.log("You selected " + selectedCuisine);
        // Do stuff here to show only selectedCuisine markers and restaurant list.
        // filteredCuisines = ko.utils.arrayFilter(this.myMarkers(), function () {
        //      return (marker.cuisine === selectedCuisine);
        //      console.log(myMarkers);
        //      self.myRestaurants(myMarkers);
        // });
    }

    self.populateInfoWindow = function (restaurant){
        var marker = restaurant.marker;
        google.maps.event.trigger(marker, 'click');
    };


// Closes the ViewModel
}

// Error call handle
function googleError() {
    alert('For some reason Google Maps isn\'t loading, have you checked your Internet or Wifi connection?')
}


