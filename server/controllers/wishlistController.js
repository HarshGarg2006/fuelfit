import Wishlist from '../models/Wishlist.js';

export const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name brand price discountPrice images ratings stock category');
    if (!wishlist) wishlist = { products: [] };
    res.status(200).json({ success: true, wishlist });
  } catch (error) { next(error); }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) wishlist = new Wishlist({ user: req.user._id, products: [] });
    const idx = wishlist.products.indexOf(req.params.productId);
    if (idx > -1) { wishlist.products.splice(idx, 1); } else { wishlist.products.push(req.params.productId); }
    await wishlist.save();
    wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products', 'name brand price discountPrice images ratings stock category');
    res.status(200).json({ success: true, wishlist, added: idx === -1 });
  } catch (error) { next(error); }
};
