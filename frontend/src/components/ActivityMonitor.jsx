
function ActivityMonitor({ activities }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 transition-colors">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">
        Recent Activity
      </h3>
      {activities.length === 0 ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">No recent activity</p>
      ) : (
        <ul className="space-y-2">
          {activities.map((activity, index) => (
            <li key={index} className="text-xs text-slate-600 dark:text-slate-300 border-l-2 border-slate-500 pl-2">
              {activity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityMonitor;
