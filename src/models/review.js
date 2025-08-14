import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const reviewSchema = ({
    body: String,
    rating: Number,
});

const Review = mongoose.model('Review', reviewSchema);

export default Review;