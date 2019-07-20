var cheerio = require("cheerio");
var axios = require("axios");
var mongoose = require('mongoose');
const db = require('./db');

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

mongoose.connect('mongodb://localhost/test', {useNewUrlParser: true});

// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });