import Task from "./Task";
import { Droppable } from "@hello-pangea/dnd";


function Column({title, tasks, onMove}) {
    const status = title.toLowerCase().replace(" ", "");
    return (
    <Droppable droppableId={status}>
        {(provided) => (
        <div
          className="column"
          {...provided.droppableProps}
          ref={provided.innerRef}
        >
            <h2>{title}</h2>

            {tasks.map((task,index) => (
                <Task 
                key={task._id} 
                task={task} 
                onMove={onMove} 
                index={index} 
                />
            ))}
            {provided.placeholder}
        </div>
        )}
    </Droppable>
    );
}

export default Column;