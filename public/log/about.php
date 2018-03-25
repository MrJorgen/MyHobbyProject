<?php 
  include_once './inc/header.php';
 ?>


    <div class="container">
      <div class="starter-template">
        <!-- <h1>My logger</h1> -->
        <p class="lead">Här kommer jag att fixa så att jag kan logga mina resor i jobbet. Dels kommer jag att kunna se historiken och även kunna lägga till nya värden i loggen. </p>
        <p class="content">Vet inte vad jag kommer att visa som standard i "index.php" men det kommer senare.</p>
        <span id="devicePixelRatio"></span>
        <script>
        	var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    			var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
        	document.getElementById('devicePixelRatio').innerHTML += "devicePixelRatio: " + window.devicePixelRatio + "<br>";
        	document.getElementById('devicePixelRatio').innerHTML += "Width: " + w + " px<br>";
        	document.getElementById('devicePixelRatio').innerHTML += "Height: " + h + " px<br>";
        </script>
      </div>

    </div><!-- /.container -->

<?php 
  include_once './inc/footer.php';
 ?>