import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
    trim: true,
    maxlength: [200, 'Name cannot exceed 200 characters'],
  },
  brand: {
    type: String,
    required: [true, 'Please enter brand name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please enter product description'],
  },
  category: {
    type: String,
    required: [true, 'Please select a category'],
    enum: {
      values: [
        'whey-protein',
        'creatine',
        'mass-gainer',
        'pre-workout',
        'vitamins',
        'fat-burner',
        'accessories',
      ],
      message: '{VALUE} is not a valid category',
    },
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    min: [0, 'Price cannot be negative'],
  },
  discountPrice: {
    type: Number,
    default: 0,
    validate: {
      validator: function (val) {
        return val < this.price;
      },
      message: 'Discount price must be less than regular price',
    },
  },
  images: [
    {
      url: { type: String, required: true },
      publicId: { type: String, default: '' },
    },
  ],
  stock: {
    type: Number,
    required: [true, 'Please enter stock quantity'],
    min: [0, 'Stock cannot be negative'],
    default: 0,
  },
  flavours: [String],
  goals: [
    {
      type: String,
      enum: [
        'muscle-gain',
        'fat-loss',
        'strength',
        'endurance',
        'recovery',
        'general-health',
      ],
    },
  ],
  nutritionDetails: {
    servingSize: String,
    servingsPerContainer: Number,
    calories: Number,
    protein: String,
    carbs: String,
    fat: String,
    fiber: String,
    sugar: String,
    additionalInfo: [{ label: String, value: String }],
  },
  weight: String,
  servings: Number,
  ratings: {
    average: { type: Number, default: 0 },
    count: { type: Number, default: 0 },
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Text index for search
productSchema.index({ name: 'text', brand: 'text', description: 'text' });
// Compound index for filtering
productSchema.index({ category: 1, isActive: 1, price: 1 });
productSchema.index({ brand: 1 });

export default mongoose.model('Product', productSchema);
