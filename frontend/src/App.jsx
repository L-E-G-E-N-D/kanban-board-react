import { useState } from "react"



function App() {
  const [tasks,setTasks]=useState([
    {id:1, title:"Task 1", status:"todo"},
    {id:2, title:"Task 2", status:"doing"},
    {id:3, title:"Task 3", status:"done"},
    {id:4, title:"Task 4", status:"done"},
    {id:5, title:"Task 5", status:"doing"},
  ])


  return (
    <div>
      <div>
        <h1>KanbanBoard</h1>
        <h3>Logout</h3>
        
      <div>
        <h2>ToDo</h2>
        {tasks
          .filter(task=>task.status==="todo")
          .map(task=>(
            <div key={task.id}>{task.title}</div>
          ))
          }

      </div>
      <div>
        <h2>Doing</h2>
        {tasks
          .filter(task=>task.status==="doing")
          .map(task=>(
            <div key={task.id}>{task.title}</div>
          ))
          }
        
      </div>
      <div>
        <h2>Done</h2>
        {tasks
          .filter(task=>task.status==="done")
          .map(task=>(
            <div key={task.id}>{task.title}</div>
          ))
          }
      </div>
      </div>
    </div>
  )
}

export default App
