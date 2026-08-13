import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/database.js';
import User from './models/User.js';
import Product from './models/Product.js';
import Coupon from './models/Coupon.js';
import DeliveryConfig from './models/DeliveryConfig.js';
import Review from './models/Review.js';

dotenv.config();

const products = [
  { name: 'Gold Standard 100% Whey', brand: 'Optimum Nutrition', description: 'The world\'s best-selling whey protein powder. 24g protein per serving with 5.5g BCAAs. Low fat, low sugar. Mixes instantly for a smooth, great-tasting shake.', category: 'whey-protein', price: 4999, discountPrice: 3999, stock: 50, flavours: ['Double Rich Chocolate', 'Vanilla Ice Cream', 'Strawberry Banana'], goals: ['muscle-gain', 'recovery'], weight: '2.27 kg', servings: 73, images: [{ url: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800', publicId: 'seed_1' }], nutritionDetails: { servingSize: '31g', servingsPerContainer: 73, calories: 120, protein: '24g', carbs: '3g', fat: '1.5g', sugar: '1g', additionalInfo: [{ label: 'BCAAs', value: '5.5g' }] } },
  { name: 'Serious Mass Gainer', brand: 'Optimum Nutrition', description: 'High calorie mass gainer with 1,250 calories per serving. 50g of protein per serving. Contains vitamins and minerals for complete nutrition support.', category: 'mass-gainer', price: 5499, discountPrice: 4499, stock: 30, flavours: ['Chocolate', 'Banana', 'Vanilla'], goals: ['muscle-gain'], weight: '5.44 kg', servings: 16, images: [{ url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2c4d8?w=800', publicId: 'seed_2' }], nutritionDetails: { servingSize: '334g', servingsPerContainer: 16, calories: 1250, protein: '50g', carbs: '252g', fat: '4.5g', sugar: '20g' } },
  { name: 'Creatine Monohydrate', brand: 'MuscleBlaze', description: 'Pure micronized creatine monohydrate for strength and power. Improves high-intensity exercise performance. 3g creatine per serving.', category: 'creatine', price: 999, discountPrice: 749, stock: 100, flavours: ['Unflavoured'], goals: ['strength', 'muscle-gain'], weight: '250g', servings: 83, images: [{ url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800', publicId: 'seed_3' }], nutritionDetails: { servingSize: '3g', servingsPerContainer: 83, calories: 0, protein: '0g', carbs: '0g', fat: '0g', additionalInfo: [{ label: 'Creatine Monohydrate', value: '3g' }] } },
  { name: 'C4 Original Pre-Workout', brand: 'Cellucor', description: 'America\'s #1 selling pre-workout. Explosive energy, heightened focus, and an overwhelming urge to conquer. Contains CarnoSyn Beta-Alanine and caffeine.', category: 'pre-workout', price: 2499, discountPrice: 1999, stock: 40, flavours: ['Fruit Punch', 'Blue Raspberry', 'Watermelon', 'Orange Burst'], goals: ['strength', 'endurance'], weight: '195g', servings: 30, images: [{ url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800', publicId: 'seed_4' }], nutritionDetails: { servingSize: '6.5g', servingsPerContainer: 30, calories: 5, protein: '0g', carbs: '1g', fat: '0g', additionalInfo: [{ label: 'Caffeine', value: '150mg' }, { label: 'Beta-Alanine', value: '1.6g' }] } },
  { name: 'Fish Oil Omega-3', brand: 'HealthKart', description: 'Premium fish oil capsules with 1000mg Omega-3 fatty acids. Supports heart health, brain function, and joint mobility.', category: 'vitamins', price: 799, discountPrice: 599, stock: 80, flavours: [], goals: ['general-health'], weight: '60 capsules', servings: 60, images: [{ url: 'https://images.unsplash.com/photo-1616671276441-2f2c277b8bf6?w=800', publicId: 'seed_5' }], nutritionDetails: { servingSize: '1 softgel', servingsPerContainer: 60, calories: 10, protein: '0g', carbs: '0g', fat: '1g', additionalInfo: [{ label: 'EPA', value: '180mg' }, { label: 'DHA', value: '120mg' }] } },
  { name: 'Lipo-6 Black Ultra Concentrate', brand: 'Nutrex Research', description: 'Ultra-concentrated fat destroyer. Powerful one pill dose for extreme fat loss and clean energy. Thermogenic formula.', category: 'fat-burner', price: 2299, discountPrice: 1899, stock: 35, flavours: [], goals: ['fat-loss'], weight: '60 capsules', servings: 60, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800', publicId: 'seed_6' }], nutritionDetails: { servingSize: '1 capsule', servingsPerContainer: 60, calories: 0, protein: '0g', carbs: '0g', fat: '0g', additionalInfo: [{ label: 'Caffeine', value: '200mg' }] } },
  { name: 'Raw Whey Protein', brand: 'MuscleBlaze', description: 'Unflavoured raw whey protein concentrate. 24g protein per scoop. 80% protein content. No added sugar or flavour.', category: 'whey-protein', price: 2999, discountPrice: 2499, stock: 60, flavours: ['Unflavoured'], goals: ['muscle-gain', 'fat-loss'], weight: '1 kg', servings: 33, images: [{ url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2c4d8?w=800', publicId: 'seed_7' }], nutritionDetails: { servingSize: '30g', servingsPerContainer: 33, calories: 120, protein: '24g', carbs: '2g', fat: '1.8g', sugar: '1g' } },
  { name: 'BCAA Pro', brand: 'MuscleTech', description: 'Premium BCAA supplement with 8g BCAAs per serving in 2:1:1 ratio. Zero sugar, zero carbs. Enhances recovery and reduces muscle soreness.', category: 'whey-protein', price: 1799, discountPrice: 1499, stock: 45, flavours: ['Watermelon', 'Blue Raspberry', 'Fruit Punch'], goals: ['recovery', 'muscle-gain'], weight: '400g', servings: 30, images: [{ url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800', publicId: 'seed_8' }], nutritionDetails: { servingSize: '13.3g', servingsPerContainer: 30, calories: 0, protein: '0g', carbs: '0g', fat: '0g', additionalInfo: [{ label: 'L-Leucine', value: '4g' }, { label: 'L-Isoleucine', value: '2g' }, { label: 'L-Valine', value: '2g' }] } },
  { name: 'Multivitamin Gold', brand: 'MuscleBlaze', description: 'Complete daily multivitamin with 25 essential vitamins and minerals. Enhanced with Ginseng and Grape Seed Extract.', category: 'vitamins', price: 699, discountPrice: 549, stock: 90, flavours: [], goals: ['general-health'], weight: '60 tablets', servings: 60, images: [{ url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800', publicId: 'seed_9' }], nutritionDetails: { servingSize: '1 tablet', servingsPerContainer: 60, calories: 0, protein: '0g', carbs: '0g', fat: '0g' } },
  { name: 'Nitrotech Whey Gold', brand: 'MuscleTech', description: 'Superior whey protein with 24g protein sourced from whey peptides and isolate. Enhanced with creatine for strength.', category: 'whey-protein', price: 5799, discountPrice: 4799, stock: 25, flavours: ['Double Rich Chocolate', 'Cookies and Cream', 'French Vanilla'], goals: ['muscle-gain', 'strength'], weight: '2.27 kg', servings: 71, images: [{ url: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800', publicId: 'seed_10' }], nutritionDetails: { servingSize: '32g', servingsPerContainer: 71, calories: 130, protein: '24g', carbs: '4g', fat: '2.5g', sugar: '2g', additionalInfo: [{ label: 'Creatine', value: '3g' }] } },
  { name: 'Gym Shaker Bottle 700ml', brand: 'Boldfit', description: 'BPA-free gym shaker with leak-proof lid. Extra compartment for supplements. Stainless steel blending ball included.', category: 'accessories', price: 399, discountPrice: 299, stock: 150, flavours: [], goals: [], weight: '200g', images: [{ url: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800', publicId: 'seed_11' }] },
  { name: 'Resistance Band Set', brand: 'Boldfit', description: 'Set of 5 resistance bands with varying resistance levels. Perfect for home workouts, stretching, and mobility training.', category: 'accessories', price: 599, discountPrice: 449, stock: 75, flavours: [], goals: ['strength', 'recovery'], weight: '300g', images: [{ url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800', publicId: 'seed_12' }] },
  { name: 'Iso Whey Zero', brand: 'BioTechUSA', description: 'Premium whey protein isolate with zero sugar and zero fat. 25g protein per serving. Lactose and gluten free formula.', category: 'whey-protein', price: 6499, discountPrice: 5299, stock: 20, flavours: ['Chocolate', 'Vanilla', 'Strawberry'], goals: ['muscle-gain', 'fat-loss'], weight: '2.27 kg', servings: 90, images: [{ url: 'https://images.unsplash.com/photo-1593095948071-474c5cc2c4d8?w=800', publicId: 'seed_13' }], nutritionDetails: { servingSize: '25g', servingsPerContainer: 90, calories: 93, protein: '25g', carbs: '0.3g', fat: '0.1g', sugar: '0g' } },
  { name: 'Super Mass Gainer', brand: 'Dymatize', description: '1,280 calories per serving with 52g protein. BCAAs and glutamine included. Perfect for hardgainers looking to build size.', category: 'mass-gainer', price: 4999, discountPrice: 3999, stock: 22, flavours: ['Rich Chocolate', 'Gourmet Vanilla'], goals: ['muscle-gain'], weight: '5.4 kg', servings: 16, images: [{ url: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800', publicId: 'seed_14' }], nutritionDetails: { servingSize: '336g', servingsPerContainer: 16, calories: 1280, protein: '52g', carbs: '246g', fat: '6g', sugar: '23g' } },
  { name: 'Creatine HCL', brand: 'MuscleTech', description: 'Highly concentrated creatine HCL for better absorption. No loading phase required. Improves strength and power output.', category: 'creatine', price: 1999, discountPrice: 1599, stock: 55, flavours: ['Unflavoured', 'Blue Raspberry'], goals: ['strength', 'muscle-gain'], weight: '150g', servings: 50, images: [{ url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800', publicId: 'seed_15' }], nutritionDetails: { servingSize: '3g', servingsPerContainer: 50, calories: 0, protein: '0g', carbs: '0g', fat: '0g', additionalInfo: [{ label: 'Creatine HCL', value: '3g' }] } },
  { name: 'Assault Pre-Workout', brand: 'MusclePharm', description: 'Scientifically dosed pre-workout for explosive energy and endurance. Contains beta-alanine, creatine, and caffeine.', category: 'pre-workout', price: 1899, discountPrice: 1499, stock: 38, flavours: ['Green Apple', 'Blue Raspberry', 'Fruit Punch'], goals: ['strength', 'endurance'], weight: '345g', servings: 30, images: [{ url: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=800', publicId: 'seed_16' }], nutritionDetails: { servingSize: '11.5g', servingsPerContainer: 30, calories: 10, protein: '0g', carbs: '3g', fat: '0g', additionalInfo: [{ label: 'Caffeine', value: '175mg' }] } },
  { name: 'L-Carnitine Liquid', brand: 'HealthKart', description: 'Pure L-Carnitine liquid for fat metabolism support. 1500mg L-Carnitine per serving. Great tasting fruit flavours.', category: 'fat-burner', price: 899, discountPrice: 699, stock: 65, flavours: ['Green Apple', 'Orange'], goals: ['fat-loss', 'endurance'], weight: '450ml', servings: 30, images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800', publicId: 'seed_17' }], nutritionDetails: { servingSize: '15ml', servingsPerContainer: 30, calories: 5, protein: '0g', carbs: '1g', fat: '0g', additionalInfo: [{ label: 'L-Carnitine', value: '1500mg' }] } },
  { name: 'Wrist Wraps Pro', brand: 'Boldfit', description: 'Heavy-duty gym wrist wraps for wrist support during heavy lifts. Thumb loop design. 18-inch length.', category: 'accessories', price: 349, discountPrice: 249, stock: 120, flavours: [], goals: ['strength'], weight: '100g', images: [{ url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800', publicId: 'seed_18' }] },
  { name: 'Biozyme Performance Whey', brand: 'MuscleBlaze', description: 'India\'s first clinically tested protein. Enhanced Absorption Formula (EAF) for 50% more protein absorption. 25g protein per serving.', category: 'whey-protein', price: 4499, discountPrice: 3799, stock: 42, flavours: ['Rich Chocolate', 'Cafe Mocha', 'Ice Cream Chocolate'], goals: ['muscle-gain', 'recovery'], weight: '2 kg', servings: 57, images: [{ url: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=800', publicId: 'seed_19' }], nutritionDetails: { servingSize: '35g', servingsPerContainer: 57, calories: 140, protein: '25g', carbs: '4g', fat: '2g', sugar: '2g', additionalInfo: [{ label: 'BCAAs', value: '5.51g' }] } },
  { name: 'Vitamin D3 + K2', brand: 'HealthKart', description: 'Clinically dosed Vitamin D3 (2000 IU) with K2 for optimal calcium absorption. Supports bone health and immunity.', category: 'vitamins', price: 499, discountPrice: 399, stock: 110, flavours: [], goals: ['general-health'], weight: '60 capsules', servings: 60, images: [{ url: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800', publicId: 'seed_20' }], nutritionDetails: { servingSize: '1 capsule', servingsPerContainer: 60, calories: 0, protein: '0g', carbs: '0g', fat: '0g', additionalInfo: [{ label: 'Vitamin D3', value: '2000 IU' }, { label: 'Vitamin K2', value: '55mcg' }] } },
];

const coupons = [
  { code: 'FIT10', discountType: 'percentage', discountValue: 10, minOrderValue: 500, maxDiscount: 500, expiryDate: new Date('2027-12-31'), usageLimit: 1000, singleUse: false, isActive: true },
  { code: 'WELCOME200', discountType: 'flat', discountValue: 200, minOrderValue: 2000, expiryDate: new Date('2027-12-31'), usageLimit: 500, singleUse: true, isActive: true },
  { code: 'FIRST50', discountType: 'percentage', discountValue: 50, minOrderValue: 1000, maxDiscount: 1000, expiryDate: new Date('2027-06-30'), usageLimit: 100, singleUse: true, isActive: true },
  { code: 'PROTEIN20', discountType: 'percentage', discountValue: 20, minOrderValue: 3000, maxDiscount: 1500, expiryDate: new Date('2027-12-31'), singleUse: false, isActive: true },
  { code: 'FLAT500', discountType: 'flat', discountValue: 500, minOrderValue: 4000, expiryDate: new Date('2027-12-31'), singleUse: false, isActive: true },
];

const seedDB = async () => {
  try {
    await connectDB();
    console.log('🗑️  Clearing existing data...');
    await User.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    await DeliveryConfig.deleteMany({});
    await Review.deleteMany({});

    console.log('👤 Creating admin user...');
    const admin = await User.create({ name: 'Admin FuelFit', email: 'admin@fuelfit.com', password: 'Admin@123', phone: '7248782252', role: 'admin', addresses: [{ label: 'Store', street: 'Sikandrabad Main Market', city: 'Bulandshahr', state: 'Uttar Pradesh', pincode: '203205', lat: 28.4502, lng: 78.3917, isDefault: true }] });

    console.log('👤 Creating test user...');
    const user = await User.create({ name: 'Test User', email: 'user@fuelfit.com', password: 'User@123', phone: '8888888888', role: 'user', addresses: [{ label: 'Home', street: '123 Fitness Lane, Sector 18', city: 'Noida', state: 'Uttar Pradesh', pincode: '201301', lat: 28.5706, lng: 77.3219, isDefault: true }] });

    console.log('📦 Creating products...');
    const createdProducts = await Product.insertMany(products);

    console.log('🎫 Creating coupons...');
    await Coupon.insertMany(coupons);

    console.log('🚚 Creating delivery config...');
    await DeliveryConfig.create({});

    console.log('⭐ Creating sample reviews...');
    const reviewData = [
      { user: user._id, product: createdProducts[0]._id, rating: 5, comment: 'Best whey protein! Amazing taste and mixes well.' },
      { user: user._id, product: createdProducts[2]._id, rating: 4, comment: 'Great creatine. Noticed strength gains within 2 weeks.' },
      { user: user._id, product: createdProducts[3]._id, rating: 5, comment: 'Incredible energy boost! Best pre-workout I have tried.' },
    ];
    await Review.insertMany(reviewData);

    // Update ratings
    for (const r of reviewData) {
      const reviews = await Review.find({ product: r.product });
      const avg = reviews.reduce((a, rv) => a + rv.rating, 0) / reviews.length;
      await Product.findByIdAndUpdate(r.product, { ratings: { average: avg, count: reviews.length } });
    }

    console.log('\n✅ Database seeded successfully!');
    console.log('📧 Admin: admin@fuelfit.com / Admin@123');
    console.log('📧 User:  user@fuelfit.com / User@123');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();
