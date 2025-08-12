import express from 'express';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import fs from 'fs';

import { productSchema, reviewSchema } from './schemas.js';
import Product from '../src/models/product.js';
import Review from '../src/models/review.js';
import mongoose from 'mongoose';

import { fileURLToPath } from 'url';

import "dotenv/config.js";

import catchAsync from './utils/catchAsync.js';

import { create } from 'domain';
import { rmSync } from 'fs';
import ExpressError from './utils/expressError.js';

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

app.use(express.urlencoded({extended: true}));
app.use(express.json());

// function wrapAsync(fn){
//   return function (req, res, next) {
//     fn(req,res,next).catch((e) => next(e))
//   }
// }

const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body)
    if(error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
    } else {
      next();
    }
};

// Ensure uploads directory exists, this creates the folder as well:
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Uploads go to ./uploads folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ storage });

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body.review)
  if(error) {
      const msg = error.details.map(el => el.message).join(',')
      throw new ExpressError(msg, 400)
    } else {
      next();
    }
}

app.get('/api/products', async (req,res) => {
    try {
       const products = await Product.find({}); // Fetch data from your MongoDB collection
       res.json(products);
       
     } catch (error) {
       res.status(500).json({ error: error.message });
     }
});

app.get('/api/products/:productId', catchAsync(async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);

  if (!product) {
    const err = new Error("Product not found");
    err.statusCode = 404;
    return next(err); // Trigger error-handling middleware
  }

  res.json(product);
}));

app.put('/api/products/:productId', catchAsync(async (req, res) => {
    const { productId } = req.params;
    const product = await Product.findByIdAndUpdate(productId, {...req.body});
    console.log(product);
    console.log('put request from server.js');
}));

// app.post('/products', validateProduct, catchAsync(async (req, res, next) => {
//   // if(!req.body) throw new ExpressError('Invalid Product Data', 400);
  
//     const product = new Product(req.body);
//     await product.save();
//     console.log(req.body);
// }));

app.post('/products', upload.single('imageFile'), catchAsync(async (req, res, next) => {
    const { title, price, category, description, image } = req.body;

    // Manual validation
    const { error } = productSchema.validate({ title, price, category, description });
    if (error) {
      throw new ExpressError(error.details.map(el => el.message).join(','), 400);
    }

    // Check for file OR image URL
    let imagePath;
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (image && /^https?:\/\/.+/i.test(image)) {
      imagePath = image; // Use URL directly
    } else {
      throw new ExpressError('An image file or valid image URL is required', 400);
    }

    const newProduct = new Product({
      title,
      price,
      category,
      description,
      image: imagePath,
    });

    await newProduct.save();
    res.status(201).json(newProduct);
  })
);


app.get('/products/:productId', catchAsync(async (req, res) => {
      const product = await Product.findById(req.params.productId);
      console.log('Product data:', product)
      res.json(product);
}));

app.get('/products/:productId/edit', catchAsync(async (req, res, next) => {
    try {
      const product = await Product.findById(req.params.productId);
      res.json(product);
    } catch (e){
      next(e)
    }
}));

app.delete('/api/products/:productId', async (req, res) => {
  console.log('Hello does this delete work');
  const { productId } = req.params;
  try {
    const deletedItem = await Product.findByIdAndDelete(productId);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.status(200).json({ message: 'Item deleted successfully', deletedItem });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/products/:productId/reviews', validateReview, catchAsync(async (req, res) => {
  const { productId } = req.params;
  
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  // Create a new review (make sure req.body.review matches your schema)
  const review = new Review(req.body.review);

  await review.save();

  product.reviews.push(review);
  await product.save();

  // Respond with the saved review
  res.status(201).json(review);
}));


app.use((err, req, res, next) => {
  console.error(err.stack); // log for debugging

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({ error: message });
  // res.send('BOY YOU DONE HIT THE EXPRESS ERROR HANDLER MIDDLEWARE');
});


app.listen(8080, HOST, port, () => {
    console.log(`Server started on port ${HOST}: ${port}`);
});
