import asyncHandler from 'express-async-handler';
import Review from '../models/reviewModel.js';
import Product from '../models/productModel.js';
// post a review private
const createReview = asyncHandler(async (req, res) => {
  const { rating, comment, productId } = req.body;

  // Check if the user has already reviewed the product
  const existingReview = await Review.findOne({ user: req.user._id, product: productId });
  if (existingReview) {
    const exist = true;
    res.status(400).json({ message: 'Product already reviewed', flag: exist });
    throw new Error('Product already reviewed');
  }

  // Create a new review
  const newReview = await Review.create({
    rating,
    comment,
    user: req.user._id,
    product: productId,
  });

  if (newReview) {
    const product = await Product.findById(productId);
    if (product) {
      // Update the total rating of the product
      const existingRating = product.rating || 0;
      const existingNumReviews = product.numReviews || 0;
      const newTotalRating = existingRating * existingNumReviews + rating;
      const newNumReviews = existingNumReviews + 1;
      const newAverageRating = newTotalRating / newNumReviews;

      // Update the product with the new rating and number of reviews
      product.rating = newAverageRating;
      product.numReviews = newNumReviews;
      await product.save();
    }

    const exist = false;
    res.status(201).json({ newReview, flag: exist });
  } else {
    res.status(400);
    throw new Error('Invalid review data');
  }
});

  

const getReview = asyncHandler(async (req, res) => {
    const productId = req.params.id;
    const reviews = await Review.find({ product: productId }).populate('user', 'name');
    if (reviews) {
        res.status(200).json(reviews);
    } else {
        res.status(404);
        throw new Error('Review not found');
    }
});

const deleteReview = asyncHandler(async (req, res) => {
  const reviewId = req.body.id;
  const review = await Review.findById(reviewId);
  if (review) {
    let product = await Product.findById(review.product);
    if (product) {
      const existingRating = product.rating || 0;
      const existingNumReviews = product.numReviews || 0;
      const newTotalRating = existingRating * existingNumReviews - review.rating;
      const newNumReviews = existingNumReviews - 1;
      const newAverageRating = newNumReviews === 0 ? 0 : newTotalRating / newNumReviews;
      product.rating = newAverageRating;
      product.numReviews = newNumReviews;
      await product.save();
    }
    await review.deleteOne();
    res.status(200).json({ message: 'Review removed' });
  } else {
    res.status(404);
    throw new Error('Review not found');
  }
});


const getAllReviews = asyncHandler(async (req, res) => {
    const reviews = await Review.find({}).populate('user', 'name')
        .populate('product', 'name rating');
    if (reviews) {
        res.status(200).json(reviews);
    } else {
        res.status(404);
        throw new Error('Reviews not found');
    }
});


export { createReview, getReview, deleteReview, getAllReviews };