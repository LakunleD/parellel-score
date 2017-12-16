let routes = (server, db) => {

    let newsCollection = db.collection('news');

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
            let {title, body, creator} = request.payload;

            let data = {title, body, creator};

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
            let id = request.params.id;

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
            let id = request.params.id;

            let {title, body} = request.payload;

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
                newsCollection.updateOne({_id: new ObjectID(id)}, {$set:news}, (err, result)=>{
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