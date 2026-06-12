import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, Download, RefreshCw, ArrowLeft, FileText, Copy, Check } from 'lucide-react'

const CoverLetter = () => {
  const navigate = useNavigate()
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [hiringManager, setHiringManager] = useState('')
  const [tone, setTone] = useState('professional')
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [coverLetterText, setCoverLetterText] = useState('')

  // Load resume data from localStorage
  const resumeData = (() => {
    try { return JSON.parse(localStorage.getItem('resumeData') || '{}') } catch { return {} }
  })()
  const personal = resumeData.personalInfo || resumeData.personal || {}
  const userName = personal.fullName || 'Your Name'
  const userTitle = personal.title || ''
  const skills = (resumeData.skills || []).slice(0, 6).join(', ')
  const experience = (resumeData.experience || [])
  const latestJob = experience[0]

  const tones = [
    { id: 'professional', label: 'Professional', emoji: '💼' },
    { id: 'enthusiastic', label: 'Enthusiastic', emoji: '🚀' },
    { id: 'concise', label: 'Concise', emoji: '✂️' },
    { id: 'creative', label: 'Creative', emoji: '🎨' },
  ]

  const generateCoverLetter = () => {
    if (!jobTitle.trim() || !company.trim()) return
    setGenerating(true)

    // Generate cover letter template based on resume data
    setTimeout(() => {
      const today = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
      const greeting = hiringManager ? `Dear ${hiringManager},` : 'Dear Hiring Manager,'
      const expLine = latestJob
        ? `In my current role as ${latestJob.jobTitle} at ${latestJob.company}, I have ${latestJob.description?.split('\n')[0]?.toLowerCase() || 'delivered impactful results'}.`
        : `With my background in ${userTitle || 'the industry'}, I have consistently delivered strong results.`
      const skillsLine = skills ? `My core skills include ${skills}.` : ''

      const letter = `${today}

${greeting}

I am writing to express my strong interest in the ${jobTitle} position at ${company}. ${
  tone === 'enthusiastic' ? `This opportunity genuinely excites me, and I believe my background makes me an excellent fit for your team.` :
  tone === 'creative' ? `After researching ${company}'s innovative work, I'm convinced my unique perspective and skills would add real value to your team.` :
  tone === 'concise' ? `I bring relevant experience and skills that directly align with this role.` :
  `With my professional experience and technical expertise, I am confident in my ability to contribute meaningfully to your team.`
}

${expLine} ${skillsLine}

${
  tone === 'enthusiastic' ? `I am truly passionate about ${jobTitle} and would love to bring my energy and expertise to ${company}. I thrive in collaborative environments and am always looking to push the boundaries of what's possible.` :
  tone === 'creative' ? `What sets me apart is my ability to blend technical skills with creative problem-solving. I believe the best solutions come from thinking differently, and I would bring that perspective to every challenge at ${company}.` :
  tone === 'concise' ? `I am results-driven, collaborative, and ready to contribute from day one. I would welcome the opportunity to discuss how I can add value to your team.` :
  `I am a dedicated professional who takes pride in delivering high-quality work. I am a collaborative team player and a proactive problem-solver who thrives in dynamic environments.`
}

I would welcome the opportunity to discuss how my skills and experience align with ${company}'s goals. Thank you for considering my application. I look forward to speaking with you.

Warm regards,

${userName}
${userTitle ? userTitle + '\n' : ''}${personal.email || ''}${personal.phone ? ' | ' + personal.phone : ''}`

      setCoverLetterText(letter)
      localStorage.setItem('coverLetter', JSON.stringify({ text: letter, company, jobTitle }))
      setGenerating(false)
      setGenerated(true)
    }, 2000)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetterText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const isPaid = (() => {
    try {
      const p = JSON.parse(localStorage.getItem('payment') || '{}')
      return p.plan === 'cover_letter' || p.plan === 'bundle'
    } catch { return false }
  })()

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <header style={{
        height: '60px', backgroundColor: 'white', borderBottom: '1px solid #f3f4f6',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 32px', position: 'sticky', top: 0, zIndex: 50
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '600' }}>
            <ArrowLeft size={16} /> Back
          </button>
          <span style={{ color: '#e5e7eb' }}>|</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '28px', height: '28px', backgroundColor: '#059669', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={14} color="white" />
            </div>
            <span style={{ fontWeight: '800', fontSize: '15px', color: '#111827' }}>Cover Letter Generator</span>
          </div>
        </div>
        {!isPaid && (
          <button
            onClick={() => navigate('/payment')}
            style={{
              backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '12px',
              padding: '8px 20px', fontSize: '12px', fontWeight: '800', cursor: 'pointer',
              letterSpacing: '0.05em', textTransform: 'uppercase'
            }}
          >
            Unlock — ₹21
          </button>
        )}
      </header>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 20px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>

        {/* Left — Form */}
        <div style={{ flex: '0 0 340px', minWidth: '280px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '28px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#111827', marginBottom: '20px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              Job Details
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Field label="Job Title *" value={jobTitle} onChange={setJobTitle} placeholder="e.g. Software Engineer" />
              <Field label="Company Name *" value={company} onChange={setCompany} placeholder="e.g. Google" />
              <Field label="Hiring Manager (optional)" value={hiringManager} onChange={setHiringManager} placeholder="e.g. Ms. Priya Sharma" />

              <div>
                <label style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '8px' }}>
                  Tone
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {tones.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTone(t.id)}
                      style={{
                        padding: '10px 8px', borderRadius: '12px', border: `2px solid ${tone === t.id ? '#059669' : '#e5e7eb'}`,
                        backgroundColor: tone === t.id ? '#f0fdf4' : 'white',
                        cursor: 'pointer', fontSize: '12px', fontWeight: '700',
                        color: tone === t.id ? '#059669' : '#6b7280', transition: 'all 0.15s'
                      }}
                    >
                      {t.emoji} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Resume data preview */}
              {userName !== 'Your Name' && (
                <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '12px' }}>
                  <p style={{ fontSize: '10px', fontWeight: '800', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>
                    Auto-filled from your resume
                  </p>
                  <p style={{ fontSize: '12px', color: '#374151', margin: '2px 0', fontWeight: '600' }}>{userName}</p>
                  {userTitle && <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0' }}>{userTitle}</p>}
                  {skills && <p style={{ fontSize: '11px', color: '#6b7280', margin: '2px 0' }}>Skills: {skills}</p>}
                </div>
              )}

              <button
                onClick={generateCoverLetter}
                disabled={generating || !jobTitle.trim() || !company.trim() || !isPaid}
                style={{
                  width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                  background: (!jobTitle.trim() || !company.trim() || !isPaid) ? '#e5e7eb' : 'linear-gradient(135deg, #059669, #047857)',
                  color: (!jobTitle.trim() || !company.trim() || !isPaid) ? '#9ca3af' : 'white',
                  fontSize: '13px', fontWeight: '800', cursor: (!jobTitle.trim() || !company.trim() || !isPaid) ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  letterSpacing: '0.05em', textTransform: 'uppercase', boxShadow: isPaid ? '0 4px 12px rgba(5,150,105,0.3)' : 'none'
                }}
              >
                {generating ? <><RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generating...</> :
                  <><Sparkles size={16} /> Generate Cover Letter</>}
              </button>

              {!isPaid && (
                <p style={{ textAlign: 'center', fontSize: '11px', color: '#6b7280' }}>
                  <span
                    onClick={() => navigate('/payment')}
                    style={{ color: '#059669', fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    Unlock for ₹21
                  </span>{' '}to generate cover letter
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Right — Preview */}
        <div style={{ flex: 1, minWidth: '300px' }}>
          <div style={{ backgroundColor: 'white', borderRadius: '24px', border: '1px solid #f3f4f6', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', padding: '28px', minHeight: '500px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#111827', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Preview
              </h2>
              {generated && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleCopy}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '10px', border: '1px solid #e5e7eb',
                      backgroundColor: 'white', cursor: 'pointer', fontSize: '11px', fontWeight: '700', color: '#374151'
                    }}
                  >
                    {copied ? <><Check size={12} color="#059669" /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([coverLetterText], { type: 'text/plain' })
                      const a = document.createElement('a')
                      a.href = URL.createObjectURL(blob)
                      a.download = `cover_letter_${company.toLowerCase().replace(/\s/g, '_')}.txt`
                      a.click()
                    }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '8px 14px', borderRadius: '10px', border: 'none',
                      backgroundColor: '#059669', cursor: 'pointer', fontSize: '11px', fontWeight: '800', color: 'white'
                    }}
                  >
                    <Download size={12} /> Download
                  </button>
                </div>
              )}
            </div>

            {!generated && !generating && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px', color: '#d1d5db' }}>
                <FileText size={48} />
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#9ca3af' }}>
                  Fill job details and click Generate
                </p>
              </div>
            )}

            {generating && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '400px', gap: '16px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '3px solid #d1fae5', borderTop: '3px solid #059669', animation: 'spin 1s linear infinite' }} />
                <p style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>Generating your cover letter...</p>
              </div>
            )}

            {generated && (
              <div style={{
                whiteSpace: 'pre-wrap', fontFamily: "'Georgia', serif", fontSize: '14px',
                lineHeight: '1.8', color: '#374151', padding: '8px 0',
                maxHeight: '580px', overflowY: 'auto'
              }}>
                {coverLetterText}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

const Field = ({ label, value, onChange, placeholder }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string
}) => (
  <div>
    <label style={{ fontSize: '11px', fontWeight: '700', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '6px' }}>
      {label}
    </label>
    <input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%', padding: '10px 14px', borderRadius: '12px',
        border: '1.5px solid #e5e7eb', fontSize: '13px', fontWeight: '600',
        outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
        backgroundColor: '#f9fafb', transition: 'border-color 0.15s'
      }}
      onFocus={e => e.target.style.borderColor = '#059669'}
      onBlur={e => e.target.style.borderColor = '#e5e7eb'}
    />
  </div>
)

export default CoverLetter
