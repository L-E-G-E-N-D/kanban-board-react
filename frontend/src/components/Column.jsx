import { memo } from "react";
import Task from "./Task";
import { Droppable } from "@hello-pangea/dnd";


function Column({ title, tasks, onMove, onDelete, onEdit, onAdd }) {
    const status = title.toLowerCase().replace(" ", "");
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 w-72 sm:w-80 border border-gray-200 dark:border-gray-700 transition-colors">
        <h2 className="text-xs font-semibold mb-3 text-slate-700 dark:text-slate-300 tracking-[0.08em] uppercase">
          {title}
        </h2>
        <Droppable droppableId={status}>
          {(provided) => (
            <div
              className="min-h-32 pt-2 space-y-3"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {tasks.map((task, index) => (
                <Task
                  key={task._id}
                  task={task}
                  onMove={onMove}
                  onDelete={onDelete}
                  onEdit={onEdit}
                  index={index}
                />
              ))}
              {tasks.length === 0 && (
                <p className="text-sm text-gray-400 italic">
                  Drop tasks here
                </p>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <button 
          onClick={onAdd}
          className="mt-3 w-full py-2 text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Task
        </button>
      </div>
    );
}

export default memo(Column);