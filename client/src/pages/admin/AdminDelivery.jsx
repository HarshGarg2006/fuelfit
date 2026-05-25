import { useEffect, useState } from 'react';
import { FiSave, FiPlus, FiTrash2, FiTruck } from 'react-icons/fi';
import API from '../../store/api/axiosInstance';
import toast from 'react-hot-toast';

export default function AdminDelivery() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try { const res = await API.get('/delivery/config'); setConfig(res.data.config); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await API.put('/delivery/config', config);
      toast.success('Delivery config updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    setSaving(false);
  };

  const addSlab = () => {
    const slabs = [...(config?.slabs || [])];
    const lastMax = slabs.length > 0 ? slabs[slabs.length - 1].maxKm : 0;
    slabs.push({ minKm: lastMax, maxKm: lastMax + 10, charge: 0 });
    setConfig({ ...config, slabs });
  };

  const updateSlab = (index, field, value) => {
    const slabs = [...(config?.slabs || [])];
    slabs[index] = { ...slabs[index], [field]: Number(value) };
    setConfig({ ...config, slabs });
  };

  const removeSlab = (index) => {
    const slabs = (config?.slabs || []).filter((_, i) => i !== index);
    setConfig({ ...config, slabs });
  };

  if (loading) return <div className="py-12 page-container"><div className="skeleton h-96 rounded-2xl" /></div>;

  return (
    <div className="py-8 fade-in">
      <div className="page-container max-w-3xl">
        <h1 className="font-heading text-3xl font-bold mb-8">Delivery <span className="gradient-text">Config</span></h1>

        <div className="glass-card p-6 mb-6">
          <h3 className="font-heading font-bold mb-4 flex items-center gap-2"><FiTruck className="text-neon-red" /> Store Location</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-dark-100 mb-1.5 block">Latitude</label>
              <input type="number" step="any" value={config?.storeLocation?.lat || ''} onChange={(e) => setConfig({ ...config, storeLocation: { ...config?.storeLocation, lat: Number(e.target.value) } })} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-dark-100 mb-1.5 block">Longitude</label>
              <input type="number" step="any" value={config?.storeLocation?.lng || ''} onChange={(e) => setConfig({ ...config, storeLocation: { ...config?.storeLocation, lng: Number(e.target.value) } })} className="input-field" />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-sm text-dark-100 mb-1.5 block">Free Delivery Above (₹)</label>
              <input type="number" value={config?.freeDeliveryAbove || ''} onChange={(e) => setConfig({ ...config, freeDeliveryAbove: Number(e.target.value) })} className="input-field" />
            </div>
            <div>
              <label className="text-sm text-dark-100 mb-1.5 block">Max Delivery Radius (km)</label>
              <input type="number" value={config?.maxDeliveryRadius || ''} onChange={(e) => setConfig({ ...config, maxDeliveryRadius: Number(e.target.value) })} className="input-field" />
            </div>
          </div>
        </div>

        <div className="glass-card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-bold">Distance Slabs</h3>
            <button onClick={addSlab} className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1"><FiPlus size={14} /> Add Slab</button>
          </div>
          <div className="space-y-3">
            {(config?.slabs || []).map((slab, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-3 gap-3">
                  <input type="number" value={slab.minKm} onChange={(e) => updateSlab(i, 'minKm', e.target.value)} className="input-field !py-2 text-sm" placeholder="Min km" />
                  <input type="number" value={slab.maxKm} onChange={(e) => updateSlab(i, 'maxKm', e.target.value)} className="input-field !py-2 text-sm" placeholder="Max km" />
                  <input type="number" value={slab.charge} onChange={(e) => updateSlab(i, 'charge', e.target.value)} className="input-field !py-2 text-sm" placeholder="₹ Charge" />
                </div>
                <button onClick={() => removeSlab(i)} className="text-dark-300 hover:text-neon-red"><FiTrash2 size={16} /></button>
              </div>
            ))}
            {(config?.slabs || []).length === 0 && <p className="text-dark-200 text-sm text-center py-4">No slabs configured</p>}
            <div className="text-xs text-dark-300 flex gap-8 mt-2">
              <span>Min (km)</span><span>Max (km)</span><span>Charge (₹)</span>
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2 !py-3 w-full">
          <FiSave size={16} /> {saving ? 'Saving...' : 'Save Configuration'}
        </button>
      </div>
    </div>
  );
}
