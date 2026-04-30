import { useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Clock, AlertCircle, LayoutDashboard, ListTodo } from 'lucide-react';
import Card from '../components/Card';
import TaskItem from '../components/TaskItem';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks/');
        setTasks(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, []);

  const todoTasks = tasks.filter(t => t.status === 'Todo');
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress');
  const doneTasks = tasks.filter(t => t.status === 'Done');
  const overdueTasks = tasks.filter(t => 
    t.status !== 'Done' && t.deadline && new Date(t.deadline) < new Date()
  );

  const myTasks = tasks.filter(t => t.assigned_to === user._id);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Hello, {user.name}. Here's what's happening today.</p>
      </header>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={<ListTodo className="w-5 h-5 text-slate-500" />} title="To Do" value={todoTasks.length} />
        <StatCard icon={<Clock className="w-5 h-5 text-amber-500" />} title="In Progress" value={inProgressTasks.length} />
        <StatCard icon={<CheckCircle2 className="w-5 h-5 text-emerald-500" />} title="Completed" value={doneTasks.length} />
        <StatCard icon={<AlertCircle className="w-5 h-5 text-rose-500" />} title="Overdue" value={overdueTasks.length} variant="danger" />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">My Tasks</h2>
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{myTasks.length} assigned</span>
          </div>
          
          <Card>
            <div className="divide-y divide-slate-100">
              {myTasks.length > 0 ? (
                myTasks.map((task) => <TaskItem key={task._id} task={task} />)
              ) : (
                <div className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3 text-slate-300">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <p className="text-slate-500 font-medium">All caught up!</p>
                  <p className="text-slate-400 text-sm">You have no tasks assigned to you.</p>
                </div>
              )}
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, variant = "default" }) {
  return (
    <Card className="p-5 flex items-center space-x-4">
      <div className={`p-2.5 rounded-lg ${variant === 'danger' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-600'}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </Card>
  );
}
