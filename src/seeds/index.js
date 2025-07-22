import Product from '../models/product.js';
import { connect } from "mongoose";
import { products } from './products.js';

connect('mongodb://127.0.0.1:27017/bigBearVite')
    .then(() => {
        console.log("DATABASE CONNECTED");
    })
    .catch(err => {
        console.log("THERE WAS AN ERROR");
        console.log(err);
    });

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Product.deleteMany({});
    for(let i = 0; i < 50; i++) {
        const randomNum = Math.floor(Math.random() * 5)
        const prod = new Product({
            title: `${products[randomNum].title}`,
            image: `https://picsum.photos/400?random=${Math.random()}`,
            price: `${products[randomNum].price}`,
            category: `${products[randomNum].category}`,
            description: "TRALALA",
        })
        await prod.save();
    }
}
// const seedDB = async () => {
//     await deleteMany({});
    
//     }
// }

seedDB();