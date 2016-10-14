var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/loginUser', function(req, res){
  var db = req.db;
  var collection = db.collection('Users');
  var userId = req.body.id;

  // Find the user
  collection.find({userId:userId}).toArray(function(err, users){
    // There was an error
    if (err!=null){
      console.log("Failed to find user with the id: " + userId + "\n" + err);
      req.closeDB();
      res.json({
        status:400,
        error: err
      });
    // The user is not exists in the DB
    } else if (users.length == 0){
      var date = new Date();
      date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

      // Create the user object
      var user = {
        userId: userId,
        name: req.body.name,
        token: req.body.token,
        photo: req.body.photo,
        visit: false,
        lastVisit: date.toISOString()
      };

      // Save the new user
      collection.insert(user, function(insertError, r){
        req.closeDB();
        if (insertError==null){
          res.json(user);
        } else {
          console.log("\nFailed to save new user:\n" + JSON.stringify(user) + "\n" + insertError + "\n");
          res.json({
            status:400,
            error: insertError
          });
        }
      });
    // The user already exists in the DB
    } else if (users.length == 1){
      var date = new Date();
      date = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
      var token = req.body.token;
      var name = req.body.name;
      var isodate = date.toISOString();

      // Set the new fields of the user
      collection.update({userId:userId},{$set:{token:token,name:name,lastVisit:isodate}},function(data){
        req.closeDB();
        var user = users[0];
        user.token = token;
        user.name = name;
        user.lastVisit = isodate;
        res.json(user);
      });
    // , function(error) {
    //     console.log("\nFailed to update user: " + userId + "\n" + error + "\n");
    //     res.json({
    //       status: 400,
    //       error:error
    //     });
    //   }
    } else {
      req.closeDB();
      console.log("\n******ERROR******\nThere is multiple users with the given userId: " + userId + "\n");
      res.json({
        status:400,
        error:"There is multiple users with the given userId: " + userId
      });
    }
  });
});

module.exports = router;
