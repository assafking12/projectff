var express = require('express');
var router = express.Router();
var usersBL = require('../BL/usersBL');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/loginUser', function(req, res){
  usersBL.loginUser(req, function(responseJson) {
    res.json(responseJson);
  });
});

module.exports = router;
