import { Clock, AlertCircle } from 'lucide-react';
import Badge from './Badge';

export default function TaskItem({ task }) {
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'Done';

  return (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-0 group">
      <div className="flex items-center space-x-4">
        <div className={`w-2 h-2 rounded-full ${
          task.status === 'Done' ? 'bg-emerald-500' : 
          task.status === 'In Progress' ? 'bg-amber-500' : 
          'bg-slate-300'
        }`} />
        <div>
          <p className={`text-sm font-medium ${isOverdue ? 'text-rose-600' : 'text-slate-900'} group-hover:text-indigo-600 transition-colors`}>
            {task.title}
          </p>
          {task.assigned_name && (
            <p className="text-[10px] text-slate-400 mt-0.5">Assigned to: {task.assigned_name}</p>
          )}
          <div className="flex items-center space-x-3 mt-1">
            <Badge variant={
              task.status === 'Done' ? 'success' : 
              task.status === 'In Progress' ? 'warning' : 
              'default'
            }>
              {task.status}
            </Badge>
            {task.deadline && (
              <span className={`flex items-center text-xs ${isOverdue ? 'text-rose-500 font-medium' : 'text-slate-400'}`}>
                {isOverdue ? <AlertCircle className="w-3 h-3 mr-1" /> : <Clock className="w-3 h-3 mr-1" />}
                {new Date(task.deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
