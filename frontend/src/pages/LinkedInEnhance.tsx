import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { enhanceText } from '../lib/aiService';
import { 
    Sparkles, 
    CheckCircle2, 
    XCircle, 
    ArrowRight, 
    ArrowLeft, 
    Check, 
    RefreshCw,
    AlertCircle,
    ChevronRight,
    TrendingUp,
    Lock,
    Save,
    Layout,
    Palette,
    Type,
    Sliders,
    Minus,
    Plus,
    X,
    BarChart3,
    Edit3,
    Smartphone,
    Building2,
    Wallet,
    Shield,
    Star,
    Download,
    FileText,
    FileCode,
    Printer,
    Link,
    Search,
    PenTool,
    Target,
    Copy,
    CreditCard,
    Mail,
    Share2,
    ExternalLink
} from 'lucide-react';

type Step = 'enhancing' | 'review' | 'payment' | 'success' | 'download';

export const LinkedInEnhance = () => {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState<Step>('enhancing');
    const [processedSections, setProcessedSections] = useState<string[]>([]);
    const [isEnhancementFinished, setIsEnhancementFinished] = useState(false);
    const [zoom, setZoom] = useState(75);
    const [selectedColor, setSelectedColor] = useState('indigo');
    const [selectedFont, setSelectedFont] = useState('Inter');
    const [spacing, setSpacing] = useState(50);

    const [resumeData, setResumeData] = useState<any>(null);
    const [atsScore, setAtsScore] = useState<number>(92);

    const calculateATSScore = (data: any) => {
        let score = 50;
        if (data.personalInfo?.fullName) score += 10;
        if (data.personalInfo?.email) score += 5;
        if (data.summary) score += 10;
        if (data.experience?.length) score += 15;
        if (data.skills?.length) score += 10;
        return Math.min(score, 100);
    };

  useEffect(() => {
    const rawData = localStorage.getItem('resumeData');
    if (rawData) {
        const data = JSON.parse(rawData);
        setResumeData(data);
        const score = calculateATSScore(data);
        setAtsScore(score);
    }
  }, []);
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const [paymentMethod, setPaymentMethod] = useState('upi');

    const enhancementSections = [
        { id: 'summary', label: 'Professional Summary' },
        { id: 'exp1', label: 'Senior Product Designer' },
        { id: 'exp2', label: 'Product Designer' },
        { id: 'skills', label: 'Technical Skills' }
    ];

    useEffect(() => {
        const runEnhancement = async () => {
            const rawData = localStorage.getItem('resumeData');
            if (!rawData) {
                navigate('/builder');
                return;
            }
            
            const resumeData = JSON.parse(rawData);
            
            try {
                // Enhance Summary
                if (resumeData.personal?.summary && resumeData.personal.summary.length > 10) {
                    const enhanced = await enhanceText(resumeData.personal.summary, 'professional summary');
                    resumeData.personal.summary = enhanced;
                }
                setProcessedSections(prev => [...prev, 'summary']);
                
                // Enhance Experience
                if (resumeData.experience && resumeData.experience.length > 0) {
                    for (let i = 0; i < resumeData.experience.length; i++) {
                        if (resumeData.experience[i].description && resumeData.experience[i].description.length > 10) {
                            resumeData.experience[i].description = await enhanceText(
                                resumeData.experience[i].description, 
                                'work experience'
                            );
                        }
                        setProcessedSections(prev => [...prev, `exp${i + 1}`]);
                    }
                }
                
                // Enhance Projects
                if (resumeData.projects && resumeData.projects.length > 0) {
                    for (let i = 0; i < resumeData.projects.length; i++) {
                        if (resumeData.projects[i].description && resumeData.projects[i].description.length > 10) {
                            resumeData.projects[i].description = await enhanceText(
                                resumeData.projects[i].description, 
                                'project'
                            );
                        }
                    }
                }
                setProcessedSections(prev => [...prev, 'skills']); // Simulate skills done

                // Save enhanced data
                localStorage.setItem('resumeData', JSON.stringify(resumeData));
                localStorage.setItem('enhancedData', JSON.stringify(resumeData));
                
                setIsEnhancementFinished(true);
                
                // Auto navigate to review after 1.5 seconds
                setTimeout(() => {
                    navigate('/review');
                }, 1500);
                
            } catch (err) {
                console.error('Enhancement failed:', err);
                setIsEnhancementFinished(true);
                setTimeout(() => navigate('/review'), 2000);
            }
        };

        runEnhancement();
    }, []);

    const renderEnhancing = () => (
        <motion.div 
            key="enhancing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans"
        >
            <div className="fixed top-20 flex items-center justify-center gap-8 mb-12">
               <div className="flex items-center gap-2">
                   <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-black">1</div>
                   <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Import</span>
               </div>
               <div className="w-8 h-[1px] bg-zinc-100" />
               <div className="flex items-center gap-2">
                   <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black animate-pulse">2</div>
                   <span className="text-[10px] font-black text-black uppercase tracking-widest">AI Enhancement</span>
               </div>
               <div className="w-8 h-[1px] bg-zinc-100" />
               <div className="flex items-center gap-2">
                   <div className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center text-[10px] font-black">3</div>
                   <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Download</span>
               </div>
            </div>

            <div className="relative mb-12">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 border-4 border-indigo-50 border-t-indigo-600 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center text-indigo-600">
                    <Sparkles size={32} />
                </div>
            </div>

            <h1 className="text-3xl font-display font-bold text-zinc-900 mb-2">AI is enhancing your resume...</h1>
            <p className="text-zinc-500 mb-12 font-semibold">Reviewing imported LinkedIn data and making it more professional</p>

            <div className="w-full max-w-sm space-y-3">
                {(enhancementSections || []).map((section) => (
                    <div 
                        key={section?.id || Math.random()} 
                        className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                            (section?.id && processedSections.includes(section.id)) ? 'bg-white border-green-100' : 'bg-zinc-50 border-transparent opacity-40'
                        }`}
                    >
                        <span className="text-sm font-bold text-zinc-700">{section?.label}</span>
                        <div className="flex items-center gap-2">
                            {(section?.id && processedSections.includes(section.id)) ? (
                                <div className="flex items-center gap-1.5 text-green-500 text-[10px] font-black uppercase tracking-widest">
                                    <CheckCircle2 size={14} /> Enhanced
                                </div>
                            ) : (
                                <div className="flex items-center gap-2 text-indigo-500 text-[10px] font-black uppercase tracking-widest">
                                    <RefreshCw size={14} className="animate-spin" /> Processing
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
            
            <AnimatePresence>
                {isEnhancementFinished ? (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12"
                    >
                        <button 
                            onClick={() => setCurrentStep('review')}
                            className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-200 flex items-center gap-2"
                        >
                            Continue to Review
                            <ArrowRight size={18} />
                        </button>
                    </motion.div>
                ) : (
                    <button 
                        onClick={() => setCurrentStep('review')}
                        className="mt-12 text-zinc-400 hover:text-indigo-600 transition-colors font-black text-[10px] uppercase tracking-widest"
                    >
                        Skip Enhancement →
                    </button>
                )}
            </AnimatePresence>
        </motion.div>
    );

    const renderReview = () => (
        <motion.div 
            key="review"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white min-h-screen flex flex-col font-sans"
        >
            <header className="h-16 border-b border-zinc-100 flex items-center justify-between px-6 shrink-0 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-4">
                  <LogoIcon />
                  <div className="h-6 w-[1px] bg-zinc-100" />
                  <div className="flex items-center gap-8">
                    <StepIndicator number={1} label="Build ✓" completed />
                    <StepIndicator number={2} label="AI Enhance ✓" completed />
                    <StepIndicator number={3} label="Review" active />
                    <StepIndicator number={4} label="Download" />
                  </div>
                </div>
                <button 
                  onClick={() => navigate('/')}
                  className="text-xs font-bold text-zinc-400 hover:text-black transition-colors uppercase tracking-widest px-4 py-2 border border-transparent hover:border-zinc-100 rounded-lg"
                >
                  Save & Exit
                </button>
            </header>

            <div className="flex-grow flex overflow-hidden">
                <aside className="w-[30%] border-r border-zinc-100 p-8 overflow-y-auto hidden lg:block">
                  <div className="space-y-10">
                    <div>
                      <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6">ATS Score</h2>
                      <div className="relative flex flex-col items-center">
                         <svg className="w-40 h-40 transform -rotate-90">
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-100" />
                            <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" strokeDasharray={440} strokeDashoffset={440 * (1 - 92/100)} strokeLinecap="round" fill="transparent" className="text-green-500" />
                         </svg>
                         <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-5xl font-black text-zinc-900 leading-none">92</span>
                            <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">/100</span>
                         </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <ScoreBar label="ATS Friendly" value={85} />
                      <ScoreBar label="Keywords" value={90} />
                      <ScoreBar label="Formatting" value={80} />
                      <ScoreBar label="Completeness" value={100} />
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sections Checklist</h3>
                      <div className="space-y-2">
                        <CheckItem label="Personal Info" completed />
                        <CheckItem label="Summary" completed />
                        <CheckItem label="Experience (2)" completed />
                        <CheckItem label="Education" completed />
                        <CheckItem label="Skills (8)" completed />
                        <CheckItem label="Projects" warning />
                      </div>
                    </div>
                  </div>
                </aside>

                <main className="w-[45%] bg-zinc-100 flex flex-col items-center p-8 overflow-y-auto">
                    <div className="w-full flex items-center justify-between mb-6">
                      <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Resume Preview</h2>
                      <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-zinc-200">
                        <button onClick={() => setZoom(75)} className={`p-1 px-2 rounded text-[10px] font-black ${zoom === 75 ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-50'}`}>75%</button>
                        <button onClick={() => setZoom(100)} className={`p-1 px-2 rounded text-[10px] font-black ${zoom === 100 ? 'bg-zinc-900 text-white' : 'text-zinc-400 hover:bg-zinc-50'}`}>100%</button>
                      </div>
                    </div>

                    <div 
                      style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                      className="bg-white aspect-[210/297] w-full shadow-2xl rounded-sm p-12 relative cursor-pointer overflow-hidden transition-transform"
                    >
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none overflow-hidden">
                        <span className="text-zinc-100 text-[8vw] font-black uppercase tracking-[0.1em] -rotate-45 opacity-20 whitespace-nowrap">
                          PREVIEW
                        </span>
                      </div>

                      <div className="space-y-6 relative z-0 text-[10px]">
                          <div className="text-center border-b border-zinc-100 pb-4">
                            <h1 className="text-2xl font-bold tracking-tight text-zinc-800">Rahul Sharma</h1>
                            <p className="font-bold text-zinc-400 uppercase tracking-widest">Senior Software Engineer</p>
                            <div className="flex justify-center gap-3 text-[8px] text-zinc-400 mt-1">
                               <span>rahul.sharma@gmail.com</span>
                               <span>•</span>
                               <span>Mumbai, India</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h3 className="font-black uppercase tracking-widest border-b border-zinc-100 pb-1">Profile</h3>
                            <p className="leading-relaxed text-zinc-600">Experienced software engineer with 5+ years of expertise in full-stack development. Proven track record in building scalable web applications and leading technical initiatives.</p>
                          </div>
                          <div className="space-y-4">
                            <h3 className="font-black uppercase tracking-widest border-b border-zinc-100 pb-1">Experience</h3>
                            <div className="space-y-3">
                               <div>
                                  <div className="flex justify-between font-bold">
                                     <span className="text-zinc-800">Software Engineer</span>
                                     <span className="text-zinc-400">2020 – 2024</span>
                                  </div>
                                  <p className="text-zinc-500 italic">TCS • Mumbai</p>
                               </div>
                               <div>
                                  <div className="flex justify-between font-bold">
                                     <span className="text-zinc-800">Junior Developer</span>
                                     <span className="text-zinc-400">2018 – 2020</span>
                                  </div>
                                  <p className="text-zinc-500 italic">Infosys • Pune</p>
                               </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                             <h3 className="font-black uppercase tracking-widest border-b border-zinc-100 pb-1">Skills</h3>
                             <div className="flex flex-wrap gap-1.5">
                                {['React', 'Node.js', 'Python', 'AWS', 'MongoDB', 'PostgreSQL', 'Docker', 'Jenkins'].map(s => (
                                   <span key={s} className="bg-zinc-50 border border-zinc-100 px-2 py-0.5 rounded text-[7px] font-black text-zinc-600 uppercase tracking-widest">{s}</span>
                                ))}
                             </div>
                          </div>
                      </div>
                    </div>
                </main>

                <aside className="w-[25%] border-l border-zinc-100 p-8 overflow-y-auto hidden lg:block">
                   <div className="space-y-8">
                      <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Customize</h2>
                      <div className="space-y-6">
                         <div className="space-y-3">
                            <label className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Color Theme</label>
                            <div className="flex gap-2">
                              {['#4F46E5', '#2563EB', '#10B981', '#E11D48', '#374151'].map(hex => (
                                <button key={hex} style={{ backgroundColor: hex }} className="w-6 h-6 rounded-full shadow-sm ring-1 ring-zinc-100" />
                              ))}
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[8px] font-black text-zinc-400 uppercase tracking-widest">Font Style</label>
                            <select className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2 text-[10px] font-bold">
                               <option>Inter</option>
                               <option>Roboto</option>
                               <option>Poppins</option>
                            </select>
                         </div>
                         <button className="w-full text-[10px] font-black text-zinc-400 uppercase tracking-widest py-3 border border-zinc-100 rounded-xl hover:bg-zinc-50">Change Template</button>
                      </div>
                      <div className="space-y-2 pt-6 border-t border-zinc-50">
                          <button className="w-full flex items-center justify-center gap-2 py-3 bg-zinc-50 text-zinc-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-100">
                             <Edit3 size={14} /> Edit Resume
                          </button>
                          <button className="w-full flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-100">
                             <RefreshCw size={14} /> Re-run AI
                          </button>
                      </div>
                   </div>
                </aside>
            </div>

            <footer className="h-20 border-t border-zinc-100 bg-white flex items-center justify-between px-10 shrink-0 shadow-sm sticky bottom-0 z-50">
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Current Score</span>
                  <span className="text-xl font-black text-green-500 uppercase tracking-tighter">{atsScore}/100 <span className="text-[10px] text-zinc-300 font-bold ml-2 tracking-widest uppercase">• Last saved just now</span></span>
               </div>
               <div className="flex items-center gap-4">
                  <button className="text-[10px] font-black text-zinc-400 uppercase tracking-widest hover:text-black">← Edit Resume</button>
                  <div className="flex flex-col items-end">
                    <button 
                      onClick={() => setCurrentStep('payment')}
                      className="bg-zinc-900 text-white px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2"
                    >
                      Continue to Payment
                      <ArrowRight size={16} />
                    </button>
                    <span className="text-[9px] font-bold text-indigo-600 mt-1 uppercase tracking-widest">₹199 one-time • PDF + DOCX included</span>
                  </div>
               </div>
            </footer>
        </motion.div>
    );

    const renderPayment = () => (
        <motion.div 
            key="payment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-zinc-50 min-h-screen font-sans"
        >
             <header className="h-16 border-b border-zinc-200 flex items-center justify-between px-10 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-10">
                    <LogoIcon />
                    <div className="flex items-center gap-4">
                        <StepIndicator label="Build" completed />
                        <StepIndicator label="AI Enhance" completed />
                        <StepIndicator label="Review" completed />
                        <StepIndicator label="Download" active />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full">
                    <Lock size={12} /> Secure Checkout
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    <div className="lg:w-[55%] space-y-10">
                        <h2 className="text-2xl font-black text-zinc-900 tracking-tighter uppercase">Complete Your Purchase</h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                           {[
                                { id: 'basic', name: 'Basic', price: 199, desc: '1 resume, PDF+DOCX' },
                                { id: 'pro', name: 'Pro', price: 499, desc: '3 resumes', popularCode: true },
                                { id: 'life', name: 'Lifetime', price: 2999, desc: 'unlimited', bestCode: true }
                           ].map(p => (
                             <button key={p?.id || Math.random()} onClick={() => p?.id && setSelectedPlan(p.id)} className={`p-6 rounded-3xl border-2 text-left bg-white transition-all relative ${selectedPlan === p?.id ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-lg' : 'border-zinc-100 hover:border-zinc-200'}`}>
                                {p?.popularCode && <span className="absolute -top-3 left-6 bg-indigo-600 text-white text-[8px] font-black py-1 px-3 rounded-full uppercase tracking-widest">MOST POPULAR</span>}
                                {p?.bestCode && <span className="absolute -top-3 left-6 bg-yellow-400 text-zinc-900 text-[8px] font-black py-1 px-3 rounded-full uppercase tracking-widest">BEST VALUE</span>}
                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">{p?.name}</p>
                                <p className="text-2xl font-black text-zinc-900 mb-2">₹{p?.price}</p>
                                <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">{p?.desc}</p>
                             </button>
                           ))}
                        </div>

                        <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
                            <div className="flex bg-zinc-50">
                                {['upi', 'card', 'net', 'wallet'].map(m => (
                                    <button key={m} onClick={() => setPaymentMethod(m)} className={`flex-grow py-4 text-[10px] font-black uppercase tracking-widest transition-all ${paymentMethod === m ? 'bg-white text-indigo-600 border-t-2 border-indigo-600' : 'text-zinc-500 border-t-2 border-transparent'}`}>
                                        {m}
                                    </button>
                                ))}
                            </div>
                            <div className="p-8">
                                {paymentMethod === 'upi' && (
                                    <div className="space-y-8 text-center sm:text-left">
                                        <div className="flex gap-2">
                                            <input type="text" placeholder="name@upi" className="flex-grow bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-indigo-500" />
                                            <button className="bg-indigo-600 text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest">Verify UPI</button>
                                        </div>
                                        <div className="flex gap-4 items-center justify-center sm:justify-start">
                                            {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                                                <div key={app} className="flex flex-col items-center gap-1 opacity-50 hover:opacity-100 cursor-pointer transition-opacity">
                                                    <div className="w-10 h-10 bg-zinc-100 rounded-xl border border-zinc-200" />
                                                    <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{app}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <input type="text" placeholder="Coupon Code" className="flex-grow bg-white border border-zinc-100 rounded-xl px-4 py-3 text-sm font-bold outline-none" />
                            <button className="bg-zinc-900 text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest">Apply</button>
                        </div>
                    </div>

                    <aside className="lg:w-[45%] sticky top-28">
                        <div className="bg-white rounded-[40px] border border-zinc-100 p-8 shadow-2xl space-y-6">
                            <h2 className="text-[10px] font-black uppercase tracking-widest text-zinc-300">Order Summary</h2>
                            <div className="space-y-4 text-xs font-bold text-zinc-600">
                                <div className="flex justify-between"><span>Plan: Basic</span><span>₹199.00</span></div>
                                <div className="flex justify-between"><span>GST 18%</span><span>₹35.82</span></div>
                                <div className="h-[1px] bg-zinc-50" />
                                <div className="flex justify-between items-baseline"><span className="text-[10px] uppercase tracking-widest text-zinc-400">Total</span><span className="text-3xl font-black text-zinc-900">₹234.82</span></div>
                            </div>
                            <div className="space-y-2 py-4 border-y border-zinc-50">
                                {['✓ PDF download', '✓ DOCX download', '✓ No watermark', '✓ Lifetime access'].map(item => (
                                    <p key={item} className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2"><Check size={12} className="text-green-500" /> {item}</p>
                                ))}
                            </div>
                            <div className="grid grid-cols-3 gap-2 opacity-50">
                               <div className="flex flex-col items-center gap-1 text-[8px] font-black uppercase"><Shield size={16} /> SSL</div>
                               <div className="flex flex-col items-center gap-1 text-[8px] font-black uppercase"><Star size={16} /> 4.9/5</div>
                               <div className="flex flex-col items-center gap-1 text-[8px] font-black uppercase"><RefreshCw size={16} /> 7-day</div>
                            </div>
                            <button 
                                onClick={() => setCurrentStep('success')}
                                className="w-full bg-zinc-900 text-white py-5 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                            >
                                Pay ₹234.82 Securely →
                            </button>
                            <p className="text-center text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Powered by Razorpay</p>
                        </div>
                    </aside>
                </div>
            </div>
        </motion.div>
    );

    const renderSuccess = () => (
        <motion.div 
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center"
        >
             <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12 }}
                className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mb-8 shadow-2xl relative"
             >
                <Check size={48} className="text-white" strokeWidth={4} />
                <motion.div 
                    initial={{ scale: 1, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="absolute inset-0 bg-green-500 rounded-full"
                />
             </motion.div>
             <h1 className="text-4xl font-black text-zinc-900 tracking-tighter mb-2">Payment Successful! 🎉</h1>
             <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-10">Your resume is ready to download</p>
             <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-3xl w-full max-w-sm space-y-4 mb-10">
                <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest"><span>Order ID:</span><span className="text-zinc-900">#RES-2026-48291</span></div>
                <div className="flex justify-between text-[10px] font-bold text-zinc-400 uppercase tracking-widest"><span>Date:</span><span className="text-zinc-900">13 May 2026</span></div>
             </div>
             <button 
                onClick={() => setCurrentStep('download')}
                className="bg-zinc-900 text-white px-12 py-4 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl flex items-center gap-3 hover:gap-5 transition-all"
             >
                Go to Download →
             </button>
        </motion.div>
    );

    const renderDownload = () => (
        <motion.div 
            key="download"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-zinc-50 font-sans"
        >
             <header className="h-16 border-b border-zinc-100 flex items-center justify-between px-10 bg-white">
                <LogoIcon />
                <div className="flex items-center gap-2">
                    {[1, 2, 3, 4].map(s => <div key={s} className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center"><Check size={12} className="text-white" strokeWidth={4} /></div>)}
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-16 space-y-16">
                <div className="text-center space-y-4">
                    <h1 className="text-5xl font-black text-zinc-900 tracking-tighter uppercase leading-none">Your Resume is Ready! 🚀</h1>
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-[0.3em]">No watermark • ATS-friendly • Professional quality</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start justify-center">
                    <div className="w-full max-w-md relative">
                         <div className="absolute -top-3 -right-3 z-10 bg-indigo-600 text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest border-2 border-white shadow-xl">ATS Score: 92/100</div>
                         <div className="bg-white aspect-[210/297] w-full shadow-2xl rounded p-12 overflow-hidden border border-zinc-100 opacity-90 scale-95 opacity-40">
                             <div className="h-2 w-1/3 bg-zinc-900 mb-4 mx-auto" />
                             <div className="h-1 w-1/2 bg-zinc-100 mb-10 mx-auto" />
                             <div className="space-y-4">
                                <div className="h-2 w-full bg-zinc-50" /><div className="h-2 w-full bg-zinc-50" /><div className="h-2 w-full bg-zinc-50" />
                             </div>
                         </div>
                    </div>

                    <div className="flex flex-col gap-6 w-full max-w-sm">
                        <DownloadCard icon={<FileText size={40} className="text-red-500" />} title="PDF Format" size="245 KB" color="bg-red-500" />
                        <DownloadCard icon={<FileCode size={40} className="text-blue-500" />} title="Word (.docx)" size="87 KB" color="bg-blue-600" />
                        
                        <div className="grid grid-cols-2 gap-3 pt-6 border-t border-zinc-200">
                           <IconButton icon={<Edit3 size={14} />} label="Edit" />
                           <IconButton icon={<RefreshCw size={14} />} label="New" />
                           <IconButton icon={<Mail size={14} />} label="Email" />
                           <IconButton icon={<Link size={14} />} label="Share" />
                        </div>
                    </div>
                </div>

                <div className="bg-indigo-600 rounded-[50px] p-12 text-center text-white relative shadow-2xl overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-indigo-800" />
                     <div className="relative z-10 space-y-6">
                        <h2 className="text-2xl font-black uppercase tracking-tighter">Refer friends • Earn ₹100 per signup</h2>
                        <button className="bg-white text-indigo-600 px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest">Get Referral Link</button>
                     </div>
                </div>
            </main>
        </motion.div>
    );

    return (
        <AnimatePresence mode="wait">
            {currentStep === 'enhancing' && renderEnhancing()}
            {currentStep === 'review' && renderReview()}
            {currentStep === 'payment' && renderPayment()}
            {currentStep === 'success' && renderSuccess()}
            {currentStep === 'download' && renderDownload()}
        </AnimatePresence>
    );
};

const LogoIcon = () => (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white"><BarChart3 size={18} /></div>
      <span className="font-display font-black text-lg tracking-tighter uppercase">ResuMate<span className="text-zinc-400">AI</span></span>
    </div>
);

const ScoreBar = ({ label, value }: { label: string, value: number }) => (
    <div className="space-y-1">
      <div className="flex justify-between items-center"><span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest">{label}</span><span className="text-[9px] font-black text-zinc-900">{value}%</span></div>
      <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
         <motion.div initial={{ width: 0 }} animate={{ width: `${value}%` }} className="h-full bg-green-500" />
      </div>
    </div>
);

const CheckItem = ({ label, completed, warning }: { label: string, completed?: boolean, warning?: boolean }) => (
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-2">
          {completed ? <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center text-white"><Check size={8} strokeWidth={5} /></div> : 
           warning ? <div className="w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center text-white"><AlertCircle size={8} strokeWidth={5} /></div> : null}
          <span className="text-[10px] font-bold text-zinc-600 tracking-tight">{label}</span>
       </div>
       {warning && <span className="text-[8px] font-black text-indigo-600 uppercase tracking-widest">+5pts</span>}
    </div>
);

const StepIndicator = ({ number, label, active, completed }: any) => (
    <div className={`flex items-center gap-2 ${active ? 'opacity-100' : 'opacity-40'}`}>
        <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black ${completed ? 'bg-green-500 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-400'}`}>
          {completed ? <Check size={10} strokeWidth={5} /> : number || '•'}
        </div>
        <span className={`text-[8px] font-black uppercase tracking-widest ${active ? 'text-zinc-900' : 'text-zinc-400'}`}>{label}</span>
    </div>
);

const DownloadCard = ({ icon, title, size, color }: any) => (
    <div className="bg-white border border-zinc-100 p-6 rounded-3xl flex items-center gap-6 shadow-sm hover:shadow-xl transition-all cursor-pointer group">
        <div className="w-16 h-16 bg-zinc-50 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">{icon}</div>
        <div className="flex-grow">
            <h4 className="text-sm font-black text-zinc-900 tracking-tight">{title}</h4>
            <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">{size}</p>
        </div>
        <button className={`px-5 py-2 rounded-xl text-white ${color} text-[9px] font-black uppercase tracking-widest`}>Download</button>
    </div>
);

const IconButton = ({ icon, label }: any) => (
    <button className="flex flex-col items-center gap-1.5 p-3 bg-white border border-zinc-100 rounded-2xl hover:bg-zinc-50 transition-colors">
        <div className="text-zinc-400">{icon}</div>
        <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest">{label}</span>
    </button>
);

