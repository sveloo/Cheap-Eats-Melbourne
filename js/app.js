'use strict';

// Initialise the Google Map
var map;
var marker;
var vm;


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

        // // Create a reference to the marker data in the restaurant object.
        // restaurant.marker = marker;

        // Push the marker into the markers array.
        markers.push(marker);

        // Fit the map to the boundaries of the markers.
        bounds.extend(marker.position);
        map.fitBounds(bounds);

        // Create the layout of the info window.
        var contentString = '<div><h4>' + marker.title + '</h4><p>' + marker.cuisine + '</p>';
        var restaurantInfoWindow = new google.maps.InfoWindow({
            content: contentString
        });

        // Create an onclick event to open an infowindow at each marker.

        // google.maps.event.trigger(marker, 'click', populateInfoWindow(marker, restaurantInfoWindow));

        marker.addListener('click', function() {
            self.populateInfoWindow(marker, restaurantInfoWindow);
        });

        self.populateInfoWindow = function (marker, restaurantInfoWindow){
            console.log("Click!")
            console.log(marker);
            console.log(this.marker);
            restaurantInfoWindow.open(map, marker);
        };



    });


// Closes the ViewModel
}
