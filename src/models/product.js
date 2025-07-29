import mongoose from 'mongoose';
import Review from './review.js';

// const mongoose = require('mongoose');
// const Review = require('./review')
const Schema = mongoose.Schema;

// const ImageSchema = new Schema ({
//     url: String,
//     filename: String
// })

// ImageSchema.virtual('thumbnail').get(function() {
//     return this.url.replace('/upload', '/upload/w_200')
// })

const opts = { toJSON: {virtuals: true}}

const productSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    image: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        enum:['fruit', 'vegetable','poultry', 'dairy', 'meat', 'canned goods']
    },
    description: {
        type: String,
    },
    // images: [ImageSchema],
    // geometry: {
    //     type: {
    //         type: String,
    //         enum: ['Point'],
    //         required: true
    //     },
    //     coordinates: {
    //         type: [Number],
    //         required: true
    //     }
    // },
    
    // category: {
    //     type: String,
    //     lowercase: true,
    //     enum: ['fruit', 'vegetable', 'dairy', 'meat', 'poultry']
    // },
    // description: String,
    // location: String,
    // reviews: [
    //     {   
    //         type: Schema.Types.ObjectId,
    //         ref: 'Review'
    //     }
    // ],
    // author: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'User'
    // }
}, opts);

// productSchema.virtual('properties.popUpMarkup').get(function(){
//     return `
//     <strong><a href="/products/${this._id}">${this.name}</a></strong>
//     <p>${this.description.substring(0 , 20)}...</p>`
// })

// productSchema.virtual('properties.popUpMarkup').get(function () {
//     return `
//     <strong><a href="/products/${this._id}">${this.name}</a><strong>
//     <p>${this.description.substring(0, 20)}...</p>`
// });

// productSchema.post('findOneAndDelete', async function(doc){
//     await Review.deleteMany({
//         _id: {
//             $in: doc.reviews
//         }
//     })
// })

const Product = mongoose.model('Product', productSchema);

export default Product;