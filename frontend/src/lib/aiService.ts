const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY

const SYSTEM_PROMPT = `You are a professional resume writer 
with 10+ years of experience.

STRICT RULES:
- ONLY improve and rephrase existing text professionally
- NEVER add fake companies, experiences, or achievements
- NEVER invent any information not provided by user
- Keep same meaning but make it more professional
- Use strong action verbs (Led, Developed, Achieved, Managed)
- Make it ATS-friendly with relevant keywords
- Return ONLY the improved text, nothing else
- Do not add any explanation or preamble`

export async function enhanceText(
  text: string,
  section: string
): Promise<string> {
  if (!text || text.trim().length < 5) {
    throw new Error('Text too short to enhance')
  }

  const response = await fetch(
    'https://openrouter.ai/api/v1/chat/completions',
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': 'ResuMate AI'
      },
      body: JSON.stringify({
        model: 'minimax/minimax-m2.5',
        messages: [
          {
            role: 'system',
            content: SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: `Improve this ${section} professionally. 
Return only the improved text:

${text}`
          }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    }
  )

  if (!response.ok) {
    const error = await response.json()
    console.error('OpenRouter error:', error)
    throw new Error('AI service failed: ' + response.status)
  }

  const data = await response.json()
  
  if (!data.choices || data.choices.length === 0) {
    throw new Error('No response from AI')
  }

  return data.choices[0].message.content.trim()
}

export async function enhanceFullResume(
  resumeData: any
): Promise<any> {
  const enhanced = { ...resumeData }

  try {
    if (resumeData.summary && resumeData.summary.trim().length > 10) {
      enhanced.summary = await enhanceText(
        resumeData.summary,
        'professional summary'
      )
    }
  } catch (err) {
    console.error('Summary enhancement failed:', err)
  }

  if (resumeData.experience && resumeData.experience.length > 0) {
    enhanced.experience = await Promise.all(
      resumeData.experience.map(async (exp: any) => {
        try {
          if (exp.description && exp.description.trim().length > 10) {
            return {
              ...exp,
              description: await enhanceText(
                exp.description,
                'work experience description'
              )
            }
          }
        } catch (err) {
          console.error('Experience enhancement failed:', err)
        }
        return exp
      })
    )
  }

  if (resumeData.projects && resumeData.projects.length > 0) {
    enhanced.projects = await Promise.all(
      resumeData.projects.map(async (proj: any) => {
        try {
          if (proj.description && proj.description.trim().length > 10) {
            return {
              ...proj,
              description: await enhanceText(
                proj.description,
                'project description'
              )
            }
          }
        } catch (err) {
          console.error('Project enhancement failed:', err)
        }
        return proj
      })
    )
  }

  return enhanced
}

export function calculateATSScore(resumeData: any): number {
  if (!resumeData) return 0
  let score = 0

  if (resumeData?.personalInfo?.fullName?.trim()) score += 10
  if (resumeData?.personalInfo?.email?.trim()) score += 5
  if (resumeData?.personalInfo?.phone?.trim()) score += 5
  if (resumeData?.summary?.trim().length > 30) score += 15

  const validExp = resumeData?.experience?.filter(
    (e: any) => e.jobTitle || e.company
  )
  if (validExp?.length > 0) score += 20

  const validEdu = resumeData?.education?.filter(
    (e: any) => e.degree || e.institution
  )
  if (validEdu?.length > 0) score += 15

  if (resumeData?.skills?.length >= 5) score += 15
  else if (resumeData?.skills?.length > 0) score += 8

  const validProjects = resumeData?.projects?.filter(
    (p: any) => p.projectName?.trim()
  )
  if (validProjects?.length > 0) score += 10

  const validCerts = resumeData?.certifications?.filter(
    (c: any) => c.certName?.trim()
  )
  if (validCerts?.length > 0) score += 5

  return Math.min(score, 100)
}
