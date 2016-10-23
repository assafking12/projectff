/**
 * Created by Assaf on 23/10/2016.
 */
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://AssafZvigi:Aa123456@ds011462.mlab.com:11462/projectff"; // Prod
// var url = "mongodb://localhost:27017/projectff"; // Test
// var url = "mongodb://localhost:27017/test"; // Test

MongoClient.connect(url, function(err, db){
    if (err==null){
        exports.db = db;
    }
});