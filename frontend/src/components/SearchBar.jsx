
function SearchBar({ searchQuery, onSearchChange, activeFilter, onFilterChange }) {
  const filters = ["all", "todo", "doing", "done"];

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
      {/* Search Input */}
      <div className="relative w-full sm:w-64">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-200 dark:border-gray-600 shadow-sm transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-2 top-1/2 -trangray-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg border border-gray-200 dark:border-gray-600">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-3 py-1.5 text-xs font-medium rounded transition-colors uppercase ${
              activeFilter === filter
                ? "bg-white dark:bg-gray-600 text-blue-600 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600/50"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchBar;
