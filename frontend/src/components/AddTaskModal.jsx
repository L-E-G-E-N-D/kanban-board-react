import { useState } from "react";
import { X, Calendar, AlertCircle, FileText } from "lucide-react";

function AddTaskModal({ isOpen, onClose, onAddTask }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") return;
    

    onAddTask(title, description, priority, dueDate);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    onClose();
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate("");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] px-4 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div 
        className="glass-dark rounded-[2.5rem] shadow-2xl w-full max-w-lg border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-8 border-b border-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Add Task</h2>
            <p className="text-xs text-gray-500 mt-1">Define the next step for your project</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition"
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
              className="w-full bg-white/[0.03] border border-white/5 text-white placeholder:text-gray-600 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all shadow-inner"
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
              className="w-full bg-white/[0.03] border border-white/5 text-white placeholder:text-gray-600 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all shadow-inner resize-none"
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
                className="w-full bg-white/[0.03] border border-white/5 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
              >
                <option value="low" className="bg-[#0a0a0a]">Low</option>
                <option value="medium" className="bg-[#0a0a0a]">Medium</option>
                <option value="high" className="bg-[#0a0a0a]">High</option>
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
                className="w-full bg-white/[0.03] border border-white/5 text-white rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all cursor-pointer"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-4 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-2xl transition-all"
            >
              Discard
            </button>
            <button
              type="submit"
              className="flex-2 px-10 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-[0.98]"
            >
              Add to Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddTaskModal;
