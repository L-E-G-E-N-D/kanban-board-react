import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

function StatsPanel({ tasks, analytics }) {
  const stats = useMemo(() => {
    const statusColors = {
        "To Do": "#6366f1", // Indigo
        "Doing": "#a855f7", // Purple
        "Done": "#10b981", // Emerald
        "todo": "#6366f1",
        "doing": "#a855f7",
        "done": "#10b981"
    };

    if (analytics) {
      const chartData = Array.isArray(analytics.byStatus) ? analytics.byStatus : [];
      const withColors = chartData.map((item) => ({
        ...item,
        color: statusColors[item.name] || "#64748b",
      }));

      return {
        total: analytics.total || 0,
        completed: analytics.completed || 0,
        pending: analytics.pending || 0,
        data: withColors,
      };
    }

    const data = [
      { name: "To Do", value: tasks.filter((t) => t.status === "todo").length, color: statusColors["todo"] },
      { name: "Doing", value: tasks.filter((t) => t.status === "doing").length, color: statusColors["doing"] },
      { name: "Done", value: tasks.filter((t) => t.status === "done").length, color: statusColors["done"] },
    ];

    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "done").length,
      pending: tasks.filter((t) => t.status !== "done").length,
      data: data.filter((d) => d.value > 0),
    };
  }, [tasks, analytics]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5 p-4 rounded-2xl">
          <p className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider mb-1">Total</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
        <div className="bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10 p-4 rounded-2xl">
          <p className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-500/60 tracking-wider mb-1">Done</p>
          <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</p>
        </div>
      </div>

      <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-100 dark:border-amber-500/10 p-4 rounded-2xl">
          <p className="text-[10px] uppercase font-bold text-amber-600 dark:text-amber-500/60 tracking-wider mb-1">Pending Tasks</p>
          <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
          <div className="w-full bg-gray-200 dark:bg-white/5 h-1.5 rounded-full mt-3 overflow-hidden">
             <div 
                className="bg-amber-500 h-full rounded-full transition-all duration-1000" 
                style={{ width: `${stats.total > 0 ? (stats.pending / stats.total) * 100 : 0}%` }}
             />
          </div>
      </div>

      {stats.total > 0 && (
        <div className="space-y-6">
          <div className="h-48 bg-white/[0.02] rounded-2xl border border-white/5 p-4 relative overflow-hidden group">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={stats.data} 
                  innerRadius={50} 
                  outerRadius={70} 
                  paddingAngle={8} 
                  dataKey="value"
                  stroke="none"
                >
                  {stats.data.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                      backgroundColor: "var(--card)", 
                      border: "1px solid var(--border)", 
                      borderRadius: "12px", 
                      backdropFilter: "blur(8px)",
                      fontSize: "12px", 
                      color: "var(--foreground)" 
                  }}
                  itemStyle={{ color: "var(--foreground)" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-20">
                <span className="text-xl font-bold text-gray-900 dark:text-white leading-none">
                    {Math.round(stats.total > 0 ? (stats.completed / stats.total) * 100 : 0)}%
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-400 uppercase font-bold tracking-tighter mt-1">Efficiency</span>
            </div>
          </div>

          <div className="h-48 bg-white/[0.02] rounded-2xl border border-white/5 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.data}>
                <XAxis 
                  dataKey="name" 
                  tick={{ fontSize: 10, fill: '#6b7280', fontWeight: 'bold' }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <YAxis 
                  allowDecimals={false} 
                  tick={{ fontSize: 10, fill: '#6b7280' }} 
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip
                   cursor={{ fill: 'rgba(0, 0, 0, 0.05)', className: 'dark:fill-white/5' }}
                   contentStyle={{ 
                       backgroundColor: "var(--card)", 
                       border: "1px solid var(--border)", 
                       borderRadius: "12px", 
                       fontSize: "12px",
                       color: "var(--foreground)"
                   }}
                   itemStyle={{ color: "var(--foreground)" }}
                />
                <Bar 
                  dataKey="value" 
                  radius={[8, 8, 0, 0]} 
                >
                  {stats.data.map((entry, index) => (
                    <Cell key={`bar-${index}`} fill={entry.color} opacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}

export default StatsPanel;
