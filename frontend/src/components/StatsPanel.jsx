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
    if (analytics) {
      const chartData = Array.isArray(analytics.byStatus) ? analytics.byStatus : [];
      const withColors = chartData.map((item) => ({
        ...item,
        color:
          item.name === "To Do"
            ? "#64748b"
            : item.name === "Doing"
            ? "#475569"
            : "#1e293b",
      }));

      return {
        total: analytics.total || 0,
        completed: analytics.completed || 0,
        pending: analytics.pending || 0,
        data: withColors,
      };
    }

    const data = [
      { name: "To Do", value: tasks.filter((t) => t.status === "todo").length, color: "#64748b" },
      { name: "Doing", value: tasks.filter((t) => t.status === "doing").length, color: "#475569" },
      { name: "Done", value: tasks.filter((t) => t.status === "done").length, color: "#1e293b" },
    ];

    return {
      total: tasks.length,
      completed: tasks.filter((t) => t.status === "done").length,
      pending: tasks.filter((t) => t.status !== "done").length,
      data: data.filter((d) => d.value > 0),
    };
  }, [tasks, analytics]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2">
        <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
          <p className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400">Total</p>
          <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stats.total}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400">Done</p>
            <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{stats.completed}</p>
          </div>
          <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
            <p className="text-[11px] uppercase font-semibold text-slate-500 dark:text-slate-400">Pending</p>
            <p className="text-lg font-bold text-amber-600 dark:text-amber-400">{stats.pending}</p>
          </div>
        </div>
      </div>

      {stats.total > 0 && (
        <>
          <div className="h-32 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={stats.data} innerRadius={24} outerRadius={40} paddingAngle={4} dataKey="value">
                  {stats.data.map((entry, index) => (
                    <Cell key={`pie-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1e293b", border: "none", borderRadius: "8px", fontSize: "10px", color: "#fff" }}
                  itemStyle={{ color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="h-32 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.data}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#334155" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

export default StatsPanel;
