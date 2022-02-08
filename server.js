// Require Express, MongoDB, Cors, Dotenv and Declaring Port
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

// Creating Server App
const app = express();
const port = process.env.PORT || 5000;

// Middle Ware
app.use(cors());
app.use(express.json());


// Database Credentials
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.w9ewo.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Async Function for Data Management
async function run() {
    try {
        await client.connect();

        const database = client.db("yooda_hostel");
        const foodItemCollection = database.collection("FoodItem");
        const studentCollection = database.collection("Student");
        const distributionCollection = database.collection("Distribution");
        console.log('DB CONNECTED');

        // POST API FOR ADDING FOOD
        app.post('/FoodItem', async (req, res) => {
            const foodItem = req.body;
            const result = await foodItemCollection.insertOne(foodItem);
            res.json(result);
        })

        // GET API For ALL Food Item
        app.get('/FoodItem', async (req, res) => {
            const cursor = foodItemCollection.find({});
            const allFoods = await cursor.toArray();
            res.send(allFoods);
        });

        // PUT API FOR UPDATE Food Name
        app.put('/FoodItem/:id', async (req, res) => {
            const id = req.params.id;
            const updatedFoodName = req.body.editFoodName;
            const updatedFoodPrice = req.body.editFoodPrice;
            const filter = { _id: ObjectId(id) };

            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    foodItem: updatedFoodName,
                    costPrice: updatedFoodPrice
                }
            }
            const result = await foodItemCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        })

        // DLETE FOOD API
        app.delete('/FoodItem/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await foodItemCollection.deleteOne(query);
            res.json(result);
        });





    } finally {
        // await client.close();
    }

}
run().catch(console.dir);
// Default Root
app.get('/', (req, res) => {
    res.send('Hello From Yooda Hostel!')
})

app.listen(port, () => {
    console.log(`Listening to PORT - ${port}`)
})