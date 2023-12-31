const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: "./.env" });
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.DB_Pass}@cluster0.xyrtm8p.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const collegesCollection = client.db("collegeBookingDB").collection("colleges");

    app.get('/colleges', async(req,res)=>{
        const result = await collegesCollection.find().toArray();
        res.send(result);
    });
    app.get('/search', async(req, res) => {
            const {searchQuery} = req.query;
            console.log(searchQuery);
          const matchingColleges = await collegesCollection.find({ collegeName: { $regex: searchQuery, $options: 'i' } }).toArray();
          res.send(matchingColleges);
        
      });
      app.get('/collegeDetails/:id', async(req,res)=>{
        const id = req.params.id;
        const result = await collegesCollection.find({_id: new ObjectId(id)}).toArray();
        res.send(result);
      })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req,res)=>{
    res.send('hello world')
})

app.listen(port, () => {
    console.log(`app listening on port ${port}`)
  })