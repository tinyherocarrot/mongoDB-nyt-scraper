var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
// var db = require("./models");

var port = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: false }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
var MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect(MONGODB_URI, {
	useMongoClient: true
});

// Routes
// -----------------------------------

// A GET route for scraping The Atlantic homepage
app.get("/scrape", function(req, res) {
	// First, we grab the body of the html with request
	axios.get("https://www.theatlantic.com/").then(function(response) {
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		var $ = cheerio.load(response.data);
		// Now, we grab every article tag, and do the following:
		$("article").each(function(i, element) {
			// Save an empty result object
			var result = {};

			// Add the category, title, summary and link of every article,
			// 		and save them as properties of the result object
			result.category = $(this)
				.children("a.c-kicker")
				.text();
			result.title = $(this)
				.children("h3.o-hed")
				.text();
			result.summary = $(this)
				.children("p.o-dek")
				.text();
			result.link = $(this)
				.children("h3.o-hed a")
				.attr("href");

			// Create a new Article using the `result` object built from scraping
			db.Article
				.create(result)
				.then(function(dbArticle) {
					// If we were able to successfully scrape and save an Article, send a message to the client
					res.send("Scrape Complete");
				})
				.catch(function(err) {
					// If an error occurred, send it to the client
					res.json(err);
				});
		});
	});
});

// Start the server
app.listen(port, function() {
	console.log("App running on port " + port + "!");
});
