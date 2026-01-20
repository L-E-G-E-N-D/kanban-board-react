import { Draggable } from "@hello-pangea/dnd";

function Task({ task, index, onDelete }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task._id);
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white border border-gray-200 rounded-lg p-3 mb-3 shadow-sm cursor-grab transition
            ${snapshot.isDragging ? "bg-blue-50 shadow-lg rotate-1" : "hover:shadow-md"}
          `}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-800 mb-1">{task.title}</h3>
              {task.description && (
                <p className="text-sm text-gray-600 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            <button
              onClick={handleDelete}
              className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded p-1 transition"
              title="Delete task"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default Task;
