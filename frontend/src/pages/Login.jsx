import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Command } from 'lucide-react';
import Card from '../components/Card';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 px-4">
      <div className="mb-8 flex items-center justify-center space-x-2">
        <Command className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-slate-900">TeamTask</h1>
      </div>
      
      <Card className="max-w-md w-full p-8">
        <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">Welcome back</h2>
        <p className="text-slate-500 text-sm mb-6 text-center">Sign in to your account to continue</p>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-rose-50 border border-rose-100 text-rose-600 text-sm p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email address</label>
            <input 
              type="email" 
              required 
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm"
              placeholder="you@example.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required 
              className="w-full bg-white border border-slate-200 text-slate-900 rounded-lg px-3.5 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all text-sm"
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm transition-all"
          >
            Sign in
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <span className="text-slate-500">Don't have an account? </span>
          <Link to="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700">Create one now</Link>
        </div>
      </Card>
    </div>
  );
}
