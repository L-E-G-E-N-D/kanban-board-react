import { Draggable } from "@hello-pangea/dnd";

function Task({ task, onMove, index }) {
  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided) => (
        <div
          className="task"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {task.title}

      {task.status === "todo" && (
        <button onClick={() => onMove(task._id, "doing")}>Move to Doing</button>
      )}

      {task.status === "doing" && (
        <button onClick={() => onMove(task._id, "done")}>Move to Done</button>
      )}
        </div>
      )}
    </Draggable>
  );
}

export default Task;
