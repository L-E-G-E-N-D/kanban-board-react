import { useState } from "react";
import Column from "./components/Column";
import "./App.css";
import { useEffect } from "react";


function App() {

  useEffect(()=>{
    fetch("http://localhost:3000/tasks")
    .then(res=>res.json())
    .then(data=>setTasks(data))
  },[])

  const [tasks, setTasks] = useState([]);

  const [newTask, setNewTask] = useState("");



  function addTask() {
    if (newTask.trim() === "") return;

    fetch("http://localhost:3000/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
  },
      body: JSON.stringify({ title: newTask })
    })
      .then((res) => res.json())
      .then((task) => {
        setTasks([...tasks, task]);
        setNewTask("");
      });
  }



  function moveTask(id, newStatus) {
    fetch(`http://localhost:3000/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status: newStatus })
    })
      .then((res) => res.json())
      .then(() => {
        setTasks(
          tasks.map((task) =>
            task.id === id ? { ...task, status: newStatus } : task
          )
        );
      });
  }

  return (
    <div>
      <h1>Kanban Board</h1>

      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
        placeholder="New task"
      />

      <button onClick={addTask}>Add</button>

      <div className="board">
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
    </div>
  );
}

export default App;
