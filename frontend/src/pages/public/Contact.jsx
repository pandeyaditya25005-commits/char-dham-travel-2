import { useState } from 'react';
import { motion } from 'framer-motion';
import { submitContact } from '../../services/contactService';

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Valid email is required';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setSubmitting(true);
    try {
      await submitContact(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setErrors({ submit: err.message || 'Failed to send message' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const inputStyle = (field) => ({
    width: '100%',
    padding: '12px 16px',
    borderRadius: 8,
    border: `1px solid ${errors[field] ? 'var(--color-danger)' : 'var(--color-border)'}`,
    background: 'var(--color-bg)',
    fontSize: '0.95rem',
    transition: 'border-color 0.2s',
    outline: 'none',
  });

  return (
    <>
      <section style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a5f)', padding: '8rem 0 3rem', textAlign: 'center' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 style={{ color: 'white', fontSize: 'clamp(2rem, 4vw, 2.8rem)', marginBottom: 8 }}>Get in Touch</h1>
            <p style={{ color: '#94a3b8', maxWidth: 500, margin: '0 auto' }}>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
          </motion.div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 40 }}>
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              {success ? (
                <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 16 }}>✅</div>
                  <h3>Message Sent!</h3>
                  <p style={{ color: 'var(--color-text-secondary)', marginTop: 8 }}>We'll get back to you shortly.</p>
                  <button onClick={() => setSuccess(false)} style={{ marginTop: 16, padding: '10px 24px', borderRadius: 8, background: 'var(--color-primary)', color: 'white', fontWeight: 600 }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {errors.submit && <div style={{ padding: '12px 16px', borderRadius: 8, background: '#fef2f2', color: 'var(--color-danger)', fontSize: '0.85rem', border: '1px solid #fecaca' }}>{errors.submit}</div>}
                  <div>
                    <input name="name" placeholder="Your Name *" value={form.name} onChange={handleChange} style={inputStyle('name')} />
                    {errors.name && <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.name}</p>}
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div>
                      <input name="email" type="email" placeholder="Your Email *" value={form.email} onChange={handleChange} style={inputStyle('email')} />
                      {errors.email && <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.email}</p>}
                    </div>
                    <div>
                      <input name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} style={inputStyle('phone')} />
                    </div>
                  </div>
                  <div>
                    <input name="subject" placeholder="Subject *" value={form.subject} onChange={handleChange} style={inputStyle('subject')} />
                    {errors.subject && <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.subject}</p>}
                  </div>
                  <div>
                    <textarea name="message" placeholder="Your Message *" rows={5} value={form.message} onChange={handleChange} style={{ ...inputStyle('message'), resize: 'vertical', minHeight: 120 }} />
                    {errors.message && <p style={{ color: 'var(--color-danger)', fontSize: '0.75rem', marginTop: 4 }}>{errors.message}</p>}
                  </div>
                  <button type="submit" disabled={submitting} style={{ padding: '14px 28px', borderRadius: 8, background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', fontWeight: 700, fontSize: '1rem', opacity: submitting ? 0.7 : 1 }}>
                    {submitting ? 'Sending...' : 'Send Message'}
                  </button>
                </form>
              )}
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {[
                { icon: '📍', title: 'Our Address', info: 'Rishikesh, Uttarakhand, India' },
                { icon: '📞', title: 'Phone', info: '+91 99999 99999', link: 'tel:+919999999999' },
                { icon: '✉️', title: 'Email', info: 'info@chardhamtravel.com', link: 'mailto:info@chardhamtravel.com' },
                { icon: '🕐', title: 'Working Hours', info: 'Mon - Sat: 9:00 AM - 7:00 PM' },
              ].map((item, i) => (
                <div key={i} style={{ padding: '1.5rem', borderRadius: 12, background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{item.icon}</div>
                  <h4 style={{ marginBottom: 4 }}>{item.title}</h4>
                  {item.link ? (
                    <a href={item.link} style={{ color: 'var(--color-primary)', fontWeight: 500 }}>{item.info}</a>
                  ) : (
                    <p style={{ color: 'var(--color-text-secondary)' }}>{item.info}</p>
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Contact;
