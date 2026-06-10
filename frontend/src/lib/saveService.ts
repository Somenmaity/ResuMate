import { supabase } from './supabase'

export async function saveResumeData(resumeData: any) {
  try {
    // Save to localStorage always (instant)
    localStorage.setItem('resumeData', JSON.stringify(resumeData))
    localStorage.setItem('resumeLastSaved', new Date().toISOString())

    // Save to Supabase if user is logged in
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      const resumeId = localStorage.getItem('resumeId')
      
      const payload = {
        user_id: session.user.id,
        title: resumeData.personalInfo?.fullName 
          ? `${resumeData.personalInfo.fullName}'s Resume`
          : 'My Resume',
        template_id: localStorage.getItem('selectedTemplate') || 'travis-classic',
        personal_info: resumeData.personalInfo || {},
        summary: resumeData.summary || '',
        experience: resumeData.experience || [],
        education: resumeData.education || [],
        skills: resumeData.skills || [],
        projects: resumeData.projects || [],
        certifications: resumeData.certifications || [],
        languages: resumeData.languages || [],
        updated_at: new Date().toISOString()
      }

      if (resumeId) {
        // Update existing resume
        const { data, error } = await supabase
          .from('resumes')
          .update(payload)
          .eq('id', resumeId)
          .eq('user_id', session.user.id)
          .select()
          .single()
        
        if (error) throw error
        return { success: true, resumeId: data.id }
      } else {
        // Create new resume
        const { data, error } = await supabase
          .from('resumes')
          .insert(payload)
          .select()
          .single()
        
        if (error) throw error
        
        localStorage.setItem('resumeId', data.id)
        return { success: true, resumeId: data.id }
      }
    }

    return { success: true, resumeId: null }
  } catch (error: any) {
    console.error('Save failed:', error)
    return { success: false, error: error.message }
  }
}

export async function loadResumeData() {
  try {
    // First try Supabase
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      const resumeId = localStorage.getItem('resumeId')
      
      if (resumeId) {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('id', resumeId)
          .eq('user_id', session.user.id)
          .single()
        
        if (!error && data) {
          const resumeData = {
            personalInfo: data.personal_info || {},
            summary: data.summary || '',
            experience: data.experience || [],
            education: data.education || [],
            skills: data.skills || [],
            projects: data.projects || [],
            certifications: data.certifications || [],
            languages: data.languages || []
          }
          localStorage.setItem('resumeData', JSON.stringify(resumeData))
          return resumeData
        }
      }
    }

    // Fallback to localStorage
    const saved = localStorage.getItem('resumeData')
    if (saved) return JSON.parse(saved)
    
    return null
  } catch (error) {
    const saved = localStorage.getItem('resumeData')
    if (saved) return JSON.parse(saved)
    return null
  }
}
