import { useCallback, useEffect, useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "../components/Column";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import RenameBoardModal from "../components/RenameBoardModal";
import API_BASE_URL from "../api.js";


function Board({ token, tasks, setTasks, activeBoardId, boardName, onRenameBoard, onDeleteBoard }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isRenameOpen, setIsRenameOpen] = useState(false);
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
    if (!token || !activeBoardId) {
      setTasks([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    fetch(`${API_BASE_URL}/tasks?boardId=${activeBoardId}`, {
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
  }, [token, activeBoardId]);

  const addTask = useCallback((title, description = "") => {
    if (title.trim() === "") return;
    if (!activeBoardId) return;

    setError(null);

    fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description, boardId: activeBoardId }),
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
  }, [authHeaders, activeBoardId]);

  const syncTaskStatus = useCallback(
    (id, newStatus, previousTasks) => {
      setError(null);

      fetch(`${API_BASE_URL}/tasks/${id}`, {
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

    fetch(`${API_BASE_URL}/tasks/${id}`, {
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

    fetch(`${API_BASE_URL}/tasks/${id}`, {
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
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 group">
          <h1 className="text-3xl font-semibold text-gray-800">{boardName || "Kanban Board"}</h1>
          <button 
            onClick={() => setIsRenameOpen(true)}
            className="text-gray-400 hover:text-blue-600 p-1"
            title="Rename Board"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button 
            onClick={() => onDeleteBoard(activeBoardId)}
            className="text-gray-400 hover:text-red-600 p-1"
            title="Delete Board"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:scale-95 transition shadow-sm"
          >
            Add Task
          </button>
        </div>
      </div>

      {loading && <p className="mb-2">Loading tasks...</p>}
      {error && <p className="mb-2 text-red-500">{error}</p>}

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
      <RenameBoardModal 
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        onRename={(newName) => onRenameBoard(activeBoardId, newName)}
        currentName={boardName}
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-2">
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
