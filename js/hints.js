// Optimize JavaScript
'use strict';

// Display Map
var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 9,
    center: {lat: 40.4406, lng: -79.9959}
  });
  ko.applyBindings(new ViewModel());
}

// Error Call for Google Maps
function googleError() {
  alert('Google Maps has failed to load at this time.')
}

// Detect iOS and Android Devices
// Is this necessary if I am using bootstrap containers?
var useragent;

function detectBrowser() {
  var useragent = navigator.userAgent;
  var map = document.getElementById('map');

  if (useragent.indexOf('iPhone') != -1 || useragent.indexOf('Android') != -1 ) {
    map.style.width = '100%';
    map.style.height = '100%';
  } else {
    map.style.width = '600px';
    map.style.height = '800px';
  }
}

// Initial Brewery Data
var breweries = [
  { name: 'Roundabout Brewery',
    position: {lat: 40.477242, lng: -79.957048}
  },
  { name: 'Hitchhiker Brewing Company',
    position: {lat: 40.377538, lng: -80.040648 }
  },
  { name: 'The Brew Gentlemen Beer Co.',
    position: {lat: 40.404250, lng: -79.870155}
  },
  { name: 'Hop Farm Brewing Company',
    position: {lat: 40.484647, lng: -79.947931 }
  },
  { name: 'Draai Laag Brewing Company',
    position: {lat: 40.478767, lng: -79.968170}
  },
  { name: 'Grist House Craft Brewery',
    position: {lat: 40.478850, lng: -79.972004}
  },
  { name: 'Voodoo Brewery Homestead',
    position: {lat: 40.406815, lng: -79.909852}
  },
  { name: 'Helltown Brewing',
    position: {lat: 40.150456, lng: -79.532164}
  },
  { name: 'Spoonwood Brewing Company',
    position: {lat: 40.345291, lng: -80.014076}
  },
  { name: 'ShuBrew',
    position: {lat: 40.794078, lng: -80.136642}
  }
]

// Brewery Data
var brewery = function(data) {
  this.name = ko.observable(data.name);
  this.position = ko.observable(data.position);
}

var ViewModel = function() {

  // Reference scope of another object
  var self = this;

  // Display Markers
  var marker;

  breweries.forEach(function(breweryItem) {
    marker = new google.maps.Marker({
      title: breweryItem.name,
      position: breweryItem.position,
      map: map
    });
  });

  // Create an observable for list input
  this.breweryList = ko.observableArray([]);

  // Create an observable for flter input
  // Why do the "" make this happen?
  this.filter = ko.observable("");

  // Push items to list
  breweries.forEach(function(breweryItem){
    self.breweryList.push( new brewery(breweryItem));
  });

  // What exactly does breweryItem do?
  //console.log(breweryItem);

  // Create filter input to update filter list
  // What does != -1 mean?
  this.filteredItems = ko.computed(function() {
    var filter = self.filter().toLowerCase();
    if (!filter) {
        return self.breweryList();
    } else {
        return ko.utils.arrayFilter(self.breweryList(), function(item) {
            return item.name().toLowerCase().indexOf(filter) != -1;
        });
    }
  });

  // Bind my filtered list elements to a click event
  // that will open an info window and animate
  // the marker of the selected element

  //Assign the marker as an attribute on the
  // brewery object

}