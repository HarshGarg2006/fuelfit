import mongoose from 'mongoose';

const deliverySlabSchema = new mongoose.Schema({
  minKm: { type: Number, required: true },
  maxKm: { type: Number, required: true },
  charge: { type: Number, required: true },
});

const deliveryConfigSchema = new mongoose.Schema({
  storeLocation: {
    lat: { type: Number, required: true, default: 28.4528 },
    lng: { type: Number, required: true, default: 77.6965 },
    address: { type: String, default: 'Sikandrabad, Bulandshahr, Uttar Pradesh, 203205' },
  },
  freeDeliveryRadius: {
    type: Number,
    default: 5, // km
  },
  perKmCharge: {
    type: Number,
    default: 4, // ₹ per km beyond free radius
  },
  deliverySlabs: {
    type: [deliverySlabSchema],
    default: [
      { minKm: 0, maxKm: 5, charge: 0 },
      { minKm: 5, maxKm: 10, charge: 20 },
      { minKm: 10, maxKm: 15, charge: 40 },
      { minKm: 15, maxKm: 25, charge: 60 },
      { minKm: 25, maxKm: 50, charge: 100 },
    ],
  },
  maxDeliveryRadius: {
    type: Number,
    default: 50, // km
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure only one config document exists with the correct store location
deliveryConfigSchema.statics.getConfig = async function () {
  let config = await this.findOne();
  if (!config) {
    config = await this.create({
      storeLocation: {
        lat: 28.4528,
        lng: 77.6965,
        address: 'Sikandrabad, Bulandshahr, Uttar Pradesh, 203205'
      }
    });
  } else {
    // Force update coordinates to Sikandrabad if they are still at the old New Delhi defaults
    if (config.storeLocation.lat === 28.6139 || !config.storeLocation.lat) {
      config.storeLocation = {
        lat: 28.4528,
        lng: 77.6965,
        address: 'Sikandrabad, Bulandshahr, Uttar Pradesh, 203205'
      };
      await config.save();
    }
  }
  return config;
};

export default mongoose.model('DeliveryConfig', deliveryConfigSchema);
