import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const BitHubLogo = () => (
  <div className="flex items-center gap-2.5">
    <div className="relative w-8 h-8">
      <div className="absolute inset-0 bg-accent-primary rounded-lg opacity-20 blur-sm" />
      <div className="relative w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="16 18 22 12 16 6" />
          <polyline points="8 6 2 12 8 18" />
        </svg>
      </div>
    </div>
    <span className="font-display font-700 text-xl tracking-tight text-white">
      Bit<span className="text-indigo-400">Hub</span>
    </span>
  </div>
);

const Navbar = ({ roomId, roomName, onSave, onDownload, saving }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="h-14 bg-dark-800 border-b border-dark-500 flex items-center justify-between px-4 flex-shrink-0 z-10">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/home')} className="hover:opacity-80 transition-opacity">
          <BitHubLogo />
        </button>
        {roomId && (
          <>
            <div className="w-px h-5 bg-dark-500" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse-slow" />
              <span className="text-sm font-mono text-dark-400/80 text-gray-300">
                {roomName || 'Unnamed Room'}
              </span>
              <button
                onClick={() => { navigator.clipboard.writeText(roomId); }}
                title="Copy Room ID"
                className="ml-1 px-2 py-0.5 bg-dark-600 hover:bg-dark-500 border border-dark-500 rounded-md text-xs font-mono text-gray-400 hover:text-gray-200 transition-all"
              >
                {roomId.slice(0, 8)}…
              </button>
            </div>
          </>
        )}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        {onSave && (
          <button
            onClick={onSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-600 hover:bg-dark-500 border border-dark-500 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-all disabled:opacity-50"
          >
            {saving ? (
              <svg className="w-3.5 h-3.5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
            Save
          </button>
        )}
        {onDownload && (
          <button
            onClick={onDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-600 hover:bg-dark-500 border border-dark-500 rounded-lg text-xs font-medium text-gray-300 hover:text-white transition-all"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        )}
        <div className="w-px h-5 bg-dark-500 mx-1" />
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-gray-400 hidden sm:block">{user?.username}</span>
        </div>
        <button
          onClick={handleLogout}
          className="ml-1 p-1.5 hover:bg-dark-600 rounded-lg text-gray-500 hover:text-red-400 transition-all"
          title="Logout"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
