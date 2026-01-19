import { useState } from "react";
import Column from "./components/Column";
import { useEffect } from "react";
import { DragDropContext } from "@hello-pangea/dnd";


function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch("http://localhost:3000/tasks")
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

  

  function addTask() {
    if (newTask.trim() === "") return;

    setError(null);

    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title: newTask }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to add task");
        }
        return res.json();
      })
      .then((createdTask) => {
        setTasks([...tasks, createdTask]);
        setNewTask("");
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

  function onDragEnd(result) {
    const {destination,source,draggableId} = result;

    if(!destination) return;
    if(
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) return;

    const newStatus = destination.droppableId;
    
    moveTask(draggableId,newStatus);
  }


  return (
  <div className="min-h-screen bg-gray-100 p-6">
    <h1 className="text-3xl font-bold mb-6 text-gray-800">
      Kanban Board
    </h1>

    {loading && <p className="mb-2">Loading tasks...</p>}
    {error && <p className="mb-2 text-red-500">{error}</p>}

    <div className="mb-6 flex gap-2">
      <input
        className="border rounded px-3 py-2"
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task"
      />

      <button
        onClick={addTask}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Add
      </button>
    </div>

    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-6">
        <Column
          title="To Do"
          tasks={tasks.filter((t) => t.status === "todo")}
          onMove={moveTask}
        />
        <Column
          title="Doing"
          tasks={tasks.filter((t) => t.status === "doing")}
          onMove={moveTask}
        />
        <Column
          title="Done"
          tasks={tasks.filter((t) => t.status === "done")}
          onMove={moveTask}
        />
      </div>
    </DragDropContext>
  </div>
);
}

export default App;