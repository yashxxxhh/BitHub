import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { listRooms } from '../services/api';
import Navbar from '../components/Navbar';
import RoomJoin from '../components/RoomJoin';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ label, value, icon }) => (
  <div className="bg-dark-800 border border-dark-500 rounded-xl p-4 flex items-center gap-4">
    <div className="w-10 h-10 bg-dark-600 rounded-lg flex items-center justify-center text-indigo-400">
      {icon}
    </div>
    <div>
      <div className="text-xl font-bold text-white font-mono">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  </div>
);

const Home = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { toasts, toast } = useToast();
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const data = await listRooms(token);
        setRooms(data.rooms || []);
      } catch {
        // ignore
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRooms();
  }, [token]);

  const recentRooms = rooms.slice(-6).reverse();

  return (
    <div className="min-h-screen gradient-mesh flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        {/* Welcome Banner */}
        <div className="mb-10">
          <h1 className="font-display text-3xl font-bold text-white mb-1">
            Hey, <span className="text-indigo-400">{user?.username}</span> 👋
          </h1>
          <p className="text-gray-500 text-sm">Create a room or jump into an existing session.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <StatCard
            label="Total Rooms"
            value={rooms.length}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" /></svg>}
          />
          <StatCard
            label="Active Sessions"
            value={rooms.filter(r => r.activeUsers?.length > 0).length}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" /></svg>}
          />
          <StatCard
            label="Member Since"
            value={new Date(user?.createdAt).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
          />
        </div>

        <div className="grid grid-cols-5 gap-8">
          {/* Room Controls */}
          <div className="col-span-2">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Start Coding</h2>
            <div className="bg-dark-800 border border-dark-500 rounded-2xl p-6">
              <RoomJoin toast={toast} />
            </div>
          </div>

          {/* Recent Rooms */}
          <div className="col-span-3">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">All Rooms</h2>
            <div className="flex flex-col gap-2">
              {loadingRooms ? (
                [...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-dark-800 border border-dark-500 rounded-xl animate-pulse" />
                ))
              ) : recentRooms.length === 0 ? (
                <div className="bg-dark-800 border border-dark-500 rounded-xl p-8 text-center">
                  <p className="text-gray-600 text-sm">No rooms yet. Create your first room!</p>
                </div>
              ) : (
                recentRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => navigate(`/editor/${room.id}`)}
                    className="w-full flex items-center gap-4 px-4 py-3 bg-dark-800 border border-dark-500 hover:border-indigo-500/50 hover:bg-dark-700 rounded-xl transition-all text-left group"
                  >
                    <div className="w-9 h-9 bg-dark-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600/20 transition-colors">
                      <svg className="w-4 h-4 text-gray-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-200 truncate">{room.name}</span>
                        {room.activeUsers?.length > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                            <span className="text-[10px] text-green-400">{room.activeUsers.length} live</span>
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-mono text-gray-600 capitalize">{room.language}</span>
                        <span className="text-gray-700">·</span>
                        <span className="text-[11px] text-gray-600">{room.id.slice(0, 12)}…</span>
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </main>

      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default Home;
