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

router.post('/findFaceInImage', function(req, res){
    if (req.body.request.isUrl){
        request.post({
            headers: {
                'content-type': 'application/json',
                'Ocp-Apim-Subscription-Key': '1b4677c2416f40a1b28ff550075e36d4'
            },
            url: "https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false",
            json: req.body.request
        }, function (error, response, body){
            if (!error){
                res.json(body);
            } else {
                console.log(error);
            }
        });
    } else {
        var imageId = guid.create()+".jpg";
        fs.writeFile(path.join(__dirname,"../tempImages/"+imageId), req.body.request.url.split(',')[1], 'base64', function(err){
            if (err){
                console.log(err);
            } else {
                request.post({
            headers: {
                'content-type': 'application/json',
                'Ocp-Apim-Subscription-Key': '1b4677c2416f40a1b28ff550075e36d4'
            },
            url: "https://api.projectoxford.ai/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false",
            json: {"url":"https://findemapp.herokuapp.com/photos/cacheImages/"+imageId}
        }, function (error, response, body){
            if (error){                
                console.log(error);
            }

            res.json({data:body,guid:imageId});
        });
            }
        });
    }
});

router.get('/cacheImages/:imageGuid', function(req, res) {
    // TODO: delete the file after visit
    var filePath = path.join(__dirname,"../tempImages/", req.params.imageGuid);
    res.sendFile(filePath);
    // fs.readFile(filePath, function(err, data){
    //     fs.unlink(filePath, function(err){
    //     if (err){
    //         console.log(err);
    //     } else {
    //         res.sendFile(fs.);
    //     }
    // });
    // });
});

module.exports = router;
