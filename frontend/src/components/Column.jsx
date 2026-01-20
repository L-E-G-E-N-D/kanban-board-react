import Task from "./Task";
import { Droppable } from "@hello-pangea/dnd";


function Column({title, tasks, onMove, onDelete}) {
    const status = title.toLowerCase().replace(" ", "");
    return (
      <Droppable droppableId={status}>
        {(provided) => (
          <div
            className="bg-white rounded-xl shadow-sm p-4 w-80 border border-gray-200"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            <h2 className="text-lg font-semibold mb-4 text-gray-700 tracking-wide">
              {title}
            </h2>

            {tasks.map((task, index) => (
              <Task key={task._id} task={task} onMove={onMove} onDelete={onDelete} index={index} />
            ))}
            {tasks.length === 0 && (
              <p className="text-sm text-gray-400 italic">Drop tasks here</p>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    );
}

export default Column;