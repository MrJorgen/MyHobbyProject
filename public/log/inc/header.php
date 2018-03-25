<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="">
    <meta name="author" content="Jörgen Karlsson">
    <!-- <link rel="icon" href="./favicon.ico"> -->

    <title>My Logger</title>
    <!-- default theme -->
    <!-- <link href="./css/bootstrap.min.css" rel="stylesheet"> -->
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" >

    <!-- Font Awsome: Custom icons for use in webapps
    How to use here: http://fontawesome.io/icons/ -->
    <link rel="stylesheet" href="./css/font-awesome.min.css">

    <!-- Even more fonts :) -->
    <link id="fonts_link" href="https://fonts.googleapis.com/css?family=Architects+Daughter|Atma|Autour+One|Averia+Libre|Baloo+Chettan|Bilbo|Buda|Cairo|Chewy|Coiny|Diplomata|Dynalight|Fresca|Glass+Antiqua|Gudea|Irish+Grover|Julee|Kalam|Karla|Kavivanar|Kavoon|Laila|Mada|MedievalSharp|Modak|Montaga|News+Cycle|Nova+Flat|Nova+Slim|Nunito|Poiret+One|Sarina|Shadows+Into+Light+Two|Sonsie+One|Sriracha|Stoke|Swanky+and+Moo+Moo|Arimo|Athiti|Bubbler+One|Comfortaa|Exo|Exo+2|Gloria+Hallelujah|Indie+Flower|Maven+Pro|PT+Sans+Caption|Quicksand|Shadows+Into+Light|Source+Sans+Pro|Titillium+Web|Work+Sans|Play|Varela+Round|Ubuntu|Jura|Orbitron|Oxygen|PT+Sans|Raleway|ABeeZee|Acme|Coming+Soon|Dancing+Script|Didact+Gothic|Economica|Handlee|Josefin+Sans|Kalam|Khand|Nunito|Patrick+Hand|Philosopher|Rajdhani|Ruda|Sacramento|Arima+Madurai|Gruppo|Happy+Monkey" rel="stylesheet">

    <link rel="stylesheet" href="./css/myStyle.css">
  </head>
  <body>
    <nav class="navbar navbar-default navbar-top" id="main_navbar">
      <div class="container">
        <div class="navbar-header">
          <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
          <span id="logo" class="navbar-brand active">My Logger</span>
          
        </div>
        <div id="navbar" class="collapse navbar-collapse">
          <ul class="nav navbar-nav">
            <li><a href="index.php"><i class="fa fa-home fa-fw" aria-hidden="true"></i>Home</a></li>
            <li><a href="about.php"><i class="fa fa-info fa-fw" aria-hidden="true"></i>About</a></li>
            <li><a href="map.php"><i class="fa fa-map fa-fw" aria-hidden="true"></i>Map</a></li>

            <!-- Playing around with the look and feel of the website -->
            <li class="dropdown">
                <a href="#" id="font" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Font<span class="caret"></span></a>
                <ul id="fonts-menu" class="dropdown-menu">
                    <!-- Javascript populates this li -->
                </ul>
            </li>
            <li class="dropdown">
                <a href="#" id="theme" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">Theme<span class="caret"></span></a>
                <ul class="dropdown-menu" id="themes">
                </ul>
            </li>
            <li><a id="class-toggle" onclick="toggleInverseDefault()" href="#">Defult/Inverse toggle</a></li>
        </ul>
        </div><!--/.nav-collapse -->
      </div>
    </nav>
