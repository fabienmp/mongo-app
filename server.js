var express = require('express');
var logger = require("morgan");
const db = require('./db');

var PORT = process.env.PORT || 3000;
// Initialize Express
var app = express();
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

var articles_routes = require("./controllers/articles_route");
app.use(articles_routes);

// Start the server
app.listen(PORT, function () {
  console.log("App running on port " + PORT + "!");
});