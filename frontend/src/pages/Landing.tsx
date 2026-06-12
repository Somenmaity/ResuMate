import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation()
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

  useEffect(() => {
    const scrollTo = (location.state as any)?.scrollTo
    if (scrollTo) {
      setTimeout(() => {
        document.getElementById(scrollTo)?.scrollIntoView({ behavior: 'smooth' })
      }, 150)
    }
  }, [location.state])

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
      <section id="how-it-works" className="py-24">
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
                <div className="bg-zinc-50 border border-zinc-100 rounded-2xl p-6 flex flex-col justify-between">
                  <p className="text-zinc-700 text-sm leading-relaxed mb-4">
                    "ResuMate helped me tailor my resume for every job application. I landed 3 interviews in the first week after using the JD optimizer."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">A</div>
                    <div>
                      <p className="font-semibold text-sm text-zinc-900">Aditya Sharma</p>
                      <p className="text-xs text-zinc-500">Software Engineer, Bengaluru</p>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900 rounded-2xl p-6 flex flex-col justify-between">
                  <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                    "The AI enhancement feature rewrote my bullet points so well that my recruiter thought I had a professional writer. Got hired at my dream company!"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-sm">P</div>
                    <div>
                      <p className="font-semibold text-sm text-white">Priya Menon</p>
                      <p className="text-xs text-zinc-400">Product Manager, Mumbai</p>
                    </div>
                  </div>
                </div>
            </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section id="pricing" className="py-24 bg-zinc-50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-display text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-zinc-500">Pay only for what you need. No subscriptions, no hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Resume Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white border border-zinc-200 rounded-3xl p-8 flex flex-col"
            >
              <div className="mb-6">
                <FileText size={28} className="text-zinc-600 mb-4" />
                <h3 className="text-xl font-bold mb-1">Resume Download</h3>
                <p className="text-zinc-500 text-sm">PDF + DOCX formats</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹99</span>
                <span className="text-zinc-500 text-sm ml-1">one-time</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow text-sm text-zinc-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0" />ATS-friendly PDF</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0" />Editable DOCX</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0" />AI Enhanced content</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-green-500 shrink-0" />All templates</li>
              </ul>
              <button onClick={() => handleOptionClick('/templates')} className="w-full py-3 border-2 border-zinc-900 text-zinc-900 rounded-xl font-semibold hover:bg-zinc-900 hover:text-white transition-colors">
                Get Resume
              </button>
            </motion.div>

            {/* Cover Letter Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white border-2 border-blue-500 rounded-3xl p-8 flex flex-col relative shadow-xl shadow-blue-500/10"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-blue-500 text-white text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">New</span>
              </div>
              <div className="mb-6">
                <Sparkles size={28} className="text-blue-500 mb-4" />
                <h3 className="text-xl font-bold mb-1">Cover Letter</h3>
                <p className="text-zinc-500 text-sm">AI-generated for any job</p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">₹21</span>
                <span className="text-zinc-500 text-sm ml-1">per letter</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow text-sm text-zinc-600">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500 shrink-0" />AI-written content</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500 shrink-0" />Matches your resume</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500 shrink-0" />PDF + DOCX</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500 shrink-0" />Customizable tone</li>
              </ul>
              <button onClick={() => handleOptionClick('/cover-letter')} className="w-full py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors">
                Generate Letter
              </button>
            </motion.div>

            {/* Bundle Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="bg-zinc-900 rounded-3xl p-8 flex flex-col relative"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="bg-amber-400 text-zinc-900 text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-wide">Best Value</span>
              </div>
              <div className="mb-6">
                <Zap size={28} className="text-amber-400 mb-4" />
                <h3 className="text-xl font-bold text-white mb-1">Bundle — Both</h3>
                <p className="text-zinc-400 text-sm">Resume + Cover Letter</p>
              </div>
              <div className="mb-6 flex items-baseline gap-2">
                <span className="text-4xl font-bold text-white">₹110</span>
                <span className="text-zinc-500 line-through text-sm">₹120</span>
                <span className="text-amber-400 text-xs font-bold">Save ₹10</span>
              </div>
              <ul className="space-y-3 mb-8 flex-grow text-sm text-zinc-400">
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-400 shrink-0" />Everything in Resume</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-400 shrink-0" />Everything in Cover Letter</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-400 shrink-0" />Best value deal</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-amber-400 shrink-0" />Priority support</li>
              </ul>
              <button onClick={() => handleOptionClick('/payment')} className="w-full py-3 bg-amber-400 text-zinc-900 rounded-xl font-semibold hover:bg-amber-300 transition-colors">
                Get Bundle
              </button>
            </motion.div>
          </div>
          <p className="text-center text-zinc-400 text-sm mt-10">
            All plans are one-time payments · GST included · Secure checkout via Razorpay
          </p>
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
