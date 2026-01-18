function Task({ task, onMove }) {
  return (
    <div className="task">
      {task.title}

      {task.status === "todo" && (
        <button onClick={() => onMove(task._id, "doing")}>Move to Doing</button>
      )}

      {task.status === "doing" && (
        <button onClick={() => onMove(task._id, "done")}>Move to Done</button>
      )}
    </div>
  );
}

export default Task;
