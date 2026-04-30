import { Link, Navigate } from 'react-router-dom';
import { Command, CheckCircle2, LayoutDashboard, Zap, Shield, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between relative z-10">
        <div className="flex items-center space-x-2">
          <Command className="w-8 h-8 text-indigo-600" />
          <span className="text-xl font-bold text-slate-900 tracking-tight">TeamTask</span>
        </div>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors">Sign in</Link>
          <Link to="/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-all shadow-sm">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-50 border border-indigo-100 rounded-full mb-8">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Now in Beta</span>
          </div>
          
          <h1 className="text-5xl sm:text-7xl font-extrabold text-slate-900 tracking-tight mb-6">
            Manage tasks with <br />
            <span className="text-indigo-600">effortless precision.</span>
          </h1>
          
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
            TeamTask is the minimal project management tool designed for fast-moving teams. 
            No clutter, just productivity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white rounded-xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 flex items-center justify-center">
              Start for free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link to="/login" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl text-lg font-bold hover:bg-slate-50 transition-all shadow-sm">
              Live Demo
            </Link>
          </div>

          {/* Abstract background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-300 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-300 rounded-full blur-[120px]"></div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-40">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<LayoutDashboard className="w-6 h-6" />}
              title="Kanban Focus"
              description="Visualize your progress with our streamlined Kanban board. Move tasks seamlessly from Todo to Done."
            />
            <FeatureCard 
              icon={<Shield className="w-6 h-6" />}
              title="Role-Based Security"
              description="Full Admin and Member roles. Control who creates projects and who manages task updates."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="w-6 h-6" />}
              title="Real-time Analytics"
              description="Track team velocity and overdue tasks with our smart dashboard metrics."
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2 opacity-60">
            <Command className="w-5 h-5 text-slate-900" />
            <span className="text-sm font-bold text-slate-900">TeamTask</span>
          </div>
          <p className="text-slate-400 text-sm">© 2026 TeamTask Inc. Built for high-performance teams.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
      <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{description}</p>
    </div>
  );
}
