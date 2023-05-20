const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()


const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// console.log(process.env.DB_User)
const uri = `mongodb+srv://${process.env.DB_User}:${process.env.Secret_Key}@cluster0.ey6jdyf.mongodb.net/?retryWrites=true&w=majority`;

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


    const productCollection = client.db('kitsForKids').collection('products');
    const addedToyCollection = client.db('kitsForKids').collection('addedToy');

    app.get('/products', async (req, res) => {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    app.get('/products/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await productCollection.findOne(query)
      res.send(result)
    })


    //Add a toy

    app.post('/addedToy', async (req, res) => {
      const added = req.body
      // console.log(added)
      const result = await addedToyCollection.insertOne(added);
      res.send(result)
    })

    //All Toy

    app.get('/addedToy', async (req, res) => {
      const result = await addedToyCollection.find().toArray();
      res.send(result)
    })

    //for added toy details
    app.get('/addedToy/:id', async (req, res) => {
      const id = req.params.id;
      // console.log(id)

      const query = { _id: new ObjectId(id) }
      const result = await addedToyCollection.findOne(query)
      res.send(result)
    })


    //for my toy section
    app.get('/addedToy', async (req, res) => {
      let query = {};
      console.log(req.query.email); // Log the email parameter to check if it is correctly received
      if (req.query.email) {
        query = { email: req.query.email };
      }
      try {
        const result = await addedToyCollection.find(query).toArray();
        console.log(result); // Log the result to the terminal
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
      }
    });
    


    //Delete a toy from my toy
    app.delete('/addedToy/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await addedToyCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        res.status(500).send(error.message);
      }
    });

    // Update a toy

    app.patch('/addedToy/:id',async(req,res)=>{

      const id=req.params.id;
      const updateToy=req.body;
      const filter={_id:new ObjectId(id)}
      console.log(updateToy)
      const updateDoc={
          $set :{
              status:updateToy.status
          }
      }

      const result = await addedToyCollection.updateOne(filter,updateDoc)
      res.send(result)

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


app.get('/', (req, res) => {
  res.send('Kit for Kids server is running')
})

app.listen(port, () => {
  console.log(`Kits for kids is running on port ${port}`);
})