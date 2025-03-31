const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"]
}
const Product = require('./models/product');

const mongoose = require("mongoose");


mongoose.connect('mongodb://127.0.0.1:27017/bigBearVite')
    .then(() => {
        console.log("CONNECTION OPEN");
    })
    .catch(err => {
        console.log("THERE WAS AN ERROR");
        console.log(err);
    });


// we can alternatively use db.on and db.once for our error handling
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"))
// db.once("open", () => {
//     console.log("Database connected")
// })

app.use(cors(corsOptions));

app.get("/products", async (req,res) => {
    const products = await Product.find({})
    res.render('produccts/index')
})

app.get("/api", (req,res) => {
    res.json({fruits: ["apple", "orange", "banana", "green grapes", "guavas" ]});
})

app.get('/products', async (req, res) => {
    const products = await Product.find({});
    console.log(products);
    res.send("ALL PRODUCTS WILL BE HERE");
})

app.listen(8080, () => {
    console.log("Server started on port 8080");
})