const express = require("express");
const articles_router = express.Router();
const app = express();

const axios = require('axios');
const cheerio = require('cheerio');

const db = require('../db');

articles_router.get("/Home", (req, res) => {
    res.redirect('/');
});

articles_router.get("/clear", (req, res) => {
    db.Article.collection.drop();
    res.send("Articles cleared.");
});

articles_router.get("/scrape", (req, res) => {
    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com/column/learning-article-of-the-day").then(response => {
        // Then, we load that into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(response.data);

        // Now, we grab every h2 within an article tag, and do the following:
        $(".css-1cp3ece").each((i, element) => {
            var result = {};

            // Add the text and href of every link, and save them as properties of the result object
            result.title = $(element).find("h2.css-1dq8tca").text().trim();
            result.title = result.title.replace('Learning With:', '').trim().replace('‘', '');
            if (result.title != "") {
                result.text = $(element).find("p.css-1echdzn").text();
                result.link = 'https://www.nytimes.com' + $(element).children(".css-4jyr1y").children("a").attr('href');
                result.image_url = $(element).find(".css-196wev6").attr("itemid");
                //result.pusblished_on = '';

                // Create a new Article using the `result` object built from scraping
                db.Article.find({
                    link: result.link
                }, function (err, results) {
                    if (!results.length) {
                        db.Article.create(result)
                            .then(function (dbArticle) {
                                console.log(dbArticle);
                            })
                            .catch(function (err) {
                                console.log(err);
                            });
                    } else {
                        console.log('Article already exists: ', results[0].link);
                    }
                });

            }
        });

        res.send("Scraping ongoing. Please wait...");
    });
});

articles_router.get("/articles/:id", (req, res) => {
    db.Article.findOne({
            _id: req.params.id
        })
        .populate("note")
        .then(function (dbArticle) {
            res.json(dbArticle);
        })
        .catch(function (err) {
            res.json(err);
        });
});

articles_router.get("/articles", async (req, res) => {
    let dbArticle = await db.Article.find({
        saved: false
    }).catch(function (err) {
        res.json(err);
    });
    res.json(dbArticle);
});

articles_router.get("/articles/saved", async (req, res) => {
    let dbArticle = await db.Article.find({
        saved: true
    }).catch(function (err) {
        res.json(err);
    });
    res.json(dbArticle);
});

articles_router.post("/article/:id/save", function (req, res) {

    db.Article.findOne({ _id: req.params.id }, function (err, doc){
        doc.saved = true;
        doc.save();
        return res.send("Article Saved!");
      });

});

articles_router.post("/article/:id", async (req, res) => {

    let dbNote = await db.Note.create(req.body).catch(function (err) {
        res.json(err);
    });

    let dbArticle = await db.Article.findOneAndUpdate({
        _id: req.params.id
    }, {
        note: dbNote._id
    }, {
        new: true
    });

    res.json(dbArticle);

});

module.exports = articles_router;