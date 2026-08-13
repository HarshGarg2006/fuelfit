import { useState } from 'react';
import { FiMessageSquare, FiX, FiCheckCircle, FiAlertCircle, FiSend, FiLoader, FiZap } from 'react-icons/fi';

const QUICK_PROMPTS = [
  "Where is my order? How to track?",
  "How to return or exchange unopened protein?",
  "How to verify authenticity scratch code?",
  "I received a broken seal protein tub!",
  "The plastic scoop is missing inside my jar!",
  "I received an expired supplement container!",
  "My pre-workout/creatine is clumpy like rocks.",
  "Which protein is best for beginner muscle gain?",
  "Failed transaction: Money deducted twice via UPI.",
  "Can I change my shipping address after order?",
  "Is COD (Cash on Delivery) available?"
];

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

    // AI Query Intent Classification & Smart Resolution Mock Engine
    setTimeout(() => {
      const t = query.toLowerCase();
      let category = "General Support";
      let urgency = "Low";
      let sentiment = "Neutral";
      let reply = "";
      let action = "";

      // 1. Damaged / Broken Seal
      if (t.includes('seal') || t.includes('broken') || t.includes('leak') || t.includes('damaged') || t.includes('cracked') || t.includes('spilled')) {
        category = "Damaged / Broken Seal";
        urgency = "High";
        sentiment = "Negative";
        action = "100% Free Replacement Dispatch";
        reply = `Hi ${name || 'Customer'}, we apologize for the broken seal on order ${orderId || 'FF-ONLINE'}. Please do not consume it for safety reasons. We have dispatched a 100% free sealed replacement tub with priority tracking.`;
      } 
      // 2. Missing Item / Scoop
      else if (t.includes('scoop') || t.includes('missing') || t.includes('empty') || t.includes('less weight')) {
        category = "Missing Product or Accessories";
        urgency = "Medium";
        sentiment = "Negative";
        action = "Express Scoop/Item Dispatch";
        reply = `Hi ${name || 'Customer'}, protein scoops sometimes sink to the bottom during shipping. Please try using a dry fork to find it. If it is genuinely missing, we are shipping a spare scoop & a shaker bottle to you immediately at no charge!`;
      }
      // 3. Expired Supplement
      else if (t.includes('expired') || t.includes('expiry') || t.includes('shelf life') || t.includes('date')) {
        category = "Expired Product Complaint";
        urgency = "Critical";
        sentiment = "Negative";
        action = "Batch Recall & Free Replacement";
        reply = `Hi ${name || 'Customer'}, FuelFit maintains strict batch fresh guarantees. If you received an expired item, please share a picture of the base stamp. We will retrieve the tub and dispatch a fresh batch under 48 hours.`;
      }
      // 4. Clumpy Pre-workout / Creatine
      else if (t.includes('clump') || t.includes('clumpy') || t.includes('solid') || t.includes('moisture')) {
        category = "Product Quality Concern (Clumping)";
        urgency = "Medium";
        sentiment = "Neutral";
        action = "Quality Team Advisory & Replacement";
        reply = `Hi ${name || 'Customer'}, pre-workouts contain hygroscopic ingredients (like Citrulline/Glycerol) which absorb moisture and form soft clumps. It is 100% safe to consume; just shake the tub to break them. If it is rock solid, we will replace it for you.`;
      }
      // 5. Tracking / Shipment ETA
      else if (t.includes('where is') || t.includes('track') || t.includes('tracking') || t.includes('status') || t.includes('delay') || t.includes('stuck')) {
        category = "Order Tracking & Status";
        urgency = "Medium" if t.includes('stuck') or t.includes('delay') else "Low";
        sentiment = t.includes('delay') ? "Negative" : "Neutral";
        action = "Priority Hub Courier Escalation";
        reply = `Hi ${name || 'Customer'}, your order ${orderId || 'FF-ONLINE'} status can be tracked at https://fuelfit-six.vercel.app/track/${orderId || 'FF-ONLINE'}. We have escalated with our courier partner to speed up the out-for-delivery run.`;
      } 
      // 6. Return / Exchange Policy
      else if (t.includes('return') || t.includes('exchange') || t.includes('refund policy')) {
        category = "Return & Exchange Inquiry";
        urgency = "Low";
        sentiment = "Neutral";
        action = "7-Day Hassle-Free Policy Guide";
        reply = `Hi ${name || 'Customer'}, we accept returns/exchanges of unopened supplements with original outer wraps intact within 7 days of delivery. Go to your Orders dashboard to schedule an automated reverse pickup.`;
      } 
      // 7. Authenticity Scratch Code
      else if (t.includes('authentic') || t.includes('genuine') || t.includes('verify') || t.includes('scratch') || t.includes('fake')) {
        category = "Authenticity Verification";
        urgency = "High" if t.includes('fake') else "Low";
        sentiment = "Neutral";
        action = "Lab Test CoA Portal Guide";
        reply = `Hi ${name || 'Customer'}, every FuelFit product is NABL third-party lab verified. Scratch the cap code and input it at: https://fuelfit-six.vercel.app/verify to view the official Lab Protein Certificate of Analysis.`;
      } 
      // 8. Payment Gateway Reversal (Deducted twice)
      else if (t.includes('refund') || t.includes('deducted') || t.includes('failed') || t.includes('twice') || t.includes('upi') || t.includes('money')) {
        category = "Payment & Refund Issues";
        urgency = "High";
        sentiment = "Negative";
        action = "Razorpay Webhook Auto-Reversal";
        reply = `Hi ${name || 'Customer'}, failed transaction deductions are securely reversed back to your bank account/UPI within 24-48 business hours by the payment gateway. Refund reference: #RF-FIT-${orderId || '9281'}.`;
      }
      // 9. Change Shipping Address
      else if (t.includes('address') || t.includes('change') || t.includes('modify location')) {
        category = "Order Modification Inquiry";
        urgency = "Medium";
        sentiment = "Neutral";
        action = "Address Redirection Ticket";
        reply = `Hi ${name || 'Customer'}, if your order has not left our warehouse, our dispatch team can change the address. Please reply with the new shipping location and pin code immediately.`;
      }
      // 10. Supplement Recommendation
      else if (t.includes('best') || t.includes('beginner') || t.includes('muscle') || t.includes('protein') || t.includes('creatine') || t.includes('fat loss')) {
        category = "Product Recommendation";
        urgency = "Low";
        sentiment = "Positive";
        action = "Nutrition Advisory Consultation";
        reply = `Hi ${name || 'Customer'}, for lean muscle gain, post-workout FuelFit Whey Isolate (27g protein/scoop) is ideal. For strength, take 3g Creatine Monohydrate daily. For fat loss, target a calorie deficit with high protein intake.`;
      }
      // 11. COD Availability
      else if (t.includes('cod') || t.includes('cash on delivery') || t.includes('delivery charges')) {
        category = "Payment & COD Inquiry";
        urgency = "Low";
        sentiment = "Neutral";
        action = "COD Pin Code Serviceability Check";
        reply = `Hi ${name || 'Customer'}, Cash on Delivery (COD) is available on 25,000+ pin codes in India on FuelFit with zero extra charges! You can check serviceability at checkout.`;
      }
      // 12. Generic / Other FAQs
      else {
        category = "General Inquiries & FAQs";
        urgency = "Low";
        sentiment = "Neutral";
        action = "Support Ticket Created";
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
    }, 600);
  };

  const getUrgencyBadge = (urg) => {
    if (urg === 'Critical') return 'bg-red-500/20 text-red-400 border border-red-500/30';
    if (urg === 'High') return 'bg-orange-500/20 text-orange-400 border border-orange-500/30';
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
                    <label className="block text-xs text-dark-200 mb-1">Describe your query or grievance:</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="e.g. Where is my order? / Received broken seal tub / How to return?..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="input-field !py-2 text-xs"
                    />
                  </div>

                  {/* Quick FAQ Chips */}
                  <div>
                    <p className="text-[11px] font-semibold text-dark-200 mb-1.5 uppercase tracking-wider">Quick Inquiries:</p>
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
                    {loading ? <><FiLoader className="animate-spin" size={14} /> Analyzing Intent...</> : <><FiSend size={14} /> Submit Query to AI Assistant</>}
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
