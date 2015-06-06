$(document).ready(function(){ 

   // var mapOptions = {
   //    center: new google.maps.LatLng(40.7527, -74.0059),
   //    zoom: 1,
   //    mapTypeId: google.maps.MapTypeId.ROADMAP
   //  }
   //  var mapCanvas = document.getElementById('map-canvas');
   //  var map = google.maps.Map(mapCanvas, mapOptions);
   var mapObj = new google.maps.Map(document.getElementById('map-canvas'), {
    zoom:1,
    center: new google.maps.LatLng(0,0),
    mapTypeId: google.maps.MapTypeId.ROADMAP
});
    new DayNightOverlay({
    map: mapObj,
     fillColor: 'rgba(200,0,0,0.3)'
});
  })
    // google.maps.event.addDomListener(window, 'load', initialize); 