import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentAPI } from '../lib/api';
import { motion } from 'motion/react';
import {
  Lock, CreditCard, Smartphone, Building2, Wallet,
  Check, Shield, Star, RefreshCw, ArrowRight, FileText, Mail, X
} from 'lucide-react';

// ─── Products ───────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    id: 'resume',
    icon: '📄',
    title: 'Resume Download',
    subtitle: 'PDF + DOCX formats',
    price: 99,
    features: ['ATS-friendly PDF', 'Editable DOCX', 'AI Enhanced', 'All templates'],
    color: '#4F46E5',
  },
  {
    id: 'cover_letter',
    icon: '✉️',
    title: 'Cover Letter',
    subtitle: 'AI-generated for any job',
    price: 21,
    features: ['AI-written content', 'Matches your resume', 'PDF + DOCX', 'Customizable'],
    color: '#059669',
    badge: 'New',
  },
  {
    id: 'bundle',
    icon: '🎯',
    title: 'Bundle — Both',
    subtitle: 'Resume + Cover Letter',
    price: 110,
    originalPrice: 120,
    features: ['Everything in Resume', 'Everything in Cover Letter', 'Save ₹10', 'Best value'],
    color: '#D97706',
    badge: 'Best Value',
  },
];

export const Payment = () => {
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState('resume');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const [userInfo, setUserInfo] = useState({ name: '', email: '', phone: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const product = PRODUCTS.find(p => p.id === selectedProduct)!;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
    setPaymentError('');
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!userInfo.name.trim()) e.name = 'Full name required';
    if (!userInfo.email.trim()) e.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(userInfo.email)) e.email = 'Invalid email';
    if (!userInfo.phone.trim()) e.phone = 'Phone required';
    else if (!/^\d{10}$/.test(userInfo.phone.replace(/\s/g, '').replace('+91', '')))
      e.phone = '10-digit phone number required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePayment = async () => {
    if (!validate()) return;
    setIsLoading(true);
    setPaymentError('');

    try {
      const order = await paymentAPI.createOrder(product.price, selectedProduct);

      if (!order.success) {
        setPaymentError(order.error || 'Order creation failed. Please try again.');
        setIsLoading(false);
        return;
      }

      const rzp = new (window as any).Razorpay({
        key: order.key,
        amount: order.amount,
        currency: 'INR',
        order_id: order.orderId,
        name: 'ResuMate AI',
        description: product.title,
        prefill: { name: userInfo.name, email: userInfo.email, contact: `+91${userInfo.phone.replace(/\D/g, '').slice(-10)}` },
        theme: { color: product.color },
        handler: async (response: any) => {
          try {
            const verified = await paymentAPI.verifyPayment({
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              userId: JSON.parse(localStorage.getItem('userData') || '{}').id,
              resumeId: localStorage.getItem('resumeId'),
              amount: product.price,
              plan: selectedProduct,
              name: userInfo.name,
              email: userInfo.email,
              phone: userInfo.phone,
            });

            if (verified.success) {
              localStorage.setItem('payment', JSON.stringify({
                paymentId: response.razorpay_payment_id,
                name: userInfo.name,
                email: userInfo.email,
                phone: userInfo.phone,
                amount: product.price,
                plan: selectedProduct,
                productTitle: product.title,
              }));
              navigate('/success');
            } else {
              setPaymentError('Payment verification failed. Contact support with payment ID: ' + response.razorpay_payment_id);
            }
          } catch {
            setPaymentError('Verification failed. Please contact support.');
          } finally {
            setIsLoading(false);
          }
        },
        modal: {
          ondismiss: () => { setIsLoading(false); }
        },
      });
      rzp.open();
    } catch (err: any) {
      setPaymentError(err?.message || 'Payment initialization failed. Please try again.');
      setIsLoading(false);
    }
  };

  const gst = Math.round(product.price * 0.18 * 100) / 100;
  const total = product.price;

  return (
    <div className="bg-zinc-50 min-h-screen font-sans">
      {/* Navbar */}
      <header className="h-16 border-b border-zinc-200 flex items-center justify-between px-6 md:px-10 bg-white sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white font-black text-sm">R</div>
          <span className="font-black text-lg tracking-tight uppercase">ResuMate <span className="text-zinc-400">AI</span></span>
        </div>
        <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full">
          <Lock size={12} /> Secure Checkout
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-10 py-10">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ── LEFT ─────────────────────────────────────── */}
          <div className="lg:w-[58%] space-y-10">

            {/* Product Selection */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-5">What do you need?</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PRODUCTS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => setSelectedProduct(p.id)}
                    className={`relative bg-white rounded-3xl border-2 p-5 text-left transition-all ${
                      selectedProduct === p.id
                        ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xl'
                        : 'border-zinc-100 hover:border-zinc-200'
                    }`}
                  >
                    {p.badge && (
                      <span className={`absolute -top-2.5 left-4 text-[8px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                        p.badge === 'Best Value' ? 'bg-amber-400 text-zinc-900' : 'bg-emerald-500 text-white'
                      }`}>{p.badge}</span>
                    )}

                    <div className="text-2xl mb-3">{p.icon}</div>
                    <h3 className="font-black text-zinc-900 text-sm mb-0.5">{p.title}</h3>
                    <p className="text-[11px] text-zinc-400 font-medium mb-3">{p.subtitle}</p>

                    <div className="flex items-baseline gap-1 mb-3">
                      <span className="text-2xl font-black text-zinc-900">₹{p.price}</span>
                      {p.originalPrice && (
                        <span className="text-xs text-zinc-300 line-through font-bold">₹{p.originalPrice}</span>
                      )}
                    </div>

                    <div className="space-y-1.5 mb-4">
                      {p.features.map(f => (
                        <div key={f} className="flex items-center gap-1.5 text-[10px] text-zinc-500 font-semibold">
                          <Check size={10} className="text-green-500 shrink-0" strokeWidth={3} /> {f}
                        </div>
                      ))}
                    </div>

                    <div className={`w-full py-1.5 rounded-xl text-center text-[10px] font-black uppercase tracking-widest transition-colors ${
                      selectedProduct === p.id ? 'bg-indigo-600 text-white' : 'bg-zinc-50 text-zinc-400'
                    }`}>
                      {selectedProduct === p.id ? '✓ Selected' : 'Select'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* User Info */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-5">Delivery Details</h2>
              <div className="bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Full Name</label>
                    <input
                      name="name" value={userInfo.name} onChange={handleInput}
                      placeholder="Rahul Sharma"
                      className={`w-full bg-zinc-50 border rounded-2xl px-4 py-3 text-sm font-semibold outline-none transition-colors ${errors.name ? 'border-red-400 bg-red-50' : 'border-zinc-200 focus:border-indigo-500'}`}
                    />
                    {errors.name && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Phone Number</label>
                    <input
                      name="phone" value={userInfo.phone} onChange={handleInput}
                      placeholder="+91 98765 43210"
                      className={`w-full bg-zinc-50 border rounded-2xl px-4 py-3 text-sm font-semibold outline-none transition-colors ${errors.phone ? 'border-red-400 bg-red-50' : 'border-zinc-200 focus:border-indigo-500'}`}
                    />
                    {errors.phone && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase">{errors.phone}</p>}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest block mb-2">Email Address</label>
                  <input
                    name="email" value={userInfo.email} onChange={handleInput}
                    placeholder="rahul@gmail.com" type="email"
                    className={`w-full bg-zinc-50 border rounded-2xl px-4 py-3 text-sm font-semibold outline-none transition-colors ${errors.email ? 'border-red-400 bg-red-50' : 'border-zinc-200 focus:border-indigo-500'}`}
                  />
                  {errors.email && <p className="text-[9px] text-red-500 font-bold mt-1 uppercase">{errors.email}</p>}
                  <p className="text-[10px] text-zinc-400 font-semibold mt-1.5">Files will be sent to this email after payment.</p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-5">Payment Method</h2>
              <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
                <div className="flex border-b border-zinc-50">
                  {[
                    { id: 'upi', icon: <Smartphone size={14} />, label: 'UPI' },
                    { id: 'card', icon: <CreditCard size={14} />, label: 'Card' },
                    { id: 'net', icon: <Building2 size={14} />, label: 'Net Banking' },
                    { id: 'wallet', icon: <Wallet size={14} />, label: 'Wallet' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setPaymentMethod(tab.id)}
                      className={`flex-grow flex items-center justify-center gap-1.5 py-4 text-[10px] font-black uppercase tracking-widest transition-all border-t-2 ${
                        paymentMethod === tab.id
                          ? 'bg-white text-indigo-600 border-indigo-600'
                          : 'bg-zinc-50 text-zinc-400 border-transparent hover:text-zinc-600'
                      }`}
                    >
                      {tab.icon} {tab.label}
                    </button>
                  ))}
                </div>

                <div className="p-6">
                  {paymentMethod === 'upi' && (
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-zinc-500">Enter UPI ID or pay via app</p>
                      <div className="flex gap-2">
                        <input
                          type="text" placeholder="name@upi"
                          className="flex-grow bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3 text-sm font-semibold outline-none focus:border-indigo-500 transition-colors"
                        />
                        <button className="bg-indigo-600 text-white px-5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-700 transition-all">Verify</button>
                      </div>
                      <div className="flex gap-3 pt-1">
                        {['GPay', 'PhonePe', 'Paytm', 'BHIM'].map(app => (
                          <div key={app} className="flex flex-col items-center gap-1 bg-zinc-50 border border-zinc-100 rounded-xl px-3 py-2 w-16 text-center">
                            <div className="w-7 h-7 bg-zinc-200 rounded-full" />
                            <span className="text-[9px] font-black text-zinc-400">{app}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {paymentMethod !== 'upi' && (
                    <div className="text-center py-6">
                      <p className="text-sm font-bold text-zinc-400">Razorpay will open a secure payment window</p>
                      <p className="text-xs text-zinc-300 mt-1">Supports all {paymentMethod === 'card' ? 'Visa/Mastercard/Amex cards' : paymentMethod === 'net' ? '50+ banks' : 'major wallets'}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Payment Error */}
            {paymentError && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3"
              >
                <X size={16} className="text-red-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-red-700">Payment Failed</p>
                  <p className="text-xs text-red-500 mt-0.5">{paymentError}</p>
                </div>
                <button onClick={() => setPaymentError('')} className="ml-auto text-red-400 hover:text-red-600">
                  <X size={14} />
                </button>
              </motion.div>
            )}
          </div>

          {/* ── RIGHT: ORDER SUMMARY ─────────────────────── */}
          <div className="lg:w-[42%]">
            <div className="bg-white rounded-[32px] border border-zinc-100 shadow-2xl p-8 sticky top-24">
              <h2 className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 mb-6">Order Summary</h2>

              {/* Selected product card */}
              <div className="bg-gradient-to-br from-zinc-50 to-zinc-100 rounded-2xl p-5 mb-6 border border-zinc-200">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{product.icon}</span>
                  <div>
                    <h3 className="font-black text-zinc-900 text-sm">{product.title}</h3>
                    <p className="text-[10px] text-zinc-500 font-semibold">{product.subtitle}</p>
                  </div>
                </div>
                <div className="space-y-1.5">
                  {product.features.map(f => (
                    <div key={f} className="flex items-center gap-2 text-[10px] text-zinc-600 font-semibold">
                      <Check size={10} className="text-green-500 shrink-0" strokeWidth={3} /> {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Price breakdown */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs font-semibold text-zinc-500">
                  <span>{product.title}</span>
                  <span>₹{product.price}</span>
                </div>
                {product.originalPrice && (
                  <div className="flex justify-between text-xs font-bold text-green-600">
                    <span>Bundle Discount</span>
                    <span>-₹{product.originalPrice - product.price}</span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-semibold text-zinc-400">
                  <span>GST (18%) — included</span>
                  <span>₹{gst}</span>
                </div>
                <div className="h-px bg-zinc-100 my-2" />
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-black text-zinc-400 uppercase tracking-widest">Total</span>
                  <span className="text-3xl font-black text-zinc-900 tracking-tight">₹{total}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                {[
                  { icon: <Shield size={12} />, label: 'SSL Secure' },
                  { icon: <Star size={12} />, label: '4.9★ Rating' },
                  { icon: <RefreshCw size={12} />, label: '7-day Refund' },
                ].map(b => (
                  <div key={b.label} className="bg-zinc-50 rounded-xl p-2 flex flex-col items-center gap-1 text-zinc-400">
                    {b.icon}
                    <span className="text-[8px] font-black uppercase tracking-wide text-center">{b.label}</span>
                  </div>
                ))}
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest text-white transition-all shadow-xl flex items-center justify-center gap-3 group ${
                  isLoading ? 'bg-zinc-400 cursor-not-allowed' : 'bg-zinc-900 hover:bg-black'
                }`}
              >
                {isLoading ? (
                  <><RefreshCw size={18} className="animate-spin" /> Processing...</>
                ) : (
                  <>Pay ₹{total} Securely <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
                )}
              </button>

              <p className="text-center text-[10px] font-bold text-zinc-400 mt-4 uppercase tracking-wider">
                Powered by <span className="text-zinc-600">Razorpay</span> • 256-bit SSL
              </p>

              {/* Delivery note */}
              <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-start gap-2">
                <Mail size={14} className="text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] font-semibold text-blue-600 leading-relaxed">
                  Your {selectedProduct === 'bundle' ? 'resume and cover letter' : selectedProduct === 'cover_letter' ? 'cover letter' : 'resume'} will be emailed to <strong>{userInfo.email || 'your email'}</strong> immediately after payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
