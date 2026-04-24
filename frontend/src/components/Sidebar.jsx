
import { Layout, Plus, LogOut, Moon, Sun, Settings, ChevronRight } from "lucide-react";

function Sidebar({ boards, activeBoardId, onBoardSelect, onNewBoard, onEditBoard, onDeleteBoard, onLogout, theme, toggleTheme, isOpen, onClose, onToggle, user }) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`w-72 md:w-64 bg-[#0a0a0a] text-gray-400 h-screen flex flex-col fixed left-0 top-0 z-50 border-r border-white/5 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-1.5 rounded-lg">
                <Layout className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                KanbanFlow
              </span>
            </div>
            <button
              onClick={onToggle}
              className="p-1.5 rounded-lg hover:bg-white/5 transition md:hidden"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 py-6 overflow-y-auto custom-scrollbar">
          <div className="px-6 mb-4 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">Your Boards</span>
            <button 
              onClick={onNewBoard}
              className="p-1 hover:bg-indigo-500/10 hover:text-indigo-400 rounded-md transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <ul className="px-3 space-y-1">
            {boards.map((board) => (
              <li key={board._id}>
                <div className={`group relative w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                    activeBoardId === board._id
                      ? "bg-indigo-500/10 text-white"
                      : "hover:bg-white/5 text-gray-400 hover:text-gray-200"
                  }`}
                  onClick={() => onBoardSelect(board._id)}
                >
                  {activeBoardId === board._id && (
                    <div className="absolute left-0 top-2 bottom-2 w-1 bg-indigo-500 rounded-full" />
                  )}
                  <div className="truncate font-medium text-sm flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${activeBoardId === board._id ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-gray-600'}`} />
                      {board.name}
                      {user && board.ownerId && user.id !== board.ownerId && (
                           <span className="text-[9px] bg-indigo-500/20 text-indigo-400 px-1.5 py-0.5 rounded-md font-bold uppercase tracking-wider">Shared</span>
                      )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                          onClick={(e) => { e.stopPropagation(); onEditBoard(board); }}
                          className="p-1 hover:bg-white/10 rounded-md text-gray-500 hover:text-white transition"
                      >
                          <Settings className="w-3.5 h-3.5" />
                      </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-4 border-t border-white/5 space-y-2">
          <div className="px-3 py-3 rounded-xl bg-white/5 border border-white/5 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-lg">
                {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "U")}
              </div>
              <div className="flex-1 truncate">
                <p className="text-sm font-bold text-white truncate">{user?.name || "User"}</p>
                <p className="text-[10px] text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
          </div>

          <button
            onClick={toggleTheme}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium hover:bg-white/5 rounded-xl transition text-gray-400 hover:text-white"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-yellow-500" /> : <Moon className="w-4 h-4" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium hover:bg-red-500/10 rounded-xl transition text-gray-400 hover:text-red-400"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed left-0 top-5 z-40 bg-[#0a0a0a] border border-white/5 border-l-0 rounded-r-xl px-2 py-3 text-gray-400 hover:text-white hover:bg-indigo-500/10 transition shadow-xl"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </>
  );
}

export default Sidebar;
