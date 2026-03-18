import { memo } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { formatRelativeTime } from "../utils/dateUtils";

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
          className={`group bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 rounded-xl p-4 shadow-[0_2px_6px_rgba(15,23,42,0.05)] cursor-grab active:cursor-grabbing transition-all duration-200
            ${snapshot.isDragging ? "shadow-2xl ring-2 ring-indigo-500/30 dark:ring-indigo-400/30 scale-[1.03] -rotate-1" : "hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600"}
          `}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-1 text-sm leading-snug">{task.title}</h3>
                <div className="flex items-center gap-2">
                  {task.createdAt && (
                     <span className="text-[10px] text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {formatRelativeTime(task.createdAt)}
                     </span>
                  )}
                  {task.dueDate && (
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 flex items-center gap-1 bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                  {task.priority && (
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest
                      ${task.priority === 'high' ? 'bg-rose-50 text-rose-600 dark:bg-rose-900/20 dark:text-rose-400' :
                        task.priority === 'medium' ? 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400' :
                        'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                      }
                    `}>
                      {task.priority}
                    </span>
                  )}
                </div>
              </div>
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
