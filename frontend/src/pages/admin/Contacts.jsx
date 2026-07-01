import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getContacts, markContactRead } from '../../services/adminService';
import Loader from '../../components/common/Loader';
import { formatDate } from '../../utils/formatters';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetch = () => {
    setLoading(true);
    const params = { page, limit: 15 };
    if (filter === 'unread') params.isRead = 'false';
    if (filter === 'read') params.isRead = 'true';
    if (search) params.search = search;
    getContacts(params)
      .then((data) => { setContacts(data.contacts); setTotal(data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetch(); }, [page, filter]);

  const markRead = async (id) => {
    try {
      await markContactRead(id);
      fetch();
    } catch (err) { alert(err.message); }
  };

  const totalPages = Math.ceil(total / 15);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div style={{ marginBottom: 20 }}>
        <h1 style={{ fontSize: '1.5rem' }}>Contact Inbox</h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>{total} messages</p>
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
        <input placeholder="Search by name, email, subject..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && fetch()} style={{ padding: '8px 14px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', flex: 1, minWidth: 200, maxWidth: 300, fontSize: '0.85rem' }} />
        <button onClick={fetch} className="btn btn-primary btn-sm">Search</button>
      </div>

      <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: 'Unread' },
          { key: 'read', label: 'Read' },
        ].map(f => (
          <button key={f.key} onClick={() => { setFilter(f.key); setPage(1); }} style={{ padding: '5px 14px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: filter === f.key ? 'var(--color-primary)' : 'var(--color-bg-tertiary)', color: filter === f.key ? 'white' : 'var(--color-text-secondary)' }}>{f.label}</button>
        ))}
      </div>

      {loading ? <Loader /> : contacts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--color-text-muted)' }}>
          <p>No messages found</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {contacts.map((c, i) => (
            <motion.div key={c._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} style={{ background: c.isRead ? 'var(--color-bg)' : '#eff6ff', borderRadius: 10, border: `1px solid ${c.isRead ? 'var(--color-border)' : '#bfdbfe'}`, padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</span>
                    {!c.isRead && <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#3b82f6' }} />}
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem' }}>{c.email} {c.phone ? `• ${c.phone}` : ''}</p>
                  <p style={{ fontWeight: 600, fontSize: '0.85rem', marginTop: 4 }}>{c.subject}</p>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.8rem', marginTop: 4, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{c.message}</p>
                  <p style={{ color: 'var(--color-text-muted)', fontSize: '0.7rem', marginTop: 6 }}>{formatDate(c.createdAt)}</p>
                </div>
                {!c.isRead && (
                  <button onClick={() => markRead(c._id)} className="btn btn-sm btn-outline" style={{ fontSize: '0.7rem', padding: '4px 10px', whiteSpace: 'nowrap' }}>Mark Read</button>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontWeight: 600, opacity: page <= 1 ? 0.5 : 1, fontSize: '0.85rem' }}>←</button>
          <span style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid var(--color-border)', background: 'var(--color-bg)', fontWeight: 600, opacity: page >= totalPages ? 0.5 : 1, fontSize: '0.85rem' }}>→</button>
        </div>
      )}
    </motion.div>
  );
};

export default AdminContacts;
