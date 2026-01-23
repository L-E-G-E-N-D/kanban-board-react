
import { useMemo } from "react";

function StatsPanel({ tasks }) {
  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((t) => t.status === "todo").length,
      doing: tasks.filter((t) => t.status === "doing").length,
      done: tasks.filter((t) => t.status === "done").length,
    };
  }, [tasks]);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <p className="text-sm font-medium text-gray-500 uppercase">Total Tasks</p>
        <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-gray-400">
        <p className="text-sm font-medium text-gray-500 uppercase">To Do</p>
        <p className="text-2xl font-bold text-gray-800">{stats.todo}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-blue-500">
        <p className="text-sm font-medium text-gray-500 uppercase">Doing</p>
        <p className="text-2xl font-bold text-gray-800">{stats.doing}</p>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 border-l-4 border-l-green-500">
        <p className="text-sm font-medium text-gray-500 uppercase">Done</p>
        <p className="text-2xl font-bold text-gray-800">{stats.done}</p>
      </div>
    </div>
  );
}

export default StatsPanel;
