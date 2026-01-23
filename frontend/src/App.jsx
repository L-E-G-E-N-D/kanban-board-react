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
      .then((res) => res.json())
      .then((data) => {
        setBoards(data);
        if (data.length > 0 && !activeBoardId) {
            setActiveBoardId(data[0]._id);
        } else if (data.length > 0 && activeBoardId && !data.find(b => b._id === activeBoardId)) {
            // fallback if stored board id is invalid/deleted
            setActiveBoardId(data[0]._id);
        }
      })
      .catch((err) => console.error("Failed to fetch boards", err));
  }, [token]);

  useEffect(() => {
    if (activeBoardId) {
      localStorage.setItem("activeBoardId", activeBoardId);
    }
  }, [activeBoardId]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("activeBoardId");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    setActiveBoardId(null);
    setTasks([]);
    navigate("/login");
  }

  function handleCreateBoard(name) {
    if (!token) return;

    fetch(`${API_BASE_URL}/boards`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    })
      .then((res) => {
          if (!res.ok) throw new Error("Failed to create board");
          return res.json();
      })
      .then((newBoard) => {
        setBoards((prev) => [...prev, newBoard]);
        setActiveBoardId(newBoard._id);
      })
      .catch((err) => console.error(err));
  }
  
  function handleRenameBoard(boardId, newName) {
    if (!token) return;

    fetch(`${API_BASE_URL}/boards/${boardId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to rename board");
        return res.json();
      })
      .then((updatedBoard) => {
        setBoards((prev) =>
          prev.map((b) => (b._id === boardId ? updatedBoard : b))
        );
      })
      .catch((err) => console.error(err));
  }

  function handleDeleteBoard(boardId) {
    if (!token) return;

    if (!window.confirm("Are you sure you want to delete this board? All tasks in it will be lost.")) {
      return;
    }

    fetch(`${API_BASE_URL}/boards/${boardId}`, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    .then((res) => {
        if (!res.ok) throw new Error("Failed to delete board");
        return res.json();
    })
    .then(() => {
        const newBoards = boards.filter(b => b._id !== boardId);
        setBoards(newBoards);
        if (activeBoardId === boardId) {
            setActiveBoardId(newBoards.length > 0 ? newBoards[0]._id : null);
        }
    })
    .catch((err) => console.error(err));
  }

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activityLog, setActivityLog] = useState([]);

  function addActivity(message) {
    setActivityLog((prev) => [message, ...prev].slice(0, 5));
  }

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
              />
              <div className="flex-1 ml-60 p-8 bg-slate-50 dark:bg-slate-950 min-h-screen transition-colors duration-200">
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