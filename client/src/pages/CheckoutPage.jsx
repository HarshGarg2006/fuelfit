import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCart } from '../store/slices/cartSlice';
import { placeOrder } from '../store/slices/orderSlice';
import { FiMapPin, FiCreditCard, FiCheckCircle, FiCopy, FiCheck } from 'react-icons/fi';
import toast from 'react-hot-toast';
import API from '../store/api/axiosInstance';

export default function CheckoutPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((s) => s.cart);
  const { user } = useSelector((s) => s.auth);
  const { loading } = useSelector((s) => s.orders);
  
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({ street: '', city: '', state: '', pincode: '', phone: '', lat: null, lng: null });
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);

  const [locating, setLocating] = useState(false);
  const [distanceInfo, setDistanceInfo] = useState(null);
  const [checkingDistance, setCheckingDistance] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  useEffect(() => { dispatch(fetchCart()); }, [dispatch]);
  
  useEffect(() => {
    if (user?.addresses?.length > 0) {
      const a = user.addresses[0];
      setAddress({ 
        street: a.street || '', 
        city: a.city || '', 
        state: a.state || '', 
        pincode: a.pincode || '', 
        phone: user.phone || '',
        lat: a.lat || null,
        lng: a.lng || null
      });
    }
  }, [user]);

  // Geolocation lookup
  const detectLocation = () => {
    if (!navigator.geolocation) {
      return toast.error('Geolocation is not supported by your browser');
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setAddress(prev => ({ ...prev, lat: latitude, lng: longitude }));
        setLocating(false);
        toast.success('Live location coordinates detected!');
        
        // Reverse geocoding using free OpenStreetMap Nominatim API
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
          const data = await res.json();
          if (data && data.address) {
            const street = data.display_name || '';
            const city = data.address.city || data.address.town || data.address.village || '';
            const state = data.address.state || '';
            const pincode = data.address.postcode || '';
            setAddress(prev => ({
              ...prev,
              street: street || prev.street,
              city: city || prev.city,
              state: state || prev.state,
              pincode: pincode || prev.pincode
            }));
            toast.success('Address auto-filled from live location!');
          }
        } catch (e) {
          console.error('Reverse geocoding error:', e);
        }
      },
      (error) => {
        setLocating(false);
        toast.error('Unable to detect location. Please check browser permissions.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const isSikandrabadCustomer = (addr) => {
    if (!addr) return false;
    const pin = String(addr.pincode || '').trim();
    const city = String(addr.city || '').trim().toLowerCase();
    const street = String(addr.street || '').trim().toLowerCase();
    return pin === '203205' || city.includes('sikandrabad') || street.includes('sikandrabad');
  };

  const isSikandrabadActive = isSikandrabadCustomer(address);

  useEffect(() => {
    if (!isSikandrabadActive && paymentMethod === 'cod') {
      setPaymentMethod('upi');
    }
  }, [isSikandrabadActive, paymentMethod]);

  // Distance calculation API call
  useEffect(() => {
    const checkDistance = async () => {
      if (address.lat && address.lng) {
        setCheckingDistance(true);
        try {
          const res = await API.post('/delivery/calculate', { lat: address.lat, lng: address.lng });
          if (res.data.success) {
            setDistanceInfo(res.data);
          }
        } catch (err) {
          console.error('Error calculating distance:', err);
        }
        setCheckingDistance(false);
      }
    };
    checkDistance();
  }, [address.lat, address.lng]);

  const subtotal = items.reduce((sum, item) => {
    const p = item.product;
    return sum + ((p?.discountPrice > 0 ? p.discountPrice : p?.price) || 0) * item.quantity;
  }, 0);
  
  // Use dynamic delivery fee if available, otherwise fallback to static calculation. Free for Sikandrabad.
  const deliveryFee = isSikandrabadActive ? 0 : (distanceInfo ? distanceInfo.fee : (subtotal > 999 ? 0 : 49));
  const total = subtotal - discount + deliveryFee;

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setCouponLoading(true);
    try {
      const res = await API.post('/coupons/validate', { code: couponCode, orderTotal: subtotal });
      if (res.data.success) {
        setDiscount(res.data.coupon.discount);
        toast.success(`Coupon "${res.data.coupon.code}" applied! Discount: ₹${res.data.coupon.discount}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon code');
      setDiscount(0);
    }
    setCouponLoading(false);
  };

  const handlePlaceOrder = async () => {
    if (!address.street || !address.city || !address.state || !address.pincode) {
      return toast.error('Please fill in your address');
    }

    if (paymentMethod === 'cod') {
      if (!isSikandrabadActive) {
        return toast.error('Cash on Delivery (COD) is only available inside Sikandrabad (Pincode 203205).');
      }
    }

    if (paymentMethod === 'upi') {
      if (!transactionId) {
        return toast.error('Please enter the 12-digit UPI Transaction ID / UTR.');
      }
      if (transactionId.length !== 12 || !/^\d+$/.test(transactionId)) {
        return toast.error('UPI Transaction ID / UTR must be exactly 12 digits.');
      }
    }

    try {
      const result = await dispatch(placeOrder({
        shippingAddress: address,
        paymentInfo: { 
          method: paymentMethod, 
          status: 'pending',
          ...(paymentMethod === 'upi' ? { upiTransactionId: transactionId } : {})
        },
        couponCode: couponCode || undefined,
        deliveryPrice: deliveryFee,
      })).unwrap();
      toast.success('Order placed successfully!');
      navigate(`/orders/${result.order._id}`);
    } catch (err) {
      toast.error(err || 'Failed to place order');
    }
  };

  const steps = [
    { num: 1, label: 'Address', icon: FiMapPin },
    { num: 2, label: 'Payment', icon: FiCreditCard },
    { num: 3, label: 'Confirm', icon: FiCheckCircle },
  ];

  const isCodBlocked = !isSikandrabadActive;

  return (
    <div className="py-8 fade-in">
      <div className="page-container max-w-4xl">
        <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>

        {/* Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {steps.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s.num ? 'bg-neon-red text-white' : 'bg-dark-600 text-dark-200'}`}>
                <s.icon size={18} />
              </div>
              <span className={`text-sm hidden sm:block ${step >= s.num ? 'text-white' : 'text-dark-200'}`}>{s.label}</span>
              {i < steps.length - 1 && <div className={`w-12 h-0.5 ${step > s.num ? 'bg-neon-red' : 'bg-dark-600'}`} />}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="glass-card p-6 slide-up">
                <h2 className="font-heading text-xl font-bold mb-6">Shipping Address</h2>
                
                {/* Live Location Panel */}
                <div className="mb-6 bg-dark-800/40 p-4 rounded-xl border border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <div>
                    <h3 className="font-semibold text-sm text-white">Detect Live Location</h3>
                    <p className="text-xs text-dark-300">Fast address auto-fill & precise distance check</p>
                  </div>
                  <button
                    type="button"
                    onClick={detectLocation}
                    disabled={locating}
                    className="btn-secondary !py-2 !px-4 text-xs flex items-center gap-1.5 bg-neon-red/10 border-neon-red/20 text-neon-red hover:bg-neon-red/20 transition-all font-semibold"
                  >
                    📍 {locating ? 'Detecting...' : 'Detect Location'}
                  </button>
                </div>

                {address.lat && address.lng && (
                  <div className="text-xs text-neon-green bg-neon-green/5 p-3 rounded-lg border border-neon-green/10 flex items-center gap-1.5 mb-5 font-semibold">
                    ✓ Coordinates detected: {address.lat.toFixed(5)}, {address.lng.toFixed(5)}
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-dark-100 mb-1.5 block">Street Address *</label>
                    <input value={address.street} onChange={(e) => setAddress({ ...address, street: e.target.value })} className="input-field" placeholder="123 Main St, Apt 4B" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-dark-100 mb-1.5 block">City *</label>
                      <input value={address.city} onChange={(e) => setAddress({ ...address, city: e.target.value })} className="input-field" placeholder="Mumbai" />
                    </div>
                    <div>
                      <label className="text-sm text-dark-100 mb-1.5 block">State *</label>
                      <input value={address.state} onChange={(e) => setAddress({ ...address, state: e.target.value })} className="input-field" placeholder="Maharashtra" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-dark-100 mb-1.5 block">Pincode *</label>
                      <input value={address.pincode} onChange={(e) => setAddress({ ...address, pincode: e.target.value })} className="input-field" placeholder="203205" />
                    </div>
                    <div>
                      <label className="text-sm text-dark-100 mb-1.5 block">Phone</label>
                      <input value={address.phone} onChange={(e) => setAddress({ ...address, phone: e.target.value })} className="input-field" placeholder="+91 9876543210" />
                    </div>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn-primary mt-6 !py-3 w-full">Continue to Payment</button>
              </div>
            )}

            {/* Step 2: Payment */}
            {step === 2 && (
              <div className="glass-card p-6 slide-up">
                <h2 className="font-heading text-xl font-bold mb-6">Payment Method</h2>
                
                {checkingDistance && (
                  <div className="text-xs text-dark-300 bg-dark-700/50 p-2.5 rounded-lg border border-white/5 mb-4 animate-pulse">
                    Calculating distance from store...
                  </div>
                )}

                {!checkingDistance && isSikandrabadActive ? (
                  <div className="text-xs text-neon-green bg-neon-green/5 p-3 rounded-lg border border-neon-green/10 mb-4 font-semibold">
                    ✓ Free Delivery and Cash on Delivery (COD) are available for Sikandrabad customers!
                  </div>
                ) : (
                  <div className="text-xs text-neon-orange bg-neon-orange/5 p-3 rounded-lg border border-neon-orange/10 mb-4 font-semibold">
                    ⚠️ Cash on Delivery (COD) is only available inside Sikandrabad (Pincode 203205). Please pay online via UPI/Scanner.
                  </div>
                )}

                <div className="space-y-3">
                  {/* UPI Method */}
                  <label className={`glass-card !rounded-xl p-4 flex items-start gap-4 cursor-pointer transition-colors ${paymentMethod === 'upi' ? '!border-neon-red/50 bg-neon-red/5' : ''}`}>
                    <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="accent-[var(--color-neon-red)] w-4 h-4 mt-1" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Online Payment (UPI / Scanner)</p>
                      <p className="text-dark-200 text-xs">Scan & pay instantly with any UPI app</p>
                    </div>
                  </label>

                  {/* COD Method */}
                  <label className={`glass-card !rounded-xl p-4 flex items-start gap-4 transition-colors ${isCodBlocked ? 'opacity-40 cursor-not-allowed bg-dark-800' : 'cursor-pointer'} ${paymentMethod === 'cod' ? '!border-neon-red/50 bg-neon-red/5' : ''}`}>
                    <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} disabled={isCodBlocked} onChange={() => setPaymentMethod('cod')} className="accent-[var(--color-neon-red)] w-4 h-4 mt-1" />
                    <div className="flex-1">
                      <p className="font-semibold text-sm">Cash on Delivery (COD)</p>
                      <p className="text-dark-200 text-xs">Pay upon delivery (exclusive to Sikandrabad customers)</p>
                    </div>
                  </label>
                </div>

                {/* UPI Panel */}
                {paymentMethod === 'upi' && (
                  <div className="glass-card !rounded-xl p-5 mt-4 border-neon-red/20 bg-neon-red/[0.02] space-y-4 slide-down">
                    <h3 className="font-heading font-bold text-xs text-white uppercase tracking-wider">UPI Payment Details</h3>
                    <div className="flex flex-col items-center gap-3">
                      <p className="text-xs text-dark-200 text-center">Scan the PhonePe QR Code below using any app (PhonePe, GPay, Paytm) to pay <span className="font-bold text-white">₹{total.toLocaleString()}</span></p>
                      
                      <div className="relative p-4 bg-dark-950 rounded-3xl w-64 h-80 sm:w-72 sm:h-90 flex items-center justify-center shadow-2xl border border-white/10">
                        <img src="/upi-qr.png" alt="UPI QR Scanner" className="w-full h-full object-contain rounded-2xl" />
                      </div>

                      <div className="w-full space-y-1.5 mt-1">
                        <span className="text-xs text-dark-300 block text-center">Or transfer to UPI ID:</span>
                        <div className="flex items-center justify-between bg-dark-800/80 px-3 py-2.5 rounded-xl border border-white/5 font-mono text-sm">
                          <span className="text-white select-all">7248782252@ibl</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText('7248782252@ibl');
                              toast.success('UPI ID copied!');
                            }}
                            className="text-xs text-neon-red font-bold hover:text-white px-2 py-0.5 rounded hover:bg-neon-red/10 transition-colors"
                          >
                            Copy
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-white/5 pt-4">
                      <label className="text-xs font-semibold text-dark-100 mb-1.5 block">12-Digit UPI Transaction ID / UTR *</label>
                      <input
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value.replace(/\D/g, '').slice(0, 12))}
                        className="input-field font-mono"
                        placeholder="e.g. 329184719284"
                      />
                      <p className="text-[10px] text-dark-300 mt-1">Enter the 12-digit reference/UTR number from your payment confirmation screen.</p>
                    </div>
                  </div>
                )}

                {/* Coupon */}
                <div className="mt-6">
                  <label className="text-sm text-dark-100 mb-1.5 block">Coupon Code</label>
                  <div className="flex gap-2">
                    <input 
                      value={couponCode} 
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())} 
                      className="input-field flex-1" 
                      placeholder="SAVE10" 
                    />
                    <button 
                      onClick={handleApplyCoupon} 
                      disabled={couponLoading}
                      className="btn-secondary"
                    >
                      {couponLoading ? 'Applying...' : 'Apply'}
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button onClick={() => setStep(1)} className="btn-secondary flex-1 !py-3">Back</button>
                  <button onClick={() => setStep(3)} className="btn-primary flex-1 !py-3">Review Order</button>
                </div>
              </div>
            )}

            {/* Step 3: Confirm */}
            {step === 3 && (
              <div className="glass-card p-6 slide-up">
                <h2 className="font-heading text-xl font-bold mb-6">Review Order</h2>
                <div className="space-y-3 mb-6">
                  <div className="glass-card !rounded-xl p-4">
                    <p className="text-xs text-dark-200 uppercase mb-1">Shipping To</p>
                    <p className="text-sm">{address.street}, {address.city}, {address.state} - {address.pincode}</p>
                    {address.lat && address.lng && (
                      <p className="text-[10px] text-dark-300 mt-1 font-mono">Location: {address.lat.toFixed(5)}, {address.lng.toFixed(5)}</p>
                    )}
                  </div>
                  <div className="glass-card !rounded-xl p-4">
                    <p className="text-xs text-dark-200 uppercase mb-1">Payment Method</p>
                    <p className="text-sm">{paymentMethod === 'cod' ? 'Cash on Delivery (COD)' : 'Online Payment (UPI)'}</p>
                    {paymentMethod === 'upi' && transactionId && (
                      <p className="text-xs text-dark-300 font-mono mt-1">UTR: {transactionId}</p>
                    )}
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  {items.map((item) => {
                    const p = item.product;
                    if (!p) return null;
                    const price = p.discountPrice > 0 ? p.discountPrice : p.price;
                    return (
                      <div key={item._id} className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                        <span className="text-dark-100 truncate max-w-[200px]">{p.name} × {item.quantity}</span>
                        <span className="font-semibold">₹{(price * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep(2)} className="btn-secondary flex-1 !py-3">Back</button>
                  <button onClick={handlePlaceOrder} disabled={loading} className="btn-primary flex-1 !py-3">
                    {loading ? 'Placing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 sticky top-24">
              <h3 className="font-heading text-lg font-bold mb-4">Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-dark-200">Subtotal</span><span>₹{subtotal.toLocaleString()}</span></div>
                {discount > 0 && <div className="flex justify-between"><span className="text-neon-green">Discount</span><span className="text-neon-green">-₹{discount.toLocaleString()}</span></div>}
                <div className="flex justify-between">
                  <span className="text-dark-200">Delivery</span>
                  <span>{deliveryFee === 0 ? <span className="text-neon-green">FREE</span> : `₹${deliveryFee}`}</span>
                </div>
                {distanceInfo && (
                  <div className="text-[10px] text-dark-300 text-right -mt-1.5">
                    ({distanceInfo.distance} km from store)
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
                  <span>Total</span><span className="gradient-text">₹{total.toLocaleString()}</span>
                </div>
              </div>
              {subtotal < 999 && !distanceInfo && <p className="text-xs text-dark-200 mt-3">Add ₹{(999 - subtotal).toLocaleString()} more for free delivery</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
