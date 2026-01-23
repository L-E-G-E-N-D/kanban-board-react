
function ActivityMonitor({ activities }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-colors">
      <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200 uppercase tracking-wider mb-3">
        Recent Activity
      </h3>
      {activities.length === 0 ? (
        <p className="text-xs text-gray-500 dark:text-gray-400 italic">No recent activity</p>
      ) : (
        <ul className="space-y-2">
          {activities.map((activity, index) => (
            <li key={index} className="text-xs text-gray-600 dark:text-gray-300 border-l-2 border-blue-500 pl-2">
              {activity}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ActivityMonitor;
