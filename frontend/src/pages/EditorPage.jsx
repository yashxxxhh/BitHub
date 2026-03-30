import { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getRoom, saveCode } from '../services/api';
import {
  connectSocket,
  disconnectSocket,
  getSocket,
  joinRoom,
  emitLanguageChange,
  sendChatMessage,
} from '../services/socketClient';
import Navbar from '../components/Navbar';
import Editor from '../components/Editor';
import UserPanel from '../components/UserPanel';
import ChatPanel from '../components/ChatPanel';
import { ToastContainer } from '../components/Toast';
import { useToast } from '../hooks/useToast';

const LANGUAGES = ['javascript', 'typescript', 'python', 'cpp', 'java', 'html'];

const LANG_EXTENSIONS = {
  javascript: 'js',
  typescript: 'ts',
  python: 'py',
  cpp: 'cpp',
  java: 'java',
  html: 'html',
};

const EditorPage = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { toasts, toast } = useToast();

  const [room, setRoom] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [activeUsers, setActiveUsers] = useState([]);
  const [remoteCursors, setRemoteCursors] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [saving, setSaving] = useState(false);
  const [myColor, setMyColor] = useState('#6C63FF');
  const [showChat, setShowChat] = useState(false);
  const [connected, setConnected] = useState(false);

  const notifId = useRef(0);

  const addNotification = useCallback((message, type) => {
    const id = ++notifId.current;
    setNotifications((prev) => [...prev, { id, message, type }]);
  }, []);

  // Load room data
  useEffect(() => {
    if (!token) { navigate('/login'); return; }

    getRoom(roomId, token)
      .then((data) => {
        setRoom(data.room);
        setCode(data.room.code || '');
        setLanguage(data.room.language || 'javascript');
      })
      .catch(() => {
        toast.error('Room not found.');
        navigate('/home');
      });
  }, [roomId, token]);

  // Connect socket and join room
  useEffect(() => {
    if (!room || !user) return;

    const socket = connectSocket();
    setConnected(true);

    joinRoom(roomId, user.id, user.username);

    socket.on('sync_code', ({ code: syncedCode }) => {
      setCode(syncedCode || '');
    });

    socket.on('code_updated', ({ code: updatedCode }) => {
      setCode(updatedCode);
    });

    socket.on('active_users', ({ users }) => {
      setActiveUsers(users);
      // find my color from the list
      const me = users.find((u) => u.username === user.username);
      if (me?.color) setMyColor(me.color);
    });

    socket.on('user_joined', ({ user: joinedUser, message }) => {
      toast.info(message);
      addNotification(message, 'join');
    });

    socket.on('user_left', ({ user: leftUser, message }) => {
      toast.info(message);
      addNotification(message, 'leave');
      // remove their cursor
      setRemoteCursors((prev) => {
        const next = { ...prev };
        delete next[leftUser.socketId];
        return next;
      });
    });

    socket.on('cursor_updated', ({ socketId, cursor, username, color }) => {
      if (username === user.username) return;
      setRemoteCursors((prev) => ({
        ...prev,
        [socketId]: { cursor, username, color },
      }));
    });

    socket.on('language_changed', ({ language: newLang }) => {
      setLanguage(newLang);
      toast.info(`Language switched to ${newLang}`);
    });

    socket.on('receive_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('error', ({ message: errMsg }) => {
      toast.error(errMsg);
    });

    return () => {
      socket.off('sync_code');
      socket.off('code_updated');
      socket.off('active_users');
      socket.off('user_joined');
      socket.off('user_left');
      socket.off('cursor_updated');
      socket.off('language_changed');
      socket.off('receive_message');
      socket.off('error');
      disconnectSocket();
      setConnected(false);
    };
  }, [room, user]);

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveCode(roomId, code, token);
      toast.success('Code saved successfully!');
    } catch {
      toast.error('Failed to save code.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = () => {
    const ext = LANG_EXTENSIONS[language] || 'txt';
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${room?.name || 'bithub-code'}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    emitLanguageChange(roomId, lang);
  };

  const handleSendMessage = (message) => {
    sendChatMessage(roomId, message, user.username, myColor);
  };

  const currentUserForEditor = user ? { username: user.username, color: myColor } : null;

  if (!room) {
    return (
      <div className="min-h-screen gradient-mesh flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading room…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-dark-900 overflow-hidden">
      <Navbar
        roomId={roomId}
        roomName={room.name}
        onSave={handleSave}
        onDownload={handleDownload}
        saving={saving}
      />

      {/* Toolbar */}
      <div className="h-10 bg-dark-800 border-b border-dark-500 flex items-center gap-3 px-4 flex-shrink-0">
        {/* Language selector */}
        <div className="flex items-center gap-1">
          {LANGUAGES.map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all capitalize ${
                language === lang
                  ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                  : 'text-gray-500 hover:text-gray-300 hover:bg-dark-600'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {/* Connection indicator */}
          <div className={`flex items-center gap-1.5 text-xs ${connected ? 'text-green-400' : 'text-red-400'}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
            {connected ? 'Live' : 'Disconnected'}
          </div>

          {/* Chat toggle */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all ${
              showChat
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40'
                : 'text-gray-500 hover:text-gray-300 hover:bg-dark-600'
            }`}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            Chat {messages.length > 0 && `(${messages.length})`}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Monaco Editor */}
        <Editor
          roomId={roomId}
          language={language}
          code={code}
          onCodeChange={handleCodeChange}
          currentUser={currentUserForEditor}
          remoteCursors={remoteCursors}
        />

        {/* Users Panel */}
        <UserPanel users={activeUsers} notifications={notifications} />

        {/* Chat Panel (toggleable) */}
        {showChat && (
          <ChatPanel
            messages={messages}
            onSend={handleSendMessage}
            currentUsername={user?.username}
          />
        )}
      </div>

      <ToastContainer toasts={toasts} />
    </div>
  );
};

export default EditorPage;
