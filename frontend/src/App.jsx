import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Board from "./pages/Board";
import Sidebar from "./components/Sidebar";
import CreateBoardModal from "./components/CreateBoardModal";
import RenameBoardModal from "./components/RenameBoardModal";
import API_BASE_URL from "./api.js";

function App() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [boards, setBoards] = useState([]);
  const [activeBoardId, setActiveBoardId] = useState(localStorage.getItem("activeBoardId"));
  const [isCreateBoardOpen, setIsCreateBoardOpen] = useState(false);
  const [isRenameBoardOpen, setIsRenameBoardOpen] = useState(false);
  const [boardToRename, setBoardToRename] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme(prev => prev === "light" ? "dark" : "light");
  }

  useEffect(() => {
    if (user) {
        localStorage.setItem("user", JSON.stringify(user));
    } else {
        localStorage.removeItem("user");
    }
  }, [user]);

  useEffect(() => {
    if (!token) return;

    fetch(`${API_BASE_URL}/boards`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (res.status === 401) {
            logout();
            throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
            setBoards(data);
            if (data.length > 0 && !activeBoardId) {
                setActiveBoardId(data[0]._id);
            } else if (data.length > 0 && activeBoardId && !data.find(b => b._id === activeBoardId)) {
                setActiveBoardId(data[0]._id);
            }
        } else {
            setBoards([]);
        }
      })
      .catch((err) => {
        if (err.message !== "Unauthorized") console.error("Failed to fetch boards", err);
      });
  }, [token]);

  useEffect(() => {
    if (activeBoardId) {
      localStorage.setItem("activeBoardId", activeBoardId);
    }
  }, [activeBoardId]);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeBoardId");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setActiveBoardId(null);
    setTasks([]);
    navigate("/login");
  }, [navigate]);

  // ... (handleCreateBoard, etc. - no changes needed if they aren't passed as dependencies to effects in Board)
  // Actually handleCreateBoard, Rename, Delete are passed to Sidebar, not Board. Sidebar might not have effects depending on them.
  // But let's stick to the critical ones for Board first.

  // ... skipping to addActivity ...
  
  const addActivity = useCallback((message) => {
    setActivityLog((prev) => [message, ...prev].slice(0, 5));
  }, []);

  const activeBoard = boards.find(b => b._id === activeBoardId);

  const filteredTasks = tasks.filter((task) => {
    // Filter by Search Query
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
    }
    // Filter by Status
    if (activeFilter !== "all" && task.status !== activeFilter) {
        return false;
    }
    return true;
  });

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute token={token}>
            <div className="flex">
              <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                boards={boards}
                activeBoardId={activeBoardId}
                onBoardSelect={setActiveBoardId}
                onNewBoard={() => setIsCreateBoardOpen(true)}
                onEditBoard={(board) => {
                    setBoardToRename(board);
                    setIsRenameBoardOpen(true);
                }}
                onDeleteBoard={handleDeleteBoard}
                onLogout={logout}
                theme={theme}
                toggleTheme={toggleTheme}
                user={user}
              />
              <div className={`flex-1 p-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-all duration-300 ease-in-out ${
                isSidebarOpen ? "md:ml-60" : "md:ml-0"
              }`}>
                <div className="mb-4">
                  <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    aria-label="Toggle Sidebar"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
                {activeBoard ? (
                    <Board
                    token={token}
                    user={user}
                    tasks={filteredTasks}
                    setTasks={setTasks}
                    activeBoardId={activeBoardId}
                    boardName={activeBoard.name}
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                    activeFilter={activeFilter}
                    onFilterChange={setActiveFilter}
                    activityLog={activityLog}
                    addActivity={addActivity}
                    onLogout={logout}
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <div className="text-center text-gray-500">
                            <h2 className="text-xl font-semibold mb-2">No Boards Found</h2>
                            <p className="mb-4">Create a new board to get started.</p>
                            <button 
                                onClick={() => setIsCreateBoardOpen(true)}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                            >
                                Create Board
                            </button>
                        </div>
                    </div>
                )}
              </div>
            </div>
            <CreateBoardModal 
                isOpen={isCreateBoardOpen}
                onClose={() => setIsCreateBoardOpen(false)}
                onCreateBoard={handleCreateBoard}
            />
            <RenameBoardModal 
                isOpen={isRenameBoardOpen}
                onClose={() => {
                    setIsRenameBoardOpen(false);
                    setBoardToRename(null);
                }}
                onRename={(newName) => {
                    if (boardToRename) {
                        handleRenameBoard(boardToRename._id, newName);
                        setIsRenameBoardOpen(false);
                        setBoardToRename(null);
                    }
                }}
                currentName={boardToRename?.name || ""}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <Login
            onLogin={(tok, userData) => {
              setToken(tok);
              setUser(userData);
              navigate("/");
            }}
            onSwitch={() => navigate("/signup")}
          />
        }
      />
      <Route
        path="/signup"
        element={<Signup onSwitch={() => navigate("/login")} />}
      />
      <Route
        path="*"
        element={<Navigate to={token ? "/" : "/login"} replace />}
      />
    </Routes>
  );
}

export default App;