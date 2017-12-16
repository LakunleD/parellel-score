var ObjectID = require('mongodb').ObjectID;
var bcrypt = require('bcrypt');


function doAuth(db, email, password, callback) {
    console.log("Authenticating...")
    var userCollection = db.collection('users');

    userCollection.findOne({"email": email}, function (e, doc) {
        if (doc !== null) {
            bcrypt.compare(password, doc.password, function (e, result) {
                if (result) {
                    doc.password = undefined;
                    callback(true, doc);
                } else {
                    callback(false, "Invalid username/Password");
                }
            });
        } else {
            callback(false, "Error Authenticating...");
        }
    });
}


var routes = function (server, mongodb) {
    var userCollection = mongodb.collection('users');

    server.route({
        path: "/users",
        method: "POST",
        handler: function (request, reply) {
            var payload = request.payload;

            var firstName = payload.firstName;
            var lastName = payload.lastName;
            var password = payload.password;
            var email = payload.email;
            var type = payload.type;

            var salt = bcrypt.genSaltSync(11);
            var encPassword = bcrypt.hashSync(password, salt);

            var data = {firstName: firstName, lastName: lastName, password: encPassword, email: email, type: type};

            userCollection.findOne({email: email}, function (err, user) {
                if (err) {
                    reply({message: 'error'}).code(400);
                }
                if (user === null) {
                    userCollection.insertOne(data, function (err, result) {
                        if (err) {
                            reply({message: 'error'}).code(400);
                        }
                        reply({message: 'created a user', user: data});
                    });
                }
                else {
                    reply({message: 'user already exist'});
                }
            });
        }
    });

    server.route({
        path: "/users",
        method: "GET",
        handler: function (request, reply) {
            userCollection.find({}).toArray((err, users) => {
                if (err) {
                    reply({message: 'error'}).code(400);
                }
                reply(users);
            });
        }
    });

    server.route({
        path: '/users/auth',
        method: 'POST',
        handler: function (request, reply) {
            var password = request.payload.password;
            var email = request.payload.email;

            doAuth(mongodb, email, password, (status, response) => {
                if (status) {
                    reply(response)
                }
                else {
                    reply({
                        message: response
                    }).code(403);
                }
            });
        }
    });
}

module.exports = routes;