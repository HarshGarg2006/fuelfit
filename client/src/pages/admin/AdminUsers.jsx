import { useEffect, useState } from 'react';
import { FiUsers, FiShield } from 'react-icons/fi';
import API from '../../store/api/axiosInstance';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try { const res = await API.get('/admin/users'); setUsers(res.data.users || []); } catch {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="py-8 fade-in">
      <div className="page-container">
        <h1 className="font-heading text-3xl font-bold mb-8">All <span className="gradient-text">Users</span></h1>
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-dark-200 text-xs uppercase border-b border-white/10 bg-dark-800/50">
                  <th className="text-left py-4 px-4">User</th>
                  <th className="text-left py-4 px-4">Email</th>
                  <th className="text-left py-4 px-4">Phone</th>
                  <th className="text-left py-4 px-4">Role</th>
                  <th className="text-left py-4 px-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}><td colSpan={5} className="py-4 px-4"><div className="skeleton h-10 rounded-lg" /></td></tr>
                  ))
                ) : users.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-12 text-dark-200"><FiUsers size={32} className="mx-auto mb-2" />No users</td></tr>
                ) : (
                  users.map((u) => (
                    <tr key={u._id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-red to-neon-orange flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {u.name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <span className="font-semibold">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-dark-200">{u.email}</td>
                      <td className="py-3 px-4 text-dark-200">{u.phone || '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`badge text-xs ${u.role === 'admin' ? 'badge-red' : 'badge-blue'}`}>
                          {u.role === 'admin' && <FiShield size={10} className="mr-1" />}{u.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-dark-200 text-xs">{new Date(u.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
