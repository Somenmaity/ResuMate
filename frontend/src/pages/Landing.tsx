import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  FileText, 
  Linkedin, 
  Briefcase,
  Zap,
  Globe,
  Search,
  Pencil,
  Target,
  Check
} from 'lucide-react';

export const Landing = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleOptionClick = async (path: string) => {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) {
      navigate(path)
    } else {
      navigate('/login')
    }
  }

  return (
    <div className="bg-white">
      {/* New Hero Section: Choose Your Path */}
      <section className="relative pt-20 pb-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="text-blue-600 font-bold uppercase tracking-widest text-xs mb-4">Choose Your Path</h3>
              <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6">
                How do you want to build your resume?
              </h1>
              <p className="text-lg text-zinc-500">Select an option — takes less than 5 minutes</p>
            </motion.div>
          </div>

          {!user && (
            <div style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '14px',
              padding: '16px 24px',
              margin: '0 auto 32px',
              maxWidth: '700px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '20px' }}>🔒</span>
                <div>
                  <p style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: '#1e40af' }}>
                    Sign in to build your resume
                  </p>
                  <p style={{ margin: 0, fontSize: '13px', color: '#3b82f6' }}>
                    Free account required to access resume builder
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => navigate('/login')}
                  style={{
                    padding: '8px 20px',
                    border: '1.5px solid #3b82f6',
                    borderRadius: '8px',
                    backgroundColor: 'white',
                    color: '#3b82f6',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >Log In</button>
                <button
                  onClick={() => navigate('/signup')}
                  style={{
                    padding: '8px 20px',
                    border: 'none',
                    borderRadius: '8px',
                    background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
                    color: 'white',
                    fontSize: '14px',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >Sign Up Free</button>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-8 items-stretch">
            {/* Card 1: Build Manually */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group flex flex-col bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-amber-50 rounded-2xl text-amber-500">
                  <Pencil size={32} />
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Most Popular
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-3">Build Manually</h2>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                Fill details step by step with AI help at every stage to ensure quality.
              </p>
              <ul className="space-y-4 mb-10 flex-grow text-sm font-medium text-zinc-600">
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-green-500" />
                  Step-by-step guidance
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-green-500" />
                  Live preview
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-green-500" />
                  AI enhancement
                </li>
              </ul>
              <button onClick={() => handleOptionClick('/templates')} className="btn-primary w-full flex items-center justify-center gap-2 mt-auto">
                Start Building
                <ArrowRight size={18} />
              </button>
            </motion.div>

            {/* Card 2: Optimize for Job */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group flex flex-col bg-white border-2 border-blue-500 rounded-3xl p-8 shadow-xl shadow-blue-500/5 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-500">
                  <Target size={32} />
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  AI Powered
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-3">Optimize for Job</h2>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                Paste a Job Description and our AI will tailor your resume to match exactly what recruiters want.
              </p>
              <ul className="space-y-4 mb-10 flex-grow text-sm font-medium text-zinc-600">
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-blue-500" />
                  Paste job description
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-blue-500" />
                  Resume upload optional
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-blue-500" />
                  ATS score boost
                </li>
              </ul>
              <button onClick={() => handleOptionClick('/jd')} className="btn-primary w-full flex items-center justify-center gap-2 mt-auto">
                Upload JD
                <ArrowRight size={18} />
              </button>
            </motion.div>

            {/* Card 3: Import from LinkedIn */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group flex flex-col bg-white border border-zinc-100 rounded-3xl p-8 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-8">
                <div className="p-4 bg-zinc-50 rounded-2xl text-[#0A66C2]">
                  <Linkedin size={32} />
                </div>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                  Fastest
                </span>
              </div>
              <h2 className="text-2xl font-bold mb-3">Import LinkedIn</h2>
              <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                Connect your LinkedIn profile and auto-fill your entire resume in seconds.
              </p>
              <ul className="space-y-4 mb-10 flex-grow text-sm font-medium text-zinc-600">
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#0A66C2]" />
                  One-click import
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#0A66C2]" />
                  Auto-fills all sections
                </li>
                <li className="flex items-center gap-3">
                  <Check size={16} className="text-[#0A66C2]" />
                  AI optimization
                </li>
              </ul>
              <button onClick={() => handleOptionClick('/linkedin')} className="bg-[#0A66C2] text-white px-6 py-3 rounded-full font-medium transition-all hover:bg-[#004182] flex items-center justify-center gap-2 mt-auto">
                Connect LinkedIn
                <ArrowRight size={18} />
              </button>
            </motion.div>
          </div>

          <div className="mt-12 text-center">
            <p className="text-zinc-400 text-sm font-medium">
              No credit card required • Free to start
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-zinc-50">
        <div className="container mx-auto px-6 text-center mb-16">
          <h2 className="font-display text-4xl font-bold mb-4">Everything you need to land the job</h2>
          <p className="text-zinc-500 max-w-2xl mx-auto">From professional templates to AI-enhanced content, we've got you covered at every step.</p>
        </div>
        <div className="container mx-auto px-6 grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Zap className="text-yellow-500" />}
            title="AI Enhancement"
            description="Our advanced LLM writes professional bullet points that highlight your metrics and impact."
          />
          <FeatureCard 
            icon={<Search className="text-blue-500" />}
            title="ATS Optimization"
            description="Automatically format your resume to pass applicant tracking systems with flying colors."
          />
          <FeatureCard 
            icon={<Briefcase className="text-purple-500" />}
            title="JD Matching"
            description="Paste a Job Description and we'll tailor your resume specifically for that role."
          />
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-24">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
            <div>
                <h2 className="font-display text-4xl font-bold mb-6">Designed by experts, trusted by professionals.</h2>
                <div className="space-y-4">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 size={24} className="text-green-500 mt-1" />
                        <p className="text-zinc-600 font-medium">100+ Professional templates used by top recruiters</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 size={24} className="text-green-500 mt-1" />
                        <p className="text-zinc-600 font-medium">LinkedIn profile optimization for visibility</p>
                    </div>
                    <div className="flex items-start gap-3">
                        <CheckCircle2 size={24} className="text-green-500 mt-1" />
                        <p className="text-zinc-600 font-medium">Expert feedback and review system</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-100 aspect-square rounded-2xl flex items-center justify-center font-display text-3xl font-bold text-zinc-300">USER 1</div>
                <div className="bg-zinc-900 aspect-square rounded-2xl flex items-center justify-center font-display text-3xl font-bold text-white/10">USER 2</div>
            </div>
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) => (
  <div className="bg-white border border-zinc-100 p-8 rounded-3xl hover:shadow-xl transition-all hover:-translate-y-1">
    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-zinc-500 leading-relaxed">{description}</p>
  </div>
);
