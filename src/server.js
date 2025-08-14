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
import ExpressError from './utils/expressError.js';

const corsOptions = {
  origin: ["http://localhost:5173"]
};

mongoose.connect('mongodb://127.0.0.1:27017/bigBearVite')
  .then(() => console.log("CONNECTION OPEN, DATABASE CONNECTED"))
  .catch(err => console.error("DB CONNECTION ERROR", err));

const HOST = process.env.SERVER_HOST;
const PORT = process.env.SERVER_PORT;

const app = express();
app.use(cors(corsOptions));

app.use((req, res, next) => {
  console.log('-----------------------');
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, '../../big-bear-vite/dist')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ----------------------
// Multer config
// ----------------------
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${file.fieldname}${ext}`);
  }
});

const upload = multer({ storage });

// ----------------------
// Validation middleware
// ----------------------
const validateProduct = (req, res, next) => {
  const { error } = productSchema.validate(req.body);
  if (error) {
    throw new ExpressError(error.details.map(el => el.message).join(','), 400);
  }
  next();
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(error.details.map(el => el.message).join(','), 400);
  }
  next();
};

// ----------------------
// Product routes
// ----------------------
app.get('/api/products', catchAsync(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
}));

app.get('/api/products/:productId', catchAsync(async (req, res) => {
  const { productId } = req.params;

  const product = await Product.findById(productId)
    .populate({ path: "reviews", select: "rating body" });

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json({
    ...product.toObject(),
    reviews: Array.isArray(product.reviews)
      ? product.reviews.map(r => ({
          _id: r._id,
          rating: r.rating,
          body: r.body
        }))
      : []
  });
}));

app.post('/products', upload.single('imageFile'), catchAsync(async (req, res) => {
  const { title, price, category, description, image } = req.body;

  const { error } = productSchema.validate({ title, price, category, description });
  if (error) {
    throw new ExpressError(error.details.map(el => el.message).join(','), 400);
  }

  let imagePath;
  if (req.file) {
    imagePath = `/uploads/${req.file.filename}`;
  } else if (image && /^https?:\/\/.+/i.test(image)) {
    imagePath = image;
  } else {
    throw new ExpressError('An image file or valid image URL is required', 400);
  }

  const newProduct = new Product({ title, price, category, description, image: imagePath });
  await newProduct.save();

  res.status(201).json(newProduct);
}));

// ----------------------
// Review routes
// ----------------------
app.post('/api/products/:productId/reviews', catchAsync(async (req, res) => {
  const { productId } = req.params;
  const { review } = req.body;

  // Check that review exists
  if (!review || typeof review.rating !== 'number' || !review.body) {
    return res.status(400).json({ error: 'Invalid review payload' });
  }

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  const newReview = new Review({
    rating: review.rating,
    body: review.body
  });
  await newReview.save();

  product.reviews.push(newReview._id);
  await product.save();

  // Populate reviews before returning
  const updatedProduct = await Product.findById(productId).populate({
    path: 'reviews',
    select: 'rating body'
  });

  res.status(201).json({
    review: {
      _id: newReview._id,
      rating: newReview.rating,
      body: newReview.body
    },
    reviews: updatedProduct.reviews
  });
}));


// ----------------------
// Error handler
// ----------------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  if (res.headersSent) {
    return next(err);
  }
  res.status(statusCode).json({ error: message });
});

app.listen(PORT, HOST, () => {
  console.log(`Server started on ${HOST}:${PORT}`);
});
