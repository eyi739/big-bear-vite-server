import express from 'express';

import Product from './models/product.js'
import mongoose from 'mongoose';

import path from 'path';
import cors from 'cors';

import "dotenv/config.js";

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
const ApiRouter = express.Router();

ApiRouter.get('/home', (req,res) => {
     return res.json({message: 'HELLO FROM EXPRESS. THIS WILL BE THE HOME PAGE APIROUTER HEHEHHHE'});
});

app.get('/home', (req,res) => {
     return res.json({message: 'HELLO FROM EXPRESS. THIS WILL BE THE HOME PAGE APIROUTER hehe'});
});

app.get('/products', async (req, res) => {
    // const products = await Product.find({});
    // res.render('/big-bear-vite/src/pages/Products/ProductIndex.jsx')
    res.send('HELLO WORLD');
    console.log('ALL PRODUCTS ROUTE FROM EXPRESS');    
})

app.get('/makeproduct', async (req,res) => {
     const product = new Product({name: 'Green Peas', price: 1.00});
     await product.save();
     res.send(product);
});

ApiRouter.get('/makeproduct', async (req,res) => {
     const product = new Product({name: 'Green Peas', price: 1.00});
     await product.save();
     res.send(product);
});

// ApiRouter.get('/about', (req,res) => {
//      return res.json({message: 'HELLO FROM EXPRESS. THIS WILL BE THE ABOUT PAGE'});
// });
// ApiRouter.get('/contact', (req,res) => {
//      return res.json({message: 'ASDFASDSD, HELLO FROM EXPRESS. THIS WILL BE THE CONTACT PAGE'});
// });

// ApiRouter.get('/contact', (req,res) => {
//      return res.json({message: 'ASDFASDSD, HELLO FROM EXPRESS. THIS WILL BE THE CONTACT PAGE'});
// });

// ApiRouter.get('/', (req,res) => {
//     return res.json({fruits: ["apple", "orange", "banana", "green grapes", "tomatoes" ]});
// });

app.get('/', (req,res) => {
    return res.json({fruits: ["apple", "orange", "banana", "green grapes", "tomatoes" ]});
});

app.use('/api', ApiRouter);

app.listen(8080, HOST, port, () => {
    console.log(`Server started on port ${HOST}: ${port}`);
});