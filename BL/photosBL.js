/**
 * Created by Assaf on 23/10/2016.
 */
var request = require('request');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var guid = require('guid');
var mongo = require('../DAL/mongoConnection');

function sendFaceAPI(p_url, p_data, p_callback) {
    request.post({
        headers: {
            'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': '1b4677c2416f40a1b28ff550075e36d4'
        },
        url: p_url,
        json: p_data
    }, p_callback);
}

exports.findFaceInImage = function (p_request, p_callback) {
    var url = "https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false";

    if (p_request.body.request.isUrl){
        sendFaceAPI(url, p_request.body.request, function (error, response, body) {
            if (!error) {
                p_callback(body);
            } else {
                console.log(error);
                p_callback({
                    status: 400,
                    error: error
                });
            }
        });
    } else {
        var imageId = guid.create() + ".jpg";
        var filePath = path.join(__dirname, "../tempImages/" + imageId);
        fs.writeFile(filePath, p_request.body.request.url.split(',')[1], 'base64', function(err){
            if (err){
                console.log(err);
                p_callback({
                    status: 400,
                    error: "Fail to save the image \n" + error
                });
            } else {
                sendFaceAPI(url, {
                    // url: "https://findemapp.herokuapp.com/photos/cacheImages/14462714_1323377101006940_1255535041551386461_n.jpg"
                    url: "https://findemapp.herokuapp.com/photos/cacheImages/" + imageId
                }, function (error, response, body) {
                    if (error) {
                        console.log(error);
                        p_callback({
                            status: 400,
                            error: error
                        });
                    } else {
                        // Remove the file
                        fs.unlink(filePath, function(err){
                            if (err) {
                                console.log(err);
                            }

                            p_callback(body);
                        })
                    }
                });
            }
        });
    }
}

exports.cacheImages = function(p_callback) {
    var directoryPath = path.join(__dirname, "../tempImages/");
    fs.readdir(directoryPath, function (err, files) {
        p_callback(files);
    });
}

exports.getImage = function(p_imageGuid, p_callback) {
    var filePath = path.join(__dirname, "../tempImages/", p_imageGuid);
    p_callback(filePath);
}

exports.findUserByPhoto = function(p_faceId, p_callback) {
    var db = mongo.db;
    var usersCollection = db.collection("Users");
    var faceListsCollection = db.collection("FaceLists");

    faceListsCollection.find().toArray(function(err, data) {
        var url = "https://api.projectoxford.ai/face/v1.0/findsimilars";
        var json = {
            faceId: p_faceId,
            mode: "matchFace",
            faceListId: ""
        };

        var foundFace = [];

        data.forEach(function(currList) {
            json.faceListId = currList.faceListId;
            sendFaceAPI(url, json, function(apiErr, response, faces) {
                if (apiErr == null && faces != null) {
                    faces.forEach(function(currFace) {
                        if (currFace.confidence >= 0.5) {
                            foundFace.push(currFace.persistedFaceId);
                        }
                    });

                    usersCollection.find({"face.persistedFaceId":{"$in":foundFace}},{"userId":"","name":"","photo":""}).toArray(function(err, foundUsers){
                        if (err){
                            console.log("Failed to find in the DB users that have the persistent face id that returned\n" + err)
                        }
                        p_callback(foundUsers);
                    });
                } else {
                    console.log("Failed to find similar faces from the given face\n" + apiErr);
                    p_callback({
                        status:400,
                        error: apiErr
                    });
                }
            });
        });
    });
}