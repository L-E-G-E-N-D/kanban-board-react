import Task from "./Task";

function Column({title, tasks, onMove}) {
    return (
        <div>
            <h2>{title}</h2>

            {tasks.map(task => (
                <Task key={task.id} task={task} onMove={onMove} />
            ))}
        </div>
    );
}

export default Column;