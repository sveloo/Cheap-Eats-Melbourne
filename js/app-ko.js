'use strict'


function mapViewModel() {

    var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -37.9701542, lng: 144.4927086},
        mapTypeId: 'terrain',
        zoom: 16
    });

    var markers = [];
    var locations = [
        {title: 'Soi 38', location: {lat: -37.8124841, lng: 144.9697461}, cuisine: 'Thai'},
        {title: 'ShanDong MaMa', location: {lat: -37.8126419, lng: 144.9651844}, cuisine: 'Asian'},
        {title: 'Very Good Falafel', location: {lat: -37.7624218, lng: 144.9605451}, cuisine: 'Kebabs'},
        {title: 'Biggie Smalls', location: {lat: -37.8057634, lng: 144.9811375}, cuisine: 'Kebabs'},
        {title: 'Naked for Satan', location: {lat: -37.7987607, lng: 144.9760093}, cuisine: 'Spanish'},
        {title: 'Pellegrini\'s Espresso Bar', location: {lat: -37.8116955, lng: 144.9690115}, cuisine: 'Italian'},
        {title: 'Grand Trailer Park Taverna', location: {lat: -37.8121679, lng: 144.970828}, cuisine: 'Burgers'},
        {title: 'Heartattack and Vine', location: {lat: -37.7976326, lng: 144.9649691}, cuisine: 'Pub Meals'},
        {title: 'Laksa King', location: {lat: -37.7878707, lng: 144.9274462}, cuisine: 'Asian'},
        {title: 'Trippy Taco', location: {lat: -37.8065107, lng: 144.9802333}, cuisine: 'Mexican'},
        {title: 'Shujinko', location: {lat: -37.8113177, lng: 144.9649363}, cuisine: 'Japanese'},
        {title: 'Bimbo Deluxe', location: {lat: -37.7960887, lng: 144.9768523}, cuisine: 'Pizza'},
        {title: 'Arbory Bar and Eatery', location: {lat: -37.8189329, lng: 144.9639345}, cuisine: 'Pubmeal'},
        {title: 'Slice Girls West', location: {lat: -37.8018787, lng: 144.9045083}, cuisine: 'Burgers'},
        {title: 'Middle Fish', location: {lat: -37.802564, lng: 144.9568226}, cuisine: 'Seafood'},
        {title: 'Game Chicken', location: {lat: -37.8143223, lng: 144.9587169}, cuisine: 'Korean'},
        {title: 'African Taste', location: {lat: -37.8037938, lng: 144.8899948}, cuisine: 'African'},
        {title: 'Purple Peanuts Japanese Café', location: {lat: -37.8186653, lng: 144.9520687}, cuisine: 'Japanese'},
        {title: 'Katarina Zrinski Restaurant', location: {lat: -37.8043028, lng: 144.9023621}, cuisine: 'Russian'},
        {title: 'Tiba\'s Lebanese Food', location: {lat: -37.7661628, lng: 144.9603235}, cuisine: 'Kebabs'}
    ];

    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {

        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        var cuisine = locations[i].cuisine;

        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            cuisine: cuisine,
            animation: google.maps.Animation.DROP,
            id: i
        });

    // Push the marker into the markers array.
    markers.push(marker);

    // Create an onclick event to open an infowindow at each marker.
    marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow);
    });

    // Display all the restaurants as a list and make them clickable and call the relevant info window
    $('ul').append('<li><a class="restaurant" href="javascript:restaurantClick(' + i + ')">' + locations[i].title + '</a></li>');

    // Set the marker boundaries.
    bounds.extend(markers[i].position);

    }

   // Extend the boundaries of the map for each marker.
   map.fitBounds(bounds);


       // This popups the restaurant info window by clicking the restaurant in the restaurant list.
       function restaurantClick(i) {
           google.maps.event.trigger(markers[i], 'click');
       }


       // Open up and populate the info window when the marker is clicked.
       function populateInfoWindow(marker, infowindow) {
       // Check to make sure the infowindow is not already opened on this marker.
           if (infowindow.marker != marker) {
               infowindow.marker = marker;
               infowindow.setContent('<div><h4>' + marker.title + '</h4></div>');
               infowindow.open(map, marker);
               // Make sure the marker property is cleared if the infowindow is closed.
               infowindow.addListener('closeclick', function() {
               infowindow.marker = null;
               });
           }
       }


       // This function will loop through the markers array and display them all.
       function showListings() {
           var bounds = new google.maps.LatLngBounds();
           // Extend the boundaries of the map for each marker and display the marker
           for (var i = 0; i < markers.length; i++) {
               markers[i].setMap(map);
               bounds.extend(markers[i].position);
           }
           map.fitBounds(bounds);
       }


       // This function will loop through the listings and hide them all.
       function hideListings() {
           for (var i = 0; i < markers.length; i++) {
               markers[i].setMap(null);
           }
       }

       // This function clears the list of restaurants
       function clearRestaurantList() {
           $('li').remove();
       }


       // This function will filter the markers by their cuisine choice
       function filterByCuisine(foodChoice) {
           // Extend the boundaries of the map for each marker and display the marker
           console.log(foodChoice);
           hideListings();
           clearRestaurantList();
           for (var i = 0; i < markers.length; i++) {
               if (foodChoice == "All") {
                   showListings();
                   $('ul').append('<li><a class="restaurant" href="javascript:restaurantClick(' + i + ')">' + markers[i].title + '</a></li>');
               }

               else if (markers[i].cuisine == foodChoice) {
                   console.log(foodChoice + ' is a match!');
                   markers[i].setMap(map);
                   $('ul').append('<li><a class="restaurant" href="javascript:restaurantClick(' + i + ')">' + markers[i].title + '</a></li>');
               }
           }
       }

}


// Activates knockout.js
ko.applyBindings(new mapViewModel());