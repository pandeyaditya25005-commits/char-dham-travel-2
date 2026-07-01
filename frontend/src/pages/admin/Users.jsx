import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getUsers, updateUserRole } from '../../services/adminService';
import Loader from '../../components/common/Loader';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetch = () => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (search) params.search = search;
    if (roleFilter) params.role = roleFilter;
    getUsers(params)
      .then((data) => { setUsers(data.users); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [page, roleFilter]);

  const handleSearch = () => { setPage(1); fetch(); };

  const toggleRole = async (id, currentRole) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await updateUserRole(id, newRole);
      fetch();
    } catch (err) { alert(err.message); }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: '1.5rem' }}>Users</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{total} total users</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <input placeholder="Search by name, email..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSearch()} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', flex: 1, minWidth: 200, maxWidth: 300, fontSize: '0.85rem' }} />
        <button onClick={handleSearch} className="btn btn-primary btn-sm">Search</button>
        <select value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontSize: '0.85rem' }}>
          <option value="">All Roles</option>
          <option value="user">Users</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      {loading ? <Loader /> : (
        <div style={{ background: 'var(--color-bg)', borderRadius: 12, border: '1px solid var(--color-border)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
              <thead>
                <tr style={{ background: 'var(--color-bg-secondary)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600 }}>User</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600 }}>Email</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600 }}>Phone</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600 }}>Role</th>
                  <th style={{ padding: '12px 16px', textAlign: 'left', color: 'var(--color-text-muted)', fontWeight: 600 }}>Verified</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center', color: 'var(--color-text-muted)', fontWeight: 600 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <motion.tr key={u._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.02 }} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700 }}>{u.name?.charAt(0)?.toUpperCase()}</div>
                        <Link to={`/admin/users/${u._id}`} style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--color-text)' }}>{u.name}</Link>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{u.email}</td>
                    <td style={{ padding: '12px 16px', color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{u.phone || '-'}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 10px', borderRadius: 12, fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', background: u.role === 'admin' ? '#dbeafe' : '#f3f4f6', color: u.role === 'admin' ? '#1d4ed8' : '#6b7280' }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ color: u.isVerified ? 'var(--color-success)' : 'var(--color-text-muted)', fontSize: '0.85rem' }}>{u.isVerified ? '✓ Yes' : '✗ No'}</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                        <Link to={`/admin/users/${u._id}`} className="btn btn-sm btn-outline" style={{ fontSize: '0.7rem', padding: '4px 10px' }}>View</Link>
                        <button onClick={() => toggleRole(u._id, u.role)} className="btn btn-sm" style={{ fontSize: '0.7rem', padding: '4px 10px', borderRadius: 6, background: u.role === 'admin' ? '#fef2f2' : '#ecfdf5', color: u.role === 'admin' ? '#dc2626' : '#059669', fontWeight: 600 }}>{u.role === 'admin' ? 'Demote' : 'Promote'}</button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontWeight: 600, opacity: page <= 1 ? 0.5 : 1, fontSize: '0.85rem' }}>← Prev</button>
          <span style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontWeight: 600, opacity: page >= totalPages ? 0.5 : 1, fontSize: '0.85rem' }}>Next →</button>
        </div>
      )}
    </motion.div>
  );
};

export default Users;
