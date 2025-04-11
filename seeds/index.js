import Product, { deleteMany } from '../models/product';
import { connect } from "mongoose";
import { products } from './products';

connect('mongodb://127.0.0.1:27017/bigBearVite')
    .then(() => {
        console.log("CONNECTION OPEN");
    })
    .catch(err => {
        console.log("THERE WAS AN ERROR");
        console.log(err);
    });

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await deleteMany({});
    for(let i = 0; i < 50; i++) {
        const randomNum = Math.floor(Math.random() * 5)
        const prod = new Product({
            name: `${products[randomNum].name}`,
            category: `${products[randomNum].category}`,
            price: `${products[randomNum].price}`
        })
        await prod.save();
    }
}

seedDB();