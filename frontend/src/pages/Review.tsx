import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
    CheckCircle2, 
    AlertCircle, 
    Maximize2, 
    RefreshCw, 
    BarChart3, 
    Edit3,
    ChevronRight,
    ArrowRight,
    ArrowLeft,
    Check,
    Lock,
    Save,
    Layout,
    Palette,
    Type,
    Sliders,
    Minus,
    Plus,
    X
} from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import TemplateModal from '../components/TemplateModal';
import { calculateATSScore, enhanceFullResume } from '../lib/aiService';

export const Review = () => {
  const navigate = useNavigate();
  const [resumeData, setResumeData] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('travis-classic');
  const [selectedColor, setSelectedColor] = useState('#4F46E5');
  const [selectedFont, setSelectedFont] = useState('Inter');
  const [spacing, setSpacing] = useState(50);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [atsScore, setAtsScore] = useState(0);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [zoom, setZoom] = useState(75);

  React.useEffect(() => {
    const saved = localStorage.getItem('resumeData');
    if (saved) {
      const data = JSON.parse(saved);
      setResumeData(data);
    }
    
    const savedTemplate = localStorage.getItem('selectedTemplate');
    if (savedTemplate) setSelectedTemplate(savedTemplate);
    
    const savedColor = localStorage.getItem('selectedColor');
    if (savedColor) setSelectedColor(savedColor);
    
    const savedFont = localStorage.getItem('selectedFont');
    if (savedFont) setSelectedFont(savedFont);
  }, []);

  React.useEffect(() => {
    if (!resumeData) return;
    let score = 0;
    if (resumeData?.personalInfo?.fullName) score += 10;
    if (resumeData?.personalInfo?.email) score += 5;
    if (resumeData?.personalInfo?.phone) score += 5;
    if (resumeData?.summary?.length > 30) score += 15;
    if (resumeData?.experience?.filter((e:any) => e.jobTitle || e.company).length > 0) score += 20;
    if (resumeData?.education?.filter((e:any) => e.degree || e.institution).length > 0) score += 15;
    if (resumeData?.skills?.length >= 5) score += 15;
    if (resumeData?.projects?.filter((p:any) => p.projectName).length > 0) score += 10;
    if (resumeData?.certifications?.filter((c:any) => c.certName).length > 0) score += 5;
    setAtsScore(Math.min(score, 100));
  }, [resumeData]);

  const colors = [
    { name: 'Indigo', value: '#4F46E5' },
    { name: 'Blue', value: '#2563EB' },
    { name: 'Green', value: '#16A34A' },
    { name: 'Red', value: '#DC2626' },
    { name: 'Dark', value: '#1f2937' }
  ];

  const fonts = ['Inter', 'Georgia', 'Arial', 'Roboto', 'Times New Roman'];

  const handleReRunAI = async () => {
    if (!resumeData) return;
    setIsEnhancing(true);
    try {
      const enhanced = await enhanceFullResume(resumeData);
      setResumeData(enhanced);
      localStorage.setItem('resumeData', JSON.stringify(enhanced));
      alert('✅ AI Enhancement complete!');
    } catch (err) {
      alert('Enhancement failed, try again');
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleATSReport = () => {
    if (!resumeData) return;
    
    const report = `
ATS REPORT - ResuMate AI
========================
Overall Score: ${atsScore}/100

SECTION SCORES:
✅ Personal Info: ${resumeData?.personalInfo?.fullName ? '10/10' : '0/10'}
✅ Contact Info: ${resumeData?.personalInfo?.email ? '5/5' : '0/5'}
✅ Summary: ${resumeData?.summary?.length > 30 ? '15/15' : '0/15'}
✅ Experience: ${resumeData?.experience?.filter((e:any) => e.jobTitle).length > 0 ? '20/20' : '0/20'}
✅ Education: ${resumeData?.education?.filter((e:any) => e.degree).length > 0 ? '15/15' : '0/15'}
✅ Skills: ${resumeData?.skills?.length >= 5 ? '15/15' : resumeData?.skills?.length > 0 ? '8/15' : '0/15'}
✅ Projects: ${resumeData?.projects?.filter((p:any) => p.projectName).length > 0 ? '10/10' : '0/10'}
✅ Certifications: ${resumeData?.certifications?.filter((c:any) => c.certName).length > 0 ? '5/5' : '0/5'}

RECOMMENDATIONS:
${resumeData?.skills?.length < 5 ? '• Add more skills (minimum 5 recommended)\n' : ''}
${resumeData?.projects?.filter((p:any) => p.projectName).length === 0 ? '• Add at least 1 project\n' : ''}
${resumeData?.certifications?.filter((c:any) => c.certName).length === 0 ? '• Add certifications to boost score\n' : ''}
${resumeData?.summary?.length < 30 ? '• Write a longer professional summary\n' : ''}
    `;
    alert(report);
  };

  return (
    <div className="bg-white min-h-screen flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="h-16 border-b border-zinc-100 flex items-center justify-between px-6 shrink-0 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <LinkIcon />
          <div className="h-6 w-[1px] bg-zinc-100" />
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-black">1</div>
                <span className="text-[10px] font-black text-zinc-400">Build ✓</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center text-[10px] font-black">2</div>
                <span className="text-[10px] font-black text-zinc-400">AI Enhance ✓</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-black animate-pulse">3</div>
                <span className="text-[10px] font-black text-black uppercase tracking-widest">Review</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-zinc-100 text-zinc-400 flex items-center justify-center text-[10px] font-black">4</div>
                <span className="text-[10px] font-black text-zinc-400">Download</span>
            </div>
          </div>
        </div>
        <button className="text-xs font-bold text-zinc-400 hover:text-black transition-colors uppercase tracking-widest px-4 py-2 border border-transparent hover:border-zinc-100 rounded-lg">
          Save & Exit
        </button>
      </header>

      <div className="flex-grow flex overflow-hidden">
        {/* LEFT SIDEBAR: Score */}
        <aside className="w-[25%] border-r border-zinc-100 p-8 overflow-y-auto hidden lg:block">
          <div className="space-y-10">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Resume Score</h2>
              <div className="relative flex flex-col items-center">
                 <svg className="w-40 h-40 transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-zinc-100" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" strokeDasharray={440} strokeDashoffset={440 * (1 - atsScore/100)} strokeLinecap="round" fill="transparent" className="text-green-500 transition-all duration-1000" />
                 </svg>
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-zinc-900 leading-none">{atsScore}</span>
                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">/100</span>
                 </div>
              </div>
            </div>

            <div className="space-y-6">
              <ScoreBar label="ATS Friendly" value={atsScore} />
              <ScoreBar label="Keywords" value={Math.min(100, (resumeData?.skills?.length || 0) * 10 + 40)} />
              <ScoreBar label="Formatting" value={100} />
              <ScoreBar label="Completeness" value={atsScore} />
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sections Checklist</h3>
              <div className="space-y-2">
                <CheckItem label="Personal Info" completed={!!resumeData?.personalInfo?.fullName} warning={!resumeData?.personalInfo?.fullName} onAdd={() => navigate('/builder')} />
                <CheckItem label="Summary" completed={resumeData?.summary?.length > 30} warning={!resumeData?.summary || resumeData?.summary?.length <= 30} onAdd={() => navigate('/builder')} />
                <CheckItem label={`Work Experience (${resumeData?.experience?.filter((e:any) => e.jobTitle || e.company).length || 0})`} completed={(resumeData?.experience?.filter((e:any) => e.jobTitle || e.company).length || 0) > 0} warning={(resumeData?.experience?.filter((e:any) => e.jobTitle || e.company).length || 0) === 0} onAdd={() => navigate('/builder')} />
                <CheckItem label={`Education (${resumeData?.education?.filter((e:any) => e.degree || e.institution).length || 0})`} completed={(resumeData?.education?.filter((e:any) => e.degree || e.institution).length || 0) > 0} warning={(resumeData?.education?.filter((e:any) => e.degree || e.institution).length || 0) === 0} onAdd={() => navigate('/builder')} />
                <CheckItem label={`Skills (${resumeData?.skills?.length || 0})`} completed={(resumeData?.skills?.length || 0) >= 5} warning={(resumeData?.skills?.length || 0) < 5} onAdd={() => navigate('/builder')} />
                <CheckItem label={`Projects (${resumeData?.projects?.filter((p:any) => p.projectName).length || 0})`} completed={(resumeData?.projects?.filter((p:any) => p.projectName).length || 0) > 0} warning={(resumeData?.projects?.filter((p:any) => p.projectName).length || 0) === 0} onAdd={() => navigate('/builder')} labelClass={(resumeData?.projects?.filter((p:any) => p.projectName).length || 0) === 0 ? "text-zinc-400" : ""} />
                <CheckItem label={`Certifications (${resumeData?.certifications?.filter((c:any) => c.certName).length || 0})`} completed={(resumeData?.certifications?.filter((c:any) => c.certName).length || 0) > 0} warning={(resumeData?.certifications?.filter((c:any) => c.certName).length || 0) === 0} onAdd={() => navigate('/builder')} labelClass={(resumeData?.certifications?.filter((c:any) => c.certName).length || 0) === 0 ? "text-zinc-400" : ""} />
              </div>
            </div>

            {(() => {
              const skillCount = resumeData?.skills?.length || 0;
              const projCount = resumeData?.projects?.filter((p:any) => p.projectName).length || 0;
              const certCount = resumeData?.certifications?.filter((c:any) => c.certName).length || 0;
              const summaryLength = resumeData?.summary?.length || 0;
              const suggestions = [];
              if (skillCount < 5) suggestions.push({ text: `Add ${5 - skillCount} more skills`, pts: 15 });
              if (projCount === 0) suggestions.push({ text: "Add a project", pts: 10 });
              if (certCount === 0) suggestions.push({ text: "Add certifications", pts: 5 });
              if (summaryLength < 30) suggestions.push({ text: "Write a longer summary", pts: 15 });

              if (suggestions.length === 0) return null;

              return (
                <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
                  <h4 className="flex items-center gap-2 text-[10px] font-black text-yellow-800 uppercase tracking-widest mb-3">
                    <AlertCircle size={14} /> Improve Score
                  </h4>
                  <div className="space-y-2">
                    {suggestions.map((s, i) => (
                      <div key={i} className="text-xs font-bold text-yellow-700 flex items-center justify-between">
                         <span>{s.text}</span>
                         <span className="text-green-600">+{s.pts}pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </aside>

        {/* CENTER: Preview */}
        <main className="flex-grow bg-zinc-100 flex flex-col items-center p-12 overflow-y-auto group">
          <div className="w-full max-w-3xl flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-8 text-center sm:text-left">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Resume Preview</h2>
              <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm border border-zinc-200">
                <button onClick={() => setZoom(Math.max(50, zoom - 25))} className="p-1 px-2 hover:bg-zinc-50 rounded text-xs font-bold text-zinc-400">-</button>
                <span className="text-[10px] font-black text-zinc-900 w-10 text-center">{zoom}%</span>
                <button onClick={() => setZoom(Math.min(100, zoom + 25))} className="p-1 px-2 hover:bg-zinc-50 rounded text-xs font-bold text-zinc-400">+</button>
              </div>
            </div>

            {/* A4 Paper with watermark */}
            <div 
              style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
              className="w-full flex justify-center overflow-hidden relative cursor-pointer group"
            >
              <div style={{
                width:'100%',
                overflow:'hidden',
                boxShadow:'0 4px 24px rgba(0,0,0,0.1)',
                borderRadius:'4px',
                position:'relative',
                fontFamily: selectedFont
              }}>
                <ResumePreview
                  resumeData={resumeData}
                  templateId={selectedTemplate}
                  scale={0.6}
                />
                
                <div style={{
                  position:'absolute',
                  inset:0,
                  display:'flex',
                  alignItems:'center',
                  justifyContent:'center',
                  pointerEvents:'none'
                }}>
                  <p style={{
                    fontSize:'32px',
                    fontWeight:900,
                    color:'rgba(0,0,0,0.08)',
                    transform:'rotate(-35deg)',
                    letterSpacing:'4px',
                    userSelect:'none',
                    whiteSpace:'nowrap'
                  }}>UNLOCK TO DOWNLOAD</p>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT SIDEBAR: Customize */}
        <aside className="w-[25%] border-l border-zinc-100 p-8 overflow-y-auto hidden lg:block">
           <div className="space-y-12">
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">Customize</h2>
                
                <div className="space-y-8">
                   <div className="space-y-4">
                      <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                        <Layout size={14} /> Template
                      </label>
                      <button
                        onClick={() => setShowTemplateModal(true)}
                        style={{
                          width:'100%', padding:'10px',
                          border:'1px solid #e5e7eb',
                          borderRadius:'10px',
                          backgroundColor:'white',
                          fontSize:'14px', fontWeight:500,
                          cursor:'pointer', marginBottom:'16px',
                          display:'flex', alignItems:'center',
                          justifyContent:'center', gap:'8px'
                        }}
                      >
                        🎨 Change Template
                      </button>
                   </div>

                   <div className="space-y-4">
                      <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                         <Palette size={14} /> Color Theme
                      </label>
                      <div style={{display:'flex', gap:'8px', marginBottom:'20px'}}>
                        {colors.map(color => (
                          <button
                            key={color.value}
                            onClick={() => {
                              setSelectedColor(color.value)
                              localStorage.setItem('selectedColor', color.value)
                            }}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: color.value,
                              border: selectedColor === color.value 
                                ? '3px solid #000' 
                                : '3px solid transparent',
                              cursor: 'pointer',
                              outline: selectedColor === color.value 
                                ? '2px solid white' 
                                : 'none',
                              outlineOffset: '-4px'
                            }}
                          />
                        ))}
                      </div>
                   </div>

                   <div className="space-y-4">
                      <label className="flex items-center gap-2 text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                         <Type size={14} /> Font Style
                      </label>
                      <select
                        value={selectedFont}
                        onChange={(e) => {
                          setSelectedFont(e.target.value)
                          localStorage.setItem('selectedFont', e.target.value)
                        }}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          fontSize: '14px',
                          marginBottom: '16px',
                          outline: 'none'
                        }}
                      >
                        {fonts.map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                   </div>

                   <div className="space-y-4">
                      <div style={{marginBottom:'20px'}}>
                        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'8px'}}>
                          <span style={{fontSize:'13px', color:'#666'}}>SPACING</span>
                          <span style={{fontSize:'13px', fontWeight:600}}>{spacing}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={spacing}
                          onChange={(e) => {
                            setSpacing(Number(e.target.value))
                            localStorage.setItem('selectedSpacing', e.target.value)
                          }}
                          style={{width:'100%', accentColor:'#4F46E5'}}
                        />
                        <div style={{display:'flex', justifyContent:'space-between'}}>
                          <span style={{fontSize:'11px', color:'#999'}}>Compact</span>
                          <span style={{fontSize:'11px', color:'#999'}}>Spacious</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="space-y-3 pt-8 border-t border-zinc-50">
                  <button
                    onClick={handleReRunAI}
                    disabled={isEnhancing}
                    style={{
                      width:'100%', padding:'12px',
                      border:'1px solid #e5e7eb',
                      borderRadius:'10px',
                      backgroundColor: isEnhancing ? '#f3f4f6' : 'white',
                      fontSize:'14px', fontWeight:500,
                      cursor: isEnhancing ? 'not-allowed' : 'pointer',
                      marginBottom:'12px',
                      display:'flex', alignItems:'center',
                    justifyContent:'center', gap:'8px'
                  }}
                >
                  {isEnhancing ? '✨ Enhancing...' : '🔄 Re-run AI Enhancement'}
                </button>

                  <button
                    onClick={handleATSReport}
                    style={{
                      width:'100%', padding:'12px',
                      border:'1px solid #e5e7eb',
                      borderRadius:'10px',
                      backgroundColor:'white',
                      fontSize:'14px', fontWeight:500,
                      cursor:'pointer', marginBottom:'12px',
                      display:'flex', alignItems:'center',
                      justifyContent:'center', gap:'8px'
                    }}
                  >
                    📊 Full ATS Report
                  </button>

                  <button
                    onClick={() => navigate('/builder')}
                    style={{
                      width:'100%', padding:'12px',
                      border:'1px solid #e5e7eb',
                      borderRadius:'10px',
                      backgroundColor:'white',
                      fontSize:'14px', fontWeight:500,
                      cursor:'pointer',
                      display:'flex', alignItems:'center',
                      justifyContent:'center', gap:'8px'
                    }}
                  >
                    ✏️ Edit Resume
                  </button>
              </div>
           </div>
        </aside>
      </div>

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelect={(id: string) => {
          setSelectedTemplate(id);
          localStorage.setItem('selectedTemplate', id);
          setShowTemplateModal(false);
        }}
        selectedId={selectedTemplate}
        resumeData={resumeData}
      />

      {/* BOTTOM STICKY BAR */}
      <footer className="h-24 border-t border-zinc-100 bg-white flex items-center justify-between px-12 z-50 shrink-0">
        <div className="flex flex-col gap-1">
           <h4 className="text-sm font-bold text-zinc-900">rahul_sharma_resume_v1</h4>
           <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
             <Save size={10} /> Last saved 2 mins ago
           </p>
        </div>

        <div className="flex items-center gap-4">
           <button onClick={() => navigate('/builder')} className="flex items-center gap-2 text-zinc-500 hover:text-black font-black text-[10px] uppercase tracking-widest transition-all">
             <ArrowLeft size={16} /> Edit Resume
           </button>
           <div className="flex flex-col items-center">
              <button
                onClick={() => navigate('/payment')}
                style={{
                  padding:'14px 32px',
                  backgroundColor:'#111827',
                  color:'white',
                  border:'none',
                  borderRadius:'12px',
                  fontSize:'16px',
                  fontWeight:600,
                  cursor:'pointer'
                }}
              >
                Continue to Payment →
              </button>
              <span className="text-[10px] font-bold text-indigo-600 mt-2 uppercase tracking-widest">₹199 one-time payment</span>
           </div>
        </div>
      </footer>
    </div>
  );
};

const ScoreBar = ({ label, value }: { label: string, value: number }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center px-1">
       <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{label}</span>
       <span className="text-[10px] font-black text-zinc-900">{value}%</span>
    </div>
    <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden">
       <motion.div 
         initial={{ width: 0 }}
         animate={{ width: `${value}%` }}
         transition={{ duration: 1, ease: 'easeOut' }}
         className={`h-full rounded-full ${value >= 90 ? 'bg-green-500' : 'bg-indigo-600'}`}
       />
    </div>
  </div>
);

const CheckItem = ({ label, completed, warning, onAdd, labelClass = 'text-zinc-700' }: { label: string, completed?: boolean, warning?: boolean, onAdd?: () => void, labelClass?: string }) => (
  <div className="flex items-center justify-between">
     <div className="flex items-center gap-2">
        <div className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
          completed ? 'bg-green-500 text-white' : warning ? 'bg-yellow-400 text-white' : 'bg-zinc-100 text-zinc-300'
        }`}>
           {completed && <Check size={10} strokeWidth={4} />}
           {warning && <AlertCircle size={10} strokeWidth={4} />}
           {!completed && !warning && <X size={10} strokeWidth={4} />}
        </div>
        <span className={`text-[11px] font-bold ${labelClass}`}>{label}</span>
     </div>
     {warning && <button onClick={onAdd} className="text-[8px] font-black text-indigo-600 uppercase tracking-widest hover:underline">+ Add</button>}
  </div>
);

const LinkIcon = () => (
  <div className="flex items-center gap-2">
    <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
      <BarChart3 size={18} />
    </div>
    <span className="font-display font-black text-lg tracking-tighter uppercase">ResuMate<span className="text-zinc-400">AI</span></span>
  </div>
);
