import { memo } from "react";
import Task from "./Task";
import { Droppable } from "@hello-pangea/dnd";


function Column({ title, tasks, onMove, onDelete, onEdit, onAdd }) {
    const status = title.toLowerCase().replace(" ", "");
    return (
      <div className="bg-slate-100/50 dark:bg-slate-900/40 rounded-2xl p-4 w-80 sm:w-96 border border-slate-200/70 dark:border-slate-800/60 transition-all duration-200 flex flex-col h-full max-h-[85vh] shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between mb-4 px-1 sticky top-0 bg-inherit z-10">
          <h2 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-widest uppercase">
            {title} <span className="ml-2 px-1.5 py-0.5 bg-slate-200 dark:bg-slate-800 rounded-full text-[10px]">{tasks.length}</span>
          </h2>
          <div className="flex gap-1">
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-700"></div>
          </div>
        </div>
        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              className={`flex-1 pt-1 space-y-3 px-1 min-h-[150px] overflow-y-auto scrollbar-hide transition-colors ${snapshot.isDraggingOver ? 'bg-slate-200/40 dark:bg-slate-800/30 rounded-xl ring-1 ring-indigo-300/40 dark:ring-indigo-500/30' : ''}`}
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
              {tasks.length === 0 && !snapshot.isDraggingOver && (
                <div className="h-full flex items-center justify-center p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium uppercase tracking-widest italic">
                    No Tasks
                  </p>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <button 
          onClick={onAdd}
          className="mt-4 w-full py-2.5 text-[13px] font-semibold text-slate-500 hover:text-indigo-600 dark:text-slate-500 dark:hover:text-indigo-400 bg-white/60 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl transition-all flex items-center justify-center gap-2 group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:scale-110 transition-transform" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add Task
        </button>
      </div>
    );
}

export default memo(Column);
