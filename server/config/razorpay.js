import Razorpay from 'razorpay';

let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
} else {
  console.log('⚠️  Razorpay keys not configured — online payments disabled (COD only)');
}

export default razorpay;
