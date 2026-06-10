import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { aiAPI } from '../lib/api';
import { saveResumeData, loadResumeData } from '../lib/saveService';
import { 
    Upload, 
    FileText, 
    ArrowRight, 
    Info, 
    Check, 
    Link as LinkIcon, 
    CloudIcon,
    X,
    ArrowLeft,
    Save
} from 'lucide-react';

export const JDUpload = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'paste' | 'upload'>('paste');
    const [jdText, setJdText] = useState('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [detectedInfo, setDetectedInfo] = useState<any>(null);
    const [analysisStep, setAnalysisStep] = useState(0);

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [lastSaved, setLastSaved] = useState<string>('');
    const [resumeData, setResumeData] = useState<any>(null);

    useEffect(() => {
        const loadData = async () => {
            const saved = await loadResumeData();
            if (saved) {
                setResumeData(saved);
            }
            const lastSavedTime = localStorage.getItem('resumeLastSaved');
            if (lastSavedTime) {
                const date = new Date(lastSavedTime);
                setLastSaved(date.toLocaleTimeString());
            }
        };
        loadData();
    }, []);

    const handleSave = async () => {
        setSaveStatus('saving');
        const dataToSave = resumeData || {
            personalInfo: {},
            summary: '',
            experience: [],
            education: [],
            skills: [],
            projects: [],
            certifications: [],
            languages: []
        };
        const result = await saveResumeData(dataToSave);
        if (result.success) {
            setSaveStatus('saved');
            const now = new Date().toLocaleTimeString();
            setLastSaved(now);
            setTimeout(() => setSaveStatus('idle'), 3000);
        } else {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
        }
    };

    // Beforeunload warning:
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (saveStatus !== 'saved') {
                e.preventDefault();
                e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [saveStatus]);

    const analysisSteps = [
        "Reading job description...",
        "Extracting key requirements...",
        "Identifying required skills...",
        "Preparing your resume editor..."
    ];

    useEffect(() => {
        if (jdText.trim().length < 20) {
            setDetectedInfo(null);
            return;
        }
        const timer = setTimeout(async () => {
            try {
                const detected = await aiAPI.detectJDInfo(jdText);
                if (detected.success) {
                    setDetectedInfo(detected.info);
                }
            } catch (err) {
                console.error("Auto-detect failed:", err);
            }
        }, 1500);
        return () => clearTimeout(timer);
    }, [jdText]);

    useEffect(() => {
        if (isAnalyzing) {
            const timer = setInterval(() => {
                setAnalysisStep((prev) => {
                    if (prev < analysisSteps.length - 1) return prev + 1;
                    return prev;
                });
            }, 850);
            return () => clearInterval(timer);
        } else {
            setAnalysisStep(0);
        }
    }, [isAnalyzing]);

    const handleContinue = async () => {
        if (jdText.trim().length > 0 || activeTab === 'upload') {
            setIsAnalyzing(true);
            try {
                const result = await aiAPI.analyzeJD(jdText);
                if (result.success) {
                    localStorage.setItem('resumeData', JSON.stringify(result.resumeData));
                    setTimeout(() => navigate('/builder'), 500);
                } else {
                    alert(result.error || 'JD analysis failed');
                    setIsAnalyzing(false);
                }
            } catch (err) {
                console.error("JD analysis failed:", err);
                alert('JD analysis failed');
                setIsAnalyzing(false);
            }
        }
    };

    if (isAnalyzing) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                    className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full mb-8"
                />
                <h2 className="text-2xl font-display font-bold mb-8">AI is analyzing your job description...</h2>
                <div className="w-full max-w-sm space-y-4">
                    {analysisSteps.map((step, idx) => (
                        <motion.div 
                            key={step}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ 
                                opacity: idx <= analysisStep ? 1 : 0.3,
                                x: 0
                            }}
                            className="flex items-center gap-3 text-left"
                        >
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                                idx < analysisStep ? 'bg-green-500 text-white' : 
                                idx === analysisStep ? 'bg-indigo-600 text-white animate-pulse' : 'bg-zinc-100 text-zinc-300'
                            }`}>
                                {idx < analysisStep ? <Check size={12} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                            </div>
                            <span className={`text-sm font-medium ${idx === analysisStep ? 'text-black' : 'text-zinc-500'}`}>
                                {step}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Top Bar Header */}
            <header className="h-16 border-b border-zinc-100 flex items-center justify-between px-6 shrink-0 bg-white z-20">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-zinc-50 rounded-lg transition-colors">
                        <ArrowLeft size={18} />
                    </button>
                    <div className="h-6 w-[1px] bg-zinc-100" />
                    <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
                      {lastSaved && (
                        <span style={{
                          fontSize: '12px',
                          color: '#6b7280'
                        }}>
                          Last saved: {lastSaved}
                        </span>
                      )}
                      <button
                        onClick={handleSave}
                        disabled={saveStatus === 'saving'}
                        style={{
                          padding: '8px 20px',
                          backgroundColor: saveStatus === 'saved' 
                            ? '#16a34a' 
                            : saveStatus === 'error'
                            ? '#dc2626'
                            : saveStatus === 'saving'
                            ? '#9ca3af'
                            : '#4F46E5',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '14px',
                          fontWeight: '600',
                          cursor: saveStatus === 'saving' ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          transition: 'all 0.2s'
                        }}
                      >
                        {saveStatus === 'saving' && '⟳ Saving...'}
                        {saveStatus === 'saved' && '✅ Saved!'}
                        {saveStatus === 'error' && '❌ Failed'}
                        {saveStatus === 'idle' && '💾 Save'}
                      </button>
                    </div>
                </div>
            </header>

            {/* Breadcrumb Steps */}
            <div className="border-b border-zinc-100 py-6">
                <div className="container mx-auto px-6">
                    <div className="flex items-center justify-center gap-4 md:gap-12">
                        <Step index={1} label="Upload JD" active={true} />
                        <div className="w-8 md:w-16 h-[1px] bg-zinc-200" />
                        <Step index={2} label="Edit Resume" active={false} />
                        <div className="w-8 md:w-16 h-[1px] bg-zinc-100" />
                        <Step index={3} label="AI Enhance" active={false} />
                        <div className="w-8 md:w-16 h-[1px] bg-zinc-100" />
                        <Step index={4} label="Download" active={false} />
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12 max-w-6xl">
                <div className="text-center mb-12">
                    <h1 className="text-3xl md:text-5xl font-display font-bold mb-4 tracking-tight">Optimize Resume for Your Dream Job</h1>
                    <p className="text-zinc-500 text-lg">Paste the job description below and upload your resume (optional)</p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 items-start mb-12">
                    {/* LEFT COLUMN: Job Description */}
                    <div className="bg-white border border-zinc-100 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-lg">Job Description</h2>
                                <span className="bg-red-50 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Required</span>
                            </div>
                        </div>

                        <div className="flex bg-zinc-50/50 p-1 m-4 rounded-xl border border-zinc-100">
                            <button 
                                onClick={() => setActiveTab('paste')}
                                className={`flex-grow py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeTab === 'paste' ? 'bg-white shadow-sm text-black' : 'text-zinc-500 hover:text-black'
                                }`}
                            >
                                Paste Text
                            </button>
                            <button 
                                onClick={() => setActiveTab('upload')}
                                className={`flex-grow py-2 rounded-lg text-sm font-semibold transition-all ${
                                    activeTab === 'upload' ? 'bg-white shadow-sm text-black' : 'text-zinc-500 hover:text-black'
                                }`}
                            >
                                Upload File
                            </button>
                        </div>

                        <div className="px-6 pb-6 flex-grow flex flex-col">
                            <AnimatePresence mode="wait">
                                {activeTab === 'paste' ? (
                                    <>
                                        <motion.div 
                                            key="paste"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="flex-grow flex flex-col relative"
                                    >
                                        <textarea
                                            value={jdText}
                                            onChange={(e) => setJdText(e.target.value.slice(0, 5000))}
                                            placeholder={"Paste the full job description here...\n\nExample: We are looking for a Senior Software Engineer \nwith 5+ years experience in React, Node.js..."}
                                            className="w-full min-h-[300px] flex-grow bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-black transition-colors resize-none"
                                        />
                                        <div className="absolute bottom-3 right-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                                            {jdText.length} / 5000
                                        </div>
                                    </motion.div>
                                    {detectedInfo && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-4 p-5 bg-indigo-50/40 rounded-2xl border border-indigo-100/50 text-left"
                                        >
                                            <h4 className="text-xs font-bold uppercase tracking-widest text-indigo-600 mb-3 flex items-center gap-2">
                                                <span className="animate-pulse">✨</span> AI Detected Details
                                            </h4>
                                            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-zinc-700">
                                                <div>
                                                    <span className="text-[10px] font-black text-zinc-400 uppercase block tracking-wider mb-0.5">Job Title</span>
                                                    {detectedInfo.jobTitle || 'Unknown'}
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black text-zinc-400 uppercase block tracking-wider mb-0.5">Company</span>
                                                    {detectedInfo.company || 'Unknown'}
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black text-zinc-400 uppercase block tracking-wider mb-0.5">Experience</span>
                                                    {detectedInfo.experience || 'Not specified'}
                                                </div>
                                                {detectedInfo.skills && detectedInfo.skills.length > 0 && (
                                                    <div className="col-span-2">
                                                        <span className="text-[10px] font-black text-zinc-400 uppercase block tracking-wider mb-1">Key Skills</span>
                                                        <div className="flex flex-wrap gap-1.5 mt-1">
                                                            {detectedInfo.skills.slice(0, 6).map((skill: string, i: number) => (
                                                                <span key={i} className="bg-white border border-indigo-100/50 px-2.5 py-1 rounded-full text-[10px] font-bold text-indigo-700 shadow-sm">
                                                                    {skill}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                    </>
                                ) : (
                                    <motion.div 
                                        key="upload"
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        className="flex-grow flex flex-col"
                                    >
                                        <div className="flex-grow min-h-[300px] border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center p-8 bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors cursor-pointer group">
                                            <CloudIcon className="text-zinc-300 group-hover:text-zinc-400 transition-colors mb-4" size={48} />
                                            <p className="font-bold text-zinc-900 mb-1">Drop your JD file here</p>
                                            <p className="text-xs text-zinc-400 mb-6 uppercase tracking-wider font-semibold">PDF, DOCX, TXT supported • Max 5MB</p>
                                            <button className="btn-secondary !text-xs !py-2">Browse Files</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Your Resume */}
                    <div className="bg-white border border-zinc-100 rounded-3xl shadow-sm overflow-hidden flex flex-col h-full">
                        <div className="p-6 border-b border-zinc-50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <h2 className="font-bold text-lg">Your Resume</h2>
                                <span className="bg-zinc-100 text-zinc-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Optional</span>
                            </div>
                        </div>

                        <div className="p-6 flex-grow flex flex-col">
                            <p className="text-sm text-zinc-500 leading-relaxed mb-6">
                                Already have a resume? Upload it and AI will optimize it for this job. Skip if you want to build fresh.
                            </p>

                            <div className="flex-grow min-h-[200px] border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center p-8 bg-zinc-50/50 hover:bg-zinc-100/50 transition-colors cursor-pointer group mb-6">
                                <Upload className="text-zinc-300 group-hover:text-zinc-400 transition-colors mb-4" size={32} />
                                <p className="font-bold text-zinc-900 mb-1">Drop your resume here</p>
                                <p className="text-xs text-zinc-400 mb-6 uppercase tracking-wider font-semibold">PDF or DOCX • Max 10MB</p>
                                <button className="btn-secondary !text-xs !py-2">Browse Files</button>
                            </div>

                            <div className="relative mb-8">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-zinc-100"></div>
                                </div>
                                <div className="relative flex justify-center uppercase">
                                    <span className="bg-white px-3 text-[10px] font-bold text-zinc-300 tracking-widest">OR</span>
                                </div>
                            </div>

                            <button className="text-zinc-400 hover:text-black transition-colors text-sm font-semibold mb-2">
                                Build from scratch instead
                            </button>
                        </div>
                    </div>
                </div>

                {/* Info Banner */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-4 items-start mb-8">
                    <div className="p-1.5 bg-blue-500 rounded-lg text-white shrink-0">
                        <Info size={18} />
                    </div>
                    <p className="text-sm text-blue-700 leading-relaxed">
                        AI will analyze the JD and help you create a perfectly tailored resume. No fake information added — only your real experience, optimized.
                    </p>
                </div>

                <div className="flex flex-col items-center">
                    <button 
                        onClick={handleContinue}
                        disabled={jdText.trim().length === 0 && activeTab === 'paste'}
                        className="btn-primary w-full max-w-xl !py-4 flex items-center justify-center gap-2 text-lg disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        Analyze & Continue
                        <ArrowRight size={20} />
                    </button>
                    <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest mt-4">Takes about 30 seconds</p>
                </div>
            </div>

            {saveStatus === 'saved' && (
              <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                backgroundColor: '#16a34a',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 9999,
                animation: 'slideIn 0.3s ease'
              }}>
                ✅ Resume saved successfully!
              </div>
            )}

            {saveStatus === 'error' && (
              <div style={{
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                backgroundColor: '#dc2626',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                zIndex: 9999
              }}>
                ❌ Save failed. Check connection.
              </div>
            )}

            <style>{`
              @keyframes slideIn {
                from { transform: translateX(100px); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
              }
            `}</style>
        </div>
    );
};

const Step = ({ index, label, active }: { index: number, label: string, active: boolean }) => (
    <div className={`flex items-center gap-2 ${active ? 'text-black' : 'text-zinc-300'}`}>
        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
            active ? 'bg-black text-white' : 'bg-zinc-100 text-zinc-300'
        }`}>
            {index}
        </div>
        <span className="text-xs font-bold uppercase tracking-wider hidden md:inline">{label}</span>
    </div>
);
