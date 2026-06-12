import React from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Landing } from './pages/Landing';
import { JDUpload } from './pages/JDUpload';
import { LinkedInLogin } from './pages/LinkedInLogin';
import { LinkedInImport } from './pages/LinkedInImport';
import { LinkedInEnhance } from './pages/LinkedInEnhance';
import { TemplateSelection } from './pages/TemplateSelection';
import { ResumeEditor } from './pages/ResumeEditor';
import { Enhance } from './pages/Enhance';
import { Review } from './pages/Review';
import { Payment } from './pages/Payment';
import { Success } from './pages/Success';
import { Download } from './pages/Download';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import AuthCallback from './pages/AuthCallback';
import ResetPassword from './pages/ResetPassword';
import Terms from './pages/Terms';
import CoverLetter from './pages/CoverLetter';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import { Navbar } from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

function App() {
  const location = useLocation();
  const isAdmin  = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar />}
      <main className={isAdmin ? '' : 'flex-grow'}>
        <AnimatePresence mode="wait">
          <motion.div key={location.pathname}>
            <Routes location={location}>
              <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
              <Route path="/jd" element={<ProtectedRoute><PageTransition><JDUpload /></PageTransition></ProtectedRoute>} />
              <Route path="/linkedin" element={<ProtectedRoute><PageTransition><LinkedInLogin /></PageTransition></ProtectedRoute>} />
              <Route path="/linkedin-import" element={<ProtectedRoute><PageTransition><LinkedInImport /></PageTransition></ProtectedRoute>} />
              <Route path="/linkedin-enhance" element={<ProtectedRoute><PageTransition><LinkedInEnhance /></PageTransition></ProtectedRoute>} />
              <Route path="/templates" element={<ProtectedRoute><PageTransition><TemplateSelection /></PageTransition></ProtectedRoute>} />
              <Route path="/builder" element={<ProtectedRoute><PageTransition><ResumeEditor /></PageTransition></ProtectedRoute>} />
              <Route path="/enhance" element={<ProtectedRoute><PageTransition><Enhance /></PageTransition></ProtectedRoute>} />
              <Route path="/review" element={<ProtectedRoute><PageTransition><Review /></PageTransition></ProtectedRoute>} />
              <Route path="/payment" element={<ProtectedRoute><PageTransition><Payment /></PageTransition></ProtectedRoute>} />
              <Route path="/success" element={<ProtectedRoute><PageTransition><Success /></PageTransition></ProtectedRoute>} />
              <Route path="/download" element={<ProtectedRoute><PageTransition><Download /></PageTransition></ProtectedRoute>} />
              <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
              <Route path="/signup" element={<PageTransition><Signup /></PageTransition>} />
              <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
              <Route path="/auth/callback" element={<PageTransition><AuthCallback /></PageTransition>} />
              <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
              <Route path="/terms" element={<PageTransition><Terms /></PageTransition>} />
              <Route path="/cover-letter" element={<ProtectedRoute><PageTransition><CoverLetter /></PageTransition></ProtectedRoute>} />
              <Route path="/pricing" element={<Navigate to="/" replace state={{ scrollTo: 'pricing' }} />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    transition={{ duration: 0.3, ease: 'easeOut' }}
  >
    {children}
  </motion.div>
);

export default App;
