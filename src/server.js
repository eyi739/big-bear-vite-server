import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackConfig from '../webpack.config.cjs';
import webpackHotMiddleware from 'webpack-hot-middleware';

import path from 'path';
import cors from 'cors';

import Product from './models/product.js'
import mongoose from 'mongoose';

const app = express();
const port = 8080;

// const HOST = process.env.SERVER_HOST;
// const PORT = process.env.SERVER_PORT;

// const express = require("express");
// const path = require('path');

// const cors = require("cors");
const corsOptions = {
    origin: ["http://localhost:5173"]
}

app.use(cors(corsOptions));
// const Product = require('../models/product');
// const mongoose = require("mongoose");
// const { webpack } = require("webpack");


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

const router = express.Router();

app.get('/api/home', (req,res) => {
     res.json({message: 'HELLO FROM EXPRESS. THIS WILL BE THE HOME PAGE'});
});



app.get('/api', (req,res) => {
    res.json({fruits: ["apple", "orange", "banana", "green grapes", "tomatoes" ]});
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});