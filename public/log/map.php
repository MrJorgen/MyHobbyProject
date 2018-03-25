<?php 
	include_once './inc/header.php';
 ?>

	<div class="container">
		<div class="starter-template">
			<p><button class="btn btn-default" onclick = "$('#map').toggle()">Toggle map</button></p>
		    <p id="geolocation"></p>
			<div id="map"></div>
		    <script async defer src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCJZla0TsMObQQEwfehMYYyn4hxQPAjklg&callback=initMap"></script>
		    <script src="./js/geo.js"></script>
	    </div>
	</div>

<?php 
	include_once './inc/footer.php';
 ?>