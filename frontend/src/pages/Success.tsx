import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
    Check, 
    Download, 
    Mail, 
    Share2, 
    ArrowRight, 
    Clock, 
    ExternalLink,
    BarChart3
} from 'lucide-react';
import { sendResumeEmail } from '../lib/emailService';

export const Success = () => {
    const navigate = useNavigate();
    const [emailSent, setEmailSent] = useState(false);
    const [sendingEmail, setSendingEmail] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);

    useEffect(() => {
        const paymentStr = localStorage.getItem('payment');
        if (!paymentStr) return;

        const paymentData = JSON.parse(paymentStr);
        setPaymentData(paymentData);

        const sendEmail = async () => {
            setSendingEmail(true);
            try {
                await sendResumeEmail({
                    toEmail: paymentData.email || '',
                    toName: paymentData.name || 'Valued User',
                    paymentId: paymentData.paymentId || 'N/A',
                    amount: paymentData.amount 
                        ? `₹${paymentData.amount}` 
                        : '₹199'
                });
                setEmailSent(true);
            } catch (err) {
                console.error('Email failed:', err);
                setEmailSent(false);
            } finally {
                setSendingEmail(false);
            }
        };

        sendEmail();
    }, []);

    const payment = JSON.parse(localStorage.getItem('payment') || '{}');
    const { email, name, paymentId, amount } = payment;

    const date = new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

    return (
        <div className="bg-zinc-50 min-h-screen flex flex-col font-sans">
             {/* Simple Navbar */}
             <header className="h-16 border-b border-zinc-100 flex items-center justify-between px-10 bg-white">
                <LinkIcon />
                <div className="flex items-center gap-4">
                    <StepIcon completed />
                    <StepIcon completed />
                    <StepIcon completed />
                    <StepIcon completed />
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-center p-6 py-12">
                <div className="max-w-4xl w-full space-y-12">
                    {/* Success Animation Area */}
                    <div className="text-center space-y-6">
                        <motion.div 
                            initial={{ scale: 0, rotate: -45 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 100 }}
                            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-green-200 relative"
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                <Check size={48} className="text-white" strokeWidth={4} />
                            </motion.div>
                            
                            {/* Pulse effect */}
                            <motion.div 
                                initial={{ scale: 1, opacity: 0.5 }}
                                animate={{ scale: 1.5, opacity: 0 }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="absolute inset-0 bg-green-500 rounded-full"
                            />
                        </motion.div>

                        <div className="space-y-2 relative">
                           {/* Confetti Animation Elements */}
                           <div className="absolute inset-0 overflow-hidden pointer-events-none">
                             {[...Array(20)].map((_, i) => (
                               <motion.div
                                 key={i}
                                 initial={{ y: -20, x: Math.random() * 400 - 200, rotate: 0 }}
                                 animate={{ y: 400, rotate: 360 }}
                                 transition={{ duration: 2, repeat: Infinity, delay: Math.random() * 2 }}
                                 className="absolute w-2 h-2 rounded-full"
                                 style={{ backgroundColor: ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'][i % 4] }}
                               />
                             ))}
                           </div>
                           <h1 className="text-4xl font-black text-zinc-900 tracking-tighter">Payment Successful! 🎉</h1>
                           <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">Confirmation sent to: {email}</p>
                           
                           <div style={{
                               backgroundColor: emailSent ? '#f0fdf4' : '#fef9c3',
                               border: `1px solid ${emailSent ? '#86efac' : '#fde047'}`,
                               borderRadius: '10px',
                               padding: '12px 16px',
                               marginTop: '16px',
                               display: 'flex',
                               alignItems: 'center',
                               gap: '8px',
                               justifyContent: 'center',
                               maxWidth: '400px',
                               margin: '16px auto 0'
                           }}>
                               <span style={{fontSize: '20px'}}>
                                   {sendingEmail ? '📤' : emailSent ? '✅' : '❌'}
                               </span>
                               <div style={{textAlign: 'left'}}>
                                   <p style={{margin: 0, fontWeight: 600, fontSize: '14px', color: '#111827'}}>
                                       {sendingEmail ? 'Sending email...' : 
                                        emailSent ? 'Email sent successfully!' : 
                                        'Email delivery failed'}
                                   </p>
                                   <p style={{margin: 0, fontSize: '12px', color: '#6b7280'}}>
                                       {paymentData?.email}
                                   </p>
                               </div>
                           </div>
                        </div>
                    </div>

                    {/* Order Details Card */}
                    <div className="bg-white border border-zinc-100 rounded-[40px] shadow-xl overflow-hidden">
                        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-zinc-50">
                            <Detail label="Payment ID" value={paymentId} />
                            <Detail label="Amount Paid" value={`₹${amount}`} />
                            <Detail label="Confirmation sent to" value={email} />
                            <Detail label="Date" value={date} />
                        </div>
                        <div className="bg-zinc-50 p-4 text-center border-t border-zinc-100">
                           <button className="flex items-center gap-2 mx-auto text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline">
                             <ExternalLink size={12} /> Download Invoice
                           </button>
                        </div>
                    </div>

                    {/* Action Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <ActionCard 
                            icon={<Download className="text-white" size={24} />}
                            title="Download Your Resume"
                            subtitle="Proceed to final download area"
                            color="bg-zinc-900"
                            onClick={() => navigate('/download')}
                        />
                        <ActionCard 
                            icon={<Mail className="text-white" size={24} />}
                            title="Email Sent"
                            subtitle="Receipt sent to your email"
                            color="bg-indigo-600"
                        />
                        <ActionCard 
                            icon={<Share2 className="text-white" size={24} />}
                            title="Share Resume"
                            subtitle="Generates public view link"
                            color="bg-green-600"
                        />
                    </div>
                </div>
            </main>
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

const Detail = ({ label, value }: { label: string, value: string }) => (
    <div className="p-8 text-center space-y-1">
        <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black text-zinc-900 tracking-tight">{value}</p>
    </div>
);

const ActionCard = ({ icon, title, subtitle, color, onClick }: { icon: React.ReactNode, title: string, subtitle: string, color: string, onClick?: () => void }) => (
    <button 
        onClick={onClick}
        className="bg-white border border-zinc-100 p-8 rounded-[40px] text-center space-y-4 hover:shadow-2xl hover:scale-[1.02] transition-all group"
    >
        <div className={`w-14 h-14 ${color} rounded-full flex items-center justify-center mx-auto shadow-xl group-hover:rotate-12 transition-transform`}>
            {icon}
        </div>
        <div className="space-y-1">
            <h3 className="text-sm font-black text-zinc-900 uppercase tracking-widest">{title}</h3>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{subtitle}</p>
        </div>
        <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight size={16} className="mx-auto text-zinc-300" />
        </div>
    </button>
);

const StepIcon = ({ completed }: { completed?: boolean }) => (
    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${completed ? 'bg-green-500 text-white' : 'bg-zinc-100 text-zinc-300'}`}>
        <Check size={10} strokeWidth={4} />
    </div>
);
