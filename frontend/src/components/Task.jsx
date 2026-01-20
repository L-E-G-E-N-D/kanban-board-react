import { memo } from "react";
import { Draggable } from "@hello-pangea/dnd";

function Task({ task, index, onDelete, onEdit }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task._id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-white border border-gray-200 rounded-lg p-3 shadow-sm cursor-grab transition-transform transition-shadow
            ${snapshot.isDragging ? "bg-blue-50 shadow-md scale-[1.01]" : "hover:shadow-md hover:-translate-y-0.5"}
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
            <div className="flex items-center gap-1">
              <button
                onClick={handleEdit}
                className="flex-shrink-0 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded p-1 transition"
                title="Edit task"
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
                    d="M15.232 5.232l3.536 3.536M4 17.25V21h3.75L17.81 10.94a1.5 1.5 0 000-2.121l-3.63-3.63a1.5 1.5 0 00-2.12 0L4 17.25z"
                  />
                </svg>
              </button>
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
        </div>
      )}
    </Draggable>
  );
}

export default memo(Task);
