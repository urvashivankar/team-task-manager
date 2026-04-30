import { useState } from 'react';
import { X, User as UserIcon, Calendar, AlertCircle, CheckCircle2, Clock, AlignLeft, Info } from 'lucide-react';
import Card from './Card';
import Badge from './Badge';

export default function TaskForm({ projectMembers, onSubmit, onCancel, currentUser }) {
  const [task, setTask] = useState({
    title: '',
    description: '',
    assigned_to: '',
    deadline: '',
    status: 'Todo'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter project members: Show only "Member" role and exclude current admin if requested
  // However, usually admins want to assign to anyone in the project. 
  // The user specifically asked to exclude admin ideally.
  const filteredMembers = projectMembers.filter(m => m.role === 'Member');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!task.title.trim()) {
      setError('Task title is required');
      return;
    }
    if (!task.deadline) {
      setError('Please set a deadline');
      return;
    }
    if (!task.assigned_to) {
      setError('Please assign this task to a team member');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(task);
    } catch (err) {
      setError('Failed to create task. Please try again.');
      setIsSubmitting(false);
    }
  };

  const selectedMember = filteredMembers.find(m => m._id === task.assigned_to);

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-[100] animate-in fade-in duration-200">
      <Card className="max-w-md w-full shadow-2xl p-0 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-50 p-2 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Create New Task</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Project Management</p>
            </div>
          </div>
          <button 
            onClick={onCancel}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-600 text-xs rounded-xl flex items-center animate-in slide-in-from-top-2">
              <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          {/* Title Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center">
              <Info className="w-3.5 h-3.5 mr-1.5" /> TASK TITLE
            </label>
            <input 
              autoFocus
              className={`w-full bg-slate-50 border ${error && !task.title ? 'border-rose-200' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400`}
              value={task.title}
              onChange={e => setTask({ ...task, title: e.target.value })}
              placeholder="e.g. Design Landing Page"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center">
              <AlignLeft className="w-3.5 h-3.5 mr-1.5" /> DESCRIPTION
            </label>
            <textarea 
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all placeholder:text-slate-400 min-h-[80px]"
              value={task.description}
              onChange={e => setTask({ ...task, description: e.target.value })}
              placeholder="Add some details about this task..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1.5" /> STATUS
              </label>
              <div className="relative">
                <select 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none appearance-none cursor-pointer"
                  value={task.status}
                  onChange={e => setTask({ ...task, status: e.target.value })}
                >
                  <option value="Todo">TODO</option>
                  <option value="In Progress">IN PROGRESS</option>
                  <option value="Done">DONE</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            {/* Deadline Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 flex items-center">
                <Calendar className="w-3.5 h-3.5 mr-1.5" /> DEADLINE
              </label>
              <input 
                type="date"
                className={`w-full bg-slate-50 border ${error && !task.deadline ? 'border-rose-200' : 'border-slate-200'} rounded-xl px-4 py-2 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none transition-all`}
                value={task.deadline}
                onChange={e => setTask({ ...task, deadline: e.target.value })}
              />
            </div>
          </div>

          {/* Assignee Select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 flex items-center">
              <UserIcon className="w-3.5 h-3.5 mr-1.5" /> ASSIGN TO MEMBER
            </label>
            <div className="relative">
              <select 
                className={`w-full bg-slate-50 border ${error && !task.assigned_to ? 'border-rose-200' : 'border-slate-200'} rounded-xl px-4 py-2.5 text-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-600 outline-none appearance-none cursor-pointer`}
                value={task.assigned_to}
                onChange={e => setTask({ ...task, assigned_to: e.target.value })}
              >
                <option value="">Select a member...</option>
                {filteredMembers.map(u => (
                  <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
            
            {selectedMember && (
              <div className="mt-2 flex items-center p-2 bg-indigo-50/50 rounded-lg border border-indigo-100 animate-in fade-in slide-in-from-left-2">
                <div className="h-6 w-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold uppercase mr-2 shadow-sm">
                  {selectedMember.name.charAt(0)}
                </div>
                <span className="text-xs font-semibold text-indigo-700">{selectedMember.name} will be assigned</span>
              </div>
            )}
            
            {filteredMembers.length === 0 && (
              <p className="text-[10px] text-rose-500 font-medium">
                No members in this project yet. Add members first to assign tasks.
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="pt-4 flex space-x-3">
            <button 
              type="button" 
              onClick={onCancel}
              className="flex-1 py-2.5 text-sm font-bold text-slate-500 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className={`flex-[2] py-2.5 bg-indigo-600 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                'Create Task'
              )}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
