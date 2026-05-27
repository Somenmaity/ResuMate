import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { aiAPI } from '../lib/api'

interface EnhancementResult {
  section: string
  original: string
  enhanced: string
  keywords: string[]
  status: 'pending' | 'processing' | 'done' | 'error'
}

export const Enhance = () => {
  const navigate = useNavigate()
  const [results, setResults] = useState<EnhancementResult[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [resumeData, setResumeData] = useState<any>(null)
  const [enhancedData, setEnhancedData] = useState<any>(null)
  const [acceptedAll, setAcceptedAll] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem('resumeData')
    if (!saved) {
      navigate('/builder')
      return
    }
    const data = JSON.parse(saved)
    setResumeData(data)
    setEnhancedData(JSON.parse(JSON.stringify(data)))
    startEnhancement(data)
  }, [])

  const extractKeywords = (text: string): string[] => {
    const keywords = [
      'Leadership', 'Growth', 'Efficiency', 'Scalability',
      'Innovation', 'Performance', 'Strategy', 'Development',
      'Management', 'Optimization', 'Collaboration', 'Results',
      'Revenue', 'Customer', 'Technical', 'Analytics'
    ]
    return keywords.filter(k => 
      text.toLowerCase().includes(k.toLowerCase())
    ).slice(0, 3)
  }

  const startEnhancement = async (data: any) => {
    const sections: EnhancementResult[] = []

    // Add summary if exists
    if (data.summary && data.summary.trim().length > 10) {
      sections.push({
        section: 'Professional Summary',
        original: data.summary,
        enhanced: '',
        keywords: [],
        status: 'pending'
      })
    }

    // Add each experience
    if (data.experience) {
      data.experience
        .filter((e: any) => e.description && e.description.trim().length > 10)
        .forEach((exp: any, i: number) => {
          sections.push({
            section: `Work Experience${exp.jobTitle ? ' — ' + exp.jobTitle : ''}${exp.company ? ' at ' + exp.company : ''}`,
            original: exp.description,
            enhanced: '',
            keywords: [],
            status: 'pending'
          })
        })
    }

    // Add each project
    if (data.projects) {
      data.projects
        .filter((p: any) => p.description && p.description.trim().length > 10)
        .forEach((proj: any) => {
          sections.push({
            section: `Project — ${proj.projectName || 'Project'}`,
            original: proj.description,
            enhanced: '',
            keywords: [],
            status: 'pending'
          })
        })
    }

    if (sections.length === 0) {
      setIsComplete(true)
      return
    }

    setResults(sections)

    // Enhance each section one by one
    const updatedData = JSON.parse(JSON.stringify(data))
    let expIndex = 0
    let projIndex = 0

    for (let i = 0; i < sections.length; i++) {
      // Update status to processing
      setResults(prev => prev.map((r, idx) => 
        idx === i ? { ...r, status: 'processing' } : r
      ))
      setCurrentIndex(i)

      try {
        const sectionType = sections[i].section.startsWith('Work Experience') 
          ? 'work experience' 
          : sections[i].section.startsWith('Project')
          ? 'project description'
          : 'professional summary'

        // Call backend API
        const result = await aiAPI.enhance(
          sections[i].original,
          sectionType
        )
        const enhanced = result.success ? result.enhanced : sections[i].original

        const keywords = extractKeywords(enhanced)

        // Update result with enhanced text
        setResults(prev => prev.map((r, idx) => 
          idx === i ? { 
            ...r, 
            enhanced: enhanced,
            keywords: keywords,
            status: 'done' 
          } : r
        ))

        // Save enhanced data
        if (sections[i].section === 'Professional Summary') {
          updatedData.summary = enhanced
        } else if (sections[i].section.startsWith('Work Experience')) {
          if (updatedData.experience && updatedData.experience[expIndex]) {
            updatedData.experience[expIndex].description = enhanced
            expIndex++
          }
        } else if (sections[i].section.startsWith('Project')) {
          if (updatedData.projects && updatedData.projects[projIndex]) {
            updatedData.projects[projIndex].description = enhanced
            projIndex++
          }
        }

        setEnhancedData({ ...updatedData })

      } catch (error) {
        console.error(`Enhancement failed for section ${i}:`, error)
        setResults(prev => prev.map((r, idx) => 
          idx === i ? { 
            ...r, 
            enhanced: r.original,
            status: 'error' 
          } : r
        ))
      }

      // Small delay between API calls
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    setIsComplete(true)
    setEnhancedData(updatedData)
  }

  const handleAcceptAll = () => {
    if (enhancedData) {
      localStorage.setItem('resumeData', JSON.stringify(enhancedData))
      setAcceptedAll(true)
      setTimeout(() => navigate('/review'), 800)
    }
  }

  const handleSkip = () => {
    navigate('/review')
  }

  const handleAcceptOne = (index: number) => {
    setResults(prev => prev.map((r, idx) => 
      idx === index ? { ...r, status: 'done' } : r
    ))
  }

  const handleRejectOne = (index: number) => {
    if (resumeData) {
      const original = results[index].original
      setResults(prev => prev.map((r, idx) => 
        idx === index ? { ...r, enhanced: original } : r
      ))
    }
  }

  const completedCount = results.filter(r => r.status === 'done').length
  const totalCount = results.length

  return (
    <div style={{minHeight:'100vh', backgroundColor:'#f8fafc'}}>
      
      {/* Navbar */}
      <nav style={{backgroundColor:'white', borderBottom:'1px solid #e5e7eb', padding:'16px 24px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <div style={{width:'32px', height:'32px', backgroundColor:'#4F46E5', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold'}}>R</div>
          <span style={{fontWeight:700, fontSize:'18px'}}>ResuMate AI</span>
        </div>
        <div style={{display:'flex', alignItems:'center', gap:'24px'}}>
          <div style={{display:'flex', gap:'8px', alignItems:'center', fontSize:'14px'}}>
            <span style={{color:'#4F46E5', fontWeight:600}}>① Build ✓</span>
            <span style={{color:'#ccc'}}>——</span>
            <span style={{color:'#111', fontWeight:700}}>② AI Enhance</span>
            <span style={{color:'#ccc'}}>——</span>
            <span style={{color:'#999'}}>③ Review</span>
          </div>
          <button onClick={handleSkip}
            style={{background:'none', border:'none', color:'#6b7280', cursor:'pointer', fontSize:'14px'}}>
            Save & Exit
          </button>
        </div>
      </nav>

      <div style={{maxWidth:'900px', margin:'0 auto', padding:'40px 24px'}}>

        {/* Header */}
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'40px'}}>
          <div>
            {isComplete ? (
              <div style={{display:'inline-flex', alignItems:'center', gap:'6px', backgroundColor:'#f0fdf4', color:'#16a34a', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:600, marginBottom:'12px'}}>
                ✨ Analysis Complete
              </div>
            ) : (
              <div style={{display:'inline-flex', alignItems:'center', gap:'6px', backgroundColor:'#eff6ff', color:'#2563eb', padding:'6px 14px', borderRadius:'20px', fontSize:'13px', fontWeight:600, marginBottom:'12px'}}>
                <span style={{display:'inline-block', animation:'spin 1s linear infinite'}}>⟳</span>
                Enhancing {currentIndex + 1} of {totalCount}...
              </div>
            )}
            <h1 style={{fontSize:'32px', fontWeight:800, margin:'0 0 8px', color:'#111'}}>
              {isComplete ? 'AI Enhancement Complete' : 'AI is Enhancing Your Resume...'}
            </h1>
            <p style={{color:'#6b7280', fontSize:'16px', margin:0}}>
              {isComplete 
                ? "We've updated your content based on best practices and matching keywords."
                : 'Using MiniMax M2.5 AI to professionally rewrite your content.'
              }
            </p>
          </div>

          {isComplete && (
            <button
              onClick={handleAcceptAll}
              style={{
                padding:'12px 28px',
                backgroundColor: acceptedAll ? '#16a34a' : '#111',
                color:'white',
                border:'none',
                borderRadius:'12px',
                fontSize:'15px',
                fontWeight:700,
                cursor:'pointer',
                whiteSpace:'nowrap',
                flexShrink:0
              }}
            >
              {acceptedAll ? '✅ Saved!' : 'Final Review →'}
            </button>
          )}
        </div>

        {/* Progress bar */}
        {!isComplete && totalCount > 0 && (
          <div style={{marginBottom:'32px'}}>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:'13px', color:'#6b7280', marginBottom:'6px'}}>
              <span>Enhancing sections...</span>
              <span>{completedCount}/{totalCount} complete</span>
            </div>
            <div style={{backgroundColor:'#e5e7eb', borderRadius:'999px', height:'6px', overflow:'hidden'}}>
              <div style={{
                backgroundColor:'#4F46E5',
                height:'100%',
                width:`${totalCount > 0 ? (completedCount/totalCount)*100 : 0}%`,
                borderRadius:'999px',
                transition:'width 0.5s ease'
              }}/>
            </div>
          </div>
        )}

        {/* No data message */}
        {results.length === 0 && !isComplete && (
          <div style={{textAlign:'center', padding:'60px', color:'#6b7280'}}>
            <p style={{fontSize:'18px'}}>⟳ Loading your resume data...</p>
          </div>
        )}

        {/* No enhanceable content */}
        {results.length === 0 && isComplete && (
          <div style={{textAlign:'center', padding:'60px', backgroundColor:'white', borderRadius:'16px', border:'1px solid #e5e7eb'}}>
            <p style={{fontSize:'32px', marginBottom:'12px'}}>📝</p>
            <h3 style={{fontSize:'18px', fontWeight:600, marginBottom:'8px'}}>No content to enhance</h3>
            <p style={{color:'#6b7280', marginBottom:'24px'}}>Add more details to your resume for AI enhancement.</p>
            <button
              onClick={() => navigate('/builder')}
              style={{padding:'10px 24px', backgroundColor:'#4F46E5', color:'white', border:'none', borderRadius:'10px', cursor:'pointer', fontWeight:600}}>
              Go Back to Builder
            </button>
          </div>
        )}

        {/* Enhancement Results */}
        {results.map((result, index) => (
          <div key={index} style={{
            backgroundColor:'white',
            border:'1px solid #e5e7eb',
            borderRadius:'16px',
            padding:'24px',
            marginBottom:'20px',
            opacity: result.status === 'pending' ? 0.5 : 1,
            transition:'opacity 0.3s'
          }}>
            
            {/* Section header */}
            <div style={{display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px'}}>
              <div style={{
                width:'28px', height:'28px', borderRadius:'50%',
                backgroundColor: result.status === 'done' ? '#dcfce7' : 
                                  result.status === 'processing' ? '#eff6ff' :
                                  result.status === 'error' ? '#fef2f2' : '#f3f4f6',
                display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px'
              }}>
                {result.status === 'done' ? '✓' : 
                 result.status === 'processing' ? '⟳' : 
                 result.status === 'error' ? '✗' : '○'}
              </div>
              <h3 style={{margin:0, fontSize:'16px', fontWeight:700}}>
                {result.section}
              </h3>
              <span style={{
                fontSize:'11px', fontWeight:600, padding:'2px 8px', borderRadius:'999px',
                backgroundColor: result.status === 'done' ? '#dcfce7' : 
                                  result.status === 'processing' ? '#eff6ff' :
                                  result.status === 'error' ? '#fef2f2' : '#f3f4f6',
                color: result.status === 'done' ? '#16a34a' :
                       result.status === 'processing' ? '#2563eb' :
                       result.status === 'error' ? '#dc2626' : '#6b7280'
              }}>
                {result.status === 'done' ? 'ENHANCED' :
                 result.status === 'processing' ? 'PROCESSING...' :
                 result.status === 'error' ? 'FAILED' : 'PENDING'}
              </span>
            </div>

            {/* Before/After comparison */}
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px', marginBottom:'16px'}}>
              
              {/* Original */}
              <div style={{backgroundColor:'#f9fafb', borderRadius:'12px', padding:'16px'}}>
                <p style={{fontSize:'11px', fontWeight:600, color:'#9ca3af', letterSpacing:'1px', marginBottom:'8px'}}>ORIGINAL</p>
                <p style={{
                  fontSize:'14px', color:'#6b7280', lineHeight:'1.6', margin:0,
                  textDecoration: result.status === 'done' ? 'line-through' : 'none',
                  fontStyle:'italic'
                }}>
                  {result.original}
                </p>
              </div>

              {/* Enhanced */}
              <div style={{
                backgroundColor: result.status === 'done' ? '#f0fdf4' : 
                                  result.status === 'processing' ? '#eff6ff' : '#f9fafb',
                border: result.status === 'done' ? '1px solid #86efac' : '1px solid #e5e7eb',
                borderRadius:'12px', padding:'16px'
              }}>
                <p style={{fontSize:'11px', fontWeight:600, color: result.status === 'done' ? '#16a34a' : '#9ca3af', letterSpacing:'1px', marginBottom:'8px'}}>
                  {result.status === 'done' ? 'ENHANCED' : 'ENHANCED'}
                </p>
                {result.status === 'processing' ? (
                  <div style={{display:'flex', alignItems:'center', gap:'8px', color:'#6b7280'}}>
                    <span style={{fontSize:'18px'}}>⟳</span>
                    <span style={{fontSize:'14px'}}>MiniMax M2.5 is rewriting...</span>
                  </div>
                ) : result.status === 'error' ? (
                  <p style={{fontSize:'14px', color:'#dc2626', margin:0}}>
                    Enhancement failed. Original text preserved.
                  </p>
                ) : result.enhanced ? (
                  <p style={{fontSize:'14px', color:'#166534', lineHeight:'1.6', margin:0, fontWeight:500}}>
                    {result.enhanced}
                  </p>
                ) : (
                  <p style={{fontSize:'14px', color:'#9ca3af', margin:0, fontStyle:'italic'}}>
                    Waiting...
                  </p>
                )}
              </div>
            </div>

            {/* Keywords */}
            {result.keywords && result.keywords.length > 0 && (
              <div style={{display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'16px'}}>
                {result.keywords.map((kw, i) => (
                  <span key={i} style={{
                    fontSize:'12px', padding:'4px 12px',
                    backgroundColor:'#eff6ff', color:'#2563eb',
                    borderRadius:'999px', fontWeight:500,
                    display:'flex', alignItems:'center', gap:'4px'
                  }}>
                    ✨ {kw}
                  </span>
                ))}
              </div>
            )}

            {/* Accept/Reject buttons */}
            {result.status === 'done' && (
              <div style={{display:'flex', gap:'10px'}}>
                <button
                  onClick={() => handleRejectOne(index)}
                  style={{
                    padding:'8px 20px', border:'1px solid #e5e7eb',
                    borderRadius:'8px', backgroundColor:'white',
                    fontSize:'13px', fontWeight:500, cursor:'pointer',
                    color:'#6b7280'
                  }}
                >
                  ❌ Keep Original
                </button>
                <button
                  onClick={() => handleAcceptOne(index)}
                  style={{
                    padding:'8px 20px', border:'none',
                    borderRadius:'8px', backgroundColor:'#16a34a',
                    color:'white', fontSize:'13px',
                    fontWeight:500, cursor:'pointer'
                  }}
                >
                  ✅ Use Enhanced
                </button>
              </div>
            )}
          </div>
        ))}

        {/* Bottom actions */}
        {isComplete && results.length > 0 && (
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'32px', padding:'20px', backgroundColor:'white', borderRadius:'16px', border:'1px solid #e5e7eb'}}>
            <button
              onClick={handleSkip}
              style={{padding:'10px 24px', border:'1px solid #e5e7eb', borderRadius:'10px', backgroundColor:'white', fontSize:'14px', fontWeight:500, cursor:'pointer', color:'#6b7280'}}
            >
              Skip → Use Original
            </button>
            <div style={{display:'flex', gap:'12px'}}>
              <button
                onClick={() => navigate('/builder')}
                style={{padding:'10px 24px', border:'1px solid #e5e7eb', borderRadius:'10px', backgroundColor:'white', fontSize:'14px', fontWeight:500, cursor:'pointer'}}
              >
                ← Edit Resume
              </button>
              <button
                onClick={handleAcceptAll}
                style={{
                  padding:'12px 32px',
                  backgroundColor: acceptedAll ? '#16a34a' : '#111',
                  color:'white', border:'none',
                  borderRadius:'10px', fontSize:'15px',
                  fontWeight:700, cursor:'pointer'
                }}
              >
                {acceptedAll ? '✅ Saved! Going to Review...' : '✅ Accept All & Continue →'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}


