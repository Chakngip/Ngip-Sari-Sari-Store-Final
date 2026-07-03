import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const user = await login({ email, password });
      const next = searchParams.get('next');
      if (user.role === 'admin') navigate('/admin/dashboard');
      else if (user.role === 'cashier') navigate('/cashier/pos');
      else navigate(next || '/');
    } catch {
      // error already set in context
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-ngip-accent text-ngip-bg font-display font-bold text-2xl mb-3">
            N
          </div>
          <h1 className="font-display text-2xl font-bold">Ngip Sari-Sari Store</h1>
          <p className="text-ngip-muted text-sm mt-1">Admin &amp; Cashier sign in</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-ngip-panel border border-white/5 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="text-sm bg-ngip-accent2/10 text-ngip-accent2 border border-ngip-accent2/30 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          <div>
            <label className="block text-xs text-ngip-muted mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
              placeholder="[email protected]"
            />
          </div>
          <div>
            <label className="block text-xs text-ngip-muted mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-ngip-accent"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-ngip-accent text-ngip-bg font-semibold rounded-lg py-2.5 text-sm hover:opacity-90 transition disabled:opacity-50"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>

          <p className="text-center text-xs text-ngip-muted">
            New to Ngip? <Link to="/register" className="text-ngip-accent hover:underline">Create an account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
