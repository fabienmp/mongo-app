$(document).ready(function () {

    var template = '<div class="col s12 m3">' +
        '<div class="card">' +
        '<div class="card-image">' +
        '<img class="article_image" src="">' +
        '<span class="card-title"></span>' +
        '<a class="btn-floating halfway-fab waves-effect waves-light red">' +
        '<i class="material-icons">add</i></a>' +
        '</div>' +
        '<div class="card-content">' +
        '<p></p>' +
        '</div>' +
        '</div>' +
        '</div>'

    function loadArticles() {
        $.getJSON("/articles", function (data) {
            var currentRow = $('<div class="row"></div>');

            for (var i = 0; i < data.length; i++) {

                if (i % 4 == 0) {
                    var currentRow = $('<div class="row"></div>');
                    $("#articles").append(currentRow);
                } else if (i == data.length) {
                    $("#articles").append(currentRow);
                }

                var articleTemplate = $(template);
                articleTemplate.find(".article_image").attr('src', data[i].image_url);
                articleTemplate.find(".card-title").text(data[i].title.substring(0, Math.min(data[i].title.length, 50)) + " ...");
                articleTemplate.find(".card-content p").text(data[i].text.substring(0, Math.min(data[i].text.length, 250)) + " ...");
                articleTemplate.find(".btn-floating").click({
                    article_id: data[i]._id
                }, function (e) {
                    e.preventDefault();
                    $.ajax({
                        method: "POST",
                        url: "/article/" + e.data.article_id + "/save"
                    }).then(function (data) {
                        M.toast({
                            html: data
                        });
                        $("#articles").empty();
                        loadArticles();
                    });
                    return false;
                });
                currentRow.append(articleTemplate);

                if (i % 4 == 0) {
                    $("#articles").append(currentRow);
                } else if (i == data.length) {
                    $("#articles").append(currentRow);
                }
            }

        });
    }

    loadArticles();

    $('#clearArticlesButton').click(function () {
        $.ajax({
            method: "GET",
            url: "/clear"
        }).then(function (data) {
            M.toast({
                html: data
            });
            $("#articles").empty();
            loadArticles();
        });

    });

    $('#scrapeArticlesButton').click(function () {
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function (data) {
            M.toast({
                html: data
            });

            setTimeout(function () {
                $("#articles").empty();
                loadArticles();
            },
            5000);

        });
    });


});