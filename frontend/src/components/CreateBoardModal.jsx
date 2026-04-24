import { useState } from "react";
import { X } from "lucide-react";

function CreateBoardModal({ isOpen, onClose, onCreateBoard }) {
  const [name, setName] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim() === "") return;
    
    onCreateBoard(name);
    setName("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-[100] px-4 animate-in fade-in duration-300"
      onClick={handleClose}
    >
      <div 
        className="glass-dark rounded-[2rem] shadow-2xl w-full max-w-md border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-8 border-b border-white/5">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Create Board</h2>
            <p className="text-xs text-gray-500 mt-1">Organize your projects in a new workspace</p>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-white/5 text-gray-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8">
          <div className="mb-8">
            <label
              htmlFor="name"
              className="block text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] mb-3"
            >
              Workspace Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Marketing Launch, Q3 Roadmap..."
              className="w-full bg-white/[0.03] border border-white/5 text-white placeholder:text-gray-600 rounded-xl px-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/30 transition-all shadow-inner"
              required
              autoFocus
              autoComplete="off"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-3.5 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 active:scale-[0.98]"
            >
              Build Board
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBoardModal;
