import DeliveryConfig from '../models/DeliveryConfig.js';
import { calculateDeliveryFee, getGoogleMapsDistance } from '../utils/distanceCalculator.js';

export const calculateDelivery = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    if (!lat || !lng) return res.status(400).json({ success: false, message: 'Location coordinates required' });
    const config = await DeliveryConfig.getConfig();
    // Try Google Maps first, fallback to Haversine
    const gmDistance = await getGoogleMapsDistance(config.storeLocation.lat, config.storeLocation.lng, lat, lng);
    let result;
    if (gmDistance !== null) {
      const roundedDist = Math.round(gmDistance * 10) / 10;
      if (roundedDist > config.maxDeliveryRadius) {
        result = { available: false, distance: roundedDist, fee: 0, message: `We don't deliver beyond ${config.maxDeliveryRadius} KM` };
      } else if (roundedDist <= config.freeDeliveryRadius) {
        result = { available: true, distance: roundedDist, fee: 0, message: 'Free Delivery! 🎉' };
      } else {
        const slab = config.deliverySlabs.find(s => roundedDist > s.minKm && roundedDist <= s.maxKm);
        const fee = slab ? slab.charge : Math.round((roundedDist - config.freeDeliveryRadius) * config.perKmCharge);
        result = { available: true, distance: roundedDist, fee, message: `Delivery charge: ₹${fee}` };
      }
    } else {
      result = await calculateDeliveryFee(lat, lng);
    }
    res.status(200).json({ success: true, ...result });
  } catch (error) { next(error); }
};

export const getDeliveryConfig = async (req, res, next) => {
  try {
    const config = await DeliveryConfig.getConfig();
    res.status(200).json({ success: true, config });
  } catch (error) { next(error); }
};

export const updateDeliveryConfig = async (req, res, next) => {
  try {
    let config = await DeliveryConfig.findOne();
    if (!config) config = new DeliveryConfig();
    Object.assign(config, req.body);
    config.updatedAt = Date.now();
    await config.save();
    res.status(200).json({ success: true, config });
  } catch (error) { next(error); }
};
