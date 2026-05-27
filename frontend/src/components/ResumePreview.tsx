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
    transform: `scale(${scale})`,
    transformOrigin: 'top left',
    fontFamily: "'Inter', 'Arial', sans-serif",
    fontSize: '12px',
    lineHeight: '1.5',
    color: '#333',
    overflow: 'hidden',
    boxShadow: scale < 1 ? 'none' : '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
  }

  // ===== TEMPLATE 1: TRAVIS CLASSIC =====
  if (templateId === 'travis-classic') {
    return (
      <div style={wrapperStyle}>
        <div style={{padding: '20mm'}}>
          {/* Header */}
          <div style={{borderBottom: '3px solid #1a1a2e', paddingBottom: '12px', marginBottom: '16px'}}>
            <p style={{fontSize: '10px', letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '4px'}}>
              {title}
            </p>
            <h1 style={{fontSize: '32px', fontWeight: '900', color: '#1a1a2e', letterSpacing: '1px', textTransform: 'uppercase', margin: '0 0 8px 0'}}>
              {name && name.trim().length > 0 ? name : <span style={{color: '#ccc'}}>YOUR NAME</span>}
            </h1>
            <p style={{fontSize: '10px', color: '#666'}}>
              {location} | {phone} | {email} {linkedin && `| ${linkedin}`}
            </p>
          </div>

          {/* Summary */}
          {summary && summary.trim().length > 0 && (
            <div style={{marginBottom: '16px'}}>
              <p style={{fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#1a1a2e', marginBottom: '6px'}}>SUMMARY</p>
              <p style={{fontSize: '11px', color: '#444', lineHeight: '1.6'}}>{summary}</p>
            </div>
          )}

          {/* Skills */}
          {skills && skills.length > 0 && (
            <div style={{marginBottom: '16px'}}>
              <p style={{fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#1a1a2e', marginBottom: '6px'}}>SKILLS</p>
              <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                {skills.map((skill: string, i: number) => (
                  <p key={i} style={{fontSize: '11px', color: '#444', margin: 0}}>• {skill}</p>
                ))}
              </div>
            </div>
          )}

          {/* Experience */}
          {experience.filter((e: any) => e.jobTitle || e.company).length > 0 && (
            <div style={{marginBottom: '16px'}}>
              <p style={{fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#1a1a2e', marginBottom: '8px'}}>EXPERIENCE</p>
              {experience
                .filter((e: any) => e.jobTitle || e.company)
                .map((exp: any, i: number) => (
                <div key={i} style={{marginBottom: '12px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
                    <p style={{fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', margin: 0}}>{exp.jobTitle} | {exp.company}</p>
                    <p style={{fontSize: '10px', color: '#666', whiteSpace: 'nowrap', marginLeft: '8px'}}>{exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : exp.current ? ' - Present' : ''}</p>
                  </div>
                  <p style={{fontSize: '10px', color: '#666', marginBottom: '4px'}}>{exp.location}</p>
                  {exp.description && exp.description.split('\n').map((line: string, j: number) => (
                    <p key={j} style={{fontSize: '11px', color: '#444', margin: '2px 0'}}>• {line}</p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Education */}
          {education.filter((e: any) => e.degree || e.institution).length > 0 && (
            <div style={{marginBottom: '16px'}}>
              <p style={{fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#1a1a2e', marginBottom: '8px'}}>EDUCATION</p>
              {education
                .filter((e: any) => e.degree || e.institution)
                .map((edu: any, i: number) => (
                <div key={i} style={{marginBottom: '8px'}}>
                  <div style={{display: 'flex', justifyContent: 'space-between'}}>
                    <div>
                      <p style={{fontSize: '11px', fontWeight: 'bold', margin: 0}}>{edu.degree}</p>
                      <p style={{fontSize: '10px', color: '#555'}}>{edu.institution}</p>
                    </div>
                    <p style={{fontSize: '10px', color: '#666'}}>{edu.year}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.filter((p: any) => p.projectName?.trim()).length > 0 && (
            <div style={{marginBottom:'16px'}}>
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
            <div style={{marginBottom:'16px'}}>
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
            <div style={{marginBottom:'16px'}}>
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
      </div>
    )
  }

  // ===== TEMPLATE 2: MIRA MODERN =====
  if (templateId === 'mira-modern') {
    return (
      <div style={wrapperStyle}>
        {/* Center Header */}
        <div style={{backgroundColor: '#f8f8f8', padding: '16px 20mm', textAlign: 'center', borderBottom: '2px solid #ddd'}}>
          <h1 style={{fontSize: '28px', fontWeight: '700', letterSpacing: '4px', textTransform: 'uppercase', margin: '0 0 4px 0', color: '#1a1a1a'}}>
            {name && name.trim().length > 0 ? name : <span style={{color: '#ccc'}}>YOUR NAME</span>}
          </h1>
          <p style={{fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: '#666', margin: 0}}>
            {title}
          </p>
        </div>

        {/* Two column layout */}
        <div style={{display: 'flex', minHeight: '250mm'}}>
          {/* Left sidebar */}
          <div style={{width: '35%', backgroundColor: '#f0f0f0', padding: '16px 12px'}}>
            <div style={{marginBottom: '16px'}}>
              <p style={{fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#333', borderBottom: '1px solid #999', paddingBottom: '4px', marginBottom: '8px'}}>DETAILS</p>
              <p style={{fontSize: '10px', color: '#444', margin: '2px 0'}}>{phone}</p>
              <p style={{fontSize: '10px', color: '#444', margin: '2px 0'}}>{email}</p>
              <p style={{fontSize: '10px', color: '#444', margin: '2px 0'}}>{location}</p>
            </div>

            {skills && skills.length > 0 && (
              <div style={{marginBottom: '16px'}}>
                <p style={{fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#333', borderBottom: '1px solid #999', paddingBottom: '4px', marginBottom: '8px'}}>SKILLS</p>
                {skills.map((skill: string, i: number) => (
                  <p key={i} style={{fontSize: '10px', color: '#444', margin: '3px 0'}}>{skill}</p>
                ))}
              </div>
            )}
            

          </div>

          {/* Right content */}
          <div style={{width: '65%', padding: '16px 16px'}}>
            {summary && summary.trim().length > 0 && (
              <div style={{marginBottom: '16px'}}>
                <p style={{fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '2px solid #333', paddingBottom: '4px', marginBottom: '8px'}}>SUMMARY</p>
                <p style={{fontSize: '11px', color: '#444', lineHeight: '1.6'}}>{summary}</p>
              </div>
            )}

            {experience && experience.filter((e: any) => e.jobTitle || e.company).length > 0 && (
              <div style={{marginBottom: '16px'}}>
                <p style={{fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '2px solid #333', paddingBottom: '4px', marginBottom: '8px'}}>EXPERIENCE</p>
                {experience
                  .filter((e: any) => e.jobTitle || e.company)
                  .map((exp: any, i: number) => (
                  <div key={i} style={{marginBottom: '12px'}}>
                    <p style={{fontSize: '11px', fontWeight: 'bold', margin: '0 0 2px 0'}}>{exp.jobTitle}</p>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                      <p style={{fontSize: '10px', color: '#555', margin: 0}}>{exp.company}, {exp.location}</p>
                      <p style={{fontSize: '10px', color: '#666', margin: 0}}>{exp.startDate} — {exp.endDate || (exp.current ? 'Present' : '')}</p>
                    </div>
                    <p style={{fontSize: '11px', color: '#444', marginTop: '4px', lineHeight: '1.5'}}>{exp.description}</p>
                  </div>
                ))}
              </div>
            )}

            {education && education.filter((e: any) => e.degree || e.institution).length > 0 && (
              <div style={{marginBottom: '16px'}}>
                <p style={{fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', borderBottom: '2px solid #333', paddingBottom: '4px', marginBottom: '8px'}}>EDUCATION</p>
                {education
                  .filter((e: any) => e.degree || e.institution)
                  .map((edu: any, i: number) => (
                  <div key={i} style={{marginBottom: '12px'}}>
                    <p style={{fontSize: '11px', fontWeight: 'bold', margin: '0 0 2px 0'}}>{edu.degree}</p>
                    <p style={{fontSize: '10px', color: '#555', margin: 0}}>{edu.institution}, {edu.year}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Projects */}
            {projects.filter((p: any) => p.projectName?.trim()).length > 0 && (
              <div style={{marginBottom:'16px'}}>
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
              <div style={{marginBottom:'16px'}}>
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
              <div style={{marginBottom:'16px'}}>
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
        </div>
      </div>
    )
  }

  // ===== TEMPLATE 3: TRAVIS SIDEBAR =====
  if (templateId === 'travis-sidebar') {
    return (
      <div style={{...wrapperStyle, display: 'flex'}}>
        {/* Dark left sidebar */}
        <div style={{width: '32%', backgroundColor: '#1e3a5f', padding: '20px 14px', color: 'white'}}>
          <div style={{marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.2)'}}>
            <h1 style={{fontSize: '18px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 4px 0', lineHeight: '1.2'}}>
              {name && name.trim().length > 0 ? name : <span style={{color: 'rgba(255,255,255,0.3)'}}>YOUR NAME</span>}
            </h1>
            <p style={{fontSize: '10px', color: 'rgba(255,255,255,0.7)', textTransform: 'uppercase', letterSpacing: '1px', margin: 0}}>
              {title}
            </p>
          </div>

          <div style={{marginBottom: '16px'}}>
            <p style={{fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '8px'}}>CONTACT</p>
            <p style={{fontSize: '10px', color: 'rgba(255,255,255,0.85)', margin: '4px 0'}}>{email}</p>
            <p style={{fontSize: '10px', color: 'rgba(255,255,255,0.85)', margin: '4px 0'}}>{phone}</p>
            <p style={{fontSize: '10px', color: 'rgba(255,255,255,0.85)', margin: '4px 0'}}>{location}</p>
          </div>

          {skills && skills.length > 0 && (
            <div style={{marginBottom: '16px'}}>
              <p style={{fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '8px'}}>SKILLS</p>
              {skills.map((skill: string, i: number) => (
                <div key={i} style={{marginBottom: '4px'}}>
                  <p style={{fontSize: '10px', color: 'rgba(255,255,255,0.9)', margin: '0 0 2px 0'}}>* {skill}</p>
                </div>
              ))}
            </div>
          )}
          
          {education && education.filter((e: any) => e.degree || e.institution).length > 0 && (
            <div style={{marginBottom: '16px'}}>
              <p style={{fontSize: '9px', fontWeight: 'bold', letterSpacing: '2px', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', marginBottom: '8px'}}>EDUCATION</p>
              {education.filter((e: any) => e.degree || e.institution).map((edu: any, i: number) => (
                <div key={i} style={{marginBottom: '8px'}}>
                  <p style={{fontSize: '10px', fontWeight: 'bold', color: 'white', margin: 0}}>{edu.degree}</p>
                  <p style={{fontSize: '9px', color: 'rgba(255,255,255,0.7)', margin: 0}}>{edu.institution}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right content */}
        <div style={{width: '68%', padding: '20px 16px'}}>
          {summary && summary.trim().length > 0 && (
            <div style={{marginBottom: '16px'}}>
              <p style={{fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#1e3a5f', borderBottom: '2px solid #1e3a5f', paddingBottom: '4px', marginBottom: '8px'}}>SUMMARY</p>
              <p style={{fontSize: '11px', color: '#444', lineHeight: '1.6'}}>{summary}</p>
            </div>
          )}

          {experience && experience.filter((e: any) => e.jobTitle || e.company).length > 0 && (
            <div style={{marginBottom: '16px'}}>
              <p style={{fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', textTransform: 'uppercase', color: '#1e3a5f', borderBottom: '2px solid #1e3a5f', paddingBottom: '4px', marginBottom: '8px'}}>EXPERIENCE</p>
              {experience
                .filter((e: any) => e.jobTitle || e.company)
                .map((exp: any, i: number) => (
                <div key={i} style={{marginBottom: '12px'}}>
                  <p style={{fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', margin: '0 0 2px 0', color: '#1e3a5f'}}>{exp.jobTitle} AT {exp.company}</p>
                  <p style={{fontSize: '10px', color: '#888', marginBottom: '4px'}}>{exp.location}, {exp.startDate} - {exp.endDate || (exp.current ? 'Present' : '')}</p>
                  {exp.description && exp.description.split('\n').map((line: string, j: number) => (
                    <p key={j} style={{fontSize: '11px', color: '#444', margin: '2px 0'}}>• {line}</p>
                  ))}
                </div>
              ))}
            </div>
          )}
          
          {/* Projects */}
          {projects.filter((p: any) => p.projectName?.trim()).length > 0 && (
            <div style={{marginBottom:'16px'}}>
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
            <div style={{marginBottom:'16px'}}>
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
            <div style={{marginBottom:'16px'}}>
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
      </div>
    )
  }

  // DEFAULT fallback - simple clean
  return (
    <div style={{...wrapperStyle, padding: '20mm'}}>
      <div style={{textAlign: 'center', borderBottom: '2px solid #333', paddingBottom: '12px', marginBottom: '16px'}}>
        <h1 style={{fontSize: '26px', fontWeight: 'bold', margin: '0 0 4px 0'}}>
          {name && name.trim().length > 0 ? name : <span style={{color: '#ccc'}}>YOUR NAME</span>}
        </h1>
        <p style={{fontSize: '13px', color: '#555', margin: '0 0 6px 0'}}>{title}</p>
        <p style={{fontSize: '11px', color: '#777'}}>{email} • {phone} • {location}</p>
      </div>
      
      {summary && summary.trim().length > 0 && (
        <p style={{fontSize: '12px', color: '#444', lineHeight: '1.6', marginBottom: '16px'}}>{summary}</p>
      )}

      {experience.filter((e: any) => e.jobTitle || e.company).length > 0 && (
        <div style={{marginBottom: '16px'}}>
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
        <div style={{marginBottom: '16px'}}>
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
        <div style={{marginBottom: '16px'}}>
          <p style={{fontWeight: 'bold', borderBottom: '1px solid #ccc', paddingBottom: '4px', marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px'}}>SKILLS</p>
          <p style={{fontSize: '11px', color: '#444'}}>{skills.join(' • ')}</p>
        </div>
      )}

      {/* Projects */}
      {projects.filter((p: any) => p.projectName?.trim()).length > 0 && (
        <div style={{marginBottom:'16px'}}>
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
        <div style={{marginBottom:'16px'}}>
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
        <div style={{marginBottom:'16px'}}>
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
