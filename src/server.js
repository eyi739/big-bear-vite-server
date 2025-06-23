import express from 'express';

import Product from '../src/models/product.js'
import mongoose from 'mongoose';

import { fileURLToPath } from 'url';
import path from 'path';
import cors from 'cors';
import "dotenv/config.js";
import { create } from 'domain';
import { rmSync } from 'fs';

const corsOptions = {
    origin: ["http://localhost:5173"]
}

mongoose.connect('mongodb://127.0.0.1:27017/bigBearVite')
    .then(() => {
        console.log("CONNECTION OPEN, DATABASE CONNECTED");
    })
    .catch(err => {
        console.log("THERE WAS AN ERROR");
        console.log(err);
    });

// Vite substitute for process.env 
// const HOST = import.meta.env.VITE_SERVER_HOST;
// const PORT = import.meta.env.VITE_SERVER_PORT;

const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

 // Now you can access env variables using process.env
 const port = process.env.SERVER_PORT;

const app = express();
app.use(cors(corsOptions));

// Logging Middleware 
app.use((req, res, next) => {
    console.log('-----------------------');
    console.log(`Request: ${req.method} ${req.url}`);
    return next();
});
// we can alternatively use db.on and db.once for our error handling
// const db = mongoose.connection;
// db.on("error", console.error.bind(console, "connection error:"))
// db.once("open", () => {
//     console.log("Database connected")
// })


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ApiRouter = express.Router();

app.use(express.static(path.join(__dirname, '../../big-bear-vite/dist')));

app.set('view engine', 'jsx');
app.set('views', path.join(__dirname, '../../big-bear-vite/src/pages'))

app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.get('/api/products', async (req,res) => {
    try {
       const products = await Product.find({}); // Fetch data from your MongoDB collection
       res.json(products);
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
});

// app.get('/products/new', async (req, res) => {
//     res.render('../../big-bear-vite/src/client/pages/products/MakeProductForm.jsx');
// });

app.post('/products', async (req, res) => {
    const product = new Product(req.body);
    // express.json(product);
    await product.save();
    console.log(req.body);
    // console.log(req.body.product);
    // console.log(req.body);
    // res.redirect(`/products/${product._id}`)
});

app.put('/products/:productId', async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, {...req.body});
    console.log('put request from server.js');
})

app.get('/products/:productId', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
});

app.get('/products/:productId/edit', async (req, res) => {
    const product = await Product.findById(req.params.id);
    res.json(product);
})





app.get('/home', (req,res) => {
     return res.json({message: 'HELLO FROM EXPRESS. THIS WILL BE THE HOME PAGE APIROUTER hehe'});
});

// app.get('/makeproduct', async (req,res) => {
//      const product = new Product({name: 'Green Peas', price: 1.00});
//      await product.save();
//      res.send(product);
// });

// app.use('/api', ApiRouter);


app.listen(8080, HOST, port, () => {
    console.log(`Server started on port ${HOST}: ${port}`);
});
