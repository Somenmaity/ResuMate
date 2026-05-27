export async function initiatePayment({
  amount,
  name,
  email,
  phone,
  onSuccess,
  onFailure
}: {
  amount: number
  name: string
  email: string
  phone: string
  onSuccess: (paymentId: string) => void
  onFailure: () => void
}) {
  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: amount * 100,
    currency: 'INR',
    name: 'ResuMate AI',
    description: 'Resume - PDF + DOCX Download',
    prefill: {
      name: name,
      email: email,
      contact: phone
    },
    theme: { color: '#4F46E5' },
    handler: function(response: any) {
      onSuccess(response.razorpay_payment_id)
    },
    modal: {
      ondismiss: function() {
        onFailure()
      }
    }
  }
  const rzp = new (window as any).Razorpay(options)
  rzp.open()
}
