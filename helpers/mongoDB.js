const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://ibazaldua:PfzCZQEPwo439Mqa@cluster0-ekgux.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then(client => {
      //console.log(client);
      _db = client.db();
      callback(client);
    })
    .catch(err => console.log(err));
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found";
};

//module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
