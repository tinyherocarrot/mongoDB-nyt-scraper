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
var db = require("./models");

var port = process.env.PORT || 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set up Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

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
app.get("/", function(req, res) {
	db.Article
		.find()
		.populate("comment")
		.then(results => {
			// res.json(results);
			res.render("index", { results: results });
		});
});

// A GET route for scraping The Atlantic homepage
app.get("/scrape", function(req, res) {
	// First, we grab the body of the html with request
	axios
		.get("https://www.theatlantic.com/")
		// Then, we load that into cheerio and save it to $ for a shorthand selector
		.then(function(response) {
			var $ = cheerio.load(response.data);
			// Now, we grab every article tag, and do the following:
			$("div.c-tease__content").each(function(i, element) {
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
					.children("h3.o-hed")
					.children("a")
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

app.post("/comments/:id", function(req, res) {
	console.log("Got: ", req.body, req.method, req.path);

	db.Comment
		// .create({ body: req.body.comment_body })
		.create(req.body)
		.then(dbComment => {
			console.log(dbComment);
			return db.Article.findOneAndUpdate(
				{ _id: req.params.id },
				{ $push: { comments: dbComment._id } },
				{ new: true }
			);
		})
		.then(results => {
			res.json(results);
		})
		.catch(err => {
			// If an error occurs, send it back to the client
			res.json(err);
		});
});

app.get("/comments/:id", function(req, res) {
	// Finds one article using the req.params.id,
	// and run the populate method with "comment",
	// then responds with the article with the comments included
	console.log("getting article and comments");
	db.Article
		.findOne({ _id: req.params.id })
		.populate("comments")
		// .sort({ _id: "desc" })
		.then(dbArticles => {
			console.log(dbArticles);
			res.json(dbArticles);
		})
		.catch(err => res.json(err));
});

// Start the server
app.listen(port, function() {
	console.log("App running on port " + port + "!");
});
