import { memo } from "react";
import { createPortal } from "react-dom";
import { Draggable } from "@hello-pangea/dnd";
import { Calendar, Edit3, Trash2, Clock } from "lucide-react";
import { formatRelativeTime, formatDueDate } from "../utils/dateUtils";

function Task({ task, index, onDelete, onEdit }) {
  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(task._id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const priorityStyles = {
    high: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_12px_rgba(244,63,94,0.1)]",
    medium: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.1)]",
    low: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_12px_rgba(16,185,129,0.1)]",
  };

  return (
    <Draggable draggableId={task._id} index={index}>
      {(provided, snapshot) => {
        const content = (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`group glass-dark rounded-2xl p-5 cursor-grab active:cursor-grabbing border border-white/5
              ${snapshot.isDragging 
                ? "shadow-[0_20px_50px_rgba(0,0,0,0.5)] ring-1 ring-white/20 z-[1000] bg-white/[0.15] backdrop-blur-2xl" 
                : "hover:border-white/10 hover:bg-white/[0.03] shadow-lg shadow-black/20 transition-all duration-300"
              }
            `}
            style={{
                ...provided.draggableProps.style,
                // Refine visibility during drag
                opacity: snapshot.isDragging ? 0.9 : 1,
            }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex flex-col gap-1.5 min-w-0">
                  {task.priority && (
                    <span className={`self-start text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest border ${priorityStyles[task.priority] || priorityStyles.medium}`}>
                      {task.priority}
                    </span>
                  )}
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug break-words">
                    {task.title}
                  </h3>
                </div>
                
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={handleEdit}
                    className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-gray-500 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {task.description && (
                <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                  {task.description}
                </p>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
                <div className="flex items-center gap-3">
                  {task.dueDate && (
                    <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {formatDueDate(task.dueDate)}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatRelativeTime(task.createdAt)}
                  </div>
                </div>
                
                <div className="flex -space-x-1.5">
                  <div className="w-5 h-5 rounded-full border border-[#050505] bg-indigo-500 flex items-center justify-center text-[8px] font-bold text-white">
                    T
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

        if (snapshot.isDragging) {
          return createPortal(content, document.body);
        }
        return content;
      }}
    </Draggable>
  );
}

export default memo(Task);
