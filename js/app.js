'use strict';

var map;
var markers = [];


function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.9701542, lng: 144.4927086},
        zoom: 15
    });

    var locations = [
        {title: 'Soi 38', location: {lat: -37.8124841, lng: 144.9697461}},
        {title: 'ShanDong MaMa', location: {lat: -37.8126419, lng: 144.9651844}},
        {title: 'Very Good Falafel', location: {lat: -37.7624218, lng: 144.9605451}},
        {title: 'Biggie Smalls', location: {lat: -37.8057634, lng: 144.9811375}},
        {title: 'Naked for Satan', location: {lat: -37.7987607, lng: 144.9760093}},
        {title: 'Pellegrini\'s Espresso Bar', location: {lat: -37.8116955, lng: 144.9690115}},
        {title: 'Grand Trailer Park Taverna', location: {lat: -37.8121679, lng: 144.970828}},
        {title: 'Heartattack and Vine', location: {lat: -37.7976326, lng: 144.9649691}},
        {title: 'Laksa King', location: {lat: -37.7878707, lng: 144.9274462}},
        {title: 'Trippy Taco', location: {lat: -37.8065107, lng: 144.9802333}},
        {title: 'Shujinko', location: {lat: -37.8113177, lng: 144.9649363}},
        {title: 'Bimbo Deluxe', location: {lat: -37.7960887, lng: 144.9768523}},
        {title: 'Arbory Bar and Eatery', location: {lat: -37.8189329, lng: 144.9639345}},
        {title: 'Slice Girls West', location: {lat: -37.8018787, lng: 144.9045083}},
        {title: 'Middle Fish', location: {lat: -37.802564, lng: 144.9568226}},
        {title: 'Game Chicken', location: {lat: -37.8143223, lng: 144.9587169}},
        {title: 'African Taste', location: {lat: -37.8037938, lng: 144.8899948}},
        {title: 'Purple Peanuts Japanese Café', location: {lat: -37.8186653, lng: 144.9520687}},
        {title: 'Katarina Zrinski Restaurant', location: {lat: -37.8043028, lng: 144.9023621}},
        {title: 'Tiba\'s Lebanese Food', location: {lat: -37.7661628, lng: 144.9603235}},
    ];

    // var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
    // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
        map: map,
        position: position,
        title: title,
        animation: google.maps.Animation.DROP,
        id: i
        });

        // Push the marker to our array of markers.
        markers.push(marker);

        // Create an onclick event to open an infowindow at each marker.
        // marker.addListener('click', function() {
        //     populateInfoWindow(this, largeInfowindow);
        // });

        bounds.extend(markers[i].position);

    }

    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);

}

initMap();

