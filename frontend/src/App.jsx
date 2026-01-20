import { useEffect, useState } from "react";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Board from "./pages/Board";

function App() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [token, setToken] = useState(
  localStorage.getItem("token")
);


  useEffect(() => {
  }, [token]);


  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    navigate("/login");
  }

  

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute token={token}>
            <Board
              token={token}
              onLogout={logout}
              tasks={tasks}
              setTasks={setTasks}
            />
          </ProtectedRoute>
        }
      />
      <Route
        path="/login"
        element={
          <Login
            onLogin={(tok) => {
              setToken(tok);
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