import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { enhanceText, enhanceFullResume } from '../lib/aiService';
import { 
    Linkedin, 
    User, 
    Check, 
    Mail, 
    Phone, 
    MapPin, 
    Globe, 
    Briefcase, 
    GraduationCap, 
    FileText, 
    Sparkles, 
    Save, 
    Eye, 
    Layout, 
    ArrowLeft,
    Plus,
    Trash2,
    ChevronUp,
    ChevronDown,
    X,
    Code,
    Award,
    Languages,
    Maximize2,
    Wrench,
    ArrowRight
} from 'lucide-react';
import ResumePreview from '../components/ResumePreview';
import TemplateModal from '../components/TemplateModal';

export const LinkedInImport = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [loadingStep, setLoadingStep] = useState(0);

    // Flat State Variables
    const [fullName, setFullName] = useState('Rahul Sharma');
    const [title, setTitle] = useState('Senior Software Engineer');
    const [email, setEmail] = useState('rahul.sharma@gmail.com');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('Mumbai, India');
    const [linkedin, setLinkedin] = useState('linkedin.com/in/rahulsharma');
    const [portfolio, setPortfolio] = useState('');
    const [summary, setSummary] = useState('Experienced software engineer with 5+ years of expertise in full-stack development. Proven track record in building scalable web applications and leading technical initiatives.');

    const [experience, setExperience] = useState([
        { 
            id: 1, 
            company: 'TCS', 
            jobTitle: 'Software Engineer', 
            startDate: '2020', 
            endDate: '2024', 
            location: 'Mumbai, India', 
            description: 'Leading the development of enterprise-scale microservices using Node.js and Java.',
            imported: true
        },
        { 
            id: 2, 
            company: 'Infosys', 
            jobTitle: 'Junior Developer', 
            startDate: '2018', 
            endDate: '2020', 
            location: 'Pune, India', 
            description: 'Developed and maintained frontend components using React and Redux.',
            imported: true
        }
    ]);

    const [education, setEducation] = useState([
        { 
            id: 1, 
            institution: 'Mumbai University', 
            degree: 'B.Tech Computer Science', 
            year: '2018', 
            grade: 'First Class',
            imported: true
        }
    ]);

    const [skills, setSkills] = useState(['React', 'Node.js', 'Python', 'AWS', 'MongoDB']);
    
    const [projects, setProjects] = useState([
        { id: 1, projectName: '', description: '', techStack: '', projectUrl: '' }
    ]);
    
    const [certifications, setCertifications] = useState([
        { id: 1, certName: 'AWS Certified Solutions Architect', issuingOrg: 'Amazon Web Services', issueDate: '2022', imported: true }
    ]);
    
    const [languages, setLanguages] = useState([
        { id: 1, language: 'English', proficiency: 'Native', imported: true },
        { id: 2, language: 'Hindi', proficiency: 'Native', imported: true }
    ]);
    const [isEnhancing, setIsEnhancing] = useState(false);
    const [enhancingSection, setEnhancingSection] = useState<string | null>(null);
    const [selectedTemplate, setSelectedTemplate] = useState(localStorage.getItem('selectedTemplate') || 'travis-classic');
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [zoom, setZoom] = useState(0.8);
    const [isEnhanced, setIsEnhanced] = useState(false);

    // AI Comparison States
    const [originalText, setOriginalText] = useState<string>('');
    const [enhancedText, setEnhancedText] = useState<string>('');
    const [showComparison, setShowComparison] = useState(false);
    const [enhanceTarget, setEnhanceTarget] = useState<{ type: string, id?: number } | null>(null);

    const handleEnhanceAll = async () => {
        setIsEnhancing(true);
        try {
            const resumeDataForAI = {
                personal: { fullName, title, email, phone, location, linkedin, portfolio, summary },
                experience,
                projects
            };
            const enhanced = await enhanceFullResume(resumeDataForAI);
            
            setSummary(enhanced.personal.summary);
            setExperience(enhanced.experience);
            setProjects(enhanced.projects);
            setIsEnhanced(true);
            alert('All sections enhanced successfully!');
        } catch (err) {
            console.error(err);
            alert('Enhancement failed, try again');
        } finally {
            setIsEnhancing(false);
        }
    };

    const handleEnhanceSection = async (type: string, id?: number) => {
        setEnhancingSection(id ? `${type}_${id}` : type);
        setEnhanceTarget({ type, id });
        try {
            if (type === 'summary') {
                setOriginalText(summary);
                const improved = await enhanceText(summary, 'professional summary');
                setEnhancedText(improved);
                setShowComparison(true);
            } else if (type === 'experience' && id) {
                const exp = experience.find(e => e.id === id);
                if (exp) {
                    setOriginalText(exp.description);
                    const improved = await enhanceText(exp.description, 'work experience');
                    setEnhancedText(improved);
                    setShowComparison(true);
                }
            } else if (type === 'project' && id) {
                const proj = projects.find(p => p.id === id);
                if (proj) {
                    setOriginalText(proj.description);
                    const improved = await enhanceText(proj.description, 'project');
                    setEnhancedText(improved);
                    setShowComparison(true);
                }
            }
        } catch (err) {
            alert('Enhancement failed, try again');
        } finally {
            setEnhancingSection(null);
        }
    };

    const applyEnhancement = () => {
        if (!enhanceTarget) return;

        if (enhanceTarget.type === 'summary') {
            setSummary(enhancedText);
        } else if (enhanceTarget.type === 'experience' && enhanceTarget.id) {
            const id = enhanceTarget.id;
            setExperience(prev => prev.map(e => e.id === id ? { ...e, description: enhancedText } : e));
        } else if (enhanceTarget.type === 'project' && enhanceTarget.id) {
            const id = enhanceTarget.id;
            setProjects(prev => prev.map(p => p.id === id ? { ...p, description: enhancedText } : p));
        }
        setShowComparison(false);
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

    const [activeSections, setActiveSections] = useState<string[]>(['personal', 'experience', 'summary', 'skills', 'education']);
    const [skillInput, setSkillInput] = useState('');

    const loadingSteps = [
        "Connecting to LinkedIn...",
        "Fetching profile information...",
        "Importing work experience...",
        "Importing education & skills...",
        "Organizing your data..."
    ];

    useEffect(() => {
        let timer: any;
        let timeout: any;
        if (isLoading) {
            timer = setInterval(() => {
                setLoadingStep(prev => {
                    if (prev < loadingSteps.length - 1) return prev + 1;
                    clearInterval(timer);
                    timeout = setTimeout(() => setIsLoading(false), 800);
                    return prev;
                });
            }, 800);
        }
        return () => {
            if (timer) clearInterval(timer);
            if (timeout) clearTimeout(timeout);
        };
    }, [isLoading, loadingSteps.length]);

    const toggleSection = (id: string) => {
        setActiveSections(prev => 
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center font-sans">
                <div className="relative mb-12">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                        className="w-24 h-24 border-4 border-blue-50 border-t-[#0A66C2] rounded-full"
                    />
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute inset-0 flex items-center justify-center text-[#0A66C2]"
                    >
                        <Linkedin size={40} fill="currentColor" />
                    </motion.div>
                </div>

                <h2 className="text-3xl font-display font-bold text-zinc-900 mb-2">Importing your LinkedIn profile...</h2>
                <p className="text-zinc-500 mb-12 font-medium">This takes just a few seconds</p>

                <div className="w-full max-w-sm space-y-4 mb-16">
                    {loadingSteps.map((step, idx) => (
                        <motion.div 
                            key={step}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: idx <= loadingStep ? 1 : 0.3, x: 0 }}
                            className="flex items-center gap-3 text-left"
                        >
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                idx < loadingStep ? 'bg-green-500 text-white' : 
                                idx === loadingStep ? 'bg-[#0A66C2] text-white animate-pulse' : 'bg-zinc-100 text-zinc-300'
                            }`}>
                                {idx < loadingStep ? <Check size={14} strokeWidth={3} /> : <div className="w-1.5 h-1.5 rounded-full bg-current" />}
                            </div>
                            <span className={`text-sm font-bold ${idx === loadingStep ? 'text-black' : 'text-zinc-500'}`}>
                                {step}
                            </span>
                        </motion.div>
                    ))}
                </div>

                <div className="w-full max-w-md bg-zinc-50 border border-zinc-100 rounded-3xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-zinc-100">
                        <motion.div 
                            initial={{ width: '0%' }}
                            animate={{ width: '85%' }}
                            transition={{ duration: 4 }}
                            className="h-full bg-[#0A66C2]"
                        />
                    </div>
                    <div className="flex gap-4 items-start text-left">
                        <div className="bg-white p-2 rounded-xl text-blue-500 shadow-sm border border-zinc-100">
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-1">Fun Fact</p>
                            <p className="text-sm font-bold text-zinc-700 leading-relaxed">
                                Profiles imported via LinkedIn are 40% more complete on average.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
            {/* Top Bar with Success Banner */}
            <header className="shrink-0 z-30">
                <div className="bg-green-50 border-b border-green-100 px-6 py-2.5 flex items-center justify-center gap-3">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0">
                        <Check size={12} strokeWidth={3} />
                    </div>
                    <p className="text-sm font-bold text-green-800">
                        LinkedIn import successful! Review and edit your information below.
                    </p>
                </div>
                <div className="h-16 border-b border-zinc-100 flex items-center justify-between px-6 bg-white">
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/linkedin')} className="p-2 hover:bg-zinc-50 rounded-lg transition-colors">
                            <ArrowLeft size={18} />
                        </button>
                        <div className="h-6 w-[1px] bg-zinc-100" />
                        <div className="flex items-center gap-2">
                             <Save size={14} className="text-zinc-400" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">All changes saved</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => setShowTemplateModal(true)}
                            className="text-xs font-bold text-zinc-500 hover:text-black flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent hover:border-zinc-100 uppercase tracking-widest transition-all"
                        >
                            <Layout size={14} />
                            Template
                        </button>
                        <button className="text-xs font-bold text-zinc-500 hover:text-black flex items-center gap-2 px-3 py-1.5 rounded-lg border border-transparent hover:border-zinc-100 uppercase tracking-widest transition-all">
                            <Eye size={14} />
                            Preview
                        </button>
                        <button 
                            onClick={() => navigate('/linkedin-enhance')}
                            className="bg-indigo-600 text-white px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
                        >
                            Continue
                            <Check size={16} strokeWidth={3} />
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-grow overflow-hidden relative">
                {/* Left Side: Form */}
                <div className="w-full lg:w-1/2 overflow-y-auto p-8 md:p-12 border-r border-zinc-100">
                    <div className="max-w-xl mx-auto space-y-12 pb-40">
                        <div>
                            <h2 className="text-3xl font-display font-bold mb-2">Editor</h2>
                            <p className="text-zinc-500">Edit the information imported from your LinkedIn profile.</p>
                        </div>

                        {/* 1. Personal Info */}
                        <CollapsibleSection 
                            id="personal" 
                            title="Personal Info" 
                            icon={<User size={18} />} 
                            isOpen={activeSections.includes('personal')} 
                            onToggle={() => toggleSection('personal')}
                            isImported
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <FormInput label="Full Name" value={fullName} onChange={setFullName} placeholder="John Doe" isImported />
                                </div>
                                <div className="col-span-2">
                                    <FormInput label="Professional Title" value={title} onChange={setTitle} placeholder="Senior Product Designer" isImported />
                                </div>
                                <FormInput label="Email" value={email} onChange={setEmail} placeholder="john@example.com" isImported />
                                <FormInput label="Phone" value={phone} onChange={setPhone} placeholder="+1 (555) 000-0000" />
                                <FormInput label="Location" value={location} onChange={setLocation} placeholder="San Francisco, CA" isImported />
                                <FormInput label="LinkedIn URL" value={linkedin} onChange={setLinkedin} placeholder="linkedin.com/in/johndoe" isImported />
                                <FormInput label="Portfolio URL" value={portfolio} onChange={setPortfolio} placeholder="johndoe.design" />
                            </div>
                        </CollapsibleSection>

                        {/* 2. Summary */}
                        <CollapsibleSection 
                            id="summary" 
                            title="Professional Summary" 
                            icon={<FileText size={18} />} 
                            isOpen={activeSections.includes('summary')} 
                            onToggle={() => toggleSection('summary')}
                            isImported
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
                                        disabled={enhancingSection === 'summary'}
                                        className="flex items-center gap-2 text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors uppercase tracking-widest group disabled:opacity-50"
                                    >
                                        <Sparkles size={14} className={enhancingSection === 'summary' ? 'animate-spin' : 'group-hover:animate-pulse'} />
                                        {enhancingSection === 'summary' ? '✨ Enhancing...' : 'Enhance with AI'}
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
                            isImported
                        >
                            <div className="space-y-8">
                                {(experience || []).map((exp, index) => (
                                    <div key={exp?.id || index} className="p-6 bg-white border border-zinc-100 rounded-2xl relative group shadow-sm">
                                        {exp.imported && (
                                            <div className="absolute -top-3 left-4 bg-green-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                                                <Check size={10} strokeWidth={4} /> Imported
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 flex gap-2">
                                            <button onClick={() => setExperience(prev => prev.filter(e => e.id !== exp.id))} className="text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <FormInput label="Company Name" value={exp.company} onChange={(v) => {
                                                const updated = [...experience];
                                                updated[index] = { ...updated[index], company: v };
                                                setExperience(updated);
                                            }} placeholder="e.g. Google" isImported={exp.imported} />
                                            <FormInput label="Job Title" value={exp.jobTitle} onChange={(v) => {
                                                const updated = [...experience];
                                                updated[index] = { ...updated[index], jobTitle: v };
                                                setExperience(updated);
                                            }} placeholder="e.g. Senior Product Designer" isImported={exp.imported} />
                                            <FormInput label="Start Date" value={exp.startDate} onChange={(v) => {
                                                const updated = [...experience];
                                                updated[index] = { ...updated[index], startDate: v };
                                                setExperience(updated);
                                            }} placeholder="MM / YYYY" isImported={exp.imported} />
                                            <FormInput label="End Date" value={exp.endDate} onChange={(v) => {
                                                const updated = [...experience];
                                                updated[index] = { ...updated[index], endDate: v };
                                                setExperience(updated);
                                            }} placeholder="Present" isImported={exp.imported} />
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400 mb-2">Description</label>
                                                <textarea
                                                    value={exp.description}
                                                    onChange={(e) => {
                                                        const updated = [...experience];
                                                        updated[index] = { ...updated[index], description: e.target.value };
                                                        setExperience(updated);
                                                    }}
                                                    className="w-full min-h-[120px] bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
                                                />
                                                <button 
                                                    onClick={() => handleEnhanceSection('experience', exp.id)}
                                                    disabled={enhancingSection === `experience_${exp.id}`}
                                                    className="mt-4 flex items-center gap-2 text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl text-[10px] font-bold hover:bg-indigo-50 transition-colors uppercase tracking-widest disabled:opacity-50"
                                                >
                                                    <Sparkles size={12} className={enhancingSection === `experience_${exp.id}` ? 'animate-spin' : ''} />
                                                    {enhancingSection === `experience_${exp.id}` ? '✨ Enhancing...' : 'Enhance with AI'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:text-black hover:border-zinc-200 transition-colors font-black text-[10px] uppercase tracking-widest">
                                    <Plus size={18} />
                                    Add More Experience
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
                            isImported
                        >
                            <div className="space-y-6">
                                {(education || []).map((edu, index) => (
                                    <div key={edu?.id || index} className="p-6 bg-zinc-50 border border-zinc-100 rounded-2xl relative">
                                        {edu.imported && (
                                            <div className="absolute -top-3 left-4 bg-green-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1">
                                                <Check size={10} strokeWidth={4} /> Imported
                                            </div>
                                        )}
                                        <div className="grid grid-cols-2 gap-4 pt-2">
                                            <FormInput label="Institution" value={edu.institution} onChange={(v) => {
                                                const updated = [...education];
                                                updated[index] = { ...updated[index], institution: v };
                                                setEducation(updated);
                                            }} isImported={edu.imported} />
                                            <FormInput label="Degree" value={edu.degree} onChange={(v) => {
                                                const updated = [...education];
                                                updated[index] = { ...updated[index], degree: v };
                                                setEducation(updated);
                                            }} isImported={edu.imported} />
                                            <FormInput label="Year" value={edu.year} onChange={(v) => {
                                                const updated = [...education];
                                                updated[index] = { ...updated[index], year: v };
                                                setEducation(updated);
                                            }} isImported={edu.imported} />
                                            <FormInput label="Grade" value={edu.grade} onChange={(v) => {
                                                const updated = [...education];
                                                updated[index] = { ...updated[index], grade: v };
                                                setEducation(updated);
                                            }} isImported={edu.imported} />
                                        </div>
                                    </div>
                                ))}
                                <button className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-zinc-100 rounded-2xl text-zinc-400 hover:text-black hover:border-zinc-200 transition-colors font-black text-[10px] uppercase tracking-widest">
                                    <Plus size={18} />
                                    Add More Education
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
                            isImported
                        >
                            <div className="space-y-4">
                                <div className="border border-zinc-200 rounded-2xl p-4 bg-zinc-50 focus-within:border-indigo-500 transition-colors">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {skills.map((skill) => (
                                            <span key={skill} className="flex items-center gap-1.5 bg-white border border-blue-100 px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
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
                                        className="bg-transparent border-none outline-none text-sm w-full font-medium"
                                    />
                                </div>
                                <button className="flex items-center gap-2 text-blue-600 border border-blue-200 px-4 py-2 rounded-xl text-[10px] font-black hover:bg-blue-50 transition-colors uppercase tracking-widest shadow-sm">
                                    <Sparkles size={14} />
                                    AI Suggest More Skills
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
                <div className="hidden lg:flex w-1/2 bg-zinc-100 items-start justify-center overflow-y-auto p-12">
                   <div style={{
                        position: 'sticky',
                        top: '20px',
                        height: 'calc(100vh - 120px)',
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '12px',
                        padding: '20px'
                    }}>
                        <p style={{
                            fontSize: '12px',
                            color: '#888',
                            marginBottom: '12px',
                            fontWeight: 500
                        }}>LIVE PREVIEW • {selectedTemplate}</p>

                        <div style={{
                            width: '100%',
                            overflow: 'hidden',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
                            borderRadius: '4px'
                        }}>
                             <ResumePreview 
                                resumeData={resumeData}
                                templateId={selectedTemplate}
                                scale={zoom}
                            />
                        </div>
                   </div>
                </div>
            </div>

            {/* Bottom Sticky Bar */}
            <footer className="h-20 bg-white border-t border-zinc-100 shrink-0 flex items-center justify-between px-12 z-20 shadow-[0_-10px_30px_rgba(0,0,0,0.02)]">
                <div className="flex items-center gap-8">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-zinc-800 uppercase tracking-widest">Import Progress</span>
                            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">
                                {(() => {
                                    let filled = 0;
                                    if (fullName) filled++;
                                    if (title) filled++;
                                    if (email) filled++;
                                    if (phone) filled++;
                                    if (location) filled++;
                                    if (linkedin) filled++;
                                    if (summary) filled++;
                                    if (experience.length > 0) filled++;
                                    if (education.length > 0) filled++;
                                    if (skills.length > 0) filled++;
                                    if (projects.some(p => p.projectName)) filled++;
                                    if (certifications.some(c => c.certName)) filled++;
                                    if (languages.some(l => l.language)) filled++;
                                    return `${filled}/13 Sections Filled`;
                                })()}
                            </span>
                        </div>
                        <div className="w-64 h-1.5 bg-zinc-100 rounded-full overflow-hidden">
                            <div 
                                className="h-full bg-green-500 rounded-full transition-all duration-500" 
                                style={{ 
                                    width: `${(() => {
                                        let filled = 0;
                                        if (fullName) filled++;
                                        if (title) filled++;
                                        if (email) filled++;
                                        if (phone) filled++;
                                        if (location) filled++;
                                        if (linkedin) filled++;
                                        if (summary) filled++;
                                        if (experience.length > 0) filled++;
                                        if (education.length > 0) filled++;
                                        if (skills.length > 0) filled++;
                                        if (projects.some(p => p.projectName)) filled++;
                                        if (certifications.some(c => c.certName)) filled++;
                                        if (languages.some(l => l.language)) filled++;
                                        return (filled / 13) * 100;
                                    })()}%` 
                                }} 
                            />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button 
                        onClick={handleEnhanceAll}
                        disabled={isEnhancing}
                        className="bg-indigo-50 text-indigo-600 px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        <Sparkles size={16} className={isEnhancing ? 'animate-spin' : ''} />
                        {isEnhancing ? '✨ Enhancing...' : isEnhanced ? '✅ Enhanced!' : 'Enhance All with AI'}
                    </button>
                    <button 
                        onClick={() => navigate('/linkedin-enhance')}
                        className="bg-zinc-900 text-white px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-zinc-200 flex items-center gap-2"
                    >
                        Continue to Review
                        <ArrowRight size={18} />
                    </button>
                </div>
            </footer>
            {/* Comparison Modal */}
            <AnimatePresence>
                {showComparison && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white rounded-[24px] p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-black text-zinc-900 flex items-center gap-2">
                                        <Sparkles className="text-indigo-600" />
                                        AI Enhancement Results
                                    </h3>
                                    <p className="text-zinc-500 font-medium mt-1">Review the changes before applying</p>
                                </div>
                                <button onClick={() => setShowComparison(false)} className="p-2 hover:bg-zinc-100 rounded-full transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <div className="w-2 h-2 rounded-full bg-zinc-300" />
                                        <h4 className="font-bold text-sm uppercase tracking-widest">Original</h4>
                                    </div>
                                    <div className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 text-sm leading-relaxed text-zinc-600 min-h-[200px]">
                                        {originalText}
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-indigo-600">
                                        <div className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                                        <h4 className="font-bold text-sm uppercase tracking-widest">Enhanced</h4>
                                    </div>
                                    <div className="p-6 bg-indigo-50/50 rounded-2xl border border-indigo-100 text-sm leading-relaxed text-indigo-900 min-h-[200px] font-medium">
                                        {enhancedText}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-100">
                                <button 
                                    onClick={() => setShowComparison(false)}
                                    className="px-6 py-3 rounded-xl font-bold text-sm text-zinc-500 hover:bg-zinc-50 transition-colors"
                                >
                                    Discard Changes
                                </button>
                                <button 
                                    onClick={applyEnhancement}
                                    className="px-8 py-3 rounded-xl font-bold text-sm bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center gap-2"
                                >
                                    Apply Enhancement
                                    <Check size={18} />
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            <TemplateModal 
                isOpen={showTemplateModal}
                onClose={() => setShowTemplateModal(false)}
                onSelect={(id: string) => setSelectedTemplate(id)}
                selectedId={selectedTemplate}
                resumeData={resumeData}
            />
        </div>
    );
};

const CollapsibleSection = ({ id, title, icon, isOpen, onToggle, children, isImported }: any) => (
    <div className={`border border-zinc-100 rounded-3xl overflow-hidden shadow-sm bg-white transition-all hover:shadow-md ${isImported ? 'ring-1 ring-green-100' : ''}`}>
        <button 
            onClick={onToggle}
            className="w-full flex items-center justify-between p-6 bg-white hover:bg-zinc-50 transition-colors"
        >
            <div className="flex items-center gap-4 text-left">
                <div className={`p-2.5 rounded-xl ${isOpen ? (isImported ? 'bg-[#0A66C2] text-white' : 'bg-indigo-600 text-white') : 'bg-zinc-50 text-zinc-400'}`}>
                    {icon}
                </div>
                <div>
                   <h3 className="font-bold text-lg">{title}</h3>
                   {isImported && (
                       <span className="text-[9px] font-black text-green-500 uppercase tracking-widest flex items-center gap-1">
                           <Check size={8} strokeWidth={5} /> Imported from LinkedIn
                       </span>
                   )}
                </div>
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

const FormInput = ({ label, value, onChange, placeholder, type = 'text', isImported }: any) => (
    <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
            <label className="block text-xs font-bold uppercase tracking-widest text-zinc-400">{label}</label>
            {isImported && value && (
                <span className="text-[8px] font-black text-green-500 uppercase tracking-widest">Imported ✓</span>
            )}
        </div>
        <input 
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-300"
        />
    </div>
);
