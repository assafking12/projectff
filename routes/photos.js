/**
 * Created by Assaf on 16/10/2016.
 */
var express = require('express');
var router = express.Router();
var request = require('request');
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');
var guid = require('guid');

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

router.post('/findFaceInImage', function(req, res){
    var url = "https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false";

    if (req.body.request.isUrl){
        sendFaceAPI(url, req.body.request, function (error, response, body) {
            if (!error) {
                res.json(body);
            } else {
                console.log(error);
            }
        });
    } else {
        var imageId = guid.create() + ".jpg";
        var filePath = path.join(__dirname, "../tempImages/" + imageId);
        fs.writeFile(filePath, req.body.request.url.split(',')[1], 'base64', function(err){
            if (err){
                console.log(err);
            } else {
                sendFaceAPI(url, {
                    url: "https://findemapp.herokuapp.com/photos/cacheImages/14462714_1323377101006940_1255535041551386461_n.jpg"
                    // url: "https://findemapp.herokuapp.com/photos/cacheImages/" + imageId
                }, function (error, response, body) {
                    if (error) {
                        console.log(error);
                        res.json(body);
                    } else {
                        // Remove the file
                        fs.unlink(filePath, function(err){
                            if (err) {
                                console.log(err);
                            }

                            res.json(body);
                        })
                    }
                });
            }
        });
    }
});

router.get('/cacheImages', function(req,res) {
    var directoryPath = path.join(__dirname,"../tempImages/");
    fs.readdir(directoryPath, function (err, files) {
        res.json(files);
    });
});

router.get('/cacheImages/:imageGuid', function(req, res) {
    var filePath = path.join(__dirname,"../tempImages/", req.params.imageGuid);
    res.sendFile(filePath);
});

module.exports = router;