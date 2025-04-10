import mongoose from 'mongoose';
// const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = ({
    body: String,
    rating: Number,
    author : {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Review = mongoose.model('Review', reviewSchema);


export default Review;