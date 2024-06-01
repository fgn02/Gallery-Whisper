import mongoose from "mongoose";

const reviewSchema = mongoose.Schema({
    rating: {
        type: Number,
        required: true,
    },
    comment: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'User'
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Product'
    }
},{
    timestamps: true
});

const Order = mongoose.model("Review", reviewSchema);


export default Order;