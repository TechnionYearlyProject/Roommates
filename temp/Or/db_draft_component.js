var mongo = require('mongodb');

const OurMongoServer =  "mongodb://ec2-18-217-64-153.us-east-2.compute.amazonaws.com:27017/";

class DBCommManager {
  constructor(url) {
    this.url = url;
    this.MongoClient = mongo.MongoClient;
  }

  // Method
  	CreateDB() {
	    this.MongoClient.connect(this.url, function(err, db) {
		  if (err) {throw err;}
		  db.close();
		  console.log("DB added successfully");
		});
  	}

  	CreateCollection(collectionName){
	  	this.MongoClient.connect(this.url, function(err, db) {
	  		if (err) {throw err;}
	  		db.createCollection(collectionName, function(err, res) {
	   	 		if (err) {throw err;}
	   	 		console.log("Collection inserted successfully");
	    		db.close();
	  		});
		});
  	}

  	InsertJsonDoc(jsonDoc, collectionName){
		this.MongoClient.connect(this.url, function(err, db) {
			if (err) throw err;
			db.collection(collectionName).insertOne(jsonDoc, function(err, res) {
				if (err) throw err;
				console.log("Document inserted successfully");
				db.close();
			});
		});
  	}

  	Find(key, value, collectionName){
		this.MongoClient.connect(this.url, function(err, db) {
			if (err) throw err;
			var jsonStr = '{"' +  key + '":"' + value + '"}';
	  		db.collection(collectionName).find(JSON.parse(jsonStr)).toArray(function(err, result) {
	    		if (err) throw err;
	   	 		console.log(result);
	    		db.close();
			});
	  	});
	}
}
