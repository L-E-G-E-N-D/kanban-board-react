import { memo } from "react";
import Task from "./Task";
import { Droppable } from "@hello-pangea/dnd";
import { Plus, MoreHorizontal } from "lucide-react";

function Column({ id, title, tasks, onMove, onDelete, onEdit, onAdd, accentColor = "indigo" }) {
    const status = id;
    
    const colors = {
        indigo: "from-indigo-500 to-blue-600",
        purple: "from-purple-500 to-pink-600",
        emerald: "from-emerald-500 to-teal-600",
    };

    const textColors = {
        indigo: "text-indigo-400",
        purple: "text-purple-400",
        emerald: "text-emerald-400",
    };

    return (
      <div className="glass-dark rounded-[2rem] p-5 w-[85vw] sm:w-[350px] lg:w-[380px] border border-white/5 flex flex-col h-full max-h-[800px] relative group/column">
        {/* Accent Top Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${colors[accentColor] || colors.indigo} rounded-t-[2rem]`} />
        
        <div className="flex items-center justify-between mb-6 px-1">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white tracking-wide">
              {title}
            </h2>
            <span className="px-2 py-0.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full text-[10px] font-bold text-gray-500 dark:text-gray-400">
              {tasks.length}
            </span>
          </div>
          <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <Droppable droppableId={status}>
          {(provided, snapshot) => (
            <div
              className={`flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar min-h-[200px] rounded-2xl transition-all duration-300 ${
                snapshot.isDraggingOver ? 'bg-white/[0.02] ring-1 ring-white/10' : ''
              }`}
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
                <div className="flex-1 flex flex-col items-center justify-center p-10 border-2 border-dashed border-white/5 rounded-3xl opacity-40">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-[0.2em]">
                    Empty List
                  </p>
                </div>
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>

        <button 
          onClick={onAdd}
          className={`mt-6 w-full py-3.5 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/20 transition-all flex items-center justify-center gap-2 group/btn ${textColors[accentColor] || textColors.indigo}`}
        >
          <div className={`p-1 rounded-lg bg-current opacity-20 group-hover/btn:opacity-30 transition-opacity`}>
            <Plus className="w-3.5 h-3.5 text-white" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider">Add Task</span>
        </button>
      </div>
    );
}

export default memo(Column);
