var Hapi = require("hapi");
var corsHeaders = require('hapi-cors-headers');
var server = new Hapi.Server();
var MongoClient = require('mongodb').MongoClient;

var users = require('./routes/users');
var news = require('./routes/news');
var documents = require('./routes/documents');


server.connection({
    "port": process.env.PORT,
    "routes": {
        "cors": {
            "headers": ["Accept", "Authorization", "Content-Type", "If-None-Match", "Accept-language", "Origin"],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }
    }
});

server.ext('onPreResponse', corsHeaders);

var mongoDbConnectionString = process.env.MONGODB_URI;

    MongoClient.connect(mongoDbConnectionString, function (err, db) {
    if (err) {
        console.log('error connecting to the database');
        console.log(err);
        return;
    }
    else {
        console.log("Connected correctly to server");

        addRoutes(server, db);
        startServer(server);
    }
});

function addRoutes(server, db){
    users(server, db);
    news(server, db);
    documents(server, db);
}

function startServer(server) {
    server.start(function () {
        console.log('Server running at: ' + server.info.uri);
        server.log('info', 'Server running at: ' + server.info.uri);
    });
}