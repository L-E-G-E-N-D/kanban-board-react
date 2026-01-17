function Task({task, onMove}) {
    return (
        <div>
            {task.title}

            {task.status === "todo" && (
                <button onClick={() => onMove(task.id, "doing")}>
                    Move to Doing
                </button>
            )}

            {task.status === "doing" && (
                <button onClick={() => onMove(task.id, "done")}>
                    Move to Done
                </button>
            )}
        </div>
    );
}

export default Task;