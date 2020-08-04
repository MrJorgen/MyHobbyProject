const
  express = require('express'), // Main express module
  app = express(), // App...
  http = require('http').Server(app), // Server http
  fs = require("fs"), // Fs = filesystem, not sure if I really need this
  mongoose = require('mongoose'), // module for talking to MongoDB
  forceSsl = require('express-force-ssl'), // This force non-secure connections to use secure connection(ssl)
  session = require("client-sessions"), // Cookie middleware
  bodyParser = require('body-parser'), // For reading form inputs, not needed right now
  path = require('path'); // path middleware

let port, sslPort, options = {}, heroku = false;

app.locals.moment = require("moment");

if (__dirname == "/home/pi/web") {
  port = 3000; // Set port variable
  sslPort = 3001; // Set secure port variable
  options = {
    key: fs.readFileSync(__dirname + "/cert/privkey.pem"),
    cert: fs.readFileSync(__dirname + "/cert/cert.pem"),
    ca: fs.readFileSync(__dirname + "/cert/chain.pem")
  };
} else if (__dirname == "/home/web") {
  port = 80; // Set port variable
  sslPort = 443; // Set secure port variable
  let sslPath = "/etc/letsencrypt/live/mrjorgen.dynu.net/";
  options = {
    key: fs.readFileSync(sslPath + 'privkey.pem'),
    cert: fs.readFileSync(sslPath + 'fullchain.pem')
  };
} else {
  port = process.env.PORT || 5000;
  heroku = true;
}

if (!heroku) {
  const https = require("https").createServer(options, app);
}

/*
------------------------------------------------------------------------------------------------
How to setup node with SSL!
https://startupnextdoor.com/how-to-obtain-and-renew-ssl-certs-with-lets-encrypt-on-node-js/
 
This directory contains your keys and certificates.
/etc/letsencrypt/live/mrjorgen.dynu.net/
 
`privkey.pem`: the private key for your certificate.
`fullchain.pem`: the certificate file used in most server software.
`chain.pem`: used for OCSP stapling in Nginx >= 1.3 .7.
`cert.pem`: will break many server configurations, and should not be used
without reading further documentation(see link below).
 
We recommend not moving these files.For more information, see the Certbot
User Guide at https: //certbot.eff.org/docs/using.html#where-are-my-certificates.
 
IMPORTANT NOTES:
- Congratulations! Your certificate and chain have been saved at:
/etc/letsencrypt/live/mrjorgen.dynu.net/fullchain.pem
Your key file has been saved at:
/etc/letsencrypt/live/mrjorgen.dynu.net/privkey.pem
Your cert will expire on 2018-06-22. To obtain a new or tweaked
version of this certificate in the future, simply run certbot-auto
again. To non-interactively renew *all* of your certificates, run
"certbot-auto renew"
- Your account credentials have been saved in your Certbot
configuration directory at /etc/letsencrypt. You should make a
secure backup of this folder now. This configuration directory will
also contain certificates and private keys obtained by Certbot so
making regular backups of this folder is ideal.
 
------------------------------------------------------------------------------------------------
/etc/letsencrypt/live/mrjorgen.dynu.net/privkey.pem
/etc/letsencrypt/live/mrjorgen.dynu.net/chain.pem
/etc/letsencrypt/live/mrjorgen.dynu.net/privkey.pem
*/


let users = 0;

if (!heroku) {
  app.use(forceSsl);
}
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false,
}));
/*
app.use(session({
  cookieName: 'mySession', // cookie name dictates the key name added to the request object
  secret: '8Xe3bNj3_-h39p-rGMW-hMRMVh6cbu_w', // should be a large unguessable string
  duration: 24 * 60 * 60 * 1000, // how long the session will stay valid in ms
  cookie: {
    path: '/chat', // cookie will only be sent to requests under '/chat'
    maxAge: 60000, // duration of the cookie in milliseconds, defaults to duration above
    ephemeral: false, // when true, cookie expires when the browser closes
    httpOnly: true, // when true, cookie is not accessible from javascript
    secure: true // when true, cookie will only be sent over SSL. use key 'secureProxy' instead if you handle SSL not in your node process
  }
}));
*/

app.set("views", __dirname + "/views");
app.set('view engine', 'ejs');

app.get('*', function (req, res) {
  res.redirect('https://' + req.headers.host + req.url);

  // Or, if you don't want to automatically detect the domain name from the request header, you can hard code it:
  // res.redirect('https://example.com' + req.url);
})

// Home page
app.get('/', (req, res) => {

  res.render('home', {
    layout: false,
    title: "Home",
    mainPage: false
  });
});

let movie = require('./movies/movies')
app.use('/movies', movie);

// about page
app.get("/projects", (req, res) => {
  res.render("home", {
    title: "Projects",
    mainPage: "projects"
  });
});

// This server is for forwarding to SSL only
http.listen(port, () => {
  console.log(`(Non secure) server listening on port: ${port}`);
});

// Main server, serve all requests
if (!heroku) {
  https.listen(sslPort, () => {
    console.log(`(Secure) server listening on port: ${sslPort}`);
  });
}