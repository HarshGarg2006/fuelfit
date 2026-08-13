import { useState } from 'react';
import { FiMessageSquare, FiX, FiCheckCircle, FiAlertCircle, FiSend, FiLoader, FiZap } from 'react-icons/fi';

const QUICK_PROMPTS = [
  "Where is my order? How to track?",
  "How do I return my unopened protein?",
  "How to verify if my supplement is 100% authentic?",
  "I received a broken seal protein tub!",
  "Money was deducted twice from UPI but order failed."
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

    // Simulate AI inference & resolution
    setTimeout(() => {
      const t = query.toLowerCase();
      let category = "Order Tracking & Status";
      let urgency = "Low";
      let sentiment = "Neutral";
      let reply = "";
      let action = "";

      if (t.includes('seal') || t.includes('broken') || t.includes('leak') || t.includes('damaged') || t.includes('cracked')) {
        category = "Damaged / Broken Seal";
        urgency = "High";
        sentiment = "Negative";
        action = "100% Free Replacement Dispatch";
        reply = `Hi ${name || 'Customer'}, we are very sorry about the broken seal on your order ${orderId || 'FF-ONLINE'}. Your health is our highest priority! Please do not consume it. We have automatically authorized a fresh sealed replacement tub with express courier tracking.`;
      } else if (t.includes('where is') || t.includes('track') || t.includes('tracking') || t.includes('status')) {
        category = "Order Tracking & Status";
        urgency = "Low";
        sentiment = "Neutral";
        action = "Live GPS Coordinates Synced";
        reply = `Hi ${name || 'Customer'}, you can check live shipment milestones for ${orderId || 'your order'} directly on FuelFit. Standard metro delivery takes 24-48 hours.`;
      } else if (t.includes('return') || t.includes('exchange')) {
        category = "Return & Exchange Inquiry";
        urgency = "Low";
        sentiment = "Neutral";
        action = "7-Day Hassle-Free Policy Guide";
        reply = `Hi ${name || 'Customer'}, FuelFit provides a 7-day hassle-free return/exchange policy on all unopened items. Simply go to your Orders profile page and click 'Return Order' to schedule a reverse pickup!`;
      } else if (t.includes('authentic') || t.includes('genuine') || t.includes('verify') || t.includes('scratch')) {
        category = "Authenticity Verification";
        urgency = "Low";
        sentiment = "Neutral";
        action = "Lab Test CoA Portal Guide";
        reply = `Hi ${name || 'Customer'}, every FuelFit tub contains a unique scratch hologram code on the lid. Enter your 8-digit code at https://fuelfit-six.vercel.app/verify to view your batch's 3rd-party NABL lab test report.`;
      } else if (t.includes('refund') || t.includes('deducted') || t.includes('failed') || t.includes('twice')) {
        category = "Payment & Refund Issues";
        urgency = "High";
        sentiment = "Negative";
        action = "Gateway Webhook Auto-Reversal";
        reply = `Hi ${name || 'Customer'}, any deduction for a pending/failed transaction is automatically reversed back to your UPI/bank account within 24-48 banking hours. Reference ARN: #RF-FIT-${orderId || '9281'}.`;
      } else {
        category = "General Nutrition & Support";
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
                    <div className="flex flex-wrap gap-1.5">
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
