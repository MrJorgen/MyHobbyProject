tsv = require("node-tsv-json");
tsv({
   input: "imdb_data.tsv",
   output: "imdb_data.json"
   //array of arrays, 1st array is column names 
   , parseRows: true
}, function (err, result) {
   if (err) {
      console.error(err);
   } else {
      console.log("Done converting!");
   }
});