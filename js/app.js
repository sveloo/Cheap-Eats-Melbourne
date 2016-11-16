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
var restaurantArray = [{
    name: 'Brother Baba Budan',
    coords: {
        lat: -37.813548,
        lng: 144.962195
    },
    cuisine: 'Cafe'
}, {
    name: 'Huxtaburger',
    coords: {
        lat: -37.817041,
        lng: 144.962679
    },
    cuisine: 'Burger'
}, {
    name: 'Paperboy Kitchen',
    coords: {
        lat: -37.811578,
        lng: 144.960280
    },
    cuisine: 'Asian'
}, {
    name: 'Little Ramen Bar',
    coords: {
        lat: -37.813121,
        lng: 144.962367
    },
    cuisine: 'Japanese'
}, {
    name: 'The Borek Shop',
    coords: {
        lat: -37.806948,
        lng: 144.959499
    },
    cuisine: 'Turkish'
}, {
    name: 'Purple Peanuts',
    coords: {
        lat: -37.8186653,
        lng: 144.9520687
    },
    cuisine: 'Japanese'
}, {
    name: 'Shanghai Street',
    coords: {
        lat: -37.811326,
        lng: 144.967701
    },
    cuisine: 'Asian'
}, {
    name: 'ShanDong MaMa',
    coords: {
        lat: -37.8126419,
        lng: 144.9651844
    },
    cuisine: 'Asian'
}, {
    name: 'Phò Nom',
    coords: {
        lat: -37.812086,
        lng: 144.963695
    },
    cuisine: 'Vietnamese'
}, {
    name: 'Little Bean Blue',
    coords: {
        lat: -37.812528,
        lng: 144.973335
    },
    cuisine: 'Cafe'
}];

// An array to store all the markers and corresponsing Google Map API marker information.
markers = [];

// An array to store all the cuisines .
cuisines = [];

// An array to store the user cuisine selection from the dropdown list.
selectedCuisine = [];


// Initialise Google Maps
function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: -37.813531,
            lng: 144.965633
        },
        mapTypeId: 'terrain',
        zoom: 15,
        styles: [{
            "featureType": "all",
            "elementType": "labels",
            "stylers": [{
                "visibility": "off"
            }]
        }, {
            "featureType": "administrative.country",
            "elementType": "all",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "administrative.province",
            "elementType": "all",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "administrative.province",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "administrative.locality",
            "elementType": "all",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "administrative.neighborhood",
            "elementType": "all",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "administrative.land_parcel",
            "elementType": "all",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "landscape.man_made",
            "elementType": "all",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "landscape.natural.landcover",
            "elementType": "geometry.fill",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#e2931e"
            }]
        }, {
            "featureType": "road.highway.controlled_access",
            "elementType": "geometry.stroke",
            "stylers": [{
                "color": "#e2931e"
            }]
        }, {
            "featureType": "road.arterial",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "road.local",
            "elementType": "labels.text",
            "stylers": [{
                "visibility": "on"
            }]
        }, {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [{
                "color": "#4cb2e6"
            }]
        }]
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

            self.toggleBounce(marker);

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
                oauth_timestamp: Math.floor(Date.now() / 1000),
                oauth_signature_method: 'HMAC-SHA1',
                oauth_version: '1.0',
                callback: 'cb', // This is crucial to include for jsonp implementation in AJAX or else the oauth-signature will be wrong.
                term: 'restaurants',
                location: 'Melbourne+Victoria+Australia',
            };

            var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
            parameters.oauth_signature = encodedSignature;

            var settings = {
                url: yelp_url,
                data: parameters,
                cache: true, // This is crucial to include as well to prevent jQuery from adding on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
                dataType: 'jsonp',
                success: function(results) {
                    // Confirm API succesfully connected
                    console.log("Yelp! Success");

                    // Setup variables for Yelp specific results
                    var yelpUrl = results.businesses[0].url;
                    var yelpSnippet = results.businesses[0].snippet_text;
                    var yelpStars = results.businesses[0].rating_img_url_large;

                    // Setup the layout of the infowindow
                    contentString = '<div id="infoWindow"><h3>' +
                        marker.title + '</h3><p>'

                    +
                    '<img src="' + yelpStars + '"/></p><p>' +
                        yelpSnippet + ' <a href=' + yelpUrl + ' target="_blank">Read more</a></p><p class="chip">' +
                        marker.cuisine + '</p><p></div>';
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

    self.populateInfoWindow = function(restaurant) {
        var marker = restaurant.marker;
        google.maps.event.trigger(marker, 'click');

    };

    //self.mySelectedCuisine = ko.observable(self.myCuisines()[0]);
    self.mySelectedCuisine = ko.observable("");

    // This knockout filtering code was adapted from http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    self.filteredByType = ko.computed(function() {
        restaurantInfoWindow.close();
        // If the filter is undefined, which is it's beginning state, then do nothing. This leaves
        // displays the restaurant list and all markers on the map.
        // If a choice is made, then convert the choice to lowercase.
        var filter = !self.mySelectedCuisine() ? "" : self.mySelectedCuisine().toLowerCase();

        if (filter.length === 0) {
            markers.forEach(function(marker) {
                marker.setVisible(true);
            });
            return self.myRestaurants();
        } else {
            return ko.utils.arrayFilter(self.myRestaurants(), function(restaurant) {
                // case insensitive search
                var cuisine = restaurant.cuisine.toLowerCase();
                var match = filter === cuisine; // true or false
                restaurant.marker.setVisible(match);
                return match;
            });
        }

    });

    self.showMarkers = function() {
        $('select').material_select();
        markers.forEach(function(marker) {
            marker.setVisible(true);
        });
    }

    self.hideMarkers = function() {
        restaurantInfoWindow.close();
        markers.forEach(function(marker) {
            marker.setVisible(false);
        });
    }

    // Got this from Google Maps documentation
    self.toggleBounce = function(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(){
            marker.setAnimation(null);
            }, 700);
        }
    }


    // Closes the ViewModel
}

// Error call handle
function googleError() {
    alert('For some reason Google Maps isn\'t loading, have you checked your Internet or Wifi connection?')
}