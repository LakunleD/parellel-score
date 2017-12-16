const ObjectID = require('mongodb').ObjectID;
const bcrypt = require('bcrypt');


function doAuth(db, email, password, callback) {
    console.log("Authenticating...")
    let userCollection = db.collection('users');

    userCollection.findOne({ "email": email }, (e, doc) => {
        if (doc !== null) {
            bcrypt.compare(password, doc.password, function (e, result) {
                if (result) {
                    console.log("Crypt result..." + result);
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


let routes = (server, mongodb) => {
    let userCollection = mongodb.collection('users');

    server.route({
        path: "/users",
        method: "POST",
        handler: function (request, reply) {
            let {firstName, lastName, password, email, type} = request.payload;

            let salt = bcrypt.genSaltSync(11);
            let encPassword = bcrypt.hashSync(password, salt);

            let data = {firstName, lastName, encPassword, email, type};

            userCollection.findOne({email: email}, function (err, user) {
                if (err) {
                    reply({message:'error'}).code(400);
                }
                if (user === null) {
                    userCollection.insertOne(data, function (err, result) {
                        if (err) {
                            reply({message:'error'}).code(400);
                        }
                        reply({message: 'created a user', user: data});
                    });
                }
                else {
                    reply({message:'user already exist'});
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
                    reply({message:'error'}).code(400);
                }
                reply(users);
            });
        }
    });

    server.route({
        path:'/users/auth',
        method:'POST',
        handler: function (request, reply) {
            let {password, email} = request.payload;

            doAuth(db, email, password, (status, response) => {
                if (status) {
                    reply(response)
                }
                else {
                    reply({
                        message:response
                    }).code(403);
                }
            });
        }
    });
}

module.exports = routes;