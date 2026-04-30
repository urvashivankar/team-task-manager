import { Link } from 'react-router-dom';
import { Folder, Users } from 'lucide-react';
import Card from './Card';

export default function ProjectCard({ project }) {
  return (
    <Link to={`/projects/${project._id}`} className="block group">
      <Card className="h-full hover:border-indigo-300 transition-all duration-300 hover:shadow-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Folder className="w-5 h-5" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{project.name}</h3>
          <p className="mt-2 text-sm text-slate-500 line-clamp-2 leading-relaxed">{project.description || 'No description provided.'}</p>
          
          <div className="mt-6 flex -space-x-2 overflow-hidden">
            {project.members_details?.slice(0, 5).map((m, i) => (
              <div key={i} className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-600 uppercase" title={m.name}>
                {m.name.charAt(0)}
              </div>
            ))}
            {project.members?.length > 5 && (
              <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-600">
                +{project.members.length - 5}
              </div>
            )}
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <Users className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
              {project.members?.length || 0} Members
            </span>
            <span className="flex items-center text-slate-400">
              <span className="w-1 h-1 rounded-full bg-slate-300 mr-2" />
              {project.task_count || 0} Tasks
            </span>
          </div>
          <span className="font-bold text-indigo-600">View Tasks →</span>
        </div>
      </Card>
    </Link>
  );
}
