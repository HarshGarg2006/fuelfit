import { useEffect, useState } from 'react';
import { FiMessageSquare, FiCheckCircle, FiClock, FiTrash2 } from 'react-icons/fi';
import API from '../../store/api/axiosInstance';
import toast from 'react-hot-toast';

const statusColor = { pending: 'badge-orange', reviewed: 'badge-blue', sourced: 'badge-green', rejected: 'badge-red' };

export default function AdminRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try { const res = await API.get('/requests'); setRequests(res.data.requests || []); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id, status) => {
    try { await API.put(`/requests/${id}`, { status }); toast.success('Updated'); load(); } catch { toast.error('Failed'); }
  };

  const handleDelete = async (id) => {
    try { await API.delete(`/requests/${id}`); toast.success('Deleted'); load(); } catch { toast.error('Failed'); }
  };

  return (
    <div className="py-8 fade-in">
      <div className="page-container max-w-4xl">
        <h1 className="font-heading text-3xl font-bold mb-8">Product <span className="gradient-text">Requests</span></h1>
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)
          ) : requests.length === 0 ? (
            <div className="text-center py-16 text-dark-200"><FiMessageSquare size={32} className="mx-auto mb-2" />No requests yet</div>
          ) : (
            requests.map((r) => (
              <div key={r._id} className="glass-card p-5">
                <div className="flex items-start gap-4">
                  {r.image && (
                    <img
                      src={r.image}
                      alt={r.productName}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        flexShrink: 0,
                      }}
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold">{r.productName}</h3>
                        {r.brand && <p className="text-dark-200 text-sm">Brand: {r.brand}</p>}
                        <p className="text-dark-200 text-xs mt-1">By: {r.user?.name || 'Guest'} · {new Date(r.createdAt).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`badge text-xs ${statusColor[r.status] || 'badge-blue'}`}>{r.status}</span>
                        <span className={`badge text-xs ${r.urgency === 'high' ? 'badge-red' : r.urgency === 'normal' ? 'badge-orange' : 'badge-blue'}`}>{r.urgency}</span>
                      </div>
                    </div>
                    {r.description && <p className="text-dark-200 text-sm mb-4">{r.description}</p>}
                    <div className="flex items-center gap-2">
                      <select value={r.status} onChange={(e) => updateStatus(r._id, e.target.value)} className="input-field !py-1.5 !px-3 text-xs !w-auto">
                        <option value="pending">Pending</option>
                        <option value="reviewed">Reviewed</option>
                        <option value="sourced">Sourced</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      <button onClick={() => handleDelete(r._id)} className="text-dark-300 hover:text-neon-red transition-colors p-1"><FiTrash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
