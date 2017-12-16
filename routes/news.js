var routes = (server, db) => {

    var newsCollection = db.collection('news');

    server.route({
        method: "GET",
        path: "/news",
        handler: function (request, reply) {
            newsCollection.find({}).toArray(function (err, news) {
                if (err) {
                    reply('error').code(400);
                }
                reply(news);
            });
        }
    });

    server.route({
        method: "POST",
        path: "/news",
        handler: function (request, reply) {
            var title = request.payload.title;
            var body = request.payload.body;
            var creator = request.payload.creator;

            var data = {title: title, body: body, creator: creator};

            newsCollection.insert(data, (err, news) => {
                if (err) {
                    reply({message: 'error'}).code(400);
                }
                reply({message: 'news created'});
            });
        }
    });

    server.route({
        method: "GET",
        path: "/news/{id}",
        handler: function (request, reply) {
            var id = request.params.id;

            newsCollection.findOne({_id: new ObjectID(id)}, (err, newsItem) => {
                if (err) {
                    reply({message: 'error'}).code(400);
                }
                reply(newsItem);
            })
        }

    })


    server.route({
        method: 'PUT',
        path: "/news/{id}",
        handler: function (request, reply) {
            var id = request.params.id;

            var title = request.payload.title;
            var body = request.payload.body;

            newsCollection.findOne({_id: new ObjectID(id)}, function (err, news) {
                if (err) {
                    reply({message: 'error'}).code(400);
                }
                if (!news) {
                    reply({message: 'News Item doesn\'t exist'});
                }
                if (title) {
                    news.title = title;
                }
                if (body) {
                    news.body = body;
                }
                newsCollection.updateOne({_id: new ObjectID(id)}, {$set: news}, (err, result) => {
                    if (err) {
                        reply({message: 'error'}).code(400);
                    }
                    reply(news);
                });
            });

        }
    });


}

module.exports = routes;