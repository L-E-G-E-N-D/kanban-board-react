import { Search, X, Filter } from "lucide-react";

export default function SearchBar({ searchQuery, onSearchChange, activeFilter, onFilterChange }) {
  const filters = ["all", "todo", "doing", "done"];

  return (
    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center w-full">
      {/* Search Input */}
      <div className="relative flex-1 group">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-500 group-focus-within:text-indigo-400 transition-colors">
          <Search className="w-4 h-4" />
        </div>
        <input
          type="text"
          placeholder="Search for tasks, descriptions, or tags..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white/[0.03] border border-white/5 text-white placeholder:text-gray-500 text-sm rounded-xl pl-11 pr-10 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all shadow-inner"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 custom-scrollbar">
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/5 rounded-xl">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-4 py-2 text-[10px] font-bold rounded-lg transition-all uppercase tracking-widest whitespace-nowrap ${
                activeFilter === filter
                  ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] scale-105"
                  : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
        
        <button className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition hidden sm:flex">
          <Filter className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
