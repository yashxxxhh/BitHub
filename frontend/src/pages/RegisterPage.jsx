import AuthForm from '../components/AuthForm';

const RegisterPage = () => (
  <div className="min-h-screen gradient-mesh flex items-center justify-center px-4">
    <div className="w-full max-w-md animate-fade-in">
      {/* Logo */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 18 22 12 16 6" />
              <polyline points="8 6 2 12 8 18" />
            </svg>
          </div>
          <h1 className="font-display text-3xl font-700 text-white tracking-tight">
            Bit<span className="text-indigo-400">Hub</span>
          </h1>
        </div>
        <p className="text-gray-500 text-sm">Real-time collaborative code editor</p>
      </div>

      {/* Card */}
      <div className="bg-dark-800 border border-dark-500 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-xl font-semibold text-white mb-1">Create account</h2>
        <p className="text-sm text-gray-500 mb-6">Start collaborating in seconds</p>
        <AuthForm mode="register" />
      </div>
    </div>
  </div>
);

export default RegisterPage;
