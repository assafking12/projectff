/**
 * Created by Assaf on 23/10/2016.
 */
var mongo = require('../DAL/mongoConnection');
var photosBL = require('./photosBL');
var MongoClient = require('mongodb').MongoClient;

exports.loginUser = function(p_request, p_callback) {
    var db = mongo.db;
    var collection = db.collection('Users');
    var userId = p_request.body.id;

    // Find the user
    collection.find({userId:userId}).toArray(function(err, users){
        // There was an error
        if (err!=null) {
            console.log("Failed to find user with the id: " + userId + "\n" + err);
            p_callback({
                status: 400,
                error: err
            });
            // The user is not exists in the DB
        } else if (users.length == 0) {
            var date = new Date();
            date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

            // Create the user object
            var user = {
                userId: userId,
                name: p_request.body.name,
                token: p_request.body.token,
                photo: p_request.body.photo,
                visit: false,
                lastVisit: date.toISOString()
            };

            // Save the new user
            collection.insert(user, function(insertError, r){
                if (insertError==null){
                    photosBL.addImageToFaceList(user.photo, user.userId, function(face) {
                        if (!face.error){
                            collection.updateOne({
                                userId: user.userId
                            }, {
                                $set: {
                                    face: face
                                }
                            }, function(updateError, r) {
                                if (updateError) {
                                    console.log("Failed to update the user in order to add him the face field: " + face + "\n" + updateError);
                                    p_callback({
                                        status:400,
                                        error: updateError
                                    });
                                } else {
                                    user.face = face;
                                    p_callback(user);
                                }
                            });
                        }
                    });
                } else {
                    console.log("\nFailed to save new user:\n" + JSON.stringify(user) + "\n" + insertError + "\n");
                    p_callback({
                        status:400,
                        error: insertError
                    });
                }
            });
            // The user already exists in the DB
        } else if (users.length == 1){
            var date = new Date();
            date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
            var token = p_request.body.token;
            var name = p_request.body.name;
            var isodate = date.toISOString();

            // Set the new fields of the user
            collection.update({userId:userId},{$set:{token:token,name:name,lastVisit:isodate}},function(data){
                var user = users[0];
                user.token = token;
                user.name = name;
                user.lastVisit = isodate;
                p_callback(user);
            });
        } else {
            console.log("\n******ERROR******\nThere is multiple users with the given userId: " + userId + "\n");
            p_callback({
                status: 400,
                error: "There is multiple users with the given userId: " + userId
            });
        }
    });
};

exports.getAll = function(p_callback) {
    var db = mongo.db;
    var usersCollection = db.collection('Users');

    usersCollection.find({name: 'no name'}).toArray(function(err, users){
        p_callback(users);
    });
};

exports.updateMany = function(p_users) {
    var db = mongo.db;
    var usersCollection = db.collection('Users');

    p_users.forEach(function(currUser) {
        usersCollection.updateOne({
            userId: currUser.userId
        }, {
            $set: {
                name: currUser.name
            }
        }, function(err, r) {
            if (err) {
                console.log(err);
            }
        });
    });
};

exports.reload = function() {
    MongoClient.connect("mongodb://localhost:27017/test", function(err, db){
        if(!err) {
            db.collection("Users").find({"face.faceId":""}).toArray(function(err, users) {
                if (!err) {
                    var i = 0;
                    setInterval(function() {
                        if (i == users.length - 1) {
                            return;
                        }

                        var endI = i+20;
                        while(endI > i && i < users.length - 1) {
                            var currUser = users[i];
                            exports.loginUser({body:{
                                id: currUser.userId,
                                name: currUser.name,
                                token: {},
                                photo: currUser.photo
                            }}, function(data){});
                            i++;
                        }
                    }, 2 * 60 * 1000);
                }
            });
        }
    })
};