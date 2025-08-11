import Product from '../models/product.js';
import Review from '../models/review.js';
import { connect } from 'mongoose';
import { products } from './products.js';

connect('mongodb://127.0.0.1:27017/bigBearVite')
  .then(() => console.log('DATABASE CONNECTED'))
  .catch(err => console.error(err));

const seedDB = async () => {
  await Product.deleteMany({});
  await Review.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const randomNum = Math.floor(Math.random() * 5);

    // Create a review first
    const review = new Review({
      body: 'product',
      rating: 1
    });
    await review.save();

    // Create product and attach review _id
    const prod = new Product({
      title: products[randomNum].title,
      image: `https://picsum.photos/400?random=${Math.random()}`,
      price: products[randomNum].price,
      category: products[randomNum].category,
      description: 'TRALALA',
      reviews: [review._id]
    });

    await prod.save();
  }
};

seedDB();
