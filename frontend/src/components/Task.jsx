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
          className={`group bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-sm cursor-grab transition-all
            ${snapshot.isDragging ? "shadow-lg ring-2 ring-gray-400 dark:ring-gray-600 rotate-2" : "hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600"}
          `}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 text-sm leading-snug">{task.title}</h3>
              {task.description && (
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleEdit}
                className="flex-shrink-0 text-gray-400 hover:text-gray-700 dark:text-gray-500 dark:hover:text-gray-300 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title="Edit task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
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
                className="flex-shrink-0 text-gray-400 hover:text-red-600 dark:text-gray-500 dark:hover:text-red-400 p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                title="Delete task"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3.5 w-3.5"
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
