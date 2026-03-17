import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

function StatsPanel({ tasks }) {
  const stats = useMemo(() => {
    const data = [
      { name: "To Do", value: tasks.filter((t) => t.status === "todo").length, color: "#64748b" },
      { name: "Doing", value: tasks.filter((t) => t.status === "doing").length, color: "#475569" },
      { name: "Done", value: tasks.filter((t) => t.status === "done").length, color: "#1e293b" },
    ];
    return {
      total: tasks.length,
      data: data.filter(d => d.value > 0)
    };
  }, [tasks]);

  return (
    <div className="flex flex-col gap-4">
      <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase mb-1">Total Tasks</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{stats.total}</p>
        
        {stats.total > 0 && (
          <div className="h-32 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.data}
                  innerRadius={25}
                  outerRadius={40}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '10px', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-2">
        {stats.data.map((s, i) => (
           <div key={i} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900/50 rounded-md border border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: s.color }}></div>
                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{s.name}</span>
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{s.value}</span>
           </div>
        ))}
      </div>
    </div>
  );
}

export default StatsPanel;
