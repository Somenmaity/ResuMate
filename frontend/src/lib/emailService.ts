import emailjs from '@emailjs/browser'

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

export async function sendResumeEmail({
  toEmail,
  toName,
  paymentId,
  amount
}: {
  toEmail: string
  toName: string
  paymentId: string
  amount: string
}) {
  try {
    emailjs.init(PUBLIC_KEY)

    const downloadLink = `${window.location.origin}/download`
    
    const templateParams = {
      to_email: toEmail,
      to_name: toName,
      payment_id: paymentId,
      amount: amount,
      download_link: downloadLink,
      reply_to: toEmail
    }

    const result = await emailjs.send(
      SERVICE_ID,
      TEMPLATE_ID,
      templateParams
    )

    console.log('Email sent successfully:', result)
    return true
  } catch (error) {
    console.error('Email send failed:', error)
    throw error
  }
}
