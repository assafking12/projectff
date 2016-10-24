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

// router.get('/getAll', function(req, res) {
//   usersBL.getAll(function(users) {
//     res.json(users);
//   })
// });
//
// // router.put('/updateMany', function(req, res) {
// //   usersBL.updateMany(req.body.users);
// // });
// //
// // router.get('/reload', function(req, res){
// //   usersBL.reload();
// // });
module.exports = router;
