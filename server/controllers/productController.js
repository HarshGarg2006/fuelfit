import Product from '../models/Product.js';
import Review from '../models/Review.js';

// @desc    Get all products with filters, search, sort, pagination
// @route   GET /api/products
export const getProducts = async (req, res, next) => {
  try {
    const {
      search,
      category,
      brand,
      minPrice,
      maxPrice,
      flavour,
      goal,
      sort,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    // Text search
    if (search) {
      query.$text = { $search: search };
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Brand filter
    if (brand) {
      query.brand = { $in: brand.split(',') };
    }

    // Price range
    if (minPrice || maxPrice) {
      query.$or = [
        {
          discountPrice: {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) }),
            $gt: 0,
          },
        },
        {
          discountPrice: 0,
          price: {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) }),
          },
        },
      ];
    }

    // Flavour filter
    if (flavour) {
      query.flavours = { $in: flavour.split(',') };
    }

    // Goal filter
    if (goal) {
      query.goals = { $in: goal.split(',') };
    }

    // Sort
    let sortOption = { createdAt: -1 };
    if (sort === 'price-asc') sortOption = { price: 1 };
    else if (sort === 'price-desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { 'ratings.average': -1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };
    else if (sort === 'popular') sortOption = { 'ratings.count': -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit));

    // Get unique brands and flavours for filter sidebar
    const allBrands = await Product.distinct('brand', { isActive: true });
    const allFlavours = await Product.distinct('flavours', { isActive: true });

    res.status(200).json({
      success: true,
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      filters: { brands: allBrands, flavours: allFlavours },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
export const getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    // Get related products
    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      isActive: true,
    }).limit(4);

    res.status(200).json({ success: true, product, reviews, related });
  } catch (error) {
    next(error);
  }
};

// @desc    Create product (Admin)
// @route   POST /api/products
export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Update product (Admin)
// @route   PUT /api/products/:id
export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete product (Admin - soft delete)
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all categories with counts
// @route   GET /api/products/categories
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Product.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all products (Admin - including inactive)
// @route   GET /api/products/admin/all
export const getAdminProducts = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search, category } = req.query;
    const query = {};
    if (search) query.$text = { $search: search };
    if (category) query.category = category;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, products, total, pages: Math.ceil(total / Number(limit)) });
  } catch (error) {
    next(error);
  }
};
