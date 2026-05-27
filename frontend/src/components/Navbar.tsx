import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, FileText, ChevronRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const isLanding = location.pathname === '/';

  if (!isLanding && 
      [
        '/templates', 
        '/payment', 
        '/download', 
        '/review', 
        '/success', 
        '/linkedin-import', 
        '/linkedin-enhance', 
        '/linkedin', 
        '/jd'
      ].includes(location.pathname)) {
    return null;
  }

  if (['/builder', '/enhance'].includes(location.pathname)) {
    // Show progress bar for builder flow
    return <BuilderNavbar />;
  }

  return (
    <nav className="border-b border-zinc-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-black text-white p-1.5 rounded-lg">
          <FileText size={20} />
        </div>
        <span className="font-display font-bold text-xl tracking-tight text-black">ResuMate AI</span>
      </Link>
      
      {isLanding && (
        <div className="hidden md:flex items-center gap-8 font-medium text-sm text-zinc-600">
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-black transition-colors">How it Works</a>
          <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
        </div>
      )}

      <div className="flex items-center gap-4">
        {loading ? (
          <span style={{fontSize:'13px', color:'#6b7280'}}>Loading...</span>
        ) : user ? (
          <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
            <div style={{
              width:'36px', height:'36px', borderRadius:'50%',
              background:'linear-gradient(135deg, #4F46E5, #7C3AED)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'white', fontWeight:'700', fontSize:'14px'
            }}>
              {(user.user_metadata?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
            </div>
            <span style={{fontSize:'14px', fontWeight:'500', color:'#111'}}>
              {user.user_metadata?.full_name || user.email}
            </span>
            <button
              onClick={async () => { await signOut(); navigate('/') }}
              style={{
                padding:'8px 16px', border:'1px solid #e5e7eb',
                borderRadius:'8px', backgroundColor:'white',
                fontSize:'13px', fontWeight:'500', cursor:'pointer', color:'#6b7280'
              }}
            >Sign Out</button>
          </div>
        ) : (
          <div style={{display:'flex', gap:'8px'}}>
            <button
              onClick={() => navigate('/login')}
              style={{
                padding:'8px 20px', border:'1px solid #e5e7eb',
                borderRadius:'10px', backgroundColor:'white',
                fontSize:'14px', fontWeight:'500', cursor:'pointer'
              }}
            >Log in</button>
            <button
              onClick={() => navigate('/signup')}
              style={{
                padding:'8px 20px', border:'none',
                borderRadius:'10px',
                background:'linear-gradient(135deg, #4F46E5, #7C3AED)',
                color:'white', fontSize:'14px',
                fontWeight:'600', cursor:'pointer'
              }}
            >Get Started</button>
          </div>
        )}
      </div>
    </nav>
  );
};

const BuilderNavbar = () => {
  const location = useLocation();
  const steps = [
    { name: 'Build', path: '/builder' },
    { name: 'AI Enhance', path: '/enhance' },
    { name: 'Review', path: '/review' },
  ];

  const currentIndex = steps.findIndex(s => s.path === location.pathname);

  return (
    <nav className="border-b border-zinc-100 py-4 px-6 md:px-12 flex items-center justify-between sticky top-0 bg-white z-50">
      <Link to="/" className="flex items-center gap-2">
        <div className="bg-black text-white p-1.2 rounded-md">
          <FileText size={18} />
        </div>
        <span className="font-display font-bold text-lg tracking-tight hidden sm:inline">ResuMate AI</span>
      </Link>

      <div className="flex items-center gap-2 md:gap-8 overflow-x-auto no-scrollbar">
        {steps.map((step, idx) => (
          <div key={step.path} className="flex items-center gap-2 whitespace-nowrap">
            <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
              idx <= currentIndex ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-400'
            }`}>
              {idx + 1}
            </span>
            <span className={`text-sm font-medium ${
              idx <= currentIndex ? 'text-black' : 'text-zinc-400'
            }`}>
              {step.name}
            </span>
            {idx < steps.length - 1 && (
              <div className="w-4 md:w-8 h-[1px] bg-zinc-200" />
            )}
          </div>
        ))}
      </div>

      <Link to="/" className="text-sm font-medium text-zinc-500 hover:text-black">Save & Exit</Link>
    </nav>
  );
};
