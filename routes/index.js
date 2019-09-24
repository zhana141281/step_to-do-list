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

/*Note creation route*/
router.get('/notes', (req, res)=>{
    res.render('create-note')
});

//create note
router.post('/api/notes', async (req, res, next)=> {
    console.log('req.body', req.body);
    const {id, title, text, color, type} = req.body;
    const data = await collection.insertOne({id, title, text, color, type});
    res.json(JSON.stringify({
        status: !!data.insertedId
    }))
});

//note details page
router.get('/notes/:id', async (req, res, next)=> {
    const id = +req.params.id;
    const note = await collection.findOne({id});
    res.render('note', { note });
});

//edit note page
router.put('/api/notes/:id', async(req,res,next)=>{
    const id = +req.params.id;
    const {title, text, color, type} = req.body;
    const data = await collection.updateOne(
        {id: +id},
        {$set: {title, text, color, type}}
    );
    res.json(JSON.stringify({
        status: !!data.modifiedCount
    }))

});
//delete note
router.delete('/api/notes/:id', async(req, res, next) => {
    const id = req.params.id;
    console.log(' req.params.id',id);

    const data = await collection.deleteOne({id: +id});
    res.json(JSON.stringify({
        status: !!data.deletedCount
    }))

});
router.get('/lists', (req, res, next) => {
  res.render('lists');
});

//Create list
router.post('/api/lists', async(req, res, next) => {
  console.log(req.body);
  const {id, title, lists, type} = req.body;

  const data = await collection.insertOne({id, title, lists, type});
  res.json(JSON.stringify({
    status: !!data.insertedId
  }))

});

// Render single list
router.get('/lists/:id', async(req, res, next) => {
    const id = +req.params.id;
    const toDos = await collection.findOne({id});
    res.render('list', {toDos});
});

// *Delete list
router.delete('/api/lists/:id', async(req, res, next) => {
    const id = req.params.id;

    const data = await collection.deleteOne({id: +id});
    res.json(JSON.stringify({
        status: !!data.deletedCount
    }))

});

// Edit list
router.put('/api/lists/:id', async(req, res, next) => {
    const id = +req.params.id;
    const {title, lists, type} = req.body;
    console.log(req.body);
    console.log(lists);
    const data = await collection.updateOne(
        {id: +id},
        {$set: {title, lists, type}},
    );
    res.json(JSON.stringify({
        status: !!data.modifiedCount
    }))

});


module.exports = router;
