// const mongo = require('mongodb');

//const OurMongoServer = "mongodb://ec2-18-217-64-153.us-east-2.compute.amazonaws.com:27017/";

// class DBCommManager {
//   constructor(url) {
//     this.url = url;
//     this.MongoClient = mongo.MongoClient;
//   }

//   // Method
//   CreateDB() {
//     this.MongoClient.connect(this.url, (err, db) => {
//       if (err) { throw err; }
//       db.close();
//       console.log('DB added successfully');
//     });
//   }

//   CreateCollection(collectionName) {
//     this.MongoClient.connect(this.url, (err, db) => {
//       if (err) { throw err; }
//       db.createCollection(collectionName, (errr) => {
//         if (errr) { throw errr; }
//         console.log('Collection inserted successfully');
//         db.close();
//       });
//     });
//   }

//   InsertJsonDoc(jsonDoc, collectionName) {
//     this.MongoClient.connect(this.url, (err, db) => {
//       if (err) throw err;
//       db.collection(collectionName).insertOne(jsonDoc, (errr) => {
//         if (errr) throw errr;
//         console.log('Document inserted successfully');
//         db.close();
//       });
//     });
//   }

//   Find(key, value, collectionName) {
//     this.MongoClient.connect(this.url, (err, db) => {
//       if (err) throw err;
//       const jsonStr = JSON.stringify({ key: value });
//       db.collection(collectionName).find(JSON.parse(jsonStr)).toArray((errr, result) => {
//         if (errr) throw errr;
//         console.log(result);
//         db.close();
//       });
//     });
//   }
// }
