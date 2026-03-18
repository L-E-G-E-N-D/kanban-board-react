
function ActivityMonitor({ activities }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 p-4 transition-colors">
      <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-4">
        Recent Activity
      </h3>
      {activities.length === 0 ? (
        <p className="text-xs text-slate-500 dark:text-slate-400 italic">No recent activity</p>
      ) : (
        <ul className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
          {activities.map((activity, index) => (
            <li key={activity._id || index} className="text-[11px] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2">
              <span className="font-semibold text-slate-900 dark:text-white">
                {activity.userId?.name || "Someone"}
              </span>{" "}
              {activity.action || "updated board"}
              {activity.details && (
                <span className="text-slate-500 italic block mt-1">
                  "{activity.details}"
                </span>
              )}
              <span className="text-[10px] text-slate-400 block mt-1">
                {activity.createdAt
                  ? new Date(activity.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                  : ""}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityMonitor;
