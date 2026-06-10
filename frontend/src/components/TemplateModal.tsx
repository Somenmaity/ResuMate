import React, { useState } from 'react'
import { X, Search, Sparkles } from 'lucide-react'
import { templates, categories } from '../data/templates'
import ResumePreview from './ResumePreview'
import { motion, AnimatePresence } from 'motion/react'

interface TemplateModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (templateId: string) => void
  selectedId: string
  resumeData: any
}

// Rich sample data used when user's resume is empty
const SAMPLE_DATA = {
  personalInfo: {
    fullName: 'Alex Johnson',
    title: 'Senior Software Engineer',
    email: 'alex@example.com',
    phone: '+1 234 567 890',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/alexj',
    portfolio: 'alexjohnson.dev'
  },
  summary: 'Full-stack engineer with 6+ years building scalable web applications. Led teams at Fortune 500 companies, shipping products used by 5M+ users.',
  skills: ['React', 'Node.js', 'TypeScript', 'Python', 'AWS', 'SQL', 'Docker'],
  experience: [
    { id: 1, jobTitle: 'Senior Software Engineer', company: 'Google', location: 'San Francisco, CA', startDate: 'Jan 2022', endDate: '', current: true, description: 'Led development of core search infrastructure serving 5M+ daily users\nReduced API latency by 40% through architecture improvements' },
    { id: 2, jobTitle: 'Software Engineer', company: 'Airbnb', location: 'New York, NY', startDate: 'Jun 2019', endDate: 'Dec 2021', current: false, description: 'Built booking platform features increasing conversions by 22%' }
  ],
  education: [{ id: 1, degree: 'B.S. in Computer Science', institution: 'Stanford University', year: '2019', grade: '3.9 GPA' }],
  projects: [{ id: 1, projectName: 'OpenTrack Dashboard', techStack: 'React, Node.js, PostgreSQL', description: 'Real-time analytics dashboard with 50K+ active users', projectUrl: '' }],
  certifications: [{ id: 1, certName: 'AWS Solutions Architect', issuingOrg: 'Amazon Web Services', issueDate: '2023', credentialUrl: '' }],
  languages: [{ id: 1, language: 'English', proficiency: 'Native' }]
}

const TemplateModal = ({ isOpen, onClose, onSelect, selectedId, resumeData }: TemplateModalProps) => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [localSelected, setLocalSelected] = useState(selectedId)

  // Use user's data if they've filled something, else fallback to sample data
  const previewData = (resumeData?.personalInfo?.fullName || resumeData?.personal?.fullName)
    ? resumeData
    : SAMPLE_DATA

  const filteredTemplates = templates.filter(t => {
    const matchesCategory = activeCategory === 'All' || t.category === activeCategory
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-white w-full max-w-6xl h-[90vh] rounded-[40px] shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-zinc-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-3xl font-display font-bold text-zinc-900 flex items-center gap-3">
              Choose a Template
              <div className="bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-indigo-100">
                12 PREMIUM DESIGNS
              </div>
            </h2>
            <p className="text-zinc-500 mt-1">Select a layout that fits your professional brand</p>
          </div>
          <button 
            onClick={onClose}
            className="w-12 h-12 flex items-center justify-center bg-zinc-50 hover:bg-zinc-100 rounded-2xl text-zinc-400 hover:text-black transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-grow overflow-hidden">
          {/* Main Grid */}
          <div className="flex-grow overflow-y-auto p-8 custom-scrollbar">
            {/* Filters */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all uppercase tracking-widest ${
                      activeCategory === cat 
                      ? 'bg-zinc-900 text-white shadow-lg shadow-zinc-200' 
                      : 'bg-zinc-50 text-zinc-500 hover:bg-zinc-100'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
                <input 
                  type="text" 
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-zinc-50 border border-zinc-100 rounded-2xl pl-12 pr-6 py-3 text-sm focus:outline-none focus:border-indigo-500 w-full md:w-64 transition-all focus:bg-white focus:shadow-xl focus:shadow-indigo-50"
                />
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 pb-12">
              {filteredTemplates.map(template => (
                <div 
                  key={template.id}
                  onClick={() => setLocalSelected(template.id)}
                  className="flex flex-col group cursor-pointer"
                >
                  <div className={`
                    aspect-[210/297] bg-white rounded-2xl overflow-hidden relative transition-all duration-300
                    ${localSelected === template.id 
                      ? 'ring-4 ring-indigo-600 ring-offset-4 scale-[1.02] shadow-2xl shadow-indigo-100' 
                      : 'border border-zinc-100 hover:shadow-xl hover:-translate-y-2 group-hover:border-zinc-200'
                    }
                  `}>
                    {/* Template Thumbnail */}
                    <div className="absolute inset-0 origin-top-left" style={{ pointerEvents: 'none' }}>
                      <ResumePreview
                        resumeData={previewData}
                        templateId={template.id}
                        scale={0.35}
                      />
                    </div>

                    {/* Badge */}
                    <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                       {template.tag && (
                         <span className="bg-zinc-900/90 backdrop-blur-sm text-white text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-xl">
                           {template.tag}
                         </span>
                       )}
                       <div className="bg-white/90 backdrop-blur-sm text-indigo-600 text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest shadow-lg border border-indigo-50 flex items-center gap-1">
                         <Sparkles size={10} />
                         ATS {template.atsScore}%
                       </div>
                    </div>

                    {/* Selection Overlay */}
                    <div className={`
                      absolute inset-0 flex items-center justify-center transition-all duration-300
                      ${localSelected === template.id ? 'bg-indigo-600/5' : 'bg-black/0 group-hover:bg-black/5'}
                    `}>
                      {localSelected === template.id && (
                        <div className="bg-indigo-600 text-white p-3 rounded-full shadow-2xl scale-110">
                          <Sparkles size={24} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 px-2">
                    <h3 className="font-bold text-zinc-900 group-hover:text-indigo-600 transition-colors">{template.name}</h3>
                    <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mt-1">{template.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar: Live Preview of Selected */}
          <div className="w-[340px] bg-zinc-50 border-l border-zinc-100 p-6 flex flex-col shrink-0 overflow-y-auto">

             {/* Selected template label */}
             <h3 className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em] mb-3">Previewing</h3>
             <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-zinc-100 flex items-center gap-3 mb-5">
               <div className="w-9 h-9 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 font-bold text-sm shrink-0">
                 {templates.find(t => t.id === localSelected)?.name.charAt(0)}
               </div>
               <div>
                 <p className="font-bold text-sm text-zinc-900">{templates.find(t => t.id === localSelected)?.name}</p>
                 <p className="text-[9px] font-black text-zinc-400 uppercase tracking-widest">Selected Style</p>
               </div>
             </div>

             {/* Preview — A4 aspect-ratio box so full page always fits */}
             <div style={{
               backgroundColor: '#f4f4f5',
               borderRadius: '16px',
               padding: '10px',
               marginBottom: '20px',
               border: '1px solid #e4e4e7',
             }}>
               {/* 210:297 = exact A4 ratio — height auto-adjusts to show full page */}
               <div style={{
                 width: '100%',
                 aspectRatio: '210 / 297',
                 overflow: 'hidden',
                 borderRadius: '6px',
                 boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                 backgroundColor: 'white',
               }}>
                 <ResumePreview
                   resumeData={previewData}
                   templateId={localSelected}
                   scale={0.33}
                 />
               </div>
             </div>

             <button
               onClick={() => { onSelect(localSelected); onClose(); }}
               className="w-full bg-zinc-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black transition-all shadow-xl shadow-zinc-200 flex items-center justify-center gap-3 shrink-0"
             >
               Use This Template
               <Sparkles size={16} />
             </button>
          </div>
        </div>
      </motion.div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e4e4e7;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d4d4d8;
        }
      `}</style>
    </div>
  )
}

export default TemplateModal
