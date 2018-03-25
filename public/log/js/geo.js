            /* Geolocation stuff */

var geolocation = document.getElementById("geolocation"), map, pos
var marker;

function success(position) {
    latitude  = position.coords.latitude;
    longitude = position.coords.longitude;

    geolocation.innerHTML = '<p>Latitude is ' + latitude + '° <br>Longitude is ' + longitude + '°</p>' +
        '<p>Accuracy is within ' + Math.round(position.coords.accuracy) + ' meters.</p>' ;
}

function error(err) {
    geolocation.innerHTML = "Error: " + err.code + " " + err.message;
    geolocation.classList.add("danger");
}

//<script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCJZla0TsMObQQEwfehMYYyn4hxQPAjklg&callback=initMap"></script>

function initMap(){
    if (!navigator.geolocation){
        geolocation.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    }
    else{
        pos = {lat: 58.42533859999999, lng: 15.5794927 };
        map = new google.maps.Map(document.getElementById('map'), {
            zoom: 14,
            center: pos
        });
        marker = new google.maps.Marker({
            position: pos,
            map: map
        });
       navigator.geolocation.watchPosition(function(position){
            success(position);
            pos = { lat: position.coords.latitude, lng: position.coords.longitude };
            map.setCenter(pos);
            //marker.setMap(null);
            marker = null;
            var marker = new google.maps.Marker({
                position: pos,
                map: map
            });
        }, error);
    }
}