import { useState } from "react"
import Column from "./components/Column";


function App() {
  const [tasks,setTasks]=useState([
    {id:1, title:"Task 1", status:"todo"},
    {id:2, title:"Task 2", status:"doing"},
    {id:3, title:"Task 3", status:"done"},
    {id:4, title:"Task 4", status:"done"},
    {id:5, title:"Task 5", status:"doing"},
  ])

  const[newTask, setNewTask]=useState("");

  function addTask(){
    if(newTask.trim()==="") return;

    setTasks([
      ...tasks,
      {
        id:tasks.length+1,
        title:newTask,
        status:"todo"
      }
    ])
    setNewTask("");
  }

  function moveTask(id, newStatus){
    setTasks(
      tasks.map(task=>
        task.id===id?{...task,status:newStatus}:task
      )
    );
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


      <Column
        title="To Do"
        tasks={tasks.filter(t => t.status === "todo")}
        onMove={moveTask}
      />

      <Column
        title="Doing"
        tasks={tasks.filter(t => t.status === "doing")}
        onMove={moveTask}
      />

      <Column
        title="Done"
        tasks={tasks.filter(t => t.status === "done")}
        onMove={moveTask}
      />
    </div>
  );
}

export default App;
