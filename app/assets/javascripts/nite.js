var nite = {
  debugger
    map: null,
    date: null,
    marker_sun: null,
    marker_shadow: null,
    marker_shadow_lite: null,
    shadow_radius: parseInt(6371 * Math.PI * 500),
    sun_position: null,

    init: function(map) {
        if(typeof google === 'undefined'
           || typeof google.maps === 'undefined') throw "Nite Overlay: no google.maps detected";

        this.map = map;
        this.sun_position = this.calculatePositionOfSun();

        this.marker_shadow = new google.maps.Circle({
            map: this.map,
            center: this.getShadowPosition(),
            radius: this.shadow_radius,
            fillColor: "#000",
            fillOpacity: 0.1,
            strokeOpacity: 0,
            clickable: false,
            editable: false
        });

        this.marker_shadow_lite = new google.maps.Circle({
            map: this.map,
            center: this.getShadowPosition(),
            radius: this.shadow_radius * 0.96,
            fillColor: "#000",
            fillOpacity: 0.1,
            strokeOpacity: 0,
            clickable: false,
            editable: false
        });
    },
    getSunPosition: function() {
        return this.sun_position;
    },
    getShadowPosition: function() {
        return (this.sun_position) ? new google.maps.LatLng(-this.sun_position.lat(), this.sun_position.lng() + 180) : null;
    },
    refresh: function() {
        if(!this.isVisible()) return;
        this.sun_position = this.calculatePositionOfSun(this.date);
        this.marker_shadow.setCenter(this.getShadowPosition());
        this.marker_shadow_lite.setCenter(this.getShadowPosition());
    },
    jday: function(date) {
        return (date.getTime() / 86400000.0) + 2440587.5;
    },
    calculatePositionOfSun: function(date) {
        date = (date instanceof Date) ? date : new Date();

        var rad = 0.017453292519943295;

        // based on NOAA solar calculations
        var mins_past_midnight = (date.getUTCHours() * 60 + date.getUTCMinutes()) / 1440;
        var jc = (this.jday(date) - 2451545)/36525;
        var mean_long_sun = (280.46646+jc*(36000.76983+jc*0.0003032)) % 360;
        var mean_anom_sun = 357.52911+jc*(35999.05029-0.0001537*jc);
        var sun_eq = Math.sin(rad*mean_anom_sun)*(1.914602-jc*(0.004817+0.000014*jc))+Math.sin(rad*2*mean_anom_sun)*(0.019993-0.000101*jc)+Math.sin(rad*3*mean_anom_sun)*0.000289;
        var sun_true_long = mean_long_sun + sun_eq;
        var sun_app_long = sun_true_long - 0.00569 - 0.00478*Math.sin(rad*125.04-1934.136*jc);
        var mean_obliq_ecliptic = 23+(26+((21.448-jc*(46.815+jc*(0.00059-jc*0.001813))))/60)/60;
        var obliq_corr = mean_obliq_ecliptic + 0.00256*Math.cos(rad*125.04-1934.136*jc);

        var lat = Math.asin(Math.sin(rad*obliq_corr)*Math.sin(rad*sun_app_long)) / rad;

        var eccent = 0.016708634-jc*(0.000042037+0.0000001267*jc);
        var y = Math.tan(rad*(obliq_corr/2))*Math.tan(rad*(obliq_corr/2));
        var rq_of_time = 4*((y*Math.sin(2*rad*mean_long_sun)-2*eccent*Math.sin(rad*mean_anom_sun)+4*eccent*y*Math.sin(rad*mean_anom_sun)*Math.cos(2*rad*mean_long_sun)-0.5*y*y*Math.sin(4*rad*mean_long_sun)-1.25*eccent*eccent*Math.sin(2*rad*mean_anom_sun))/rad);
        var true_solar_time = (mins_past_midnight*1440+rq_of_time) % 1440;
        var lng = -((true_solar_time/4 < 0) ? true_solar_time/4 + 180 : true_solar_time/4 - 180);

        return new google.maps.LatLng(lat, lng);
    },
    setDate: function(date) {
        this.date = date;
        this.refresh();
    },
    setMap: function(map) {
        this.map = map;
        this.marker_shadow.setMap(this.map);
        this.marker_shadow_lite.setMap(this.map);
    },
    show: function() {
        this.marker_shadow.setVisible(true);
        this.marker_shadow_lite.setVisible(true);
        this.refresh();
    },
    hide: function() {
        this.marker_shadow.setVisible(false);
        this.marker_shadow_lite.setVisible(false);
    },
    isVisible: function() {
        return this.marker_shadow.getVisible();
    }
}