import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import ResumePreview from '../components/ResumePreview'
import { generateAndDownloadPDF } from '../lib/pdfGenerator'
import { generateAndDownloadDOCX } from '../lib/docxGenerator'
import { sendResumeEmail } from '../lib/emailService'

export const Download = () => {
  const navigate = useNavigate()
  const [resumeData, setResumeData] = useState<any>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('travis-classic')
  const [paymentData, setPaymentData] = useState<any>(null)
  const [downloadingPDF, setDownloadingPDF] = useState(false)
  const [downloadingDOCX, setDownloadingDOCX] = useState(false)
  const [pdfDone, setPdfDone] = useState(false)
  const [docxDone, setDocxDone] = useState(false)
  const [coverLetter, setCoverLetter] = useState<any>(null)
  const [clDone, setClDone] = useState(false)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResendEmail = async () => {
    if (!paymentData) {
      alert('Payment data not found!')
      return
    }
    setResending(true)
    try {
      await sendResumeEmail({
        toEmail: paymentData.email || '',
        toName: paymentData.name || 'Valued User',
        paymentId: paymentData.paymentId || 'N/A',
        amount: paymentData.amount ? `₹${paymentData.amount}` : '₹199'
      })
      setResent(true)
      alert(`✅ Resume link resent to ${paymentData.email}`)
    } catch (err) {
      console.error(err)
      setResent(false)
      alert('❌ Email failed. Please try again.')
    } finally {
      setResending(false)
    }
  }

  useEffect(() => {
    const saved = localStorage.getItem('resumeData')
    if (saved) setResumeData(JSON.parse(saved))

    const template = localStorage.getItem('selectedTemplate')
    if (template) setSelectedTemplate(template)

    const payment = localStorage.getItem('payment')
    if (payment) setPaymentData(JSON.parse(payment))

    const cl = localStorage.getItem('coverLetter')
    if (cl) { try { setCoverLetter(JSON.parse(cl)) } catch {} }
  }, [])

  // Which documents did the user pay for?
  const plan = paymentData?.plan || 'resume'
  const showResume = plan === 'resume' || plan === 'bundle'
  const showCoverLetter = plan === 'cover_letter' || plan === 'bundle'

  const getFileName = () => {
    const name = resumeData?.personalInfo?.fullName || 'Resume'
    return name.replace(/\s+/g, '_') + '_ResuMate'
  }

  const handleDownloadPDF = async () => {
    setDownloadingPDF(true)
    setPdfDone(false)
    try {
      await generateAndDownloadPDF(resumeData, selectedTemplate, getFileName())
      setPdfDone(true)
    } finally {
      setDownloadingPDF(false)
    }
  }

  const handleDownloadDOCX = async () => {
    setDownloadingDOCX(true)
    setDocxDone(false)
    try {
      await generateAndDownloadDOCX(resumeData, getFileName())
      setDocxDone(true)
    } finally {
      setDownloadingDOCX(false)
    }
  }

  const handleDownloadCoverLetter = () => {
    if (!coverLetter?.text) return
    const blob = new Blob([coverLetter.text], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `Cover_Letter_${(coverLetter.company || 'ResuMate').replace(/\s+/g, '_')}.txt`
    a.click()
    setClDone(true)
  }

  return (
    <div style={{minHeight:'100vh', backgroundColor:'#f8fafc'}}>
      
      {/* Navbar */}
      <nav style={{backgroundColor:'white', borderBottom:'1px solid #e5e7eb', padding:'16px 24px', display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div style={{display:'flex', alignItems:'center', gap:'8px'}}>
          <div style={{width:'32px', height:'32px', backgroundColor:'#4F46E5', borderRadius:'8px', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold', fontSize:'14px'}}>R</div>
          <span style={{fontWeight:700, fontSize:'18px'}}>ResuMate AI</span>
        </div>
        <div style={{display:'flex', gap:'8px', fontSize:'13px', color:'#6b7280'}}>
          <span style={{color:'#4F46E5', fontWeight:600}}>✓ Build</span>
          <span>→</span>
          <span style={{color:'#4F46E5', fontWeight:600}}>✓ AI Enhance</span>
          <span>→</span>
          <span style={{color:'#4F46E5', fontWeight:600}}>✓ Review</span>
          <span>→</span>
          <span style={{color:'#4F46E5', fontWeight:600}}>✓ Payment</span>
          <span>→</span>
          <span style={{color:'#111827', fontWeight:700}}>⬇ Download</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{textAlign:'center', padding:'40px 24px 24px'}}>
        <div style={{width:'64px', height:'64px', backgroundColor:'#dcfce7', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', fontSize:'28px'}}>✓</div>
        <h1 style={{fontSize:'32px', fontWeight:800, margin:'0 0 8px'}}>Your Resume is Ready! 🚀</h1>
        <p style={{color:'#6b7280', fontSize:'16px', margin:0}}>Download in your preferred format — high quality, ATS-friendly</p>
        {paymentData && (
          <p style={{color:'#10b981', fontSize:'14px', marginTop:'8px', fontWeight:500}}>
            ✅ Payment confirmed • {paymentData.email}
          </p>
        )}
        {paymentData?.email && (
          <div style={{
            backgroundColor:'#f0f9ff',
            border:'1px solid #bae6fd',
            borderRadius:'10px',
            padding:'10px 16px',
            marginTop:'8px',
            fontSize:'13px',
            color:'#0369a1',
            textAlign:'center',
            display: 'inline-block'
          }}>
            📧 Download link sent to: <strong>{paymentData.email}</strong>
          </div>
        )}
      </div>

      <div style={{maxWidth:'1100px', margin:'0 auto', padding:'0 24px 40px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'32px', alignItems:'start'}}>
        
        {/* LEFT - Resume Preview (this is what gets captured for PDF) */}
        <div>
          <p style={{fontSize:'13px', fontWeight:600, color:'#6b7280', marginBottom:'12px', textAlign:'center'}}>RESUME PREVIEW</p>
          
          {/* This div is captured for PDF */}
          <div 
            id="resume-download-preview"
            style={{
              backgroundColor:'white',
              boxShadow:'0 4px 24px rgba(0,0,0,0.12)',
              borderRadius:'4px',
              overflow:'hidden'
            }}
          >
            <ResumePreview
              resumeData={resumeData}
              templateId={selectedTemplate}
              scale={1}
            />
          </div>
        </div>

        {/* RIGHT - Download Options */}
        <div>
          <p style={{fontSize:'13px', fontWeight:600, color:'#6b7280', marginBottom:'16px'}}>DOWNLOAD OPTIONS</p>

          {/* PDF Card */}
          {showResume && (
          <div style={{backgroundColor:'white', border:'1px solid #e5e7eb', borderRadius:'16px', padding:'24px', marginBottom:'16px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
              <div style={{width:'48px', height:'48px', backgroundColor:'#fef2f2', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px'}}>📄</div>
              <div>
                <h3 style={{margin:0, fontSize:'18px', fontWeight:700}}>PDF Format</h3>
                <p style={{margin:0, fontSize:'13px', color:'#6b7280'}}>Best for job applications</p>
              </div>
            </div>
            <div style={{marginBottom:'16px'}}>
              {['ATS-friendly format', 'Print-ready quality', 'Universal compatibility', 'Exact template styling'].map(f => (
                <p key={f} style={{margin:'4px 0', fontSize:'13px', color:'#374151'}}>✓ {f}</p>
              ))}
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              style={{
                width:'100%', padding:'14px',
                backgroundColor: pdfDone ? '#16a34a' : '#dc2626',
                color:'white', border:'none',
                borderRadius:'10px', fontSize:'16px',
                fontWeight:700, cursor: downloadingPDF ? 'wait' : 'pointer',
                transition:'all 0.2s'
              }}
            >
              {downloadingPDF ? '⏳ Generating PDF...' : pdfDone ? '✅ PDF Downloaded!' : '⬇ Download PDF'}
            </button>
          </div>
          )}

          {/* DOCX Card */}
          {showResume && (
          <div style={{backgroundColor:'white', border:'1px solid #e5e7eb', borderRadius:'16px', padding:'24px', marginBottom:'16px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
              <div style={{width:'48px', height:'48px', backgroundColor:'#eff6ff', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px'}}>📝</div>
              <div>
                <h3 style={{margin:0, fontSize:'18px', fontWeight:700}}>Word Format (.docx)</h3>
                <p style={{margin:0, fontSize:'13px', color:'#6b7280'}}>Editable in Microsoft Word</p>
              </div>
            </div>
            <div style={{marginBottom:'16px'}}>
              {['Fully editable', 'Easy to customize', 'ATS-compatible', 'Professional formatting'].map(f => (
                <p key={f} style={{margin:'4px 0', fontSize:'13px', color:'#374151'}}>✓ {f}</p>
              ))}
            </div>
            <button
              onClick={handleDownloadDOCX}
              disabled={downloadingDOCX}
              style={{
                width:'100%', padding:'14px',
                backgroundColor: docxDone ? '#16a34a' : '#2563eb',
                color:'white', border:'none',
                borderRadius:'10px', fontSize:'16px',
                fontWeight:700, cursor: downloadingDOCX ? 'wait' : 'pointer',
                transition:'all 0.2s'
              }}
            >
              {downloadingDOCX ? '⏳ Generating Word File...' : docxDone ? '✅ Word Downloaded!' : '⬇ Download Word (.docx)'}
            </button>
          </div>
          )}

          {/* Cover Letter Card */}
          {showCoverLetter && (
          <div style={{backgroundColor:'white', border:'1px solid #e5e7eb', borderRadius:'16px', padding:'24px', marginBottom:'16px'}}>
            <div style={{display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px'}}>
              <div style={{width:'48px', height:'48px', backgroundColor:'#f0fdf4', borderRadius:'12px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px'}}>✉️</div>
              <div>
                <h3 style={{margin:0, fontSize:'18px', fontWeight:700}}>Cover Letter</h3>
                <p style={{margin:0, fontSize:'13px', color:'#6b7280'}}>
                  {coverLetter ? `For ${coverLetter.jobTitle || 'job'} at ${coverLetter.company || 'company'}` : 'AI-generated for any job'}
                </p>
              </div>
            </div>
            <div style={{marginBottom:'16px'}}>
              {['AI-written content', 'Matches your resume', 'Tone customizable', 'Ready to send'].map(f => (
                <p key={f} style={{margin:'4px 0', fontSize:'13px', color:'#374151'}}>✓ {f}</p>
              ))}
            </div>
            {coverLetter?.text ? (
              <button
                onClick={handleDownloadCoverLetter}
                style={{
                  width:'100%', padding:'14px',
                  backgroundColor: clDone ? '#16a34a' : '#059669',
                  color:'white', border:'none',
                  borderRadius:'10px', fontSize:'16px',
                  fontWeight:700, cursor:'pointer',
                  transition:'all 0.2s'
                }}
              >
                {clDone ? '✅ Cover Letter Downloaded!' : '⬇ Download Cover Letter'}
              </button>
            ) : (
              <button
                onClick={() => navigate('/cover-letter')}
                style={{
                  width:'100%', padding:'14px',
                  backgroundColor:'#059669', color:'white', border:'none',
                  borderRadius:'10px', fontSize:'16px',
                  fontWeight:700, cursor:'pointer'
                }}
              >
                ✨ Generate Cover Letter First
              </button>
            )}
          </div>
          )}

          {/* Secondary Actions */}
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'16px'}}>
            <button
              onClick={() => navigate('/builder')}
              style={{padding:'10px', border:'1px solid #e5e7eb', borderRadius:'10px', backgroundColor:'white', fontSize:'13px', fontWeight:500, cursor:'pointer'}}>
              ✏️ Edit Resume
            </button>
            <button
              onClick={() => navigate('/')}
              style={{padding:'10px', border:'1px solid #e5e7eb', borderRadius:'10px', backgroundColor:'white', fontSize:'13px', fontWeight:500, cursor:'pointer'}}>
              🔄 New Resume
            </button>
            <button
              onClick={handleResendEmail}
              disabled={resending}
              style={{
                padding:'10px',
                border:'1px solid #e5e7eb',
                borderRadius:'10px',
                backgroundColor: resent ? '#f0fdf4' : 'white',
                fontSize:'13px',
                fontWeight:500,
                cursor: resending ? 'wait' : 'pointer'
              }}
            >
              {resending ? '📤 Sending...' : resent ? '✅ Email Sent!' : '📧 Resend Email'}
            </button>
            <button
              onClick={() => window.print()}
              style={{padding:'10px', border:'1px solid #e5e7eb', borderRadius:'10px', backgroundColor:'white', fontSize:'13px', fontWeight:500, cursor:'pointer'}}>
              🖨️ Print
            </button>
          </div>

          {/* Referral Banner */}
          <div style={{backgroundColor:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:'12px', padding:'16px', textAlign:'center'}}>
            <p style={{margin:'0 0 4px', fontWeight:600, fontSize:'14px'}}>Love ResuMate AI? 🎉</p>
            <p style={{margin:'0 0 12px', fontSize:'13px', color:'#6b7280'}}>Refer friends and earn ₹100 per signup</p>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}?ref=user123`)
                alert('Referral link copied!')
              }}
              style={{padding:'8px 20px', backgroundColor:'#4F46E5', color:'white', border:'none', borderRadius:'8px', fontSize:'13px', fontWeight:600, cursor:'pointer'}}>
              Get Referral Link
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
