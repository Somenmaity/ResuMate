import React from 'react'

interface ResumePreviewProps {
  resumeData: any
  templateId: string
  scale?: number
}

const ResumePreview = ({ resumeData, templateId, scale = 1 }: ResumePreviewProps) => {
  const data = resumeData || {}
  
  // Normalize data structure (handle both 'personal' and 'personalInfo')
  const personal = data.personalInfo || data.personal || {}
  const name = personal.fullName
  const title = personal.title || 'Professional Title'
  const email = personal.email || 'email@example.com'
  const phone = personal.phone || '+91 98765 43210'
  const location = personal.location || 'City, Country'
  const linkedin = personal.linkedin || ''
  const portfolio = personal.portfolio || ''
  const summary = data.summary || personal.summary || ''
  const experience = data.experience || []
  const education = data.education || []
  const skills = data.skills || []
  const projects = data.projects || []
  const certifications = data.certifications || []
  const languages = data.languages || []

  const wrapperStyle: React.CSSProperties = {
    width: '210mm',
    minHeight: '297mm',
    backgroundColor: 'white',
    // CSS zoom affects layout flow (unlike transform: scale which doesn't).
    // This makes the container properly shrink to the scaled size.
    zoom: scale,
    fontFamily: "'Inter', 'Arial', sans-serif",
    fontSize: '12px',
    lineHeight: '1.5',
    color: '#333',
    boxShadow: '0 10px 25px -5px rgba(0,0,0,0.12), 0 4px 6px -2px rgba(0,0,0,0.07)',
  }

  // Section heading style — reused across travis-classic
  const sectionHeading: React.CSSProperties = {
    fontSize: '9px',
    fontWeight: '800',
    letterSpacing: '2.5px',
    textTransform: 'uppercase' as const,
    color: '#1a1a2e',
    borderBottom: '1.5px solid #1a1a2e',
    paddingBottom: '3px',
    marginBottom: '6px',
    marginTop: '0',
  }

  // ===== TEMPLATE 1: TRAVIS CLASSIC =====
  if (templateId === 'travis-classic') {
    return (
      <div style={wrapperStyle}>
        <div style={{padding: '14mm 16mm 12mm'}}>

          {/* Header */}
          <div style={{borderBottom: '2.5px solid #1a1a2e', paddingBottom: '8px', marginBottom: '10px'}}>
            {title && <p style={{fontSize: '9px', letterSpacing: '3px', color: '#666', textTransform: 'uppercase', margin: '0 0 3px 0'}}>{title}</p>}
            <h1 style={{fontSize: '26px', fontWeight: '900', color: '#1a1a2e', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 5px 0', lineHeight: 1.1}}>
              {name && name.trim().length > 0 ? name : <span style={{color: '#ccc'}}>YOUR NAME</span>}
            </h1>
            <p style={{fontSize: '9px', color: '#555', margin: 0, lineHeight: '1.5'}}>
              {[location, phone, email, linkedin, portfolio].filter(Boolean).join(' | ')}
            </p>
          </div>

          {/* Summary */}
          {summary && summary.trim().length > 0 && (
            <div style={{marginBottom: '10px'}}>
              <p style={sectionHeading}>Summary</p>
              <p style={{fontSize: '10px', color: '#444', lineHeight: '1.5', margin: 0}}>{summary}</p>
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div style={{marginBottom: '10px'}}>
              <p style={sectionHeading}>Skills</p>
              <p style={{fontSize: '10px', color: '#444', margin: 0, lineHeight: '1.6'}}>
                {skills.join(' • ')}
              </p>
            </div>
          )}

          {/* Experience */}
          {experience.filter((e: any) => e.jobTitle || e.company).length > 0 && (
            <div style={{marginBottom: '10px'}}>
              <p style={sectionHeading}>Experience</p>
              {experience.filter((e: any) => e.jobTitle || e.company).map((exp: any, i: number) => (
                <div key={i} style={{marginBottom: i < experience.length - 1 ? '8px' : '0'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <p style={{fontSize: '10px', fontWeight: '700', margin: 0}}>
                      {exp.jobTitle}{exp.company ? ` — ${exp.company}` : ''}
                    </p>
                    <p style={{fontSize: '9px', color: '#666', whiteSpace: 'nowrap', marginLeft: '6px', flexShrink: 0}}>
                      {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : exp.current ? ' – Present' : ''}
                    </p>
                  </div>
                  {exp.location && <p style={{fontSize: '9px', color: '#888', margin: '1px 0 2px 0'}}>{exp.location}</p>}
                  {exp.description && exp.description.split('\n').filter((l: string) => l.trim()).map((line: string, j: number) => (
                    <p key={j} style={{fontSize: '10px', color: '#444', margin: '1px 0', lineHeight: '1.45'}}>• {line}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.filter((e: any) => e.degree || e.institution).length > 0 && (
            <div style={{marginBottom: '10px'}}>
              <p style={sectionHeading}>Education</p>
              {education.filter((e: any) => e.degree || e.institution).map((edu: any, i: number) => (
                <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: i < education.length - 1 ? '5px' : '0'}}>
                  <div>
                    <p style={{fontSize: '10px', fontWeight: '700', margin: 0}}>{edu.degree}</p>
                    <p style={{fontSize: '9px', color: '#666', margin: '1px 0 0 0'}}>
                      {edu.institution}{edu.grade ? ` • ${edu.grade}` : ''}
                    </p>
                  </div>
                  {edu.year && <p style={{fontSize: '9px', color: '#666', flexShrink: 0, marginLeft: '6px'}}>{edu.year}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.filter((p: any) => p.projectName?.trim()).length > 0 && (
            <div style={{marginBottom: '10px'}}>
              <p style={sectionHeading}>Projects</p>
              {projects.filter((p: any) => p.projectName?.trim()).map((proj: any, i: number) => (
                <div key={i} style={{marginBottom: i < projects.length - 1 ? '6px' : '0'}}>
                  <p style={{fontSize: '10px', fontWeight: '700', margin: '0 0 1px 0'}}>
                    {proj.projectName}
                    {proj.techStack && <span style={{fontWeight: '400', color: '#666', fontSize: '9px'}}> | {proj.techStack}</span>}
                  </p>
                  {proj.description && <p style={{fontSize: '10px', color: '#444', margin: '1px 0', lineHeight: '1.4'}}>• {proj.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.filter((c: any) => c.certName?.trim()).length > 0 && (
            <div style={{marginBottom: '10px'}}>
              <p style={sectionHeading}>Certifications</p>
              {certifications.filter((c: any) => c.certName?.trim()).map((cert: any, i: number) => (
                <div key={i} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: i < certifications.length - 1 ? '4px' : '0'}}>
                  <div>
                    <p style={{fontSize: '10px', fontWeight: '700', margin: 0}}>{cert.certName}</p>
                    {cert.issuingOrg && <p style={{fontSize: '9px', color: '#666', margin: '1px 0 0 0'}}>{cert.issuingOrg}</p>}
                  </div>
                  {cert.issueDate && <span style={{fontSize: '9px', color: '#666', flexShrink: 0, marginLeft: '6px'}}>{cert.issueDate}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.filter((l: any) => l.language?.trim()).length > 0 && (
            <div style={{marginBottom: '6px'}}>
              <p style={sectionHeading}>Languages</p>
              <div style={{display: 'flex', gap: '16px', flexWrap: 'wrap'}}>
                {languages.filter((l: any) => l.language?.trim()).map((lang: any, i: number) => (
                  <div key={i}>
                    <p style={{fontSize: '10px', fontWeight: '700', margin: 0}}>{lang.language}</p>
                    <p style={{fontSize: '9px', color: '#666', margin: '1px 0 0 0'}}>{lang.proficiency}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    )
  }

  // ===== TEMPLATE 2: MIRA MODERN =====
  if (templateId === 'mira-modern') {
    // Reusable tight heading style for mira-modern
    const miraHeading = (color = '#333', border = '2px solid #333'): React.CSSProperties => ({
      fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px',
      textTransform: 'uppercase' as const,
      borderBottom: border, paddingBottom: '3px', marginBottom: '5px',
      color, margin: '0 0 5px 0',
    })
    return (
      <div style={wrapperStyle}>
        {/* Center Header — reduced padding */}
        <div style={{backgroundColor: '#f8f8f8', padding: '10px 20mm', textAlign: 'center', borderBottom: '2px solid #ddd'}}>
          <h1 style={{fontSize: '24px', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 3px 0', color: '#1a1a1a'}}>
            {name && name.trim().length > 0 ? name : <span style={{color: '#ccc'}}>YOUR NAME</span>}
          </h1>
          <p style={{fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', color: '#666', margin: 0}}>{title}</p>
        </div>

        {/* Two column layout */}
        <div style={{display: 'flex', minHeight: '250mm'}}>
          {/* Left sidebar */}
          <div style={{width: '35%', backgroundColor: '#f0f0f0', padding: '12px 10px'}}>
            <div style={{marginBottom: '7px'}}>
              <p style={miraHeading('#333', '1px solid #999')}>DETAILS</p>
              <p style={{fontSize: '10px', color: '#444', margin: '1px 0'}}>{phone}</p>
              <p style={{fontSize: '10px', color: '#444', margin: '1px 0'}}>{email}</p>
              <p style={{fontSize: '10px', color: '#444', margin: '1px 0'}}>{location}</p>
              {linkedin && <p style={{fontSize: '10px', color: '#444', margin: '1px 0'}}>{linkedin}</p>}
              {portfolio && <p style={{fontSize: '10px', color: '#444', margin: '1px 0'}}>{portfolio}</p>}
            </div>

            {skills && skills.length > 0 && (
              <div style={{marginBottom: '7px'}}>
                <p style={miraHeading('#333', '1px solid #999')}>SKILLS</p>
                {skills.map((skill: string, i: number) => (
                  <p key={i} style={{fontSize: '10px', color: '#444', margin: '2px 0'}}>{skill}</p>
                ))}
              </div>
            )}
          </div>

          {/* Right content */}
          <div style={{width: '65%', padding: '12px 14px'}}>
            {summary && summary.trim().length > 0 && (
              <div style={{marginBottom: '7px'}}>
                <p style={miraHeading()}>SUMMARY</p>
                <p style={{fontSize: '10px', color: '#444', lineHeight: '1.5', margin: 0}}>{summary}</p>
              </div>
            )}

            {experience && experience.filter((e: any) => e.jobTitle || e.company).length > 0 && (
              <div style={{marginBottom: '7px'}}>
                <p style={miraHeading()}>EXPERIENCE</p>
                {experience.filter((e: any) => e.jobTitle || e.company).map((exp: any, i: number) => (
                  <div key={i} style={{marginBottom: '5px'}}>
                    <p style={{fontSize: '10px', fontWeight: 'bold', margin: '0 0 1px 0'}}>{exp.jobTitle}</p>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <p style={{fontSize: '9px', color: '#555', margin: 0}}>{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                      <p style={{fontSize: '9px', color: '#666', margin: 0, flexShrink: 0, marginLeft: '4px'}}>{exp.startDate} — {exp.endDate || (exp.current ? 'Present' : '')}</p>
                    </div>
                    {exp.description && exp.description.split('\n').filter((l: string) => l.trim()).map((line: string, j: number) => (
                      <p key={j} style={{fontSize: '10px', color: '#444', margin: '1px 0', lineHeight: '1.4'}}>• {line}</p>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {education && education.filter((e: any) => e.degree || e.institution).length > 0 && (
              <div style={{marginBottom: '7px'}}>
                <p style={miraHeading()}>EDUCATION</p>
                {education.filter((e: any) => e.degree || e.institution).map((edu: any, i: number) => (
                  <div key={i} style={{marginBottom: '4px'}}>
                    <p style={{fontSize: '10px', fontWeight: 'bold', margin: '0 0 1px 0'}}>{edu.degree}</p>
                    <p style={{fontSize: '9px', color: '#555', margin: 0}}>
                      {edu.institution}{edu.year ? `, ${edu.year}` : ''}
                      {edu.grade && <span style={{color: '#777'}}> • {edu.grade}</span>}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {projects.filter((p: any) => p.projectName?.trim()).length > 0 && (
              <div style={{marginBottom: '7px'}}>
                <p style={miraHeading('#333', '1px solid #ccc')}>PROJECTS</p>
                {projects.filter((p: any) => p.projectName?.trim()).map((proj: any, i: number) => (
                  <div key={i} style={{marginBottom: '5px'}}>
                    <p style={{fontSize: '10px', fontWeight: 'bold', margin: '0 0 1px 0'}}>
                      {proj.projectName}
                      {proj.techStack && <span style={{fontWeight: 'normal', color: '#666', fontSize: '9px'}}> | {proj.techStack}</span>}
                    </p>
                    {proj.description && <p style={{fontSize: '10px', color: '#444', margin: '1px 0', lineHeight: '1.4'}}>• {proj.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {/* Certifications */}
            {certifications.filter((c: any) => c.certName?.trim()).length > 0 && (
              <div style={{marginBottom: '7px'}}>
                <p style={miraHeading('#333', '1px solid #ccc')}>CERTIFICATIONS</p>
                {certifications.filter((c: any) => c.certName?.trim()).map((cert: any, i: number) => (
                  <div key={i} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                    <div>
                      <p style={{fontSize: '10px', fontWeight: 'bold', margin: 0}}>{cert.certName}</p>
                      {cert.issuingOrg && <p style={{fontSize: '9px', color: '#555', margin: 0}}>{cert.issuingOrg}</p>}
                    </div>
                    {cert.issueDate && <span style={{fontSize: '9px', color: '#666'}}>{cert.issueDate}</span>}
                  </div>
                ))}
              </div>
            )}

            {/* Languages */}
            {languages.filter((l: any) => l.language?.trim()).length > 0 && (
              <div style={{marginBottom: '7px'}}>
                <p style={miraHeading('#333', '1px solid #ccc')}>LANGUAGES</p>
                <div style={{display: 'flex', gap: '14px', flexWrap: 'wrap'}}>
                  {languages.filter((l: any) => l.language?.trim()).map((lang: any, i: number) => (
                    <div key={i}>
                      <p style={{fontSize: '10px', fontWeight: 'bold', margin: 0}}>{lang.language}</p>
                      <p style={{fontSize: '9px', color: '#555', margin: 0}}>{lang.proficiency}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ===== TEMPLATE 3: TRAVIS SIDEBAR =====
  if (templateId === 'travis-sidebar') {
    const sidebarHeading: React.CSSProperties = {
      fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px',
      color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' as const,
      borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '3px',
      margin: '0 0 5px 0',
    }
    const rightHeading: React.CSSProperties = {
      fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px',
      textTransform: 'uppercase' as const, color: '#1e3a5f',
      borderBottom: '2px solid #1e3a5f', paddingBottom: '3px',
      margin: '0 0 5px 0',
    }
    return (
      <div style={{...wrapperStyle, display: 'flex'}}>
        {/* Dark left sidebar */}
        <div style={{width: '32%', backgroundColor: '#1e3a5f', padding: '14px 12px', color: 'white'}}>
          <div style={{marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.2)'}}>
            <h1 style={{fontSize: '16px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 3px 0', lineHeight: '1.2'}}>
              {name && name.trim().length > 0 ? name : <span style={{color: 'rgba(255,255,255,0.3)'}}>YOUR NAME</span>}
            </h1>
            <p style={{fontSize: '9px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0}}>{title}</p>
          </div>

          <div style={{marginBottom: '8px'}}>
            <p style={sidebarHeading}>CONTACT</p>
            <p style={{fontSize: '10px', color: 'rgba(255,255,255,0.85)', margin: '2px 0'}}>{email}</p>
            <p style={{fontSize: '10px', color: 'rgba(255,255,255,0.85)', margin: '2px 0'}}>{phone}</p>
            <p style={{fontSize: '10px', color: 'rgba(255,255,255,0.85)', margin: '2px 0'}}>{location}</p>
            {linkedin && <p style={{fontSize: '10px', color: 'rgba(255,255,255,0.85)', margin: '2px 0'}}>{linkedin}</p>}
            {portfolio && <p style={{fontSize: '10px', color: 'rgba(255,255,255,0.85)', margin: '2px 0'}}>{portfolio}</p>}
          </div>

          {skills && skills.length > 0 && (
            <div style={{marginBottom: '8px'}}>
              <p style={sidebarHeading}>SKILLS</p>
              {skills.map((skill: string, i: number) => (
                <p key={i} style={{fontSize: '10px', color: 'rgba(255,255,255,0.9)', margin: '2px 0'}}>• {skill}</p>
              ))}
            </div>
          )}

          {education && education.filter((e: any) => e.degree || e.institution).length > 0 && (
            <div style={{marginBottom: '8px'}}>
              <p style={sidebarHeading}>EDUCATION</p>
              {education.filter((e: any) => e.degree || e.institution).map((edu: any, i: number) => (
                <div key={i} style={{marginBottom: '6px'}}>
                  <p style={{fontSize: '10px', fontWeight: 'bold', color: 'white', margin: '0 0 1px 0'}}>{edu.degree}</p>
                  <p style={{fontSize: '9px', color: 'rgba(255,255,255,0.7)', margin: 0}}>{edu.institution}</p>
                  {edu.grade && <p style={{fontSize: '9px', color: 'rgba(255,255,255,0.55)', margin: 0}}>{edu.grade}</p>}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right content */}
        <div style={{width: '68%', padding: '14px 14px'}}>
          {summary && summary.trim().length > 0 && (
            <div style={{marginBottom: '7px'}}>
              <p style={rightHeading}>SUMMARY</p>
              <p style={{fontSize: '10px', color: '#444', lineHeight: '1.5', margin: 0}}>{summary}</p>
            </div>
          )}

          {experience && experience.filter((e: any) => e.jobTitle || e.company).length > 0 && (
            <div style={{marginBottom: '7px'}}>
              <p style={rightHeading}>EXPERIENCE</p>
              {experience.filter((e: any) => e.jobTitle || e.company).map((exp: any, i: number) => (
                <div key={i} style={{marginBottom: '5px'}}>
                  <p style={{fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 1px 0', color: '#1e3a5f'}}>{exp.jobTitle}{exp.company ? ` — ${exp.company}` : ''}</p>
                  <p style={{fontSize: '9px', color: '#888', margin: '0 0 2px 0'}}>{exp.location ? `${exp.location}, ` : ''}{exp.startDate} - {exp.endDate || (exp.current ? 'Present' : '')}</p>
                  {exp.description && exp.description.split('\n').filter((l: string) => l.trim()).map((line: string, j: number) => (
                    <p key={j} style={{fontSize: '10px', color: '#444', margin: '1px 0', lineHeight: '1.4'}}>• {line}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.filter((p: any) => p.projectName?.trim()).length > 0 && (
            <div style={{marginBottom: '7px'}}>
              <p style={rightHeading}>PROJECTS</p>
              {projects.filter((p: any) => p.projectName?.trim()).map((proj: any, i: number) => (
                <div key={i} style={{marginBottom: '5px'}}>
                  <p style={{fontSize: '10px', fontWeight: 'bold', margin: '0 0 1px 0'}}>
                    {proj.projectName}
                    {proj.techStack && <span style={{fontWeight: 'normal', color: '#666', fontSize: '9px'}}> | {proj.techStack}</span>}
                  </p>
                  {proj.description && <p style={{fontSize: '10px', color: '#444', margin: '1px 0', lineHeight: '1.4'}}>• {proj.description}</p>}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.filter((c: any) => c.certName?.trim()).length > 0 && (
            <div style={{marginBottom: '7px'}}>
              <p style={rightHeading}>CERTIFICATIONS</p>
              {certifications.filter((c: any) => c.certName?.trim()).map((cert: any, i: number) => (
                <div key={i} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                  <div>
                    <p style={{fontSize: '10px', fontWeight: 'bold', margin: 0}}>{cert.certName}</p>
                    {cert.issuingOrg && <p style={{fontSize: '9px', color: '#555', margin: 0}}>{cert.issuingOrg}</p>}
                  </div>
                  {cert.issueDate && <span style={{fontSize: '9px', color: '#666'}}>{cert.issueDate}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Languages */}
          {languages.filter((l: any) => l.language?.trim()).length > 0 && (
            <div style={{marginBottom: '7px'}}>
              <p style={rightHeading}>LANGUAGES</p>
              <div style={{display: 'flex', gap: '14px', flexWrap: 'wrap'}}>
                {languages.filter((l: any) => l.language?.trim()).map((lang: any, i: number) => (
                  <div key={i}>
                    <p style={{fontSize: '10px', fontWeight: 'bold', margin: 0}}>{lang.language}</p>
                    <p style={{fontSize: '9px', color: '#555', margin: 0}}>{lang.proficiency}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // DEFAULT fallback - simple clean
  return (
    <div style={{...wrapperStyle, padding: '20mm'}}>
      <div style={{textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '12px', marginBottom: '10px'}}>
        <h1 style={{fontSize: '26px', fontWeight: 'bold', margin: '0 0 4px 0'}}>
          {name && name.trim().length > 0 ? name : <span style={{color: '#ccc'}}>YOUR NAME</span>}
        </h1>
        <p style={{fontSize: '13px', color: '#555', margin: '0 0 6px 0'}}>{title}</p>
        <p style={{fontSize: '11px', color: '#777'}}>{email} • {phone} • {location}</p>
      </div>
      
      {summary && summary.trim().length > 0 && (
        <p style={{fontSize: '12px', color: '#444', lineHeight: '1.6', marginBottom: '10px'}}>{summary}</p>
      )}

      {experience.filter((e: any) => e.jobTitle || e.company).length > 0 && (
        <div style={{marginBottom: '10px'}}>
          <p style={{fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>EXPERIENCE</p>
          {experience
            .filter((e: any) => e.jobTitle || e.company)
            .map((exp: any, i: number) => (
            <div key={i} style={{marginBottom: '10px'}}>
              <div style={{display: 'flex', justifyContent: 'space-between'}}>
                <strong style={{fontSize: '12px'}}>{exp.jobTitle} - {exp.company}</strong>
                <span style={{fontSize: '10px', color: '#666'}}>{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : exp.current ? ' - Present' : ''}</span>
              </div>
              <p style={{fontSize: '11px', color: '#444', margin: '4px 0'}}>{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {education.filter((e: any) => e.degree || e.institution).length > 0 && (
        <div style={{marginBottom: '10px'}}>
          <p style={{fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>EDUCATION</p>
          {education
            .filter((e: any) => e.degree || e.institution)
            .map((edu: any, i: number) => (
            <div key={i} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '6px'}}>
              <div>
                <strong style={{fontSize: '12px'}}>{edu.degree}</strong>
                <p style={{fontSize: '11px', color: '#555', margin: 0}}>{edu.institution}</p>
              </div>
              <span style={{fontSize: '10px', color: '#666'}}>{edu.year}</span>
            </div>
          ))}
        </div>
      )}

      {skills && skills.length > 0 && (
        <div style={{marginBottom: '10px'}}>
          <p style={{fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>SKILLS</p>
          <p style={{fontSize: '11px', color: '#444'}}>{skills.join(' • ')}</p>
        </div>
      )}

      {/* Projects */}
      {projects.filter((p: any) => p.projectName?.trim()).length > 0 && (
        <div style={{marginBottom:'10px'}}>
          <p style={{fontSize:'10px', fontWeight:'bold', letterSpacing:'2px', textTransform:'uppercase', borderBottom:'1px solid #ccc', paddingBottom:'4px', marginBottom:'8px'}}>PROJECTS</p>
          {projects.filter((p: any) => p.projectName?.trim()).map((proj: any, i: number) => (
            <div key={i} style={{marginBottom:'8px'}}>
              <p style={{fontSize:'11px', fontWeight:'bold', margin:'0 0 2px 0'}}>
                {proj.projectName}
                {proj.techStack && <span style={{fontWeight:'normal', color:'#666', fontSize:'10px'}}> | {proj.techStack}</span>}
              </p>
              {proj.description && <p style={{fontSize:'11px', color:'#444', margin:'2px 0'}}>• {proj.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* Certifications */}
      {certifications.filter((c: any) => c.certName?.trim()).length > 0 && (
        <div style={{marginBottom:'10px'}}>
          <p style={{fontSize:'10px', fontWeight:'bold', letterSpacing:'2px', textTransform:'uppercase', borderBottom:'1px solid #ccc', paddingBottom:'4px', marginBottom:'8px'}}>CERTIFICATIONS</p>
          {certifications.filter((c: any) => c.certName?.trim()).map((cert: any, i: number) => (
            <div key={i} style={{display:'flex', justifyContent:'space-between', marginBottom:'6px'}}>
              <div>
                <p style={{fontSize:'11px', fontWeight:'bold', margin:0}}>{cert.certName}</p>
                {cert.issuingOrg && <p style={{fontSize:'10px', color:'#555', margin:0}}>{cert.issuingOrg}</p>}
              </div>
              {cert.issueDate && <span style={{fontSize:'10px', color:'#666'}}>{cert.issueDate}</span>}
            </div>
          ))}
        </div>
      )}

      {/* Languages */}
      {languages.filter((l: any) => l.language?.trim()).length > 0 && (
        <div style={{marginBottom:'10px'}}>
          <p style={{fontSize:'10px', fontWeight:'bold', letterSpacing:'2px', textTransform:'uppercase', borderBottom:'1px solid #ccc', paddingBottom:'4px', marginBottom:'8px'}}>LANGUAGES</p>
          <div style={{display:'flex', gap:'16px', flexWrap:'wrap'}}>
            {languages.filter((l: any) => l.language?.trim()).map((lang: any, i: number) => (
              <div key={i}>
                <p style={{fontSize:'11px', fontWeight:'bold', margin:0}}>{lang.language}</p>
                <p style={{fontSize:'10px', color:'#555', margin:0}}>{lang.proficiency}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ResumePreview
