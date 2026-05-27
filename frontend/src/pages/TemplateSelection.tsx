import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Sparkles } from 'lucide-react';
import { templates } from '../data/templates';
import ResumePreview from '../components/ResumePreview';

export const TemplateSelection = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState('travis-classic');

  const handleSelect = (id: string) => {
    localStorage.setItem('selectedTemplate', id);
    navigate('/builder');
  };

  // Mock data for preview in selection
  const mockData = {
    personal: {
      fullName: 'YOUR NAME',
      title: 'Professional Title',
      email: 'hello@resumate.ai',
      phone: '+1 234 567 890',
      location: 'City, Country',
      summary: 'Experienced professional with a proven track record of success in leading complex projects and driving innovation.'
    },
    experience: [],
    education: [],
    skills: ['Leadership', 'Innovation', 'Strategy']
  };

  return (
    <div className="container mx-auto px-6 py-20 min-h-screen">
      <div className="text-center mb-16">
        <h1 className="font-display text-4xl md:text-6xl font-black mb-6 tracking-tight">Choose your <span className="text-indigo-600">template</span></h1>
        <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-medium">Select a professional layout that best represents your brand. You can always change this later.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
        {templates.map((template) => (
          <div 
            key={template.id} 
            className="group relative flex flex-col cursor-pointer"
            onClick={() => handleSelect(template.id)}
          >
            <div className={`
              aspect-[210/297] bg-white border rounded-3xl overflow-hidden mb-6 relative transition-all duration-500
              ${selectedId === template.id 
                ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-2xl scale-[1.02]' 
                : 'border-zinc-100 group-hover:border-zinc-300 group-hover:shadow-2xl group-hover:-translate-y-2'
              }
            `}>
               {/* Template Preview */}
               <div className="absolute inset-0 origin-top-left pointer-events-none transition-transform duration-500 group-hover:scale-[1.05]">
                 <ResumePreview 
                   resumeData={mockData} 
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
               <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/5 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                 <div className="bg-white text-zinc-900 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transform translate-y-8 group-hover:translate-y-0 transition-all shadow-2xl flex items-center gap-2">
                   Select This Style
                   <Check size={18} strokeWidth={3} className="text-indigo-600" />
                 </div>
               </div>
            </div>

            <div className="px-2">
                <h3 className="font-bold text-xl text-zinc-900 group-hover:text-indigo-600 transition-colors">{template.name}</h3>
                <p className="text-[10px] text-zinc-400 uppercase tracking-[0.2em] font-black mt-1">{template.category}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-24 text-center">
         <button 
           onClick={() => navigate('/builder')}
           className="bg-zinc-900 text-white px-12 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl shadow-zinc-200 flex items-center gap-4 mx-auto group"
         >
           Skip Selection
           <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
         </button>
      </div>
    </div>
  );
};
