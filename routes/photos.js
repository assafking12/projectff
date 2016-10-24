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

router.get('/cacheImages', function(req, res) {
    photosBL.cacheImages(function (p_files) {
        res.json(p_files);
    });
});

router.get('/cacheImages/:imageGuid', function(req, res) {
    photosBL.getImage(req.params.imageGuid, function(p_filePath) {
        res.sendFile(p_filePath);
    });
});

router.post('/findUserByPhoto', function(req, res) {
    photosBL.findUserByPhoto(req.body.p_faceId, function(data) {
        res.json(data);
    });
});

module.exports = router;