const BASE_URL = import.meta.env.VITE_API_URL || 
  'http://localhost:5000'

const getToken = () => localStorage.getItem('authToken') || ''

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
})

// AUTH APIs
export const authAPI = {
  signup: async (fullName: string, email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ fullName, email, password })
    })
    return res.json()
  },

  signin: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/api/auth/signin`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.success && data.session) {
      localStorage.setItem('authToken', data.session.access_token)
      localStorage.setItem('userData', JSON.stringify(data.user))
    }
    return data
  },

  signout: async () => {
    await fetch(`${BASE_URL}/api/auth/signout`, {
      method: 'POST',
      headers: headers()
    })
    localStorage.removeItem('authToken')
    localStorage.removeItem('userData')
  },

  getUser: async () => {
    const res = await fetch(`${BASE_URL}/api/auth/user`, {
      headers: headers()
    })
    return res.json()
  }
}

// RESUME APIs
export const resumeAPI = {
  save: async (resumeData: any, resumeId?: string, templateId?: string) => {
    const res = await fetch(`${BASE_URL}/api/resume/save`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ resumeData, resumeId, templateId })
    })
    return res.json()
  },

  list: async () => {
    const res = await fetch(`${BASE_URL}/api/resume/list`, {
      headers: headers()
    })
    return res.json()
  },

  get: async (resumeId: string) => {
    const res = await fetch(`${BASE_URL}/api/resume/${resumeId}`, {
      headers: headers()
    })
    return res.json()
  },

  delete: async (resumeId: string) => {
    const res = await fetch(`${BASE_URL}/api/resume/delete/${resumeId}`, {
      method: 'DELETE',
      headers: headers()
    })
    return res.json()
  }
}

// AI APIs
export const aiAPI = {
  enhance: async (text: string, section: string) => {
    const res = await fetch(`${BASE_URL}/api/ai/enhance`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ text, section })
    })
    return res.json()
  },

  enhanceFull: async (resumeData: any) => {
    const res = await fetch(`${BASE_URL}/api/ai/enhance-full`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ resumeData })
    })
    return res.json()
  },

  analyzeJD: async (jdText: string, resumeText?: string) => {
    const res = await fetch(`${BASE_URL}/api/ai/analyze-jd`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ jdText, resumeText })
    })
    return res.json()
  },

  detectJDInfo: async (jdText: string) => {
    const res = await fetch(`${BASE_URL}/api/ai/detect-jd-info`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ jdText })
    })
    return res.json()
  }
}

// PAYMENT APIs
export const paymentAPI = {
  createOrder: async (amount: number, plan: string) => {
    const res = await fetch(`${BASE_URL}/api/payment/create-order`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify({ amount, plan })
    })
    return res.json()
  },

  verifyPayment: async (paymentData: any) => {
    const res = await fetch(`${BASE_URL}/api/payment/verify`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(paymentData)
    })
    return res.json()
  }
}

// EMAIL APIs
export const emailAPI = {
  sendResume: async (emailData: any) => {
    const res = await fetch(`${BASE_URL}/api/email/send-resume`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(emailData)
    })
    return res.json()
  }
}
