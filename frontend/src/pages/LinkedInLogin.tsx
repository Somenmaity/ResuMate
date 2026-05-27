import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
    Linkedin, 
    Check, 
    Lock, 
    FileUp, 
    ArrowLeft,
    ShieldCheck
} from 'lucide-react';

export const LinkedInLogin = () => {
    const navigate = useNavigate();

    const importFeatures = [
        "Full name & profile photo",
        "Professional headline",
        "Work experience & companies",
        "Education history",
        "Skills & endorsements",
        "Certifications & languages",
        "Contact information"
    ];

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col items-center py-20 px-6 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-[480px] bg-white rounded-3xl shadow-xl overflow-hidden border border-zinc-100"
            >
                <div className="p-8 md:p-10 flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#0A66C2] rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg shadow-blue-200">
                        <Linkedin size={36} fill="white" />
                    </div>
                    
                    <h1 className="text-3xl font-display font-bold text-zinc-900 mb-2">Connect Your LinkedIn</h1>
                    <p className="text-zinc-500 mb-8 font-medium">Import your profile data instantly</p>
                    
                    <div className="w-full bg-zinc-50 rounded-2xl p-6 mb-8 border border-zinc-100">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 px-1">What we'll import:</h3>
                        <div className="space-y-3">
                            {importFeatures.map((item, idx) => (
                                <div key={idx} className="flex items-center gap-3">
                                    <div className="w-5 h-5 bg-blue-100/50 rounded-full flex items-center justify-center text-[#0A66C2]">
                                        <Check size={12} strokeWidth={3} />
                                    </div>
                                    <span className="text-sm font-semibold text-zinc-700">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="w-full bg-blue-50/50 rounded-2xl p-4 mb-8 flex items-start gap-3 border border-blue-100/50">
                        <Lock className="text-blue-500 shrink-0 mt-0.5" size={16} />
                        <p className="text-xs text-blue-700 leading-relaxed font-medium">
                            We never store your LinkedIn password. Read-only access to public profile data only.
                        </p>
                    </div>
                    
                    <button 
                        onClick={() => navigate('/linkedin-import')}
                        className="w-full bg-[#0A66C2] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 hover:bg-[#004182] transition-all shadow-lg shadow-blue-200 mb-8"
                    >
                        <div className="bg-white text-[#0A66C2] px-1 py-0.5 rounded-sm text-xs font-black">in</div>
                        Sign in with LinkedIn
                    </button>
                    
                    <div className="w-full relative mb-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-zinc-100"></div>
                        </div>
                        <div className="relative flex justify-center uppercase">
                            <span className="bg-white px-3 text-[10px] font-bold text-zinc-300 tracking-[0.3em]">OR</span>
                        </div>
                    </div>
                    
                    <div className="w-full text-center space-y-4">
                        <p className="text-sm font-semibold text-zinc-500">Don't want to connect LinkedIn?</p>
                        <button className="w-full border border-zinc-200 text-zinc-900 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-zinc-50 transition-all">
                            <FileUp size={18} />
                            Upload LinkedIn PDF instead
                        </button>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                            Export PDF from LinkedIn → Me → Save to PDF
                        </p>
                    </div>
                </div>
            </motion.div>
            
            <button 
                onClick={() => navigate('/')}
                className="mt-8 flex items-center gap-2 text-zinc-400 hover:text-black transition-colors font-bold text-sm uppercase tracking-widest"
            >
                <ArrowLeft size={16} />
                Back to options
            </button>
        </div>
    );
};
