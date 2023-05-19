const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()


const cors=require('cors');
const app=express();
const port = process.env.PORT||5000;

app.use(express.json());
app.use(cors());

console.log(process.env.DB_User)
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


    const productCollection=client.db('kitsForKids').collection('products');

    app.get('/products',async(req,res)=>{
      const cursor=productCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })

    app.get('/products/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id : new ObjectId(id)}
      const result=await productCollection.findOne(query)
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


app.get('/',(req,res)=>{
    res.send('Kit for Kids server is running')
})

app.listen(port,()=>{
    console.log(`Kits for kids is running on port ${port}`);
})