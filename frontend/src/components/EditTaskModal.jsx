import { useEffect, useState } from "react";
import { X, Calendar, AlertCircle, FileText, Save } from "lucide-react";

function EditTaskModal({ isOpen, task, onClose, onSave }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    if (isOpen && task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setPriority(task.priority || "medium");
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
    }
  }, [isOpen, task]);

  if (!isOpen || !task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") return;
    onSave(title, description, priority, dueDate);
  };

  const handleClose = () => {
    setTitle(task?.title || "");
    setDescription(task?.description || "");
    setPriority(task?.priority || "medium");
    setDueDate(task?.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] px-4 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div
        className="glass rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-8 border-b border-gray-100 dark:border-white/5">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Edit Task</h2>
            <p className="text-xs text-gray-500 mt-1">Refine the details of your task</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">
              <FileText className="w-3 h-3" />
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all shadow-inner"
              required
              autoFocus
              autoComplete="off"
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details or notes..."
              rows={3}
              className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-600 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all shadow-inner resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">
                <AlertCircle className="w-3 h-3" />
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="low" className="bg-white dark:bg-[#0a0a0a]">Low</option>
                <option value="medium" className="bg-white dark:bg-[#0a0a0a]">Medium</option>
                <option value="high" className="bg-white dark:bg-[#0a0a0a]">High</option>
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3">
                <Calendar className="w-3 h-3" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5 text-gray-900 dark:text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-4 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;
