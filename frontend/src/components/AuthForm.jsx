import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginUser, registerUser } from '../services/api';

const InputField = ({ label, type, value, onChange, placeholder, error }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-4 py-3 bg-dark-700 border rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none transition-all font-mono
        focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
        ${error ? 'border-red-500/50' : 'border-dark-500'}`}
    />
    {error && <p className="text-xs text-red-400">{error}</p>}
  </div>
);

const AuthForm = ({ mode }) => {
  const isLogin = mode === 'login';
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!isLogin && !form.username.trim()) errs.username = 'Username is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email';
    if (!form.password) errs.password = 'Password is required';
    else if (form.password.length < 6) errs.password = 'At least 6 characters';
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await loginUser({ email: form.email, password: form.password });
      } else {
        data = await registerUser({ username: form.username, email: form.email, password: form.password });
      }
      login(data.user, data.token);
      navigate('/home');
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {!isLogin && (
        <InputField
          label="Username"
          type="text"
          value={form.username}
          onChange={set('username')}
          placeholder="your_handle"
          error={errors.username}
        />
      )}
      <InputField
        label="Email"
        type="email"
        value={form.email}
        onChange={set('email')}
        placeholder="you@example.com"
        error={errors.email}
      />
      <InputField
        label="Password"
        type="password"
        value={form.password}
        onChange={set('password')}
        placeholder="••••••••"
        error={errors.password}
      />

      {serverError && (
        <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-sm text-red-400">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
            </svg>
            {isLogin ? 'Signing in…' : 'Creating account…'}
          </span>
        ) : (
          isLogin ? 'Sign In' : 'Create Account'
        )}
      </button>

      <p className="text-center text-sm text-gray-500">
        {isLogin ? "Don't have an account? " : 'Already have an account? '}
        <Link
          to={isLogin ? '/register' : '/login'}
          className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
        >
          {isLogin ? 'Sign up' : 'Sign in'}
        </Link>
      </p>
    </form>
  );
};

export default AuthForm;
