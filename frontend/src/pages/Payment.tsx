import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { paymentAPI } from '../lib/api';
import { motion } from 'motion/react';
import { 
    Lock, 
    CreditCard, 
    Smartphone, 
    Building2, 
    Wallet,
    Check,
    BarChart3,
    Shield,
    Star,
    RefreshCw,
    Download,
    ArrowRight
} from 'lucide-react';

export const Payment = () => {
    const navigate = useNavigate();
    const [selectedPlan, setSelectedPlan] = useState('pro');
    const [paymentMethod, setPaymentMethod] = useState('upi');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    
    // User info state
    const [userInfo, setUserInfo] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        if (!userInfo.name) newErrors.name = 'Full Name is required';
        if (!userInfo.email) newErrors.email = 'Email Address is required';
        else if (!/\S+@\S+\.\S+/.test(userInfo.email)) newErrors.email = 'Email is invalid';
        if (!userInfo.phone) newErrors.phone = 'Phone Number is required';
        else if (!/^\d{10}$/.test(userInfo.phone.replace(/\s/g, '').replace('+91', ''))) newErrors.phone = 'Phone Number must be 10 digits';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePayment = async () => {
        if (!validate()) return;

        setIsLoading(true);

        const amount = plans.find(p => p.id === selectedPlan)?.price || 199;
        
        try {
            const order = await paymentAPI.createOrder(amount, selectedPlan);
            
            if (!order.success) {
                alert('Order creation failed');
                setIsLoading(false);
                return;
            }

            const rzp = new (window as any).Razorpay({
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                order_id: order.orderId,
                name: 'ResuMate AI',
                prefill: { 
                    name: userInfo.name, 
                    email: userInfo.email, 
                    contact: userInfo.phone 
                },
                theme: { color: '#4F46E5' },
                handler: async (response: any) => {
                    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
                    
                    try {
                        const verified = await paymentAPI.verifyPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            userId: userData.id,
                            resumeId: localStorage.getItem('resumeId'),
                            amount: amount,
                            plan: selectedPlan,
                            name: userInfo.name,
                            email: userInfo.email,
                            phone: userInfo.phone
                        });

                        if (verified.success) {
                            localStorage.setItem('payment', JSON.stringify({
                                paymentId: response.razorpay_payment_id,
                                name: userInfo.name,
                                email: userInfo.email,
                                phone: userInfo.phone,
                                amount: amount
                            }));
                            navigate('/success');
                        } else {
                            alert('Payment verification failed');
                        }
                    } catch (err) {
                        alert('Payment verification failed');
                    } finally {
                        setIsLoading(false);
                    }
                },
                modal: {
                    ondismiss: () => {
                        setIsLoading(false);
                    }
                }
            });
            rzp.open();
        } catch (error) {
            console.error('Payment failed:', error);
            setIsLoading(false);
            alert('Payment initialization failed.');
        }
    };

    const plans = [
        { id: 'basic', name: 'Basic', price: 199, resumes: 'One Resume', features: ['1 PDF download', '1 DOCX download', 'AI optimized'] },
        { id: 'pro', name: 'Pro', price: 499, resumes: '3 Resumes', features: ['3 Resume downloads', 'Cover letter', 'Priority AI', 'All templates'], popular: true },
        { id: 'lifetime', name: 'Lifetime', price: 2999, originalPrice: 4999, resumes: 'Unlimited', features: ['Unlimited resumes', 'Lifetime access', 'All features'], bestValue: true }
    ];

    const upiApps = [
        { name: 'GPay', icon: 'https://www.vectorlogo.zone/logos/google_pay/google_pay-icon.svg' },
        { name: 'PhonePe', icon: 'https://www.vectorlogo.zone/logos/phonepe/phonepe-icon.svg' },
        { name: 'Paytm', icon: 'https://www.vectorlogo.zone/logos/paytm/paytm-icon.svg' },
        { name: 'BHIM', icon: 'https://www.vectorlogo.zone/logos/bhimupi/bhimupi-icon.svg' }
    ];

    return (
        <div className="bg-zinc-50 min-h-screen font-sans">
            {/* Top Navbar */}
            <header className="h-16 border-b border-zinc-200 flex items-center justify-between px-10 bg-white sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <LinkIcon />
                    <div className="flex items-center gap-4">
                        <Step number={1} label="Build" completed />
                        <Step number={2} label="AI Enhance" completed />
                        <Step number={3} label="Review" completed />
                        <Step number={4} label="Download" active />
                    </div>
                </div>
                <div className="flex items-center gap-2 text-green-600 font-bold text-[10px] uppercase tracking-widest bg-green-50 px-3 py-1.5 rounded-full">
                    <Lock size={12} />
                    Secure Checkout
                </div>
            </header>

            <div className="max-w-7xl mx-auto px-10 py-12">
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* LEFT: FORM */}
                    <div className="lg:w-[55%] space-y-12">
                        {/* Plan Selection */}
                        <div className="space-y-6">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Select Plan</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {plans.map(plan => (
                                    <button 
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`relative bg-white p-6 rounded-3xl border-2 transition-all text-left flex flex-col h-full ${
                                            selectedPlan === plan.id ? 'border-indigo-600 ring-4 ring-indigo-50 shadow-xl' : 'border-zinc-100 hover:border-zinc-200 scale-[0.98]'
                                        }`}
                                    >
                                        {plan.popular && (
                                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Most Popular</span>
                                        )}
                                        {plan.bestValue && (
                                            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-zinc-900 text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full">Best Value</span>
                                        )}
                                        
                                        <div className="mb-4">
                                            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-400 mb-1">{plan.resumes}</h3>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-2xl font-black text-zinc-900">₹{plan.price}</span>
                                                {plan.originalPrice && <span className="text-xs font-bold text-zinc-300 line-through">₹{plan.originalPrice}</span>}
                                            </div>
                                        </div>

                                        <div className="space-y-2 mb-6 flex-grow">
                                            {plan.features.map(f => (
                                                <div key={f} className="flex items-center gap-2 text-[10px] font-bold text-zinc-600">
                                                    <Check size={12} className="text-green-500" strokeWidth={3} /> {f}
                                                </div>
                                            ))}
                                        </div>

                                        <div className={`w-full py-2 rounded-xl text-center text-[10px] font-black uppercase tracking-widest transition-colors ${
                                            selectedPlan === plan.id ? 'bg-indigo-600 text-white' : 'bg-zinc-50 text-zinc-400'
                                        }`}>
                                            {selectedPlan === plan.id ? 'Selected' : 'Select'}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* User Information */}
                        <div className="space-y-6">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Where should we send your resume?</h2>
                            <div className="bg-white p-8 rounded-3xl border border-indigo-100 shadow-xl shadow-indigo-50/50 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Full Name</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={userInfo.name}
                                            onChange={handleInputChange}
                                            placeholder="John Doe" 
                                            className={`w-full bg-zinc-50 border rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-colors ${errors.name ? 'border-red-500 bg-red-50' : 'border-zinc-200 focus:border-indigo-500'}`} 
                                            required
                                        />
                                        {errors.name && <p className="text-[9px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.name}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Phone Number</label>
                                        <input 
                                            type="tel" 
                                            name="phone"
                                            value={userInfo.phone}
                                            onChange={handleInputChange}
                                            placeholder="+91 98765 43210" 
                                            className={`w-full bg-zinc-50 border rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-colors ${errors.phone ? 'border-red-500 bg-red-50' : 'border-zinc-200 focus:border-indigo-500'}`} 
                                            required
                                        />
                                        {errors.phone && <p className="text-[9px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.phone}</p>}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Email Address</label>
                                    <input 
                                        type="email" 
                                        name="email"
                                        value={userInfo.email}
                                        onChange={handleInputChange}
                                        placeholder="john@example.com" 
                                        className={`w-full bg-zinc-50 border rounded-2xl px-6 py-4 text-sm font-bold outline-none transition-colors ${errors.email ? 'border-red-500 bg-red-50' : 'border-zinc-200 focus:border-indigo-500'}`} 
                                        required
                                    />
                                    {errors.email && <p className="text-[9px] font-bold text-red-500 mt-1 uppercase tracking-tight">{errors.email}</p>}
                                    <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tight">We'll send your PDF and Word files to this email instantly after payment.</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="space-y-6">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400">Payment Method</h2>
                            <div className="bg-white rounded-3xl border border-zinc-100 shadow-sm overflow-hidden">
                                <div className="flex border-b border-zinc-50">
                                    <PaymentTab active={paymentMethod === 'card'} icon={<CreditCard size={16} />} label="Card" onClick={() => setPaymentMethod('card')} />
                                    <PaymentTab active={paymentMethod === 'upi'} icon={<Smartphone size={16} />} label="UPI" onClick={() => setPaymentMethod('upi')} />
                                    <PaymentTab active={paymentMethod === 'net'} icon={<Building2 size={16} />} label="Net Banking" onClick={() => setPaymentMethod('net')} />
                                    <PaymentTab active={paymentMethod === 'wallet'} icon={<Wallet size={16} />} label="Wallet" onClick={() => setPaymentMethod('wallet')} />
                                </div>

                                <div className="p-8">
                                    {paymentMethod === 'upi' && (
                                        <div className="space-y-8">
                                            <div className="flex gap-3">
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter UPI ID (e.g. name@upi)" 
                                                    className="flex-grow bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500 transition-colors"
                                                />
                                                <button className="bg-indigo-600 text-white px-8 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-black transition-all">Verify</button>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Popular Apps</p>
                                                <div className="flex gap-4">
                                                    {upiApps.map(app => (
                                                        <button key={app.name} className="flex flex-col items-center gap-2 p-4 bg-zinc-50 border border-transparent hover:border-zinc-200 rounded-2xl transition-all w-24">
                                                            <img src={app.icon} alt={app.name} className="w-8 h-8" />
                                                            <span className="text-[10px] font-black text-zinc-500">{app.name}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {paymentMethod === 'card' && (
                                        <div className="space-y-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Card Number</label>
                                                <div className="relative">
                                                  <input type="text" placeholder="0000 0000 0000 0000" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500 transition-colors" />
                                                  <CreditCard className="absolute right-6 top-4 text-zinc-300" size={20} />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Expiry Date</label>
                                                    <input type="text" placeholder="MM / YY" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500 transition-colors" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">CVV</label>
                                                    <input type="password" placeholder="***" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500 transition-colors" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Name on Card</label>
                                                <input type="text" placeholder="Full Name" className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:border-indigo-500 transition-colors" />
                                            </div>
                                            <label className="flex items-center gap-3 cursor-pointer">
                                                <input type="checkbox" className="w-5 h-5 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500" />
                                                <span className="text-xs font-bold text-zinc-500">Save card for future payments</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Coupon */}
                        <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-zinc-100 shadow-sm">
                            <div className="space-y-1">
                                <p className="text-xs font-black text-zinc-900 uppercase tracking-widest">Have a coupon code?</p>
                                <button className="text-[10px] font-bold text-indigo-600 hover:underline">Click here to apply</button>
                            </div>
                            <div className="flex gap-2">
                                <input type="text" placeholder="CODE10" className="bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2 text-xs font-bold outline-none" />
                                <button className="bg-zinc-900 text-white px-6 rounded-xl text-[10px] font-black uppercase tracking-widest">Apply</button>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: ORDER SUMMARY */}
                    <div className="lg:w-[45%]">
                        <div className="bg-white rounded-[40px] border border-zinc-100 shadow-2xl p-10 sticky top-28">
                            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-zinc-400 mb-8">Order Summary</h2>
                            
                            <div className="flex gap-6 mb-8 bg-zinc-50 p-4 rounded-3xl border border-dotted border-zinc-200">
                                <div className="w-20 h-24 bg-white rounded-lg shadow-sm overflow-hidden relative grayscale opacity-40">
                                   <div className="absolute inset-0 flex items-center justify-center -rotate-45">
                                      <span className="text-[6px] font-black uppercase tracking-widest text-zinc-300">PREVIEW</span>
                                   </div>
                                </div>
                                <div className="flex flex-col justify-center">
                                    <p className="text-xs font-black text-zinc-400 uppercase tracking-widest">Plan</p>
                                    <h3 className="text-lg font-black text-zinc-900 uppercase tracking-tighter">Basic - One Resume</h3>
                                    <div className="flex items-center gap-2 mt-2">
                                       <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                                          <Check size={10} className="text-green-600" strokeWidth={4} />
                                       </div>
                                       <span className="text-[10px] font-bold text-zinc-500">AI Enhanced Resume</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-xs font-bold text-zinc-500">
                                    <span>Resume Builder</span>
                                    <span>₹199.00</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-green-600">
                                    <span>AI Enhancement</span>
                                    <span className="uppercase tracking-widest">Included ✓</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-zinc-500">
                                    <span>GST (18%)</span>
                                    <span>₹35.82</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-zinc-500">
                                    <span>Discount</span>
                                    <span>-₹0.00</span>
                                </div>
                                <div className="h-[1px] bg-zinc-100 my-4" />
                                <div className="flex justify-between items-baseline">
                                    <span className="text-sm font-black text-zinc-400 uppercase tracking-[0.2em]">Total</span>
                                    <span className="text-4xl font-black text-zinc-900 leading-none tracking-tighter">₹234.82</span>
                                </div>
                            </div>

                            <div className="space-y-3 mb-10">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-300 mb-4">What's included:</h4>
                                <SummaryItem label="PDF download (ATS-friendly)" />
                                <SummaryItem label="DOCX download (editable)" />
                                <SummaryItem label="Watermark removed" />
                                <SummaryItem label="Lifetime access to this resume" />
                                <SummaryItem label="Email delivery" />
                            </div>

                            <div className="grid grid-cols-3 gap-2 mb-10">
                                <Badge icon={<Shield size={12} />} label="SSL Secure" />
                                <Badge icon={<Star size={12} />} label="4.9/5 Rating" />
                                <Badge icon={<RefreshCw size={12} />} label="7-day refund" />
                            </div>

                            <button 
                                onClick={handlePayment}
                                disabled={isLoading}
                                className={`w-full bg-zinc-900 text-white py-6 rounded-[30px] font-black text-xs uppercase tracking-[0.2em] hover:bg-black transition-all shadow-2xl flex items-center justify-center gap-4 group ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? (
                                    <>
                                        <RefreshCw size={20} className="animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay ₹{plans.find(p => p.id === selectedPlan)?.price || 234.82} Securely
                                        <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                                    </>
                                )}
                            </button>
                            <p className="text-center text-[10px] font-bold text-zinc-400 mt-6 uppercase tracking-wider">
                                Powered by <span className="text-zinc-600">Razorpay</span> • 256-bit encryption
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const LinkIcon = () => (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-zinc-900 rounded-lg flex items-center justify-center text-white">
        <BarChart3 size={18} />
      </div>
      <span className="font-display font-black text-lg tracking-tighter uppercase">ResuMate<span className="text-zinc-400">AI</span></span>
    </div>
);

const Step = ({ number, label, active, completed }: { number: number, label: string, active?: boolean, completed?: boolean }) => (
    <div className="flex items-center gap-2">
        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black transition-colors ${
            completed ? 'bg-green-500 text-white' : active ? 'bg-indigo-600 text-white' : 'bg-zinc-100 text-zinc-400'
        }`}>
            {completed ? <Check size={12} strokeWidth={4} /> : number}
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest ${
            active ? 'text-black' : 'text-zinc-400'
        }`}>
            {label}
        </span>
    </div>
);

const PaymentTab = ({ active, icon, label, onClick }: { active: boolean, icon: React.ReactNode, label: string, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`flex-grow flex items-center justify-center gap-2 py-5 font-black text-[10px] uppercase tracking-widest transition-all ${
            active ? 'bg-white text-indigo-600 border-t-2 border-indigo-600 ring-1 ring-zinc-50' : 'bg-zinc-50 text-zinc-400 border-t-2 border-transparent'
        }`}
    >
        {icon}
        {label}
    </button>
);

const SummaryItem = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3">
        <div className="w-4 h-4 bg-green-500 text-white flex items-center justify-center rounded-full shrink-0">
            <Check size={10} strokeWidth={4} />
        </div>
        <span className="text-[11px] font-bold text-zinc-600 uppercase tracking-wide">{label}</span>
    </div>
);

const Badge = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
    <div className="bg-zinc-50 rounded-2xl p-3 flex flex-col items-center justify-center gap-1">
        <div className="text-zinc-400">
           {icon}
        </div>
        <span className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.1em] text-center">{label}</span>
    </div>
);
