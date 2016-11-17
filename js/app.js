'use strict';
// Declaring all my global variables
var map,
    vm,
    cuisine,
    filteredCuisines,
    selected,
    bounds,
    contentString,
    restaurantInfoWindow,
    // And arrays
    markers = [],
    cuisines = [];

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
    name: 'D House Cafe',
    coords: {
        lat: -37.811326,
        lng: 144.967701
    },
    cuisine: 'Asian'
}, {
    name: 'ShanDong MaMa',
    coords: {
        lat: -37.810882,
        lng: 144.964134
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


// Initialise Google Map
function initMap() {

    function googleError() {
        alert('For some reason Google Maps isn\'t loading, have you checked your Internet or Wifi connection?');
    }

    map = new google.maps.Map(document.getElementById('map'), {

        // Set the map center to Melbourne
        center: {
            lat: -37.813531,
            lng: 144.965633
        },
        // Map terrain type
        mapTypeId: 'terrain',
        // Map zoom level
        zoom: 15,
        // Disables default Map UI
        disableDefaultUI: true,

        // Map styles were taken from a Snazzy Maps template
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

    // Make Google Map responsive by centering map on window resize.
    google.maps.event.addDomListener(window, "resize", function() {
        var center = map.getCenter();
        google.maps.event.trigger(map, "resize");
        map.setCenter(center);
    });

    // Initialise Knockout here cos it needs Google Map to be running
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

            // Assign the values to the corresponding data in the restaurant array
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
        // Filter the cuisines and pushed to the filtered cuisines array using jQuery unique & sort.
        cuisine = restaurant.cuisine;
        cuisines.push(cuisine);
        cuisines = $.unique(cuisines.sort());

        // Fit the map to the boundaries of the markers.
        bounds.extend(marker.position);

        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {

            // Center Map to position of marker using panTo and a delay of 2 seconds.
            window.setTimeout(function() {
                map.panTo(marker.getPosition());
            }, 2000);

            // Bounce the marker on click.
            self.toggleBounce(marker);

            // YELP API AUTHENTICATION
            // This code was adapated from a Yelp API authentication code template posted by a
            // Udacity Coach in the Udacity forums.
            function nonce_generate() {
                return (Math.floor(Math.random() * 1e12).toString());
            }
            // The search term URL. In this instance I am using the restaurant title
            var yelp_url = 'https://api.yelp.com/v2/search?term=' + marker.title;

            // Here are my Yelp keys.
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
                callback: 'cb',
                // This is crucial to include for jsonp implementation in AJAX
                //  or else the oauth-signature will be wrong.
                term: 'restaurants',
                location: 'Melbourne+Victoria+Australia',
            };

            var encodedSignature = oauthSignature.generate('GET', yelp_url, parameters, YELP_KEY_SECRET, YELP_TOKEN_SECRET);
            parameters.oauth_signature = encodedSignature;

            // Yep settings.
            var settings = {
                url: yelp_url,
                data: parameters,
                cache: true,
                // This is crucial to include as well to prevent jQuery from adding
                // on a cache-buster parameter "_=23489489749837", invalidating our oauth-signature
                dataType: 'jsonp',

                success: function(results) {
                    // Setup variables for Yelp specific results
                    var yelpUrl,
                        yelpSnippet,
                        yelpStars;

                    // Setup error handling and response messages
                    var response = results.businesses[0];
                    response.url !== undefined ? yelpUrl = '<a href=' + response.url +  ' target="_blank">Read more</a>' : yelpUrl = '';
                    response.snippet_text !== undefined ? yelpSnippet = response.snippet_text : yelpSnippet = 'No restaurant description available';
                    response.rating_img_url_large !== undefined ? yelpStars = '<img src="' + response.rating_img_url_large + '"/>' : yelpStars = 'No restaurant rating available';

                    // Setup the custom layout of the infowindow
                    contentString = '<div id="info-window"><h3>' + marker.title + '</h3><p>' + yelpStars + '</p><p>' + yelpSnippet + yelpUrl + '</p><p><span class="label">' + marker.cuisine + '</span><p></div>';

                    // Open the infowindow and load the layout
                    restaurantInfoWindow.open(map, marker);
                    restaurantInfoWindow.setContent(contentString);
                },

                error: function() {
                    // Error message on API load failure.
                    contentString = '<div id="info-window"><h3>Yelp has failed to load!</h3></div>';
                    restaurantInfoWindow.open(map, marker);
                    restaurantInfoWindow.setContent(contentString);
                }
            };

            $.ajax(settings);
            // Send AJAX query via jQuery and display settings.
        });
    });

    // When a restaurant in the restaurant list is clicked, this function
    // triggers a corresponding map marker click, which then loads up the infowindow.
    self.populateInfoWindow = function(restaurant) {
        var marker = restaurant.marker;
        google.maps.event.trigger(marker, 'click');

        // Collapse the menu after click event so you can see the map again.
        $('.collapse.in').collapse('hide');
    };

    // Create an observable variable to be used in filtering below.
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

    // This function displays all markers on the map, by looping through them and setting the visibility.
    self.showMarkers = function() {
        markers.forEach(function(marker) {
            marker.setVisible(true);
        });
    };

    // This function displays all markers on the map, by looping through them and setting the visibility. Before running it also closes any open infowindows.
    self.hideMarkers = function() {
        restaurantInfoWindow.close();
        markers.forEach(function(marker) {
            marker.setVisible(false);
        });
    };

    // This makes the marker bounce when it's activated. Got this from the Google Maps documentation
    self.toggleBounce = function(marker) {
        if (marker.getAnimation() !== null) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function() {
                marker.setAnimation(null);
            }, 700);
        }
    };
// Closes the ViewModel
};

// Error call handler
function mapError() {
    alert('For some reason Google Maps isn\'t loading, have you checked your Internet or Wifi connection?');
}