'use strict';

// Initialise the Google Map
var map;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.9701542, lng: 144.4927086},
        mapTypeId: 'terrain',
        zoom: 16
    });

    //Initialise Knockout
    var vm = new ViewModel();
    ko.applyBindings(vm);
}


// Error call handle
function googleError() {
    alert('For some reason Google Maps isn\'t loading, have you checked your connection?')
}


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


var ViewModel = function() {

    var self = this;

    // An array to store all the markers and corresponsing Google Map API marker information.
    var markers = [];

    // Setting up boundaries using the Google Maps API documentation
    var bounds = new google.maps.LatLngBounds();

    // Setting up InfoWindow as per Google Maps API documentation

    var restaurantInfowindow = new google.maps.InfoWindow;

    // Make the restaurant Array an observable array in this instance
    self.restaurantArray = ko.observableArray(restaurantArray);

    // Loop through the restaurantArray to create the markers
    self.restaurantArray().forEach(function(restaurant) {
        var marker = new google.maps.Marker({
            map: map,
            position: restaurant.coords,
            title: restaurant.name,
            cuisine: restaurant.cuisine,
            // Animate the dropping of each marker pin
            animation: google.maps.Animation.DROP
        });

        // Push the marker into the markers array.
        markers.push(marker);

        // Fit the map to the boundaries of the markers.
        bounds.extend(marker.position);
        map.fitBounds(bounds);

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
          populateInfoWindow(this, restaurantInfowindow);
        });


    });


    // Got this bit from the Udacity coursework.
    function populateInfoWindow(marker, infowindow) {

    // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            infowindow.marker = marker;
            infowindow.setContent('<div><h4>' + marker.title + '</h4><p>' + marker.cuisine + '</p>');
            infowindow.open(map, marker);

            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
        };
    };


    // function drop() {
    //     clearMarkers();
    //     for (var i = 0; i < restaurants.length; i++) {
    //       addMarkerWithTimeout(restaurants[i], i * 200);
    //     }
    //   }

    //   function addMarkerWithTimeout(position, timeout) {
    //     window.setTimeout(function() {
    //       markers.push(new google.maps.Marker({
    //         position: position,
    //         map: map,
    //         animation: google.maps.Animation.DROP
    //       }));
    //     }, timeout);
    //   }

    //   function clearMarkers() {
    //     for (var i = 0; i < markers.length; i++) {
    //       markers[i].setMap(null);
    //     }
    //   }


// Closes the ViewModel
}






