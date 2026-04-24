import { Clock } from "lucide-react";

function ActivityMonitor({ activities }) {
  return (
    <div className="space-y-4">
      {activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 opacity-40">
           <Clock className="w-8 h-8 text-gray-500 mb-2" />
           <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest italic">Silent Waters</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-transparent rounded-full" />
          
          <ul className="space-y-6">
            {activities.map((activity, index) => (
              <li key={activity._id || index} className="relative pl-8 group">
                {/* Dot */}
                <div className="absolute left-0 top-1.5 w-6 h-6 rounded-full bg-[#0a0a0a] border border-white/10 flex items-center justify-center z-10 group-hover:border-indigo-500/50 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                </div>
                
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] text-gray-300 leading-tight">
                      <span className="font-bold text-white">
                        {activity.userId?.name || "System"}
                      </span>{" "}
                      <span className="text-gray-500">{activity.action}</span>
                    </p>
                    <span className="text-[9px] font-bold text-gray-600 whitespace-nowrap">
                      {new Date(activity.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  
                  {activity.details && (
                    <div className="bg-white/[0.03] border border-white/5 rounded-lg px-3 py-2 mt-1">
                      <p className="text-[10px] text-gray-400 italic leading-relaxed">
                        "{activity.details}"
                      </p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ActivityMonitor;
