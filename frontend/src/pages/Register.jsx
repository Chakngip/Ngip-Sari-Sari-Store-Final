import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', address: '' });

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch {
      // error already set in context
    }
  }

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-ngip-accent text-ngip-bg font-display font-bold text-2xl mb-3">N</div>
          <h1 className="font-display text-2xl font-bold">Create Your Account</h1>
          <p className="text-ngip-muted text-sm mt-1">Shop Ngip Sari-Sari Store online</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-ngip-panel border border-white/5 rounded-2xl p-6 space-y-3">
          {error && (
            <div className="text-sm bg-ngip-accent2/10 text-ngip-accent2 border border-ngip-accent2/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <Field label="Full Name" value={form.name} onChange={update('name')} required />
          <Field label="Email" type="email" value={form.email} onChange={update('email')} required />
          <Field label="Phone (optional)" value={form.phone} onChange={update('phone')} />
          <Field label="Password" type="password" value={form.password} onChange={update('password')} required />
          <Field label="Delivery Address (optional)" value={form.address} onChange={update('address')} />

          <button
            type="submit" disabled={loading}
            className="w-full bg-ngip-accent text-ngip-bg font-semibold rounded-lg py-2.5 text-sm hover:opacity-90 disabled:opacity-50"
          >
            {loading ? 'Creating account…' : 'Create Account'}
          </button>

          <p className="text-center text-xs text-ngip-muted">
            Already have an account? <Link to="/login" className="text-ngip-accent hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs text-ngip-muted mb-1">{label}</label>
      <input
        {...props}
        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
      />
    </div>
  );
}
