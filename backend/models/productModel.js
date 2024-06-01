import mongoose from "mongoose";

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    size: {
        type: String,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    artists : {
        type: String,
    },
    style : {
        type: String,
    },
    subject: {
        type: String,
    },
    medium: {
        type: String,
    },
    price: {
        type: Number,
        default: 0,
        required: true,
    },
    countInStock: {
        type: Number,
        default: 0,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    numReviews: {
        type: Number,
        default: 0,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
        required: true,
    },
    isVerified : {
        type: Boolean,
        default: false,
    },

},{
    timestamps: true
});


const Product = mongoose.model("Product", productSchema);

export default Product;