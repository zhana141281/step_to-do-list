var express = require('express');
var router = express.Router();

let collection;

const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://admin:admin@cluster0-2uqkx.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

client.connect(err => {
  console.log('DB Connection error:', err);
  collection = client.db("todo").collection("todo");
});

/* GET home page. */
router.get('/',async function(req, res, next) {
  const data = await collection.find({});
  let lists =[];
  await data.forEach(item=>{
    lists.push(item);
  });
  console.log(lists);
  res.render('index', {lists});
});

module.exports = router;
