$(document).ready(function () {

    $('.modal').modal({
        onOpenEnd: function (modal, trigger) {
            var articleId = $(modal).attr('data-attr');
            $.ajax({
                url: "/notes/" + articleId,
                method: "GET",
                success: function (data) {
                    console.log(data);

                    var tagNotes = data.map(obj => {
                        return { tag: obj.text };
                    });
                    $('.chips-placeholder').chips({
                        data: tagNotes,
                        articleId: this.url.split('/')[2],
                        placeholder: 'Enter a note',
                        secondaryPlaceholder: '+Note',
                        onChipAdd: function (e, s) {
                            $.post('/note/add/' + this.options.articleId, {
                                    noteText: s.textContent
                                },
                                function (data) {
                                    M.toast({
                                        html: 'Note Added!'
                                    });
                                });
                        }
                    });
                }
            });
        },
        onCloseEnd: function () {

        }
    });

    $('#savedArticlesPageLink').click(function () {
        $("#articles").empty();
        loadArticles(true);
    });

    var template = '<div class="col s12 m3">' +
        '<div class="card hoverable">' +
        '<div class="card-image">' +
        '<img class="article_image" src="">' +
        '<span class="card-title"></span>' +
        '<a class="btn-floating halfway-fab waves-effect waves-light red">' +
        '<i class="material-icons">add</i></a>' +
        '</div>' +
        '<div class="card-content">' +
        '<p></p>' +
        '<div class="card-action">' +
        '<a href="#" class="deleteFromSavedButton">Delete</a>' +
        '<a href="#" class="showAddNotes">Notes</a>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>'

    function loadArticles(saved) {

        if (saved === undefined)
            saved = false;

        $.getJSON("/articles/", {
            loadSavedArticles: saved
        }, function (data) {

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
                articleTemplate.find(".showAddNotes").attr('id', 'showAddNotes__' + data[i]._id);

                if (!saved) {
                    articleTemplate.find(".card-action").css('display', 'none');
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
                } else {
                    articleTemplate.find(".btn-floating").css('display', 'none');

                    articleTemplate.find(".showAddNotes").click({
                        article_id: data[i]._id
                    }, function (e) {
                        $('#notesModal').attr('data-attr', e.data.article_id)
                        $('#notesModal').modal('open');
                    });

                    articleTemplate.find(".deleteFromSavedButton").click({
                        article_id: data[i]._id
                    }, function (e) {
                        e.preventDefault();
                        $.ajax({
                            method: "POST",
                            url: "/article/" + e.data.article_id + "/unsave"
                        }).then(function (data) {
                            M.toast({
                                html: data
                            });
                            $("#articles").empty();
                            loadArticles(true);
                        });
                        return false;
                    });
                }
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