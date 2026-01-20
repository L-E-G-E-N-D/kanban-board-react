import { useCallback, useEffect, useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "../components/Column";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";

function Board({ token, onLogout, tasks, setTasks }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const authHeaders = useMemo(
    () =>
      token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {},
    [token]
  );

  useEffect(() => {
    if (!token) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    fetch("http://localhost:3000/tasks", {
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
  }, [token]);

  const addTask = useCallback((title, description = "") => {
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
        setTasks((prev) => [...prev, createdTask]);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [authHeaders]);

  const syncTaskStatus = useCallback(
    (id, newStatus, previousTasks) => {
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
        })
        .catch((err) => {
          setError(err.message);
          if (previousTasks) {
            setTasks(previousTasks);
          }
        });
    },
    [authHeaders]
  );

  const deleteTask = useCallback((id) => {
    setError(null);

    fetch(`http://localhost:3000/tasks/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to delete task");
        }
        setTasks((prev) => prev.filter((task) => task._id !== id));
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [authHeaders]);

  const openEdit = useCallback((task) => {
    setEditingTask(task);
    setIsEditOpen(true);
  }, []);

  const updateTask = useCallback((id, updatedFields) => {
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
        setTasks((prev) => prev.map((t) => (t._id === id ? updatedTask : t)));
        setIsEditOpen(false);
        setEditingTask(null);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [authHeaders]);

  function onDragEnd(result) {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const newStatus = destination.droppableId;
    const previousTasks = tasks;

    // Optimistic UI update
    setTasks((prev) =>
      prev.map((task) =>
        task._id === draggableId ? { ...task, status: newStatus } : task
      )
    );

    // Sync in background
    syncTaskStatus(draggableId, newStatus, previousTasks);
  }

  const todoTasks = useMemo(
    () => tasks.filter((t) => t.status === "todo"),
    [tasks]
  );
  const doingTasks = useMemo(
    () => tasks.filter((t) => t.status === "doing"),
    [tasks]
  );
  const doneTasks = useMemo(
    () => tasks.filter((t) => t.status === "done"),
    [tasks]
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kanban Board</h1>
        <button
          onClick={onLogout}
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
            tasks={todoTasks}
            onMove={syncTaskStatus}
            onDelete={deleteTask}
            onEdit={openEdit}
          />
          <Column
            title="Doing"
            tasks={doingTasks}
            onMove={syncTaskStatus}
            onDelete={deleteTask}
            onEdit={openEdit}
          />
          <Column
            title="Done"
            tasks={doneTasks}
            onMove={syncTaskStatus}
            onDelete={deleteTask}
            onEdit={openEdit}
          />
        </div>
      </DragDropContext>
    </div>
  );
}

export default Board;
