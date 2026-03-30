const UserPanel = ({ users = [], notifications = [] }) => {
  return (
    <div className="w-56 flex-shrink-0 bg-dark-800 border-l border-dark-500 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-dark-500">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400" />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Live Users ({users.length})
          </span>
        </div>
      </div>

      {/* Users List */}
      <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
        {users.length === 0 ? (
          <p className="text-xs text-gray-600 text-center mt-4">No users in room</p>
        ) : (
          users.map((user) => (
            <div
              key={user.socketId}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg bg-dark-700/50 hover:bg-dark-700 transition-colors"
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                style={{ backgroundColor: user.color }}
              >
                {user.username?.[0]?.toUpperCase()}
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-medium text-gray-300 truncate">{user.username}</span>
                <span className="text-[10px] text-gray-600">Editing</span>
              </div>
              <div
                className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse-slow"
                style={{ backgroundColor: user.color }}
              />
            </div>
          ))
        )}
      </div>

      {/* Notifications feed */}
      {notifications.length > 0 && (
        <div className="border-t border-dark-500 p-3 flex flex-col gap-1">
          <span className="text-[10px] font-semibold text-gray-600 uppercase tracking-wider mb-1">Activity</span>
          {notifications.slice(-4).map((n) => (
            <div key={n.id} className="flex items-start gap-1.5 text-[11px] text-gray-500 animate-fade-in">
              <span className="mt-0.5 flex-shrink-0">{n.type === 'join' ? '→' : '←'}</span>
              <span>{n.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserPanel;
