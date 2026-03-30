import { useState, useRef, useEffect } from 'react';

const ChatPanel = ({ messages = [], onSend, currentUsername }) => {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    onSend(input.trim());
    setInput('');
  };

  return (
    <div className="w-64 flex-shrink-0 bg-dark-800 border-l border-dark-500 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Room Chat</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
        {messages.length === 0 ? (
          <p className="text-xs text-gray-600 text-center mt-6">No messages yet. Say hi! 👋</p>
        ) : (
          messages.map((msg) => {
            const isMe = msg.username === currentUsername;
            return (
              <div key={msg.id} className={`flex flex-col gap-0.5 ${isMe ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3.5 h-3.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: msg.color }}
                  />
                  <span className="text-[10px] font-medium" style={{ color: msg.color }}>
                    {isMe ? 'You' : msg.username}
                  </span>
                  <span className="text-[10px] text-gray-700">{msg.timestamp}</span>
                </div>
                <div
                  className={`max-w-[180px] px-3 py-2 rounded-xl text-xs text-gray-200 break-words ${
                    isMe
                      ? 'bg-indigo-600/30 border border-indigo-500/30'
                      : 'bg-dark-600 border border-dark-500'
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-3 border-t border-dark-500 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message…"
          className="flex-1 px-3 py-2 bg-dark-700 border border-dark-500 rounded-lg text-xs text-gray-200 placeholder-gray-600 outline-none focus:border-indigo-500 transition-all"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 rounded-lg transition-all"
        >
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  );
};

export default ChatPanel;
