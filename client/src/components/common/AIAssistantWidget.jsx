import { useState } from 'react';
import { FiMessageSquare, FiX, FiCheckCircle, FiAlertCircle, FiSend, FiLoader, FiZap } from 'react-icons/fi';

// Active/Valid Mock Order database for verification
const VALID_ORDERS = ["FF-9281", "FF-1002", "FF-5504", "FF-7721", "FF-8849"];

const QUICK_PROMPTS = [
  "Where is my order? How to track?",
  "How to return or exchange unopened protein?",
  "How to verify authenticity scratch code?",
  "I am lactose intolerant. Which protein is best?",
  "Does creatine cause hair loss or kidney damage?",
  "Is creatine safe for females / women?",
  "Should I mix protein powder in milk or water?",
  "Can I take creatine & pre-workout together?",
  "Getting acne/pimples from whey protein.",
  "How to get free delivery on FuelFit?",
  "How to download my GST tax invoice?",
  "I received a broken seal protein tub!",
  "The plastic scoop is missing inside my jar!",
  "I received an expired supplement container!",
  "My pre-workout/creatine is clumpy like rocks.",
  "Failed transaction: Money deducted twice via UPI.",
  "Can I change my shipping address after order?",
  "Why is my coupon code not applying?",
// Helper function to check if any keyword exists in text
function anyKeywordMatch(text, keywords) {
  return keywords.some(keyword => text.includes(keyword));
}

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [orderId, setOrderId] = useState('');
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResult(null);

    // AI Intent & Order Validation Engine
    setTimeout(() => {
      const t = query.toLowerCase();
      let category = "General Inquiries";
      let urgency = "Low";
      let sentiment = "Neutral";
      let reply = "";
      let action = "";
      
      // Determine if query is Order-Related
      const isOrderRelated = anyKeywordMatch(t, [
        'order', 'track', 'where is my', 'delivery', 'delay', 'stuck', 'transit',
        'return', 'exchange', 'replace', 'refund', 'money', 'deducted', 'failed', 'twice', 'upi',
        'seal', 'broken', 'leak', 'damaged', 'spilled', 'scoop', 'missing', 'expired', 'expiry',
        'clump', 'clumpy', 'cancel', 'address', 'change location', 'delivery boy', 'otp'
      ]);

      // If order related, verify Order ID
      if (isOrderRelated) {
        const cleanOrderId = orderId.trim().toUpperCase();
        if (!cleanOrderId) {
          setResult({
            category: "Authentication Needed",
            urgency: "Medium",
            sentiment: "Neutral",
            reply: "⚠️ Order ID Required: To help you with order-related issues (tracking, returns, refunds, or product damage), please enter a valid Order ID in the field above (e.g. FF-9281).",
            action: "Prompting for Order ID Credentials"
          });
          setLoading(false);
          return;
        }

        // Check if order exists in Database
        if (!VALID_ORDERS.includes(cleanOrderId)) {
          setResult({
            category: "Verification Failed",
            urgency: "Medium",
            sentiment: "Negative",
            reply: `❌ Order Not Found: We couldn't find order '${cleanOrderId}' in our database. Please double-check the Order ID printed on your invoice or SMS receipt. (Sample working IDs for testing: FF-9281, FF-1002, FF-5504).`,
            action: "Invalid Order ID Logged"
          });
          setLoading(false);
          return;
        }
      }

      // 1. Broken / Damaged Seal
      if (t.includes('seal') || t.includes('broken') || t.includes('leak') || t.includes('damaged') || t.includes('cracked') || t.includes('spilled')) {
        category = "Damaged / Broken Seal Complaint";
        urgency = "High";
        sentiment = "Negative";
        action = "100% Free Replacement Dispatch";
        reply = `Hi ${name || 'Customer'}, we apologize for the broken seal on order ${orderId.toUpperCase()}. Please do not consume it for safety reasons. We have authorized an immediate 100% free sealed replacement tub with priority air tracking!`;
      } 
      // 2. Missing Scoop / Accessory
      else if (t.includes('scoop') || t.includes('missing') || t.includes('empty') || t.includes('less weight') || t.includes('no scoop')) {
        category = "Missing Accessory / Scoop Complaint";
        urgency = "Medium";
        sentiment = "Negative";
        action = "Express Scoop & Shaker Dispatch";
        reply = `Hi ${name || 'Customer'}, scoops sometimes sink to the bottom during courier transit. Please use a dry fork to check inside order ${orderId.toUpperCase()}. If it is genuinely missing, we have dispatched a spare scoop & a complimentary FuelFit shaker bottle to you at zero cost!`;
      }
      // 3. Expired Product
      else if (t.includes('expired') || t.includes('expiry') || t.includes('shelf life') || t.includes('old batch')) {
        category = "Expired Product Complaint";
        urgency = "Critical";
        sentiment = "Negative";
        action = "Batch Recall & Priority Free Replacement";
        reply = `Hi ${name || 'Customer'}, FuelFit guarantees 100% Fresh Batches. If you received an expired tub on order ${orderId.toUpperCase()}, we are deeply sorry. We are dispatching a brand new fresh batch immediately. Please share a picture of the base expiry stamp for QA verification.`;
      }
      // 4. Clumpy Pre-workout / Creatine
      else if (t.includes('clump') || t.includes('clumpy') || t.includes('solid') || t.includes('moisture') || t.includes('rocks')) {
        category = "Product Quality Concern (Clumping)";
        urgency = "Medium";
        sentiment = "Neutral";
        action = "Quality Team Advisory & Replacement";
        reply = `Hi ${name || 'Customer'}, pre-workouts contain hygroscopic ingredients (like Citrulline & Glycerol) that naturally absorb air moisture and form soft clumps. It is 100% safe to consume; simply shake the tub to break them. If it is rock solid, we will replace it free!`;
      }
      // 5. Lactose Intolerance Query (No Order ID needed)
      else if (t.includes('lactose') || t.includes('dairy allergy') || t.includes('plant protein') || t.includes('vegan')) {
        category = "Dietary & Allergen Consultation";
        urgency = "Low";
        sentiment = "Positive";
        action = "Hypoallergenic Protein Recommendation";
        reply = `Hi ${name || 'Customer'}, if you are lactose intolerant, we recommend FuelFit 100% Whey Isolate (99% lactose-free) or 100% Organic Plant Protein (Pea + Brown Rice isolate). They digest smoothly with zero bloating or stomach distress.`;
      }
      // 6. Creatine Myths (No Order ID needed)
      else if (t.includes('hair loss') || t.includes('bald') || t.includes('kidney') || t.includes('female') || t.includes('women') || t.includes('safe')) {
        category = "Supplement Science & Safety FAQ";
        urgency = "Low";
        sentiment = "Neutral";
        action = "Scientific Study Verification Shared";
        reply = `Hi ${name || 'Customer'}, scientific consensus confirms Micronized Creatine is 100% safe for healthy adults (both men and women). It does NOT cause hair loss or kidney issues when taken at recommended daily doses (3g-5g) alongside adequate hydration (3-4L water).`;
      }
      // 7. Whey Protein Acne / Digestion
      else if (t.includes('acne') || t.includes('pimples') || t.includes('bloat') || t.includes('digestion') || t.includes('stomach')) {
        category = "Nutrition & Tolerance Advisory";
        urgency = "Medium";
        sentiment = "Neutral";
        action = "Enzyme / Isolate Switch Advisory";
        reply = `Hi ${name || 'Customer'}, mild acne or bloating can happen when your body adjusts to higher dairy intake. We recommend switching to FuelFit 100% Isolate Whey (ultra-filtered with DigeZyme® digestive enzymes) and drinking 3-4 liters of water daily.`;
      }
      // 8. Milk vs Water for Protein
      else if (t.includes('milk') || t.includes('water') || t.includes('how to drink') || t.includes('mix')) {
        category = "Product Usage Guide";
        urgency = "Low";
        sentiment = "Positive";
        action = "Usage Optimization Protocol";
        reply = `Hi ${name || 'Customer'}, mix with chilled WATER for rapid post-workout absorption and lean muscle building. Mix with MILK if your goal is mass gain or if you are having it as a bedtime/breakfast meal replacement for sustained protein release.`;
      }
      // 9. Creatine + Pre-workout combination
      else if (t.includes('pre-workout together') || t.includes('mix creatine') || t.includes('timing')) {
        category = "Supplement Synergy Protocol";
        urgency = "Low";
        sentiment = "Positive";
        action = "Stack Timing Guidelines";
        reply = `Hi ${name || 'Customer'}, YES! Taking Creatine (3g) with Pre-workout (15-20 minutes before training) is a powerful combo for explosive muscle strength, ATP regeneration, and intense vascular pumps.`;
      }
      // 10. Free Delivery FAQ
      else if (t.includes('free delivery') || t.includes('shipping charge') || t.includes('free shipping')) {
        category = "Shipping & Logistics Policy";
        urgency = "Low";
        sentiment = "Positive";
        action = "Free Delivery Terms Shared";
        reply = `Hi ${name || 'Customer'}, FuelFit provides 100% FREE express shipping on all orders above ₹999 across India, and free same-day local delivery within 5 KM of our store hub!`;
      }
      // 11. GST Tax Invoice Download
      else if (t.includes('invoice') || t.includes('gst') || t.includes('bill') || t.includes('tax')) {
        category = "Billing & Accounts Inquiry";
        urgency = "Low";
        sentiment = "Neutral";
        action = "Automated Invoice PDF Generator";
        reply = `Hi ${name || 'Customer'}, you can download your official GST-compliant tax invoice PDF anytime by navigating to Profile -> My Orders -> View Order -> Download Invoice.`;
      }
      // 12. Coupon Code Issue
      else if (t.includes('coupon') || t.includes('discount') || t.includes('promo code') || t.includes('fit50')) {
        category = "Promotions & Offers Inquiry";
        urgency = "Low";
        sentiment = "Neutral";
        action = "Coupon Code Validation Check";
        reply = `Hi ${name || 'Customer'}, promo codes (like FIT50 or FUEL10) apply to eligible carts with a minimum order value of ₹1499. If your code is not applying, please verify the cart total or contact us for a direct discount credit.`;
      }
      // 13. OTP Verification at Delivery
      else if (t.includes('otp') || t.includes('delivery boy asking') || t.includes('agent')) {
        category = "Delivery Security Advisory";
        urgency = "Medium";
        sentiment = "Neutral";
        action = "Secure Delivery Guidelines";
        reply = `Hi ${name || 'Customer'}, for package security, please share the delivery OTP with the courier agent ONLY after verifying that the outer box seal is intact and untampered.`;
      }
      // 14. Order Tracking / Transit Delay
      else if (t.includes('where is') || t.includes('track') || t.includes('tracking') || t.includes('status') || t.includes('delay') || t.includes('stuck')) {
        category = "Order Tracking & Status";
        urgency = "High";
        sentiment = "Negative";
        action = "Priority Hub Courier Escalation";
        reply = `Hi ${name || 'Customer'}, your order ${orderId.toUpperCase()} is in transit. We have raised an escalation with the logistics hub manager to deliver it within the next 24 hours. Track live: https://fuelfit-six.vercel.app/track/${orderId.toUpperCase()}`;
      } 
      // 15. Return / Exchange Policy
      else if (t.includes('return') || t.includes('exchange') || t.includes('replace')) {
        category = "Return & Exchange Inquiry";
        urgency = "Low";
        sentiment = "Neutral";
        action = "7-Day Hassle-Free Policy Guide";
        reply = `Hi ${name || 'Customer'}, we have initiated a reverse pickup for order ${orderId.toUpperCase()}. The delivery executive will collect the unopened tub within 48 hours.`;
      } 
      // 17. Failed Payment / Double Deduction
      else if (t.includes('refund') || t.includes('deducted') || t.includes('failed') || t.includes('twice') || t.includes('upi') || t.includes('money')) {
        category = "Payment & Refund Issues";
        urgency = "High";
        sentiment = "Negative";
        action = "Razorpay Webhook Auto-Reversal";
        reply = `Hi ${name || 'Customer'}, we verified the transaction for order ${orderId.toUpperCase()}. Any double-deductions are reversed automatically by Razorpay back to your bank within 24-48 business hours. Reference ARN: #RF-FIT-${orderId.toUpperCase()}`;
      }
      // 18. Change Address
      else if (t.includes('address') || t.includes('change') || t.includes('location')) {
        category = "Order Modification Inquiry";
        urgency = "Medium";
        sentiment = "Neutral";
        action = "Warehouse Manifest Address Update";
        reply = `Hi ${name || 'Customer'}, we have updated the shipping location for order ${orderId.toUpperCase()} in our warehouse packing manifest. It will ship to your updated destination.`;
      }
      // 19. Cash on Delivery (COD)
      else if (t.includes('cod') || t.includes('cash on delivery')) {
        category = "Payment & COD Inquiry";
        urgency = "Low";
        sentiment = "Neutral";
        action = "COD Serviceability Confirmed";
        reply = `Hi ${name || 'Customer'}, Cash on Delivery (COD) is fully available on 25,000+ pin codes in India on FuelFit with zero extra handling fees! You can pay by Cash or UPI on delivery.`;
      }
      // 20. Default / Generic Query
      else {
        category = "General Support Inquiry";
        urgency = "Low";
        sentiment = "Neutral";
        action = "Customer Care Ticket Generated";
        reply = `Hi ${name || 'Customer'}, thank you for contacting FuelFit AI support. We have logged your query regarding ${orderId || 'your inquiry'} and our team will get back to you shortly!`;
      }

      setResult({
        category,
        urgency,
        sentiment,
        reply,
        action
      });
      setLoading(false);
    }, 500);
  };

  const getUrgencyBadge = (urg) => {
    if (urg === 'Critical') return 'bg-red-500/20 text-red-400 border border-red-500/30';
    if (urg === 'High') return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
    if (urg === 'Medium') return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
    return 'bg-green-500/20 text-green-400 border border-green-500/30';
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-gradient-to-r from-neon-red to-neon-orange text-white font-bold rounded-full shadow-2xl shadow-neon-red/40 hover:scale-105 active:scale-95 transition-all text-sm"
        id="ai-support-fab"
      >
        <FiZap size={18} className="animate-pulse" />
        <span className="hidden sm:inline">AI Support Assistant</span>
      </button>

      {/* Modal Popup */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm fade-in">
          <div className="bg-dark-900 border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-dark-800/60">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-neon-red to-neon-orange flex items-center justify-center font-bold text-white text-sm">
                  ⚡
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white text-sm">FuelFit AI Support Assistant</h3>
                  <p className="text-[11px] text-dark-200">Instant Complaint Resolution & Store FAQs</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-dark-200 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Content Area */}
            <div className="p-4 overflow-y-auto space-y-4 flex-1">
              {!result ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Your Name (Optional)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="input-field !py-2 text-xs"
                    />
                    <input
                      type="text"
                      placeholder="Order ID (e.g. FF-9281)"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value)}
                      className="input-field !py-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-dark-200 mb-1">Ask any question or register a complaint:</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Is creatine safe for women? / Broken seal protein / Missing scoop / Track order..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="input-field !py-2 text-xs"
                    />
                  </div>

                  {/* Quick FAQ Chips */}
                  <div>
                    <p className="text-[11px] font-semibold text-dark-200 mb-1.5 uppercase tracking-wider">Frequently Asked Questions:</p>
                    <div className="flex flex-wrap gap-1.5 max-h-[160px] overflow-y-auto pr-1">
                      {QUICK_PROMPTS.map((p, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => { setQuery(p); }}
                          className="text-[11px] px-2.5 py-1 rounded-md bg-dark-700 hover:bg-dark-600 text-dark-100 hover:text-white transition-all text-left border border-white/5"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full !py-2.5 text-xs font-bold flex items-center justify-center gap-2 mt-2"
                  >
                    {loading ? <><FiLoader className="animate-spin" size={14} /> Checking Database...</> : <><FiSend size={14} /> Submit Query to AI Assistant</>}
                  </button>
                </form>
              ) : (
                <div className="space-y-4 fade-in">
                  <div className="flex items-center justify-between p-2.5 rounded-lg bg-dark-800 border border-white/5 text-xs">
                    <span className="text-dark-200">Category: <strong className="text-white">{result.category}</strong></span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getUrgencyBadge(result.urgency)}`}>
                      Urgency: {result.urgency}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-neon-green/5 border border-neon-green/20 space-y-2">
                    <div className="flex items-center gap-2 text-neon-green text-xs font-bold">
                      <FiCheckCircle size={15} /> Automated AI Resolution:
                    </div>
                    <p className="text-xs text-dark-100 leading-relaxed">
                      {result.reply}
                    </p>
                  </div>

                  <div className="p-2.5 rounded-lg bg-dark-800/70 border border-white/5 text-[11px] text-dark-200">
                    ⚡ <strong>Action Initiated:</strong> {result.action}
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => { setResult(null); setQuery(''); }}
                      className="btn-secondary flex-1 !py-2 text-xs font-semibold"
                    >
                      Ask Another Query
                    </button>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="btn-primary flex-1 !py-2 text-xs font-semibold"
                    >
                      Done
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
