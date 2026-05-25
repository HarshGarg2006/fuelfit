import { useState, useRef } from 'react';
import { FiSend, FiCheckCircle, FiImage, FiX } from 'react-icons/fi';
import API from '../store/api/axiosInstance';
import toast from 'react-hot-toast';

export default function ProductRequestPage() {
  const [form, setForm] = useState({ productName: '', brand: '', description: '', urgency: 'normal' });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('productName', form.productName);
      formData.append('brand', form.brand);
      formData.append('description', form.description);
      formData.append('urgency', form.urgency);
      if (imageFile) {
        formData.append('image', imageFile);
      }

      await API.post('/requests', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Request submitted!');
      setSubmitted(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 fade-in">
        <div className="glass-card p-10 text-center max-w-md">
          <FiCheckCircle size={56} className="text-neon-green mx-auto mb-4" />
          <h2 className="font-heading text-2xl font-bold mb-2">Request Received!</h2>
          <p className="text-dark-200 mb-6">We'll try our best to source this product for you. You'll be notified when it's available.</p>
          <button onClick={() => { setSubmitted(false); setForm({ productName: '', brand: '', description: '', urgency: 'normal' }); removeImage(); }} className="btn-primary">
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 px-4 fade-in">
      <div className="page-container max-w-2xl">
        <div className="text-center mb-10">
          <h1 className="font-heading text-3xl md:text-4xl font-bold mb-3">
            Can't Find Your <span className="gradient-text">Supplement?</span>
          </h1>
          <p className="text-dark-200 max-w-lg mx-auto">Tell us what you're looking for. We source from all major brands and will try to get it for you.</p>
        </div>
        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-dark-100 mb-1.5 block">Product Name *</label>
              <input type="text" required value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} className="input-field" placeholder="e.g. ON Gold Standard Whey 5lb" />
            </div>
            <div>
              <label className="text-sm text-dark-100 mb-1.5 block">Brand (optional)</label>
              <input type="text" value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" placeholder="e.g. Optimum Nutrition" />
            </div>
            <div>
              <label className="text-sm text-dark-100 mb-1.5 block">Description / Notes</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field min-h-[100px] resize-y" placeholder="Any specific flavour, size, or details..." />
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="text-sm text-dark-100 mb-1.5 block">Product Image (optional)</label>
              <p className="text-xs text-dark-300 mb-3">Upload a photo of the product so we can identify it faster</p>

              {!imagePreview ? (
                <label
                  htmlFor="request-image-upload"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '2rem 1rem',
                    border: '2px dashed rgba(255,255,255,0.15)',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    background: 'rgba(255,255,255,0.03)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#39FF14';
                    e.currentTarget.style.background = 'rgba(57,255,20,0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <FiImage size={36} style={{ color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem' }} />
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', fontWeight: '500' }}>
                    Tap to upload image
                  </span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    JPG, PNG or WebP • Max 5MB
                  </span>
                  <input
                    ref={fileInputRef}
                    id="request-image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                  />
                </label>
              ) : (
                <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', border: '2px solid rgba(57,255,20,0.3)' }}>
                  <img
                    src={imagePreview}
                    alt="Product preview"
                    style={{
                      width: '100%',
                      maxHeight: '250px',
                      objectFit: 'cover',
                      display: 'block',
                    }}
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(239,68,68,0.9)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '50%',
                      width: '32px',
                      height: '32px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      backdropFilter: 'blur(4px)',
                      transition: 'transform 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    <FiX size={16} />
                  </button>
                  <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '8px 12px',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                    fontSize: '0.75rem',
                    color: 'rgba(255,255,255,0.8)',
                  }}>
                    {imageFile?.name} • {(imageFile?.size / 1024).toFixed(0)} KB
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-sm text-dark-100 mb-1.5 block">Urgency</label>
              <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })} className="input-field">
                <option value="low">Low — No rush</option>
                <option value="normal">Normal — Within a week</option>
                <option value="high">High — Need it ASAP</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full !py-3.5 flex items-center justify-center gap-2 text-base">
              <FiSend size={16} /> {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
