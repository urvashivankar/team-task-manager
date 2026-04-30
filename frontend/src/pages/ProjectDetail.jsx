import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import { Plus, ArrowLeft, Clock, User as UserIcon, UserPlus, X } from 'lucide-react';
import Card from '../components/Card';
import TaskForm from '../components/TaskForm';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projRes, taskRes, userRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks/?project_id=${id}`),
        api.get('/users/')
      ]);
      setProject(projRes.data);
      setTasks(taskRes.data);
      setAllUsers(userRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    await api.post('/tasks/', { ...taskData, project_id: id });
    setShowTaskModal(false);
    fetchData();
  };

  const handleAddMember = async (userId) => {
    await api.post(`/projects/${id}/members/${userId}`);
    fetchData();
  };

  const handleRemoveMember = async (userId) => {
    await api.delete(`/projects/${id}/members/${userId}`);
    fetchData();
  };

  const updateTaskStatus = async (taskId, newStatus) => {
    await api.put(`/tasks/${taskId}`, { status: newStatus });
    fetchData();
  };

  if (loading) return <div className="h-64 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div></div>;
  if (!project) return <div className="text-center p-12 text-slate-500">Project not found.</div>;

  const projectMembers = allUsers.filter(u => project.members.includes(u._id));
  const nonMembers = allUsers.filter(u => !project.members.includes(u._id));

  const statuses = [
    { name: 'Todo', color: 'bg-slate-400' },
    { name: 'In Progress', color: 'bg-amber-400' },
    { name: 'Done', color: 'bg-emerald-400' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)]">
      <header className="mb-6">
        <Link to="/projects" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-4 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Projects
        </Link>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            <div className="flex items-center mt-3 space-x-3">
              <div className="flex -space-x-2 overflow-hidden">
                {projectMembers.map(m => (
                  <div key={m._id} className="h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase" title={m.name}>
                    {m.name.charAt(0)}
                  </div>
                ))}
              </div>
              <span className="text-xs font-medium text-slate-400">{projectMembers.length} team members</span>
              {user.role === 'Admin' && (
                <button onClick={() => setShowMemberModal(true)} className="p-1 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all ml-2">
                  <UserPlus className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          {user.role === 'Admin' && (
            <button onClick={() => setShowTaskModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 shadow-sm flex items-center transition-all">
              <Plus className="w-4 h-4 mr-2" /> Add Task
            </button>
          )}
        </div>
      </header>

      <div className="flex-1 flex space-x-6 overflow-x-auto pb-4 custom-scrollbar">
        {statuses.map(status => (
          <div key={status.name} className="flex-1 min-w-[300px] flex flex-col bg-slate-100/40 rounded-2xl border border-slate-200/50 p-2">
            <div className="p-3 flex items-center space-x-2 mb-2">
              <div className={`w-1.5 h-1.5 rounded-full ${status.color}`} />
              <h3 className="font-bold text-xs text-slate-500 uppercase tracking-widest">{status.name}</h3>
              <span className="text-[10px] font-bold bg-white text-slate-400 border border-slate-200 px-1.5 py-0.5 rounded-full">
                {tasks.filter(t => t.status === status.name).length}
              </span>
            </div>
            
            <div className="flex-1 space-y-3 overflow-y-auto p-1 custom-scrollbar">
              {tasks.filter(t => t.status === status.name).map(task => (
                <Card key={task._id} className="p-4 hover:border-indigo-200 transition-colors group">
                  <h4 className="font-semibold text-slate-900 text-sm mb-1 group-hover:text-indigo-600 transition-colors">{task.title}</h4>
                  {task.description && <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">{task.description}</p>}
                  
                  <div className="flex items-center justify-between mt-auto">
                    <select 
                      value={task.status} 
                      onChange={(e) => updateTaskStatus(task._id, e.target.value)}
                      className="text-[10px] font-bold bg-slate-50 text-slate-500 border border-slate-200 rounded px-1.5 py-0.5 outline-none cursor-pointer"
                    >
                      {statuses.map(s => <option key={s.name} value={s.name}>{s.name.toUpperCase()}</option>)}
                    </select>
                    
                    <div className="flex items-center space-x-2">
                      {task.deadline && (
                        <div className={`flex items-center text-[10px] font-medium ${new Date(task.deadline) < new Date() && task.status !== 'Done' ? 'text-rose-500' : 'text-slate-400'}`}>
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(task.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                      )}
                      <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase ring-1 ring-slate-200" title={`Assigned to: ${task.assigned_name || 'Unassigned'}`}>
                        {task.assigned_name?.charAt(0) || <UserIcon className="w-3 h-3" />}
                      </div>
                    </div>
                  </div>
                  {task.assigned_name && (
                    <p className="text-[9px] text-slate-400 mt-2 italic font-medium">Assigned to: {task.assigned_name}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {showTaskModal && user.role === 'Admin' && (
        <TaskForm 
          projectMembers={projectMembers} 
          onSubmit={handleCreateTask} 
          onCancel={() => setShowTaskModal(false)} 
          currentUser={user}
        />
      )}

      {showMemberModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Team Management</h3>
            <p className="text-sm text-slate-500 mb-6">Manage who has access to this project.</p>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              <section>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Project Members ({projectMembers.length})</h4>
                <div className="space-y-2">
                  {projectMembers.map(m => (
                    <div key={m._id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl group">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs font-bold uppercase">{m.name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{m.name}</p>
                          <p className="text-[10px] text-slate-500">{m.email}</p>
                        </div>
                      </div>
                      {m._id !== project.created_by && (
                        <button onClick={() => handleRemoveMember(m._id)} className="p-1.5 text-slate-300 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              <section>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Add Team Members</h4>
                <div className="space-y-2">
                  {nonMembers.map(u => (
                    <div key={u._id} className="flex items-center justify-between p-3 bg-slate-50/50 hover:bg-slate-50 border border-transparent hover:border-slate-200 rounded-xl transition-all">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-xs font-bold uppercase">{u.name.charAt(0)}</div>
                        <div>
                          <p className="text-sm font-semibold text-slate-700">{u.name}</p>
                          <p className="text-[10px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                      <button onClick={() => handleAddMember(u._id)} className="p-1.5 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-all">
                        <UserPlus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => setShowMemberModal(false)} className="px-6 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-colors">Done</button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
