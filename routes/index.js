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

router.get('/lists', (req, res, next) => {
  res.render('lists');
});

//Create list
router.post('/api/lists', async(req, res, next) => {
  console.log(req.body);
  const {id, title, task, type} = req.body;

  const data = await collection.insertOne({id, title, task, type});
  res.json(JSON.stringify({
    status: !!data.insertedId
  }))

});

// Render single list
router.get('/:id', async(req, res, next) => {
    const id = +req.params.id;
    const list = await collection.findOne({id});
    res.render('list', { list });
});




module.exports = router;
