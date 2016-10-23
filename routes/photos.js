/**
 * Created by Assaf on 16/10/2016.
 */
var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var photosBL = require('../BL/photosBL');

router.post('/findFaceInImage', function(req, res){
    photosBL.findFaceInImage(req, function(returnJson) {
        res.json(returnJson);
    })
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