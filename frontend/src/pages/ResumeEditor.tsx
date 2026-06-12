import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { aiAPI, resumeAPI } from '../lib/api';
import { saveResumeData, loadResumeData } from '../lib/saveService';
import { 
    User, 
    Briefcase, 
    GraduationCap, 
    Wrench, 
    ArrowLeft, 
    Plus, 
    Trash2, 
    Sparkles, 
    ChevronDown, 
    ChevronUp,
    Layout,
    Eye,
    Check,
    Save,
    Maximize2,
    Code,
    Linkedin,
    Globe,
    Mail,
    Phone,
    MapPin,
    Award,
    Languages,
    FileText,
    X,
    Upload
} from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import TemplateModal from '../components/TemplateModal';

export const ResumeEditor = () => {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState('');
    const [title, setTitle] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [linkedin, setLinkedin] = useState('');
    const [portfolio, setPortfolio] = useState('');
    const [summary, setSummary] = useState('');

    const [experience, setExperience] = useState([{
        id: 1,
        jobTitle: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
    }]);

    const [education, setEducation] = useState([{
        id: 1,
        degree: '',
        institution: '',
        location: '',
        year: '',
        grade: ''
    }]);

    const [skills, setSkills] = useState<string[]>([]);

    const [projects, setProjects] = useState([{
        id: 1,
        projectName: '',
        description: '',
        techStack: '',
        projectUrl: ''
    }]);

    const [certifications, setCertifications] = useState([{
        id: 1,
        certName: '',
        issuingOrg: '',
        issueDate: '',
        credentialUrl: ''
    }]);

    const [languages, setLanguages] = useState([{
        id: 1,
        language: '',
        proficiency: 'Fluent'
    }]);

    const [activeSections, setActiveSections] = useState<string[]>(['personal', 'experience', 'summary', 'skills']);
    const [skillInput, setSkillInput] = useState('');
    const [enhancing, setEnhancing] = useState<string | null>(null);
    const [originalText, setOriginalText] = useState<string>('');
    const [enhancedText, setEnhancedText] = useState<string>('');
    const [showComparison, setShowComparison] = useState(false);
    const [enhanceTarget, setEnhanceTarget] = useState<{ type: string, id?: number } | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState(localStorage.getItem('selectedTemplate') || 'travis-classic');
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [zoom, setZoom] = useState(0.65);
    const [resumeId, setResumeId] = useState<string>(localStorage.getItem('resumeId') || '');

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
    const [lastSaved, setLastSaved] = useState<string>('');

    const [parsing, setParsing] = useState(false);
    const [parseMsg, setParseMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Upload resume file (PDF/DOC/DOCX) → parse → form fill
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = ''; // same file dobara select ho sake
        if (!file) return;

        const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
        if (!['.pdf', '.doc', '.docx'].includes(ext)) {
            setParseMsg({ type: 'error', text: 'Only PDF, DOC, or DOCX files are supported' });
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            setParseMsg({ type: 'error', text: 'File too large (max 10 MB)' });
            return;
        }

        setParsing(true);
        setParseMsg(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/parse/resume`, {
                method: 'POST',
                body: formData
            });
            const data = await res.json();
            if (!data.success) {
                setParseMsg({ type: 'error', text: data.error || 'Parsing failed. Please try another file.' });
                return;
            }

            const r = data.resumeData;
            // Extracted info se form fill karo (empty values se overwrite nahi)
            if (r.personalInfo) {
                if (r.personalInfo.fullName) setFullName(r.personalInfo.fullName);
                if (r.personalInfo.title) setTitle(r.personalInfo.title);
                if (r.personalInfo.email) setEmail(r.personalInfo.email);
                if (r.personalInfo.phone) setPhone(r.personalInfo.phone);
                if (r.personalInfo.location) setLocation(r.personalInfo.location);
                if (r.personalInfo.linkedin) setLinkedin(r.personalInfo.linkedin);
                if (r.personalInfo.portfolio) setPortfolio(r.personalInfo.portfolio);
            }
            if (r.summary) setSummary(r.summary);
            if (r.experience?.length) setExperience(r.experience);
            if (r.education?.length) setEducation(r.education);
            if (r.skills?.length) setSkills(r.skills);
            if (r.projects?.length) setProjects(r.projects);
            if (r.certifications?.length) setCertifications(r.certifications);
            if (r.languages?.length) setLanguages(r.languages);

            // Parsed data store karo
            localStorage.setItem('resumeData', JSON.stringify(r));
            localStorage.setItem('resumeLastSaved', new Date().toISOString());

            setParseMsg({
                type: 'success',
                text: data.aiUsed
                    ? `✨ "${file.name}" parsed! Information auto-filled — review and edit below.`
                    : `📄 "${file.name}" imported (basic mode). Please review the extracted fields.`
            });
        } catch {
            setParseMsg({ type: 'error', text: 'Upload failed. Is the backend running?' });
        } finally {
            setParsing(false);
            setTimeout(() => setParseMsg(null), 8000);
        }
    };

    // Load saved data on page open:
    useEffect(() => {
        const loadData = async () => {
            const saved = await loadResumeData();
            if (saved) {
                if (saved.personalInfo) {
                    setFullName(saved.personalInfo.fullName || '');
                    setTitle(saved.personalInfo.title || '');
                    setEmail(saved.personalInfo.email || '');
                    setPhone(saved.personalInfo.phone || '');
                    setLocation(saved.personalInfo.location || '');
                    setLinkedin(saved.personalInfo.linkedin || '');
                    setPortfolio(saved.personalInfo.portfolio || '');
                }
                if (saved.summary) setSummary(saved.summary);
                if (saved.experience?.length > 0) setExperience(saved.experience);
                if (saved.education?.length > 0) setEducation(saved.education);
                if (saved.skills?.length > 0) setSkills(saved.skills);
                if (saved.projects?.length > 0) setProjects(saved.projects);
                if (saved.certifications?.length > 0) setCertifications(saved.certifications);
                if (saved.languages?.length > 0) setLanguages(saved.languages);
            }
            
            const lastSavedTime = localStorage.getItem('resumeLastSaved');
            if (lastSavedTime) {
                const date = new Date(lastSavedTime);
                setLastSaved(date.toLocaleTimeString());
            }
        };
        loadData();
    }, []);

    // Manual save function:
    const handleSave = async () => {
        setSaveStatus('saving');
        
        const resumeData = {
            personalInfo: {
                fullName,
                title,
                email,
                phone,
                location,
                linkedin,
                portfolio
            },
            summary,
            experience,
            education,
            skills,
            projects,
            certifications,
            languages
        };

        const result = await saveResumeData(resumeData);
        
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

    // Auto-save (every 30 seconds):
    useEffect(() => {
        const autoSave = setInterval(async () => {
            const resumeData = {
                personalInfo: { fullName, title, email, phone, location, linkedin, portfolio },
                summary, experience, education, skills,
                projects, certifications, languages
            };
            localStorage.setItem('resumeData', JSON.stringify(resumeData));
        }, 30000);
        
        return () => clearInterval(autoSave);
    }, [fullName, title, email, phone, location, linkedin, 
        portfolio, summary, experience, education, skills,
        projects, certifications, languages]);

    React.useEffect(() => {
        localStorage.setItem('selectedTemplate', selectedTemplate);
    }, [selectedTemplate]);

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

    const toggleSection = (id: string) => {
        setActiveSections(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    const addExperience = () => {
        setExperience(prev => [...prev, { 
            id: Date.now(), 
            jobTitle: '',
            company: '', 
            location: '', 
            startDate: '', 
            endDate: '', 
            current: false,
            description: ''
        }]);
    };

    const removeExperience = (id: number) => {
        setExperience(prev => prev.filter(exp => exp.id !== id));
    };

    const addEducation = () => {
        setEducation(prev => [...prev, { id: Date.now(), degree: '', institution: '', location: '', year: '', grade: '' }]);
    };

    const removeEducation = (id: number) => {
        setEducation(prev => prev.filter(edu => edu.id !== id));
    };

    const handleAddSkill = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && skillInput.trim()) {
            if (!skills.includes(skillInput.trim())) {
                setSkills(prev => [...prev, skillInput.trim()]);
            }
            setSkillInput('');
        }
    };

    const removeSkill = (skill: string) => {
        setSkills(prev => prev.filter(s => s !== skill));
    };

    const updateProject = (index: number, field: string, value: string) => {
        const updated = [...projects];
        updated[index] = { ...updated[index], [field]: value };
        setProjects(updated);
    };

    const addProject = () => {
        setProjects([...projects, {
            id: Date.now(),
            projectName: '',
            description: '',
            techStack: '',
            projectUrl: ''
        }]);
    };

    const removeProject = (id: number) => {
        setProjects(projects.filter((p: any) => p.id !== id));
    };

    const updateCertification = (index: number, field: string, value: string) => {
        const updated = [...certifications];
        updated[index] = { ...updated[index], [field]: value };
        setCertifications(updated);
    };

    const addCertification = () => {
        setCertifications([...certifications, {
            id: Date.now(),
            certName: '',
            issuingOrg: '',
            issueDate: '',
            credentialUrl: ''
        }]);
    };

    const removeCertification = (id: number) => {
        setCertifications(certifications.filter((c: any) => c.id !== id));
    };

    const updateLanguage = (index: number, field: string, value: string) => {
        const updated = [...languages];
        updated[index] = { ...updated[index], [field]: value };
        setLanguages(updated);
    };

    const addLanguage = () => {
        setLanguages([...languages, {
            id: Date.now(),
            language: '',
            proficiency: 'Fluent'
        }]);
    };

    const removeLanguage = (id: number) => {
        setLanguages(languages.filter((l: any) => l.id !== id));
    };

    const handleEnhanceSection = async (section: string) => {
        if (section === 'summary') {
            const text = summary;
            if (!text || text.length < 10) {
                alert('Please write a bit more before enhancing.');
                return;
            }
            setOriginalText(text);
            setEnhancing('summary');
            setEnhanceTarget({ type: 'summary' });
            try {
                const result = await aiAPI.enhance(text, 'professional summary');
                if (result.success) {
                    setEnhancedText(result.enhanced);
                    setShowComparison(true);
                } else {
                    alert('Enhancement failed');
                }
            } catch (err) {
                alert('Enhancement failed');
            } finally {
                setEnhancing(null);
            }
        }
    };

    const handleEnhanceExperience = async (id: number) => {
        const exp = experience.find(e => e.id === id);
        if (!exp || !exp.description || exp.description.length < 10) {
            alert('Please write a bit more before enhancing.');
            return;
        }
        setOriginalText(exp.description);
        setEnhancing(`experience_${id}`);
        setEnhanceTarget({ type: 'experience', id });
        try {
            const result = await aiAPI.enhance(exp.description, 'work experience description');
            if (result.success) {
                setEnhancedText(result.enhanced);
                setShowComparison(true);
            } else {
                alert('Enhancement failed');
            }
        } catch (err) {
            alert('Enhancement failed');
        } finally {
            setEnhancing(null);
        }
    };

    const handleEnhanceProject = async (id: number) => {
        const proj = projects.find(p => p.id === id);
        if (!proj || !proj.description || proj.description.length < 10) {
            alert('Please write a bit more before enhancing.');
            return;
        }
        setOriginalText(proj.description);
        setEnhancing(`project_${id}`);
        setEnhanceTarget({ type: 'project', id });
        try {
            const result = await aiAPI.enhance(proj.description, 'project description');
            if (result.success) {
                setEnhancedText(result.enhanced);
                setShowComparison(true);
            } else {
                alert('Enhancement failed');
            }
        } catch (err) {
            alert('Enhancement failed');
        } finally {
            setEnhancing(null);
        }
    };

    const applyEnhancement = () => {
        if (!enhanceTarget) return;

        if (enhanceTarget.type === 'summary') {
            setSummary(enhancedText);
        } else if (enhanceTarget.type === 'experience' && enhanceTarget.id) {
            const id = enhanceTarget.id;
            setExperience(prev => prev.map(exp => exp.id === id ? { ...exp, description: enhancedText } : exp));
        } else if (enhanceTarget.type === 'project' && enhanceTarget.id) {
            const id = enhanceTarget.id;
            setProjects(prev => prev.map(p => p.id === id ? { ...p, description: enhancedText } : p));
        }
        setShowComparison(false);
    };

    const resumeData = {
        personalInfo: {
            fullName: fullName || '',
            title: title || '',
            email: email || '',
            phone: phone || '',
            location: location || '',
            linkedin: linkedin || '',
            portfolio: portfolio || ''
        },
        summary: summary || '',
        experience: experience || [],
        education: education || [],
        skills: skills || [],
        projects: projects || [],
        certifications: certifications || [],
        languages: languages || []
    };

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden">
            {/* Top Bar */}
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

                <div className="flex items-center gap-3">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />
                    <button
                        onClick={() => setShowTemplateModal(true)}
                        className="text-sm font-bold text-zinc-500 hover:text-black transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent hover:border-zinc-100"
                    >
                        <Layout size={16} />
                        Change Template
                    </button>
                    <button className="text-sm font-bold text-zinc-500 hover:text-black transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent hover:border-zinc-100">
                        <Eye size={16} />
                        Preview Full
                    </button>
                    <button 
                        onClick={() => navigate('/enhance')}
                        className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                    >
                        Continue
                        <Check size={18} strokeWidth={3} />
                    </button>
                </div>
            </header>

            <div className="flex flex-grow overflow-hidden relative">
                {/* Left Side: Form */}
                <div className="w-full lg:w-1/2 overflow-y-auto p-8 md:p-12 border-r border-zinc-100">
                    <div className="max-w-xl mx-auto space-y-12 pb-32">

                        {/* Upload Resume Card */}
                        <div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={parsing}
                                style={{
                                    width: '100%',
                                    padding: '20px',
                                    border: '2px dashed',
                                    borderColor: parsing ? '#93c5fd' : parseMsg?.type === 'error' ? '#fca5a5' : '#a7f3d0',
                                    borderRadius: '12px',
                                    backgroundColor: parsing ? '#eff6ff' : parseMsg?.type === 'error' ? '#fef2f2' : '#f0fdf4',
                                    cursor: parsing ? 'wait' : 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    transition: 'all 0.2s',
                                    textAlign: 'left'
                                }}
                            >
                                <div style={{
                                    width: '40px', height: '40px', borderRadius: '10px', flexShrink: 0,
                                    backgroundColor: parsing ? '#dbeafe' : parseMsg?.type === 'error' ? '#fee2e2' : '#dcfce7',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                                }}>
                                    <Upload size={20} color={parsing ? '#2563eb' : parseMsg?.type === 'error' ? '#dc2626' : '#16a34a'} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    {parsing ? (
                                        <>
                                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#1d4ed8' }}>Reading your resume...</div>
                                            <div style={{ fontSize: '12px', color: '#3b82f6', marginTop: '2px' }}>Extracting information, please wait</div>
                                        </>
                                    ) : parseMsg ? (
                                        <>
                                            <div style={{ fontWeight: 700, fontSize: '14px', color: parseMsg.type === 'success' ? '#15803d' : '#b91c1c' }}>{parseMsg.text}</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>Click to upload another file</div>
                                        </>
                                    ) : (
                                        <>
                                            <div style={{ fontWeight: 700, fontSize: '14px', color: '#15803d' }}>Upload Existing Resume</div>
                                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '2px' }}>PDF, DOC, or DOCX — auto-fills all fields below</div>
                                        </>
                                    )}
                                </div>
                                {!parsing && (
                                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#16a34a', whiteSpace: 'nowrap' }}>
                                        Browse file
                                    </div>
                                )}
                            </button>
                        </div>

                        <div>
                            <h2 className="text-3xl font-display font-bold mb-2">Your Information</h2>
                            <p className="text-zinc-500">Fill in your details — AI will optimize using the JD</p>
                        </div>

                        {/* 1. Personal Info */}
                        <CollapsibleSection 
                            id="personal" 
                            title="Personal Info" 
                            icon={<User size={18} />} 
                            isOpen={activeSections.includes('personal')} 
                            onToggle={() => toggleSection('personal')}
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <FormInput label="Full Name" value={fullName} onChange={setFullName} placeholder="John Doe" />
                                <FormInput label="Professional Title" value={title} onChange={setTitle} placeholder="Senior Product Designer" />
                                <FormInput label="Email" value={email} onChange={setEmail} placeholder="john@example.com" />
                                <FormInput label="Phone" value={phone} onChange={setPhone} placeholder="+1 (555) 000-0000" />
                                <FormInput label="Location" value={location} onChange={setLocation} placeholder="San Francisco, CA" />
                                <FormInput label="LinkedIn URL" value={linkedin} onChange={setLinkedin} placeholder="linkedin.com/in/johndoe" />
                                <div className="col-span-2">
                                    <FormInput label="Portfolio URL" value={portfolio} onChange={setPortfolio} placeholder="johndoe.design" />
                                </div>
                            </div>
                        </CollapsibleSection>

                        {/* 2. Summary */}
                        <CollapsibleSection 
                            id="summary" 
                            title="Professional Summary" 
                            icon={<FileText size={18} />} 
                            isOpen={activeSections.includes('summary')} 
                            onToggle={() => toggleSection('summary')}
                        >
                            <div className="space-y-4">
                                    <textarea
                                        value={summary}
                                        onChange={(e) => setSummary(e.target.value)}
                                        placeholder="Write a brief summary about yourself..."
                                        className="w-full min-h-[150px] bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                    />
                                    <button 
                                        onClick={() => handleEnhanceSection('summary')}
                                        disabled={enhancing === 'summary'}
                                        className="flex items-center gap-2 text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors uppercase tracking-widest disabled:opacity-50"
                                    >
                                        <Sparkles size={14} className={enhancing === 'summary' ? 'animate-spin' : ''} />
                                        {enhancing === 'summary' ? '✨ Enhancing...' : 'Enhance with AI'}
                                    </button>
                            </div>
                        </CollapsibleSection>

                        {/* 3. Work Experience */}
                        <CollapsibleSection 
                            id="experience" 
                            title="Work Experience" 
                            icon={<Briefcase size={18} />} 
                            isOpen={activeSections.includes('experience')} 
                            onToggle={() => toggleSection('experience')}
                        >
                            <div className="space-y-8">
                                {(experience || []).map((exp, index) => (
                                    <div key={exp?.id || index} className="p-6 bg-zinc-50 border border-zinc-100 rounded-2xl relative group">
                                        <button 
                                            onClick={() => removeExperience(exp.id)}
                                            className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormInput label="Company Name" value={exp.company} onChange={(v) => {
                                                const updated = [...experience];
                                                updated[index] = { ...updated[index], company: v };
                                                setExperience(updated);
                                            }} placeholder="e.g. Google" />
                                            <FormInput label="Job Title" value={exp.jobTitle} onChange={(v) => {
                                                const updated = [...experience];
                                                updated[index] = { ...updated[index], jobTitle: v };
                                                setExperience(updated);
                                            }} placeholder="e.g. Senior Product Designer" />
                                            <FormInput label="Start Date" value={exp.startDate} onChange={(v) => {
                                                const updated = [...experience];
                                                updated[index] = { ...updated[index], startDate: v };
                                                setExperience(updated);
                                            }} placeholder="MM / YYYY" />
                                            <FormInput label="End Date" value={exp.endDate} onChange={(v) => {
                                                const updated = [...experience];
                                                updated[index] = { ...updated[index], endDate: v };
                                                setExperience(updated);
                                            }} placeholder="Present" />
                                            <div className="col-span-2">
                                                <FormInput label="Location" value={exp.location} onChange={(v) => {
                                                    const updated = [...experience];
                                                    updated[index] = { ...updated[index], location: v };
                                                    setExperience(updated);
                                                }} placeholder="City, Country" />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Description</label>
                                                <textarea
                                                    value={exp.description}
                                                    onChange={(e) => {
                                                        const updated = [...experience];
                                                        updated[index] = { ...updated[index], description: e.target.value };
                                                        setExperience(updated);
                                                    }}
                                                    placeholder="• Managed a team of 10..."
                                                    className="w-full min-h-[120px] bg-white border border-zinc-200 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                                />
                                                <button 
                                                    onClick={() => handleEnhanceExperience(exp.id)}
                                                    disabled={enhancing === `experience_${exp.id}`}
                                                    className="mt-2 flex items-center gap-2 text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-indigo-50 transition-colors uppercase tracking-widest disabled:opacity-50"
                                                >
                                                    <Sparkles size={12} className={enhancing === `experience_${exp.id}` ? 'animate-spin' : ''} />
                                                    {enhancing === `experience_${exp.id}` ? '✨ Enhancing...' : 'Enhance with AI'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    onClick={addExperience}
                                    className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:text-black hover:border-zinc-200 transition-colors font-bold text-sm uppercase tracking-widest"
                                >
                                    <Plus size={18} />
                                    Add Another Experience
                                </button>
                            </div>
                        </CollapsibleSection>

                        {/* 4. Education */}
                        <CollapsibleSection 
                            id="education" 
                            title="Education" 
                            icon={<GraduationCap size={18} />} 
                            isOpen={activeSections.includes('education')} 
                            onToggle={() => toggleSection('education')}
                        >
                            <div className="space-y-6">
                                {(education || []).map((edu, index) => (
                                    <div key={edu?.id || index} className="p-6 bg-zinc-50 border border-zinc-100 rounded-2xl relative group">
                                        <button 
                                            onClick={() => removeEducation(edu.id)}
                                            className="absolute top-4 right-4 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <div className="grid grid-cols-2 gap-4">
                                            <FormInput label="Institution Name" value={edu.institution} onChange={(v) => {
                                                const updated = [...education];
                                                updated[index] = { ...updated[index], institution: v };
                                                setEducation(updated);
                                            }} placeholder="University Name" />
                                            <FormInput label="Degree / Field" value={edu.degree} onChange={(v) => {
                                                const updated = [...education];
                                                updated[index] = { ...updated[index], degree: v };
                                                setEducation(updated);
                                            }} placeholder="Bachelor of Design" />
                                            <FormInput label="Year" value={edu.year} onChange={(v) => {
                                                const updated = [...education];
                                                updated[index] = { ...updated[index], year: v };
                                                setEducation(updated);
                                            }} placeholder="2020" />
                                            <FormInput label="Grade / GPA" value={edu.grade} onChange={(v) => {
                                                const updated = [...education];
                                                updated[index] = { ...updated[index], grade: v };
                                                setEducation(updated);
                                            }} placeholder="3.8 / 4.0" />
                                        </div>
                                    </div>
                                ))}
                                <button 
                                    onClick={addEducation}
                                    className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:text-black hover:border-zinc-200 transition-colors font-bold text-sm uppercase tracking-widest"
                                >
                                    <Plus size={18} />
                                    Add Education
                                </button>
                            </div>
                        </CollapsibleSection>

                        {/* 5. Skills */}
                        <CollapsibleSection 
                            id="skills" 
                            title="Skills" 
                            icon={<Wrench size={18} />} 
                            isOpen={activeSections.includes('skills')} 
                            onToggle={() => toggleSection('skills')}
                        >
                            <div className="space-y-4">
                                <div className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50 focus-within:border-indigo-500 transition-colors">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {(skills || []).map((skill) => (
                                            <span key={skill} className="flex items-center gap-1.5 bg-white border border-zinc-200 px-3 py-1 rounded-full text-xs font-bold text-zinc-600 shadow-sm">
                                                {skill}
                                                <button onClick={() => removeSkill(skill)} className="hover:text-red-500 transition-colors">
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input 
                                        type="text" 
                                        value={skillInput}
                                        onChange={(e) => setSkillInput(e.target.value)}
                                        onKeyDown={handleAddSkill}
                                        placeholder="Type skill & press Enter..."
                                        className="bg-transparent border-none outline-none text-sm w-full"
                                    />
                                </div>
                                <button className="flex items-center gap-2 text-blue-600 border border-blue-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-50 transition-colors uppercase tracking-widest">
                                    <Sparkles size={14} />
                                    AI Suggest Skills from JD
                                </button>
                            </div>
                        </CollapsibleSection>

                        {/* 6. Projects */}
                        <CollapsibleSection 
                            id="projects" 
                            title="Projects" 
                            icon={<Code size={18} />} 
                            isOpen={activeSections.includes('projects')} 
                            onToggle={() => toggleSection('projects')}
                        >
                            <div style={{marginBottom: '16px'}}>
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                                    <h3 style={{margin:0, fontSize:'16px', fontWeight:600}}>Projects</h3>
                                    <span style={{fontSize:'11px', backgroundColor:'#f3f4f6', color:'#6b7280', padding:'2px 8px', borderRadius:'10px'}}>Optional</span>
                                </div>
                                {projects.map((proj: any, index: number) => (
                                    <div key={proj.id} style={{backgroundColor:'white', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'16px', marginBottom:'12px', position:'relative'}}>
                                        <button onClick={() => removeProject(proj.id)}
                                            style={{position:'absolute', top:'12px', right:'12px', background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize:'20px', fontWeight:'bold'}}>×</button>
                                        <div style={{marginBottom:'10px'}}>
                                            <label style={{fontSize:'11px', fontWeight:600, color:'#6b7280', display:'block', marginBottom:'4px'}}>PROJECT NAME</label>
                                            <input type="text" value={proj.projectName}
                                                onChange={(e) => updateProject(index, 'projectName', e.target.value)}
                                                placeholder="My Awesome Project"
                                                style={{width:'100%', padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box'}}/>
                                        </div>
                                        <div style={{marginBottom:'10px'}}>
                                            <label style={{fontSize:'11px', fontWeight:600, color:'#6b7280', display:'block', marginBottom:'4px'}}>TECH STACK</label>
                                            <input type="text" value={proj.techStack}
                                                onChange={(e) => updateProject(index, 'techStack', e.target.value)}
                                                placeholder="React, Node.js, MongoDB"
                                                style={{width:'100%', padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box'}}/>
                                        </div>
                                        <div style={{marginBottom:'10px'}}>
                                            <label style={{fontSize:'11px', fontWeight:600, color:'#6b7280', display:'block', marginBottom:'4px'}}>DESCRIPTION</label>
                                            <textarea value={proj.description}
                                                onChange={(e) => updateProject(index, 'description', e.target.value)}
                                                placeholder="Describe your project..."
                                                rows={3}
                                                style={{width:'100%', padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'14px', outline:'none', resize:'vertical', boxSizing:'border-box'}}/>
                                        </div>
                                        <div>
                                            <label style={{fontSize:'11px', fontWeight:600, color:'#6b7280', display:'block', marginBottom:'4px'}}>PROJECT URL (OPTIONAL)</label>
                                            <input type="url" value={proj.projectUrl}
                                                onChange={(e) => updateProject(index, 'projectUrl', e.target.value)}
                                                placeholder="https://github.com/..."
                                                style={{width:'100%', padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box'}}/>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addProject}
                                    style={{width:'100%', padding:'10px', border:'2px dashed #c7d2fe', borderRadius:'10px', backgroundColor:'transparent', color:'#4F46E5', fontSize:'14px', fontWeight:600, cursor:'pointer'}}>
                                    + Add Project
                                </button>
                            </div>
                        </CollapsibleSection>

                        {/* 7. Certifications */}
                        <CollapsibleSection 
                            id="certifications" 
                            title="Certifications" 
                            icon={<Award size={18} />} 
                            isOpen={activeSections.includes('certifications')} 
                            onToggle={() => toggleSection('certifications')}
                        >
                            <div style={{marginBottom:'16px'}}>
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                                    <h3 style={{margin:0, fontSize:'16px', fontWeight:600}}>Certifications</h3>
                                    <span style={{fontSize:'11px', backgroundColor:'#f3f4f6', color:'#6b7280', padding:'2px 8px', borderRadius:'10px'}}>Optional</span>
                                </div>
                                {certifications.map((cert: any, index: number) => (
                                    <div key={cert.id} style={{backgroundColor:'white', border:'1px solid #e5e7eb', borderRadius:'12px', padding:'16px', marginBottom:'12px', position:'relative'}}>
                                        <button onClick={() => removeCertification(cert.id)}
                                            style={{position:'absolute', top:'12px', right:'12px', background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize:'20px', fontWeight:'bold'}}>×</button>
                                        <div style={{marginBottom:'10px'}}>
                                            <label style={{fontSize:'11px', fontWeight:600, color:'#6b7280', display:'block', marginBottom:'4px'}}>CERTIFICATION NAME</label>
                                            <input type="text" value={cert.certName}
                                                onChange={(e) => updateCertification(index, 'certName', e.target.value)}
                                                placeholder="AWS Certified Developer"
                                                style={{width:'100%', padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box'}}/>
                                        </div>
                                        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'10px'}}>
                                            <div>
                                                <label style={{fontSize:'11px', fontWeight:600, color:'#6b7280', display:'block', marginBottom:'4px'}}>ISSUING ORGANIZATION</label>
                                                <input type="text" value={cert.issuingOrg}
                                                    onChange={(e) => updateCertification(index, 'issuingOrg', e.target.value)}
                                                    placeholder="Amazon Web Services"
                                                    style={{width:'100%', padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box'}}/>
                                            </div>
                                            <div>
                                                <label style={{fontSize:'11px', fontWeight:600, color:'#6b7280', display:'block', marginBottom:'4px'}}>ISSUE DATE</label>
                                                <input type="text" value={cert.issueDate}
                                                    onChange={(e) => updateCertification(index, 'issueDate', e.target.value)}
                                                    placeholder="Jan 2024"
                                                    style={{width:'100%', padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box'}}/>
                                            </div>
                                        </div>
                                        <div>
                                            <label style={{fontSize:'11px', fontWeight:600, color:'#6b7280', display:'block', marginBottom:'4px'}}>CREDENTIAL URL (OPTIONAL)</label>
                                            <input type="url" value={cert.credentialUrl}
                                                onChange={(e) => updateCertification(index, 'credentialUrl', e.target.value)}
                                                placeholder="https://credential.net/..."
                                                style={{width:'100%', padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'14px', outline:'none', boxSizing:'border-box'}}/>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addCertification}
                                    style={{width:'100%', padding:'10px', border:'2px dashed #c7d2fe', borderRadius:'10px', backgroundColor:'transparent', color:'#4F46E5', fontSize:'14px', fontWeight:600, cursor:'pointer'}}>
                                    + Add Certification
                                </button>
                            </div>
                        </CollapsibleSection>

                        {/* 8. Languages */}
                        <CollapsibleSection 
                            id="languages" 
                            title="Languages" 
                            icon={<Languages size={18} />} 
                            isOpen={activeSections.includes('languages')} 
                            onToggle={() => toggleSection('languages')}
                        >
                            <div style={{marginBottom:'16px'}}>
                                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px'}}>
                                    <h3 style={{margin:0, fontSize:'16px', fontWeight:600}}>Languages</h3>
                                    <span style={{fontSize:'11px', backgroundColor:'#f3f4f6', color:'#6b7280', padding:'2px 8px', borderRadius:'10px'}}>Optional</span>
                                </div>
                                {languages.map((lang: any, index: number) => (
                                    <div key={lang.id} style={{display:'flex', gap:'10px', alignItems:'center', marginBottom:'10px'}}>
                                        <input type="text" value={lang.language}
                                            onChange={(e) => updateLanguage(index, 'language', e.target.value)}
                                            placeholder="Hindi, English..."
                                            style={{flex:1, padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'14px', outline:'none'}}/>
                                        <select value={lang.proficiency}
                                            onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)}
                                            style={{padding:'8px 12px', border:'1px solid #e5e7eb', borderRadius:'8px', fontSize:'14px', outline:'none', backgroundColor:'white'}}>
                                            <option>Native</option>
                                            <option>Fluent</option>
                                            <option>Advanced</option>
                                            <option>Intermediate</option>
                                            <option>Basic</option>
                                        </select>
                                        <button onClick={() => removeLanguage(lang.id)}
                                            style={{background:'none', border:'none', color:'#ef4444', cursor:'pointer', fontSize:'20px', fontWeight:'bold', padding:'4px 8px'}}>×</button>
                                    </div>
                                ))}
                                <button onClick={addLanguage}
                                    style={{width:'100%', padding:'10px', border:'2px dashed #c7d2fe', borderRadius:'10px', backgroundColor:'transparent', color:'#4F46E5', fontSize:'14px', fontWeight:600, cursor:'pointer'}}>
                                    + Add Language
                                </button>
                            </div>
                        </CollapsibleSection>
                    </div>
                </div>

                {/* Right Side: Live Preview */}
                {/* CSS zoom in ResumePreview properly shrinks the A4 page in layout flow,
                    so no clip-box tricks needed — just center it with natural sizing */}
                <div className="hidden lg:flex w-1/2 bg-zinc-100 justify-center overflow-y-auto py-6 px-4">
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        <p style={{
                            fontSize: '10px',
                            letterSpacing: '2px',
                            color: '#999',
                            marginBottom: '12px',
                            fontWeight: 600,
                            textTransform: 'uppercase'
                        }}>Live Preview • {selectedTemplate}</p>

                        <ResumePreview
                            resumeData={resumeData}
                            templateId={selectedTemplate}
                            scale={zoom}
                        />
                    </div>
                </div>
            </div>

            {/* Comparison Modal */}
            <AnimatePresence>
                {showComparison && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[32px] p-8 max-w-2xl w-full shadow-2xl"
                        >
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                                    <Sparkles size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold">AI Enhancement</h3>
                                    <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Review the suggested improvements</p>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Original</p>
                                    <div className="bg-zinc-50 rounded-2xl p-5 text-sm text-zinc-600 leading-relaxed border border-zinc-100 min-h-[200px]">
                                        {originalText}
                                    </div>
                                </div>
                                
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest px-1">✨ AI Enhanced</p>
                                    <div className="bg-indigo-50/50 rounded-2xl p-5 text-sm text-indigo-900 leading-relaxed border border-indigo-100 min-h-[200px]">
                                        {enhancedText}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => setShowComparison(false)}
                                    className="flex-1 py-4 border border-zinc-200 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-zinc-50 transition-colors"
                                >
                                    Keep Original
                                </button>
                                <button 
                                    onClick={applyEnhancement}
                                    className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                                >
                                    Use Enhanced Version
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <TemplateModal 
                isOpen={showTemplateModal}
                onClose={() => setShowTemplateModal(false)}
                onSelect={(id) => setSelectedTemplate(id)}
                selectedId={selectedTemplate}
                resumeData={resumeData}
            />

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

const CollapsibleSection = ({ id, title, icon, isOpen, onToggle, children }: any) => (
    <div className="border border-zinc-100 rounded-3xl overflow-hidden shadow-sm bg-white transition-all hover:shadow-md">
        <button 
            onClick={onToggle}
            className="w-full flex items-center justify-between p-6 bg-white hover:bg-zinc-50 transition-colors"
        >
            <div className="flex items-center gap-4">
                <div className={`p-2.5 rounded-xl ${isOpen ? 'bg-indigo-600 text-white' : 'bg-zinc-50 text-zinc-400'}`}>
                    {icon}
                </div>
                <h3 className="font-bold text-lg">{title}</h3>
            </div>
            {isOpen ? <ChevronUp size={20} className="text-zinc-400" /> : <ChevronDown size={20} className="text-zinc-300" />}
        </button>
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                >
                    <div className="p-8 pt-0 border-t border-zinc-50">
                        {children}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);

const FormInput = ({ label, value, onChange, placeholder, type = 'text' }: any) => (
    <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">{label}</label>
        <input 
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-300"
        />
    </div>
);
