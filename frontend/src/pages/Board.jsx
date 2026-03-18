import { useCallback, useEffect, useMemo, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import Column from "../components/Column";
import AddTaskModal from "../components/AddTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import InviteUserModal from "../components/InviteUserModal";
import StatsPanel from "../components/StatsPanel";
import SearchBar from "../components/SearchBar";
import ActivityMonitor from "../components/ActivityMonitor";
import API_BASE_URL from "../api.js";
import { connectSocket } from "../socket";


function Board({ token, user, tasks, setTasks, activeBoardId, boardName, searchQuery, onSearchChange, activeFilter, onFilterChange, activityLog, setActivityLog, addActivity, onLogout }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [targetStatus, setTargetStatus] = useState("todo");
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [activeUsers, setActiveUsers] = useState([]);

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
  
  const handleInvite = async (email) => {
      if (!activeBoardId) return;
      
      const res = await fetch(`${API_BASE_URL}/boards/${activeBoardId}/invite`, {
          method: "POST",
          headers: {
              ...authHeaders,
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
      });
      
      if (res.status === 401) {
          onLogout();
          return;
      }

      const data = await res.json();
      
      if (!res.ok) {
          throw new Error(data.message || "Failed to invite user");
      }
      
      addActivity(`Invited ${email} to board`);
  };



  useEffect(() => {
    if (!token) return;

    // Fetch notifications
    fetch(`${API_BASE_URL}/notifications`, {
      headers: authHeaders
    })
    .then(async (res) => {
        if (res.status === 401) {
            onLogout();
            return null; // Stop processing
        }
        if (!res.ok) throw new Error("Failed to fetch notifications");
        return res.json();
    })
    .then(data => {
        if (data && Array.isArray(data)) {
            setNotifications(data);
        } else {
             // If data is null (from 401 handler) or not array, don't set invalid state
             if (data) console.error("Invalid notifications format:", data);
        }
    })
    .catch(err => console.error("Failed to fetch notifications", err));
  }, [token, authHeaders, onLogout]);

  const markAsRead = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PATCH',
        headers: authHeaders
      });

      if (res.status === 401) {
          onLogout();
          return;
      }
      
      if (res.ok) {
        setNotifications(prev => prev.map(n => 
            n._id === id ? { ...n, isRead: true } : n
        ));
      }
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  useEffect(() => {
    if (!activeBoardId || !token) return;

    const socket = connectSocket(token);

    const onConnect = () => {
      socket.emit("join-board", {
        boardId: activeBoardId,
        user: user
          ? { id: user.id, name: user.name, email: user.email }
          : null,
      });
    };

    const onPresenceUpdate = (users) => {
      setActiveUsers(users);
    };

    const onTaskCreated = (newTask) => {
      setTasks((prev) => {
        if (prev.find((t) => t._id === newTask._id)) return prev;
        return [...prev, newTask];
      });
    };

    const onTaskUpdated = (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) => (t._id === updatedTask._id ? updatedTask : t))
      );
    };

    const onTaskMoved = ({ task }) => {
      if (!task?._id) return;
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? task : t))
      );
    };

    const onTaskDeleted = (deletedId) => {
      setTasks((prev) => prev.filter((t) => t._id !== deletedId));
    };

    const onNewActivity = (activity) => {
      setActivityLog((prev) => [activity, ...prev].slice(0, 30));
    };

    socket.on("connect", onConnect);
    socket.on("presence-update", onPresenceUpdate);
    socket.on("task-created", onTaskCreated);
    socket.on("task-updated", onTaskUpdated);
    socket.on("task-moved", onTaskMoved);
    socket.on("task-deleted", onTaskDeleted);
    socket.on("new-activity", onNewActivity);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.emit("leave-board", activeBoardId);
      socket.off("connect", onConnect);
      socket.off("presence-update", onPresenceUpdate);
      socket.off("task-created", onTaskCreated);
      socket.off("task-updated", onTaskUpdated);
      socket.off("task-moved", onTaskMoved);
      socket.off("task-deleted", onTaskDeleted);
      socket.off("new-activity", onNewActivity);
    };
  }, [activeBoardId, token, user, setTasks, setActivityLog]);

  useEffect(() => {
    if (!token || !activeBoardId) {
      setTasks([]);
      setActivityLog([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    // Fetch tasks
    fetch(`${API_BASE_URL}/tasks?boardId=${activeBoardId}`, {
      headers: authHeaders,
    })
      .then((res) => {
        if (res.status === 401) {
            onLogout();
            throw new Error("Unauthorized");
        }
        return res.json();
      })
      .then((data) => {
        setTasks(data);
      })
      .catch((err) => {
        if (err.message !== "Unauthorized") setError(err.message);
      })
      .finally(() => setLoading(false));

    // Fetch activities
    fetch(`${API_BASE_URL}/boards/${activeBoardId}/activity`, {
        headers: authHeaders,
    })
    .then(res => res.json())
    .then(data => setActivityLog(data || []))
    .catch(err => console.error("Failed to fetch activity", err));
  }, [token, activeBoardId, onLogout, authHeaders, setTasks, setActivityLog]);

  const addTask = useCallback((title, description, priority, dueDate) => {
    if (title.trim() === "") return;
    if (!activeBoardId) return;

    setError(null);

    fetch(`${API_BASE_URL}/tasks`, {
      method: "POST",
      headers: {
        ...authHeaders,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 
        title, 
        description, 
        boardId: activeBoardId, 
        status: targetStatus,
        priority: priority || "medium",
        dueDate: dueDate || null
      }),
    })
      .then((res) => {
        if (res.status === 401) {
            onLogout();
            throw new Error("Unauthorized");
        }
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
        if (err.message !== "Unauthorized") setError(err.message);
      });
  }, [authHeaders, activeBoardId, onLogout, targetStatus]);

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
          if (res.status === 401) {
               onLogout();
               throw new Error("Unauthorized");
          }
          if (!res.ok) {
            throw new Error("Failed to update task");
          }
        })
        .catch((err) => {
          if (err.message !== "Unauthorized") setError(err.message);
          if (previousTasks) {
            setTasks(previousTasks);
          }
        });
    },
    [authHeaders, onLogout]
  );

  const deleteTask = useCallback((id) => {
    setError(null);

    fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: "DELETE",
      headers: authHeaders,
    })
      .then((res) => {
        if (res.status === 401) {
            onLogout();
            throw new Error("Unauthorized");
        }
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
        if (err.message !== "Unauthorized") setError(err.message);
      });
  }, [authHeaders, tasks, onLogout]);

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
        if (res.status === 401) {
            onLogout();
            throw new Error("Unauthorized");
        }
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
        if (err.message !== "Unauthorized") setError(err.message);
      });
  }, [authHeaders, onLogout]);

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
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">{boardName || "Kanban Board"}</h1>
        </div>
        
        <div className="flex items-center gap-3">
            <button
                onClick={() => setIsInviteOpen(true)}
                className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                Share
            </button>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full relative transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700 font-semibold text-gray-900 dark:text-white flex justify-between items-center">
                    <h3>Notifications</h3>
                    <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-300">
                      {notifications.filter(n => !n.isRead).length} new
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        No notifications
                      </div>
                    ) : (
                      notifications.map(notification => (
                        <div 
                          key={notification._id} 
                          onClick={() => markAsRead(notification._id)}
                          className={`p-3 border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-750 transition cursor-pointer ${!notification.isRead ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}
                        >
                          <p className={`text-sm text-gray-800 dark:text-gray-200 ${!notification.isRead ? 'font-medium' : ''}`}>
                            {notification.message}
                          </p>
                          <span className="text-xs text-gray-400 dark:text-gray-500 mt-1 block">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-8 w-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 font-semibold text-sm border border-slate-300 dark:border-slate-600">
                {user?.name ? user.name.charAt(0).toUpperCase() : (user?.email ? user.email.charAt(0).toUpperCase() : "U")}
            </div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-200 hidden sm:block">
                {user?.name || user?.email || "User"}
            </span>
          </div>
          
          <div className="flex -space-x-2 overflow-hidden items-center ml-2 border-l border-slate-200 dark:border-slate-700 pl-4">
              {activeUsers.slice(0, 5).map((u, i) => (
                  <div 
                    key={i} 
                    className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-gray-900 bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-[10px] font-bold text-blue-700 dark:text-blue-300"
                    title={u.name || u.email}
                  >
                      {(u.name || u.email || 'A').charAt(0).toUpperCase()}
                  </div>
              ))}
              {activeUsers.length > 5 && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 ml-2">
                      +{activeUsers.length - 5} more
                  </span>
              )}
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

      {loading && <p className="mb-2 dark:text-slate-300">Loading tasks...</p>}
      {error && <p className="mb-2 text-red-500 dark:text-red-400">{error}</p>}

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddTask={addTask}
      />
      <InviteUserModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        onInvite={handleInvite}
      />
      <EditTaskModal
        isOpen={isEditOpen}
        task={editingTask}
        onClose={() => {
          setIsEditOpen(false);
          setEditingTask(null);
        }}
        onSave={(title, description, priority, dueDate) =>
          updateTask(editingTask._id, { title, description, priority, dueDate })
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
            <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">Board Stats</h3>
            <StatsPanel tasks={tasks} />
          </div>
          <ActivityMonitor activities={activityLog} />
        </div>
      </div>
    </div>
  );
}

export default Board;
