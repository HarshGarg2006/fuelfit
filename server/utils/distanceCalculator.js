import DeliveryConfig from '../models/DeliveryConfig.js';

/**
 * Calculate distance between two coordinates using Haversine formula
 * (fallback when Google Maps API is not available)
 */
export const haversineDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculate delivery fee based on distance and config slabs
 */
export const calculateDeliveryFee = async (customerLat, customerLng) => {
  const config = await DeliveryConfig.getConfig();
  const { storeLocation, deliverySlabs, maxDeliveryRadius, freeDeliveryRadius } = config;

  const distance = haversineDistance(
    storeLocation.lat,
    storeLocation.lng,
    customerLat,
    customerLng
  );

  const roundedDistance = Math.round(distance * 10) / 10;

  if (roundedDistance > maxDeliveryRadius) {
    return {
      available: false,
      distance: roundedDistance,
      fee: 0,
      message: `Sorry, we don't deliver beyond ${maxDeliveryRadius} KM. Your location is ${roundedDistance} KM away.`,
    };
  }

  if (roundedDistance <= freeDeliveryRadius) {
    return {
      available: true,
      distance: roundedDistance,
      fee: 0,
      message: 'Free Delivery! 🎉',
    };
  }

  // Find applicable slab
  const slab = deliverySlabs.find(
    (s) => roundedDistance > s.minKm && roundedDistance <= s.maxKm
  );

  const fee = slab ? slab.charge : Math.round((roundedDistance - freeDeliveryRadius) * config.perKmCharge);

  return {
    available: true,
    distance: roundedDistance,
    fee,
    message: `Delivery charge: ₹${fee} (${roundedDistance} KM from store)`,
  };
};

/**
 * Google Maps Distance Matrix API call (when API key is available)
 */
export const getGoogleMapsDistance = async (originLat, originLng, destLat, destLng) => {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey || apiKey === 'your_google_maps_api_key') {
    return null; // Fall back to Haversine
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${originLat},${originLng}&destinations=${destLat},${destLng}&key=${apiKey}&units=metric`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.rows[0].elements[0].status === 'OK') {
      const distanceInKm = data.rows[0].elements[0].distance.value / 1000;
      return distanceInKm;
    }
    return null;
  } catch {
    return null;
  }
};
