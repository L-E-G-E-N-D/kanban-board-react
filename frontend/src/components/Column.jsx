import { memo } from "react";
import Task from "./Task";
import { Droppable } from "@hello-pangea/dnd";


function Column({ title, tasks, onMove, onDelete, onEdit }) {
    const status = title.toLowerCase().replace(" ", "");
    return (
      <div className="bg-white rounded-xl shadow-sm p-4 w-80 border border-gray-200">
        <h2 className="text-lg font-semibold mb-4 text-gray-700 tracking-wide">
          {title}
        </h2>
        <Droppable droppableId={status}>
          {(provided) => (
            <div
              className="min-h-32 pt-2"
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
      </div>
    );
}

export default memo(Column);