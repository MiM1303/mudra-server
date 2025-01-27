const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());




  const { MongoClient, ServerApiVersion } = require('mongodb');
  const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0pky6me.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
  
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

    const userCollection = client.db("mudraDB").collection("users");

     // JWT
     app.post('/jwt', async (req, res) => {
        const user = req.body;
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { 
            expiresIn: '1h' });
        res.send({ token });
    })

    // FETCHING USER DATA
    app.get('/users', async(req, res)=>{
        const result = await userCollection.find().toArray();
        res.send(result);
    })

    // GET USER DATA BY MOBILE/EMAIL
    app.get('/users/:username', async(req, res)=>{
        const username = req.params.username;
        let result;
        // const result = await userCollection.findOne({user_email:email});
        if (username.includes('@')) {
            // User entered an email
            result = await userCollection.findOne({ email: username });
          } else {
            // User entered a phone number
            result = await userCollection.findOne({ phone: username });
          }
        
          if (result) {
            res.send(result);
          } else {
            res.status(404).send({ message: 'User not found' });
          }
      })

    // ADDING USER TO DATABASE WHEN REGISTERING
    app.post('/users', async(req, res)=>{
        const user = req.body;
        
        const result = await userCollection.insertOne(user);
        res.send(result);
    })






      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
      // Ensures that the client will close when you finish/error
    //   await client.close();
    }
  }
  run().catch(console.dir);

  app.get('/', (req, res)=>{
    res.send('Mudra server is running');
})

app.listen(port, ()=>{
    console.log(`Mudra server is running on port ${port}`);
})

  