import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createRoom, getRoom } from '../services/api';

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript', icon: '󰌞' },
  { value: 'typescript', label: 'TypeScript', icon: '󰛦' },
  { value: 'python', label: 'Python', icon: '󰌠' },
  { value: 'cpp', label: 'C++', icon: '󰙲' },
  { value: 'java', label: 'Java', icon: '󰬷' },
  { value: 'html', label: 'HTML', icon: '󰌝' },
];

const RoomJoin = ({ toast }) => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('create');
  const [roomName, setRoomName] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [roomId, setRoomId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!roomName.trim()) { toast?.error('Room name is required'); return; }
    setLoading(true);
    try {
      const data = await createRoom({ name: roomName, language }, token);
      navigate(`/editor/${data.room.id}`);
    } catch (err) {
      toast?.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    const id = roomId.trim();
    if (!id) { toast?.error('Room ID is required'); return; }
    setLoading(true);
    try {
      await getRoom(id, token); // verify room exists
      navigate(`/editor/${id}`);
    } catch (err) {
      toast?.error('Room not found. Check the ID and try again.');
    } finally {
      setLoading(false);
    }
  };

  const TabBtn = ({ id, label }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
        activeTab === id
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20'
          : 'text-gray-500 hover:text-gray-300'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="w-full max-w-md">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-dark-700 rounded-xl mb-6 border border-dark-500">
        <TabBtn id="create" label="Create Room" />
        <TabBtn id="join" label="Join Room" />
      </div>

      {activeTab === 'create' ? (
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Room Name</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              placeholder="e.g. Interview Prep, Hackathon 2024"
              className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-xl text-sm text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Language</label>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.value}
                  type="button"
                  onClick={() => setLanguage(lang.value)}
                  className={`py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                    language === lang.value
                      ? 'bg-indigo-600/20 border-indigo-500/60 text-indigo-300'
                      : 'bg-dark-700 border-dark-500 text-gray-400 hover:border-dark-400 hover:text-gray-300'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:opacity-60 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-indigo-500/20"
          >
            {loading ? 'Creating…' : '+ Create Room'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleJoin} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">Room ID</label>
            <input
              type="text"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Paste room ID here…"
              className="w-full px-4 py-3 bg-dark-700 border border-dark-500 rounded-xl text-sm font-mono text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
            />
            <p className="text-xs text-gray-600">Ask the room creator to share their room ID with you.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full py-3 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 disabled:opacity-60 rounded-xl text-sm font-semibold text-white transition-all shadow-lg shadow-teal-500/20"
          >
            {loading ? 'Joining…' : '→ Join Room'}
          </button>
        </form>
      )}
    </div>
  );
};

export default RoomJoin;
