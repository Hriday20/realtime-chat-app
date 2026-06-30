function OnlineUsers({ onlineUsers }) {
  return (
    <div className="w-56 h-screen bg-gray-900 border-l border-gray-800 p-5 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold">
          Online Users
        </h2>

        <p className="text-sm text-gray-400 mt-1">
          {onlineUsers.length} active now
        </p>
      </div>

      <div className="space-y-3">
        {onlineUsers.length === 0 ? (
          <div className="bg-gray-800 rounded-2xl p-4 text-gray-400 text-center">
            No users online
          </div>
        ) : (
          onlineUsers.map((user, index) => (
            <div
              key={index}
              className="group flex items-center gap-3 bg-gray-800 hover:bg-gray-700 transition p-3 rounded-2xl shadow-md"
            >
              <div className="relative shrink-0">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-800 flex items-center justify-center font-bold shadow-md">
                  {user?.charAt(0).toUpperCase()}
                </div>

                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-gray-800"></div>
              </div>

              <div className="min-w-0">
                <p className="font-medium truncate">
                  {user}
                </p>

                <p className="text-xs text-green-400">
                  Online
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default OnlineUsers;