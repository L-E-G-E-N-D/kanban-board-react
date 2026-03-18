
function ActivityMonitor({ activities }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 p-4 transition-colors">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-3">
        Recent Activity
      </h3>
      {activities.length === 0 ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">No recent activity</p>
      ) : (
        <ul className="space-y-3">
          {activities.map((activity, index) => (
            <li key={activity._id || index} className="text-[11px] text-slate-600 dark:text-slate-300 border-l-2 border-indigo-500 pl-3 leading-relaxed">
              <span className="font-semibold text-slate-900 dark:text-white">
                {activity.userId?.name || "Someone"}
              </span>{" "}
              {activity.action}
              {activity.details && (
                <span className="text-slate-500 italic block mt-0.5 ml-1">
                  "{activity.details}"
                </span>
              )}
              <span className="text-[10px] text-slate-400 block mt-1">
                {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityMonitor;
