import { useState } from "react";
import Column from "./components/Column";
import { useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import AddTaskModal from "./components/AddTaskModal";
import EditTaskModal from "./components/EditTaskModal";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup";

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [token, setToken] = useState(
  localStorage.getItem("token")
);
  const authHeaders = {
  Authorization: `Bearer ${token}`,
};


  function logout() {
  localStorage.removeItem("token");
  setToken(null);
}

  const [authMode, setAuthMode] = useState("login");


  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:3000/tasks",{
      headers: authHeaders,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch tasks");
        }
        return res.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  

  function addTask(title, description = "") {
    if (title.trim() === "") return;

    setError(null);

    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add task");
        }
        return res.json();
      })
      .then((createdTask) => {
        setTasks([...tasks, createdTask]);
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  function moveTask(id, newStatus) {
    setError(null);

    fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PATCH",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status: newStatus }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update task");
        }
        setTasks(
          tasks.map((task) =>
            task._id === id ? { ...task, status: newStatus } : task
          )
        );
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  function deleteTask(id) {
    setError(null);

    fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete task");
        }
        setTasks(tasks.filter((task) => task._id !== id));
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  function openEdit(task) {
    setEditingTask(task);
    setIsEditOpen(true);
  }

  function updateTask(id, updatedFields) {
    setError(null);

    fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PATCH",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedFields),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to update task");
        }
        return res.json();
      })
      .then((updatedTask) => {
        setTasks(tasks.map((t) => (t._id === id ? updatedTask : t)));
        setIsEditOpen(false);
        setEditingTask(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;

    moveTask(draggableId, newStatus);
  }

  if (!token) {
    return authMode === "login" ? (
      <Login onLogin={setToken} onSwitch={() => setAuthMode("signup")} />
    ) : (
      <Signup onSwitch={() => setAuthMode("login")} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kanban Board</h1>
        <button
          onClick={logout}
          className="text-sm text-gray-600 hover:text-red-600 hover:underline"
        >
          Logout
        </button>
      </div>

      {loading && <p className="mb-2">Loading tasks...</p>}
      {error && <p className="mb-2 text-red-500">{error}</p>}

      <div className="mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition"
        >
          Add Task
        </button>
      </div>

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={addTask}
      />
      <EditTaskModal
        isOpen={isEditOpen}
        task={editingTask}
        onClose={() => {
          setIsEditOpen(false);
          setEditingTask(null);
        }}
        onSave={(title, description) =>
          updateTask(editingTask._id, { title, description })
        }
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6">
          <Column
            title="To Do"
            tasks={tasks.filter((t) => t.status === "todo")}
            onMove={moveTask}
            onDelete={deleteTask}
            onEdit={openEdit}
          />
          <Column
            title="Doing"
            tasks={tasks.filter((t) => t.status === "doing")}
            onMove={moveTask}
            onDelete={deleteTask}
            onEdit={openEdit}
          />
          <Column
            title="Done"
            tasks={tasks.filter((t) => t.status === "done")}
            onMove={moveTask}
            onDelete={deleteTask}
            onEdit={openEdit}
          />
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;