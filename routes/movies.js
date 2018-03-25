const express = require('express'),
  router = express.Router(),
  request = require('request'),
  fs = require("fs"),
  bodyParser = require('body-parser'),
  zlib = require("zlib"),
  readline = require("readline");

let titleHeader = "";


let apiKey = fs.readFileSync("./tmdb_api_key.txt", {
  encoding: "UTF-8"
});

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// Read imdb ratings data file
// --------------------------------------------------------------------------------
let imdbRatings = {};

readImdbData();

function readImdbData() {
  let imdbRatingsFilePath = "./datastore/title.ratings.tsv.gz"
  fs.exists(imdbRatingsFilePath, (found) => {
    if (found) {
      console.log("Reading IMDB ratings file!");
      let lineReader = readline.createInterface({
        input: fs.createReadStream(imdbRatingsFilePath).pipe(zlib.createGunzip())
      });
    
      lineReader.on('line', (line) => {
        let tmpArray = line.split('\t');
        imdbRatings[tmpArray[0]] = { rating: tmpArray[1], votes: tmpArray[2] };
      });
    
      lineReader.input.on("end", () => {
        // console.log(imdbRatings["tt8112570"].rating);
        console.log("IMDB ratings imported!");
      });
    } else {
      console.log("IMDB ratings file not found!");
      refreshImdbData("https://datasets.imdbws.com/title.ratings.tsv.gz", imdbRatingsFilePath);
    }
  });
}  

function refreshImdbData(url, path) {
  console.log("Getting fresh ratings file from IMDB!");
  request(url)
    .pipe(fs.createWriteStream(path)
    .on("finish", (err) => {
      console.log("Write file to local filesystem complete!");
      readImdbData();
    })  
    );
}

// --------------------------------------------------------------------------------

// Insert config here. Check for new version every 3 days
// --------------------------------------------------------------------------------
let tmdb_config = "",
tmdb_config_filePath = "./views/movies/tmdb_config.json";

if (fs.existsSync(tmdb_config_filePath)) {
  console.log("File exists!");
  fs.stat(tmdb_config_filePath, (err, stats) => {
    console.log(stats);
    // Check if file is older than 3 days
    let now = new Date(),
    fileDate = new Date(stats.mtime);
    // Compensate for timezoneoffset. Get and set minutes...
    fileDate.setMinutes(fileDate.getMinutes() - fileDate.getTimezoneOffset());
    if (fileDate < now.setDate(now.getDate() - 3)) {
      console.log("Config file is old! Getting new one...");
      getAndSaveConfig();
    } else {
      tmdb_config = fs.readFile(tmdb_config_filePath, "utf8", (err, data) => {
        if (err) {
          console.log("There was a problem reading the config file!");
          return;
        }
        tmdb_config = JSON.parse(data);
        console.log("Config file loaded!");
      })
    }
  });
} else {
  console.log("File does not exist!");
  getAndSaveConfig();
}

function getAndSaveConfig() {
  request({
    url: `https://api.themoviedb.org/3/configuration?api_key=${apiKey}`,
    json: true
  }, (err, response, data) => {
    if (err) {
      console.log("Couldn't get config file from TMDB!");
      return;
    }
    if (response.statusCode === 200) {
      tmdb_config = JSON.stringify(data);
      fs.writeFile(tmdb_config_filePath, tmdb_config, 'utf8', (err) => {
        if (err) {
          console.log("There was an error writing the TMDB config file to disk!");
        }
      });
    }
  });
}
// --------------------------------------------------------------------------------


router.get("/person/:id?", (req, res) => {
  let personId = req.params.id;
  let personUrl = `https://api.themoviedb.org/3/person/${personId}?api_key=${apiKey}&append_to_response=credits,images,tagged_image`;
  renderPage(personUrl, res, "./movies/person");
});

router.get("/movie/:id?", (req, res) => {
  let id = req.params.id;
  if (parseInt(id) !== NaN) {
    url = `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos,credits,images&include_image_language=en,null`;
    renderPage(url, res, './movies/single_movie');
  }
});

router.post("/*", (req, res) => {
  let query = encodeURIComponent(req.body.query);
  titleHeader = `Search results for "${decodeURIComponent(query)}"`;
  let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${query}&include_adult=true`;
  renderPage(url, res, "./movies/movies");
});


// define the root route
router.get("/:id?", function (req, res) {
  let id = req.params.id;
  let url = ``;

  // There is an id. Let's render a page for a spcific movie(id)  
  if (id === undefined || id == "popular" || id == "top_rated" || id == "upcoming") {
    switch (id) {
      case "top_rated":
      titleHeader = "Top Rated ";
      break;
      case "upcoming":
      titleHeader = "Upcoming ";
      break;
      default:
        titleHeader = "Popular ";
    }
    let option = id || "popular";
    url = `https://api.themoviedb.org/3/movie/${option}?api_key=${apiKey}`;
    renderPage(url, res, "./movies/movies");
  }
});

function renderPage(url, res, page, oldData) {

  let header = titleHeader;
  // header = header.substring (header.lastIndexOf ('/'), header.length);

  request({
    url: url,
    json: true
  }, (err, response, data) => {
    if (err) {
      console.log('Error retrieving data from TMDB:', err);
      return;
    }
    if (response.statusCode === 200) {
      // This is tricky...
      if (data.belongs_to_collection) {
        console.log("Getting collection data...");
        let collectionUrl = `https://api.themoviedb.org/3/collection/${data.belongs_to_collection.id}?api_key=${apiKey}`;
        renderPage(collectionUrl, res, page, data);
      } else {
        if (oldData) {
          oldData.collection = data;

          res.render(page, {
            layout: false,
            data: oldData,
            config: tmdb_config,
            header: header,
            imdbRatings: imdbRatings
          });
          // res.send(oldData);
        } else {
          res.render(page, {
            layout: false,
            data: data,
            config: tmdb_config,
            header: header,
            imdbRatings: imdbRatings
          });
          // res.send(data);
        }
      }
    } else {
      console.log('Error retrieving data from TMDB! ' + response.statusCode);
    }
  });


}

// https://hdbits.org/browse.php?&imdb=tt2948356&org1=1&search=1080p
// https://hdbits.org/browse.php?org1=1&search=1080p&sort=seeders&h=10&d=DESC&imdb=tt2948356

/*
IMDB Datasets
-------------------------------------------------
Instruction here:
http://www.imdb.com/interfaces/
-------------------------------------------------
Datasets here:
https://datasets.imdbws.com/name.basics.tsv.gz
https://datasets.imdbws.com/title.akas.tsv.gz
https://datasets.imdbws.com/title.basics.tsv.gz
https://datasets.imdbws.com/title.crew.tsv.gz
   https://datasets.imdbws.com/title.episode.tsv.gz
   https://datasets.imdbws.com/title.principals.tsv.gz
   https://datasets.imdbws.com/title.ratings.tsv.gz
*/

function readCsvFile(imdbId) {
  const csvFilePath = '/home/pi/web/datastore/title.ratings.tsv';
  const csv = require('csvtojson');
  let jsonObj, jsonStr;
  csv({
    noheader: false,
    trim: true,
    delimiter: 'auto',
    workerNum: 4,
  })
    .fromFile(csvFilePath, (err, result) => {
      console.log(result);
    })
    .on('json', (jsonObj, rowIndex) => {
      // combine csv header row and csv line to a json object
      // jsonObj.a ==> 1 or 4
      console.log(rowIndex);
    })
    .on('data', data => {
      //data is a buffer object
      jsonStr = data.toString('utf8');
      // console.log(data);
    })
    .on('done', error => {
      if (error) {
        console.log(error);
      } else {
        console.log('end');
        console.log(jsonObj);
      }
    });
}

module.exports = router;