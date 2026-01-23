import { useCallback, useEffect, useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "../components/Column";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import StatsPanel from "../components/StatsPanel";
import SearchBar from "../components/SearchBar";
import ActivityMonitor from "../components/ActivityMonitor";
import API_BASE_URL from "../api.js";


function Board({ token, user, tasks, setTasks, activeBoardId, boardName, searchQuery, onSearchChange, activeFilter, onFilterChange, activityLog, addActivity }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [targetStatus, setTargetStatus] = useState("todo");

  const openAddTask = useCallback((status) => {
    setTargetStatus(status);
    setIsModalOpen(true);
  }, []);

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
      body: JSON.stringify({ title, description, boardId: activeBoardId, status: targetStatus }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add task");
        }
        return res.json();
      })
      .then((createdTask) => {
        setTasks((prev) => [...prev, createdTask]);
        const statusLabel = targetStatus === 'todo' ? 'To Do' : targetStatus === 'doing' ? 'Doing' : 'Done';
        addActivity(`Task "${createdTask.title}" created in ${statusLabel}`);
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
        const taskTitle = tasks.find((t) => t._id === id)?.title;
        setTasks((prev) => prev.filter((task) => task._id !== id));
        if (taskTitle) {
            addActivity(`Task "${taskTitle}" deleted`);
        }
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
    
    const taskTitle = tasks.find(t => t._id === draggableId)?.title || "Task";
    addActivity(`Task "${taskTitle}" moved to ${newStatus === 'todo' ? 'To Do' : newStatus === 'doing' ? 'Doing' : 'Done'}`);
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
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 group">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">{boardName || "Kanban Board"}</h1>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold text-sm border border-gray-300 dark:border-gray-600">
                {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "U")}
            </div>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:block">
                {user?.name || user?.email || "User"}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <SearchBar 
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            activeFilter={activeFilter}
            onFilterChange={onFilterChange}
        />
      </div>

      {loading && <p className="mb-2 dark:text-gray-300">Loading tasks...</p>}
      {error && <p className="mb-2 text-red-500 dark:text-red-400">{error}</p>}

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

      <div className="flex gap-6 items-start">
        <div className="flex-1 overflow-x-auto pb-4">
          <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-4 sm:gap-6">
              <Column
                title="To Do"
                tasks={todoTasks}
                onMove={syncTaskStatus}
                onDelete={deleteTask}
                onEdit={openEdit}
                onAdd={() => openAddTask("todo")}
              />
              <Column
                title="Doing"
                tasks={doingTasks}
                onMove={syncTaskStatus}
                onDelete={deleteTask}
                onEdit={openEdit}
                onAdd={() => openAddTask("doing")}
              />
              <Column
                title="Done"
                tasks={doneTasks}
                onMove={syncTaskStatus}
                onDelete={deleteTask}
                onEdit={openEdit}
                onAdd={() => openAddTask("done")}
              />
            </div>
          </DragDropContext>
        </div>

        <div className="w-64 shrink-0 space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Board Stats</h3>
            <StatsPanel tasks={tasks} />
          </div>
          <ActivityMonitor activities={activityLog} />
        </div>
      </div>
    </div>
  );
}

export default Board;
