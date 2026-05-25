import Review from '../models/Review.js';
import Product from '../models/Product.js';

// @desc    Add review
// @route   POST /api/reviews
export const addReview = async (req, res, next) => {
  try {
    const { productId, rating, comment } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existing = await Review.findOne({ user: req.user._id, product: productId });
    if (existing) {
      // Update existing review
      existing.rating = rating;
      existing.comment = comment;
      await existing.save();
    } else {
      await Review.create({
        user: req.user._id,
        product: productId,
        rating,
        comment,
      });
    }

    // Recalculate product rating
    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;

    product.ratings = {
      average: Math.round(avgRating * 10) / 10,
      count: reviews.length,
    };
    await product.save();

    res.status(201).json({ success: true, message: 'Review submitted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get product reviews
// @route   GET /api/reviews/product/:productId
export const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate
    const reviews = await Review.find({ product: productId });
    const product = await Product.findById(productId);
    if (reviews.length > 0) {
      const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
      product.ratings = { average: Math.round(avgRating * 10) / 10, count: reviews.length };
    } else {
      product.ratings = { average: 0, count: 0 };
    }
    await product.save();

    res.status(200).json({ success: true, message: 'Review deleted' });
  } catch (error) {
    next(error);
  }
};
