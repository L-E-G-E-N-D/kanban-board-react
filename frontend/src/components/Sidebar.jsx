
function Sidebar({ boards, activeBoardId, onBoardSelect, onNewBoard, onLogout }) {
  return (
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col fixed left-0 top-0 overflow-y-auto z-10">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-2xl font-bold tracking-tight">Kanban</h1>
      </div>

      <div className="flex-1 py-4">
        <div className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Your Boards
        </div>
        <ul>
          {boards.map((board) => (
            <li key={board._id}>
              <button
                onClick={() => onBoardSelect(board._id)}
                className={`w-full text-left px-6 py-3 transition-colors ${
                  activeBoardId === board._id
                    ? "bg-blue-600 text-white border-r-4 border-blue-400"
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div className="truncate font-medium">{board.name}</div>
              </button>
            </li>
          ))}
        </ul>
        
        <div className="px-4 mt-4">
          <button
            onClick={onNewBoard}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-blue-400 hover:text-blue-300 hover:bg-gray-800 rounded-lg transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            New Board
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={onLogout}
          className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:text-red-300 hover:bg-gray-800 rounded-lg transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
          </svg>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;
