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
        </div>
      )}
    </Draggable>
  );
}

export default Task;
