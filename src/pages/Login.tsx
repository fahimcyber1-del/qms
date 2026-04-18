import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck, Eye, EyeOff, LogIn, Lock, User as UserIcon,
  Globe, Award, Activity, AlertCircle, BarChart3,
  ClipboardList, FileText, Zap, CheckCircle2, ChevronRight,
  Layers
} from 'lucide-react';

const DEMO_CREDS = { username: 'admin', password: 'qms2026' };

export interface UserProfile {
  name: string;
  role: string;
  email: string;
  department: string;
  initials: string;
}

const DEFAULT_USER: UserProfile = {
  name: 'System Admin',
  role: 'Quality Manager',
  email: 'admin@qmserp.com',
  department: 'Quality Assurance',
  initials: 'SA',
};

interface LoginProps {
  onLogin: (user: UserProfile) => void;
}

const features = [
  { icon: ShieldCheck, title: 'ISO 9001:2015', text: 'Fully Compliant Architecture' },
  { icon: BarChart3,   title: 'Real-Time KPIs', text: 'Advanced Analytics Dashboard' },
  { icon: ClipboardList, title: 'Audit & CAPA', text: 'Comprehensive Tracking System' },
  { icon: FileText,    title: 'Document Control', text: 'Automated SOP Management' },
  { icon: Activity,    title: 'Production Quality', text: 'Defect & Inspection Tracking' },
  { icon: Layers,      title: 'Integrated Modules', text: '32+ Seamless ERP Modules' },
];

// Grid pattern component
const IndustrialPattern = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
    <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="industrial-grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#0f172a" strokeWidth="1.5"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#industrial-grid)" />
    </svg>
  </div>
);

// Rotating mechanical elements
const TechCircle = ({ size, top, left, delay = 0, duration, reverse = false }: any) => (
  <motion.div
    initial={{ rotate: 0 }}
    animate={{ rotate: reverse ? -360 : 360 }}
    transition={{ duration: duration, repeat: Infinity, ease: "linear", delay }}
    className="absolute pointer-events-none opacity-[0.04]"
    style={{
      width: size,
      height: size,
      top, left,
      border: '2px dashed #0f172a',
      borderRadius: '50%'
    }}
  />
);

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<'username' | 'password' | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password.');
      return;
    }
    setLoading(true);
    setError('');
    // Simulate async auth
    await new Promise(r => setTimeout(r, 1200));

    if (username === DEMO_CREDS.username && password === DEMO_CREDS.password) {
      const savedProfile = localStorage.getItem('qms_user_profile');
      const user: UserProfile = savedProfile ? JSON.parse(savedProfile) : DEFAULT_USER;
      localStorage.setItem('qms_auth', 'true');
      onLogin(user);
    } else {
      setError('Invalid credentials. Use: admin / qms2026');
    }
    setLoading(false);
  };

  const fillDemo = () => {
    setUsername('admin');
    setPassword('qms2026');
    setError('');
  };

  return (
    <div className="min-h-screen flex overflow-hidden bg-white" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── Left Panel — Branding & Info ── */}
      <div className="hidden lg:flex flex-col w-[55%] relative z-10 p-12 xl:p-20 justify-between bg-white border-r border-slate-200">
        <IndustrialPattern />
        
        {/* Logo Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex items-center gap-4 relative z-10"
        >
          <div className="relative w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center border border-slate-800 shadow-xl overflow-hidden">
             {/* Industrial shine */}
             <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0" />
             <ShieldCheck className="w-7 h-7 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-slate-900 font-black text-3xl tracking-tight leading-tight uppercase">QMS ERP</h1>
            <span className="text-slate-500 text-[11px] font-bold tracking-widest uppercase flex items-center gap-2">
              Enterprise Pro <span className="w-4 h-px bg-slate-300"></span>
            </span>
          </div>
        </motion.div>

        {/* Hero Text */}
        <div className="mt-20 mb-16 relative z-10">
          <motion.h2 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl xl:text-[4rem] font-black text-slate-900 leading-[1.05] mb-6 tracking-tight"
          >
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-slate-900 to-slate-500">
              Quality Standards
            </span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-slate-500 text-lg max-w-lg leading-relaxed font-medium"
          >
            A next-generation enterprise platform engineered for seamless ISO compliance, defect elimination, and multi-tier operational excellence.
          </motion.p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-auto pr-10 relative z-10">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1, duration: 0.5 }}
              className="group p-5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-white hover:shadow-lg transition-all duration-300 relative overflow-hidden"
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:border-slate-300 transition-all duration-300">
                <feature.icon className="w-5 h-5 text-slate-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">{feature.title}</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{feature.text}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom Badge */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-12 flex items-center gap-3 relative z-10"
        >
          <div className="flex -space-x-2">
             {[Award, CheckCircle2, Globe].map((Icon, i) => (
               <div key={i} className="w-8 h-8 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center z-10">
                 <Icon className="w-3.5 h-3.5 text-slate-600" />
               </div>
             ))}
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">Trusted by 500+ Manufacturers</span>
        </motion.div>
      </div>

      {/* ── Right Panel — Login Form ── */}
      <div className="w-full lg:w-[45%] flex items-center justify-center p-6 sm:p-12 relative bg-[#F4F5F7] z-0 overflow-hidden">
        
        {/* Geometric moving shapes in background of right side */}
        <TechCircle size="40vw" top="-10%" left="80%" duration={40} />
        <TechCircle size="25vw" top="70%" left="-10%" duration={35} reverse />
        <TechCircle size="15vw" top="20%" left="10%" duration={20} />

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.3 }}
          className="w-full max-w-[420px] relative z-10"
        >
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200/80 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] relative overflow-hidden">
            {/* Top decorative bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-slate-900" />
            
            {/* Mobile Logo */}
            <div className="flex items-center gap-3 mb-10 lg:hidden">
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-md">
                 <ShieldCheck className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-slate-900 font-black text-xl uppercase tracking-tight">QMS ERP</h1>
                <span className="text-slate-500 text-[10px] font-bold uppercase tracking-wider">Enterprise Pro</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <motion.h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">System Login</motion.h2>
              <p className="text-slate-500 text-sm font-medium">Verify your identity to access the portal</p>
            </div>

            {/* Demo Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="mb-8 p-4 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer overflow-hidden relative group transition-colors hover:border-slate-300 hover:bg-slate-100"
              onClick={fillDemo}
            >
              <div className="flex items-center justify-between mb-2 relative z-10">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-slate-700" />
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Quick Demo Access</span>
                </div>
                <span className="text-[9px] px-2 py-0.5 bg-slate-200 text-slate-700 rounded-sm font-black tracking-wider uppercase">Auto-Fill</span>
              </div>
              <div className="flex gap-4 text-xs font-mono bg-white border border-slate-200 p-2.5 rounded-lg relative z-10">
                <span className="text-slate-500">User: <strong className="text-slate-900">admin</strong></span>
                <span className="text-slate-500">Pass: <strong className="text-slate-900">qms2026</strong></span>
              </div>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              
              {/* Username Input */}
              <div className="space-y-1.5 relative group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1 group-focus-within:text-slate-900 transition-colors">Username ID</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <UserIcon className={`w-5 h-5 transition-colors ${focusedInput === 'username' ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={e => { setUsername(e.target.value); setError(''); }}
                    onFocus={() => setFocusedInput('username')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="Enter admin ID"
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 font-semibold outline-none focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 relative group">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500 ml-1 group-focus-within:text-slate-900 transition-colors">Security Key</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Lock className={`w-5 h-5 transition-colors ${focusedInput === 'password' ? 'text-slate-900' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type={showPw ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(''); }}
                    onFocus={() => setFocusedInput('password')}
                    onBlur={() => setFocusedInput(null)}
                    placeholder="••••••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 font-semibold outline-none focus:border-slate-900 focus:bg-white focus:ring-4 focus:ring-slate-900/5 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Error MSG */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex items-center gap-2 p-3 mt-2 rounded-lg bg-red-50 border border-red-100 text-red-600 text-[13px] font-bold">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      {error}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full mt-8 relative group overflow-hidden rounded-xl font-bold text-[15px] py-4 flex items-center justify-center gap-2 text-white bg-slate-900 disabled:opacity-80 transition-all shadow-[0_8px_20px_-6px_rgba(15,23,42,0.4)]"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-700 ease-in-out" />
                
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    Secure Login
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                  </>
                )}
              </motion.button>
            </form>
            
            {/* Footer context */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-2">
              <div className="flex items-center gap-1.5 text-slate-400 text-[11px] font-bold tracking-wide uppercase">
                <Lock className="w-3.5 h-3.5" /> End-to-end Encrypted
              </div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase mt-1">Powered by QMS Enterprise v3.4.1</div>
            </div>

          </div>
        </motion.div>
      </div>

    </div>
  );
}

