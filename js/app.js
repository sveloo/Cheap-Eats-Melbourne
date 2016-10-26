var Model = [

]


var Map = function(data) {

    initMap();


}


var ViewModel = function() {

    var map;

    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 8
        });
    }

}


ko.applyBindings(new ViewModel());