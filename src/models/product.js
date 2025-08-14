import mongoose from 'mongoose';
const Schema = mongoose.Schema;

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
    reviews: [
        {   
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
}, opts);


const Product = mongoose.model('Product', productSchema);

export default Product;