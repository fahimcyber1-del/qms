import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from 'motion/react';
import {
  ShieldCheck, Eye, EyeOff, LogIn, Lock, User as UserIcon,
  Globe, Award, Activity, AlertCircle, BarChart3,
  ClipboardList, FileText, Zap, CheckCircle2, Layers, ArrowRight
} from 'lucide-react';

/* ─────────────────────── types & constants ───────────────────── */

const DEMO_CREDS = { username: 'admin', password: 'qms2026' };

export interface UserProfile {
  name: string; role: string; email: string;
  department: string; initials: string;
}
const DEFAULT_USER: UserProfile = {
  name: 'System Admin', role: 'Quality Manager',
  email: 'admin@qmserp.com', department: 'Quality Assurance', initials: 'SA',
};
interface LoginProps { onLogin: (user: UserProfile) => void; }

const features = [
  { icon: ShieldCheck,   title: 'ISO 9001:2015',      text: 'Fully Compliant',        color: '#3b82f6' },
  { icon: BarChart3,     title: 'Real-Time KPIs',     text: 'Analytics Dashboard',    color: '#8b5cf6' },
  { icon: ClipboardList, title: 'Audit & CAPA',       text: 'Comprehensive Tracking', color: '#06b6d4' },
  { icon: FileText,      title: 'Document Control',   text: 'Automated SOP Mgmt',     color: '#10b981' },
  { icon: Activity,      title: 'Production Quality', text: 'Defect Tracking',        color: '#f59e0b' },
  { icon: Layers,        title: '32+ Modules',        text: 'Seamless ERP Suite',     color: '#ec4899' },
];

/* ─────────────────────── cursor glow follower ────────────────── */

const CursorGlow: React.FC = () => {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const springX = useSpring(x, { stiffness: 120, damping: 20 });
  const springY = useSpring(y, { stiffness: 120, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [x, y]);

  return (
    <motion.div
      style={{
        position: 'fixed', zIndex: 0, pointerEvents: 'none',
        top: 0, left: 0,
        width: 480, height: 480,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(99,130,255,0.12) 0%, rgba(168,130,255,0.06) 45%, transparent 70%)',
        x: useTransform(springX, v => v - 240),
        y: useTransform(springY, v => v - 240),
      }}
    />
  );
};

/* ─────────────────────── floating blob orbs ──────────────────── */

const Blob = ({
  size, color, top, left, delay = 0, dur = 10
}: { size: number; color: string; top: string; left: string; delay?: number; dur?: number }) => (
  <motion.div
    animate={{ y: [0, -30, 0], x: [0, 18, 0], scale: [1, 1.1, 1], rotate: [0, 8, 0] }}
    transition={{ duration: dur, delay, repeat: Infinity, ease: 'easeInOut' }}
    style={{
      position: 'absolute', width: size, height: size,
      borderRadius: '60% 40% 70% 30% / 50% 60% 40% 50%',
      background: color, filter: 'blur(55px)', opacity: 0.5,
      pointerEvents: 'none', zIndex: 0,
      top, left,
    }}
  />
);

/* ─────────────────────── animated grid lines ─────────────────── */
const GridLines: React.FC<{ mouseX: number; mouseY: number }> = ({ mouseX, mouseY }) => {
  const dx = (mouseX / window.innerWidth  - 0.5) * 18;
  const dy = (mouseY / window.innerHeight - 0.5) * 18;
  return (
    <motion.div
      animate={{ x: dx, y: dy }}
      transition={{ type: 'spring', stiffness: 40, damping: 18 }}
      style={{
        position: 'absolute', inset: '-10%', pointerEvents: 'none', zIndex: 0,
        backgroundImage: `
          linear-gradient(rgba(99,102,241,0.06) 1px, transparent 1px),
          linear-gradient(90deg, rgba(99,102,241,0.06) 1px, transparent 1px)
        `,
        backgroundSize: '52px 52px',
      }}
    />
  );
};

/* ─────────────────────── floating dot particles ──────────────── */
const Particles: React.FC = () => {
  const dots = Array.from({ length: 22 }, (_, i) => ({
    id: i,
    x: `${Math.random() * 100}%`,
    y: `${Math.random() * 100}%`,
    size: Math.random() * 5 + 3,
    dur: Math.random() * 6 + 5,
    delay: Math.random() * 4,
  }));
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {dots.map(d => (
        <motion.div
          key={d.id}
          animate={{ y: [0, -40, 0], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute', left: d.x, top: d.y,
            width: d.size, height: d.size, borderRadius: '50%',
            background: 'linear-gradient(135deg, #818cf8, #c084fc)',
          }}
        />
      ))}
    </div>
  );
};

/* ─────────────────────── parallax card wrapper ───────────────── */
const ParallaxCard: React.FC<{ children: React.ReactNode; mouseX: number; mouseY: number }> = ({
  children, mouseX, mouseY
}) => {
  const cx = typeof window !== 'undefined' ? window.innerWidth  / 2 : 500;
  const cy = typeof window !== 'undefined' ? window.innerHeight / 2 : 400;
  const rotateY = ((mouseX - cx) / cx) * 6;
  const rotateX = -((mouseY - cy) / cy) * 5;

  return (
    <motion.div
      animate={{ rotateX, rotateY }}
      transition={{ type: 'spring', stiffness: 60, damping: 18 }}
      style={{ width: '100%', maxWidth: 450, perspective: 1200, transformStyle: 'preserve-3d' }}
    >
      {children}
    </motion.div>
  );
};

/* ─────────────────────── main component ─────────────────────── */

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername]    = useState('');
  const [password, setPassword]    = useState('');
  const [showPw,   setShowPw]      = useState(false);
  const [error,    setError]       = useState('');
  const [loading,  setLoading]     = useState(false);
  const [focused,  setFocused]     = useState<'username'|'password'|null>(null);
  const [mouse,    setMouse]       = useState({ x: 0, y: 0 });
  const [hovered,  setHovered]     = useState<number|null>(null);

  useEffect(() => {
    const move = (e: MouseEvent) => setMouse({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) { setError('Please enter both username and password.'); return; }
    setLoading(true); setError('');
    await new Promise(r => setTimeout(r, 1200));
    if (username === DEMO_CREDS.username && password === DEMO_CREDS.password) {
      const saved = localStorage.getItem('qms_user_profile');
      const user: UserProfile = saved ? JSON.parse(saved) : DEFAULT_USER;
      localStorage.setItem('qms_auth', 'true');
      onLogin(user);
    } else {
      setError('Invalid credentials. Use: admin / qms2026');
    }
    setLoading(false);
  };

  const fillDemo = () => { setUsername('admin'); setPassword('qms2026'); setError(''); };

  /* parallax depth layers offset from mouse centre */
  const px = typeof window !== 'undefined' ? (mouse.x / window.innerWidth  - 0.5) : 0;
  const py = typeof window !== 'undefined' ? (mouse.y / window.innerHeight - 0.5) : 0;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }

        @keyframes spin        { to { transform: rotate(360deg); } }
        @keyframes shimmer-btn { 0%{transform:translateX(-150%)} 100%{transform:translateX(150%)} }
        @keyframes badge-pulse { 0%,100%{box-shadow:0 0 0 0 rgba(99,102,241,0.35)} 50%{box-shadow:0 0 0 8px rgba(99,102,241,0)} }

        .lp-root {
          min-height: 100vh; width: 100%;
          display: flex; align-items: stretch;
          font-family: 'Inter','Segoe UI',sans-serif;
          background: linear-gradient(145deg,#f8f5ff 0%,#eef2ff 40%,#fdf4ff 70%,#f0fdfa 100%);
          overflow: hidden; position: relative;
        }
        /* left panel */
        .lp-left {
          flex: 0 0 55%;
          display: flex; flex-direction: column; justify-content: space-between;
          padding: clamp(2rem,5vw,5rem);
          position: relative; z-index: 10;
          border-right: 1.5px solid rgba(139,92,246,0.12);
        }
        /* right panel */
        .lp-right {
          flex: 1;
          display: flex; align-items: center; justify-content: center;
          padding: clamp(1.5rem,4vw,3rem);
          position: relative; z-index: 10;
        }
        /* card */
        .lp-card {
          width: 100%; max-width: 450px;
          background: rgba(255,255,255,0.72);
          border: 1.5px solid rgba(139,92,246,0.18);
          border-radius: 28px;
          padding: clamp(1.75rem,4vw,2.75rem);
          backdrop-filter: blur(28px) saturate(160%);
          -webkit-backdrop-filter: blur(28px) saturate(160%);
          box-shadow:
            0 4px 6px rgba(139,92,246,0.04),
            0 24px 60px rgba(99,102,241,0.12),
            0 1px 0 rgba(255,255,255,0.9) inset;
          position: relative; overflow: hidden;
          transform-style: preserve-3d;
        }
        /* input */
        .lp-input {
          width: 100%;
          padding: 13px 14px 13px 46px;
          background: rgba(248,245,255,0.8);
          border: 1.5px solid rgba(139,92,246,0.2);
          border-radius: 12px;
          color: #1e1b4b; font-size: 14px; font-weight: 600;
          outline: none; transition: all 0.25s;
          font-family: inherit;
        }
        .lp-input::placeholder { color: #a5b4fc; font-weight: 500; }
        .lp-input:focus {
          border-color: rgba(99,102,241,0.6);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(99,102,241,0.1);
        }
        /* submit button */
        .lp-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(135deg,#6366f1,#8b5cf6,#a855f7);
          border: none; border-radius: 14px;
          color: #fff; font-size: 15px; font-weight: 800;
          cursor: pointer; position: relative; overflow: hidden;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          letter-spacing: -0.01em;
          box-shadow: 0 8px 28px rgba(99,102,241,0.38);
          transition: box-shadow 0.3s, opacity 0.2s;
          font-family: inherit;
        }
        .lp-btn:not(:disabled):hover { box-shadow: 0 14px 40px rgba(99,102,241,0.52); }
        .lp-btn:disabled { opacity: 0.72; cursor: not-allowed; }
        .lp-btn-shimmer {
          position: absolute; inset: 0;
          background: linear-gradient(90deg,transparent,rgba(255,255,255,0.22),transparent);
          transform: translateX(-150%);
        }
        .lp-btn:not(:disabled):hover .lp-btn-shimmer {
          animation: shimmer-btn 0.7s ease forwards;
        }
        /* feature card */
        .lp-feat {
          padding: 1.1rem 1.15rem;
          background: rgba(255,255,255,0.55);
          border: 1.5px solid rgba(139,92,246,0.12);
          border-radius: 16px;
          backdrop-filter: blur(12px);
          cursor: default; transition: all 0.3s;
          position: relative; overflow: hidden;
        }
        .lp-feat::before {
          content:''; position:absolute; inset:0;
          background: linear-gradient(135deg,rgba(255,255,255,0.4),transparent);
          opacity:0; transition:opacity 0.3s;
          pointer-events:none;
        }
        .lp-feat:hover { transform:translateY(-4px); box-shadow:0 12px 32px rgba(99,102,241,0.14); border-color:rgba(139,92,246,0.28); }
        .lp-feat:hover::before { opacity:1; }
        /* demo card */
        .lp-demo {
          padding: 0.9rem 1rem; margin-bottom: 1.4rem;
          background: rgba(238,242,255,0.7);
          border: 1.5px solid rgba(99,102,241,0.2);
          border-radius: 14px; cursor: pointer; transition: all 0.25s;
        }
        .lp-demo:hover { background:rgba(238,242,255,0.95); border-color:rgba(99,102,241,0.4); box-shadow:0 6px 20px rgba(99,102,241,0.1); }
        /* scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(139,92,246,0.3); border-radius: 3px; }
        /* responsive */
        @media (max-width: 900px) {
          .lp-left { display: none !important; }
          .lp-mobile-logo { display: flex !important; }
        }
        @media (min-width: 901px) {
          .lp-mobile-logo { display: none !important; }
        }
        /* badge pulse */
        .lp-live-badge {
          animation: badge-pulse 2.2s ease-in-out infinite;
        }
      `}</style>

      <div className="lp-root">
        {/* cursor glow */}
        <CursorGlow />

        {/* animated grid (parallax layer 1 — slow) */}
        <GridLines mouseX={mouse.x} mouseY={mouse.y} />

        {/* floating blobs (parallax layer 2 — medium) */}
        <motion.div
          animate={{ x: px * -30, y: py * -20 }}
          transition={{ type: 'spring', stiffness: 30, damping: 12 }}
          style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}
        >
          <Blob size={420} color="linear-gradient(135deg,#c7d2fe,#e9d5ff)" top="-12%"  left="-8%"  dur={11} />
          <Blob size={300} color="linear-gradient(135deg,#bfdbfe,#ddd6fe)" top="60%"  left="62%"  dur={13} delay={3} />
          <Blob size={220} color="linear-gradient(135deg,#bbf7d0,#a5f3fc)" top="35%"  left="35%"  dur={9}  delay={5} />
        </motion.div>

        {/* floating dust particles (parallax layer 3 — fast) */}
        <motion.div
          animate={{ x: px * -60, y: py * -40 }}
          transition={{ type: 'spring', stiffness: 50, damping: 15 }}
          style={{ position:'absolute', inset:0, pointerEvents:'none', zIndex:0 }}
        >
          <Particles />
        </motion.div>

        {/* ── LEFT PANEL ── */}
        <div className="lp-left">

          {/* Logo */}
          <motion.div
            initial={{ opacity:0, y:-22 }}
            animate={{ opacity:1, y:0 }}
            transition={{ duration:0.7 }}
            style={{ display:'flex', alignItems:'center', gap:'1rem' }}
          >
            <motion.div
              animate={{ x: px * -8, y: py * -8 }}
              transition={{ type:'spring', stiffness:60, damping:18 }}
              style={{
                width:54, height:54, borderRadius:16, flexShrink:0,
                background: 'linear-gradient(135deg,#6366f1,#a855f7)',
                display:'flex', alignItems:'center', justifyContent:'center',
                boxShadow:'0 8px 26px rgba(99,102,241,0.38)',
                position:'relative', overflow:'hidden',
              }}
            >
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,255,255,0.25),transparent)' }} />
              <ShieldCheck style={{ width:26, height:26, color:'#fff' }} strokeWidth={2.5} />
            </motion.div>
            <div>
              <h1 style={{ fontSize:'clamp(1.5rem,2.5vw,2rem)', fontWeight:900, color:'#1e1b4b', letterSpacing:'-0.04em', margin:0, lineHeight:1 }}>QMS ERP</h1>
              <p style={{ fontSize:10, fontWeight:700, color:'#6366f1', letterSpacing:'0.2em', textTransform:'uppercase', margin:'4px 0 0' }}>Enterprise Pro</p>
            </div>
            {/* live badge */}
            <div
              className="lp-live-badge"
              style={{
                marginLeft:'auto',
                display:'flex', alignItems:'center', gap:5,
                background:'linear-gradient(135deg,#ecfdf5,#d1fae5)',
                border:'1.5px solid rgba(16,185,129,0.3)',
                borderRadius:20, padding:'5px 11px',
              }}
            >
              <motion.div
                animate={{ scale:[1,1.5,1], opacity:[1,0.5,1] }}
                transition={{ duration:1.5, repeat:Infinity }}
                style={{ width:7, height:7, borderRadius:'50%', background:'#10b981' }}
              />
              <span style={{ fontSize:9.5, fontWeight:800, color:'#065f46', letterSpacing:'0.08em', textTransform:'uppercase' }}>Live System</span>
            </div>
          </motion.div>

          {/* Hero text (parallax layer) */}
          <motion.div
            animate={{ x: px * -14, y: py * -10 }}
            transition={{ type:'spring', stiffness:35, damping:14 }}
            style={{ margin:'clamp(2rem,5vw,4.5rem) 0 2.5rem' }}
          >
            <motion.h2
              initial={{ opacity:0, x:-30 }}
              animate={{ opacity:1, x:0 }}
              transition={{ duration:0.8, delay:0.15 }}
              style={{
                fontSize:'clamp(2rem,4vw,3.4rem)', fontWeight:900,
                color:'#1e1b4b', lineHeight:1.05, letterSpacing:'-0.03em', margin:'0 0 1.1rem',
              }}
            >
              Elevate Your<br />
              <span style={{
                background:'linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7,#06b6d4)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                backgroundSize:'300%',
                animation:'hueShift 6s linear infinite',
              }}>
                Quality Standards
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity:0 }}
              animate={{ opacity:1 }}
              transition={{ duration:0.8, delay:0.28 }}
              style={{ color:'#6b7280', fontSize:'clamp(0.875rem,1.15vw,1rem)', lineHeight:1.7, maxWidth:470 }}
            >
              A next-generation enterprise platform engineered for seamless ISO compliance,
              defect elimination, and multi-tier operational excellence.
            </motion.p>
          </motion.div>

          {/* Feature grid (parallax layer) */}
          <motion.div
            animate={{ x: px * -20, y: py * -14 }}
            transition={{ type:'spring', stiffness:40, damping:16 }}
            style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.85rem', marginBottom:'auto' }}
          >
            {features.map((f, i) => (
              <motion.div
                key={i}
                className="lp-feat"
                initial={{ opacity:0, y:24 }}
                animate={{ opacity:1, y:0 }}
                transition={{ delay:0.35 + i * 0.08 }}
                onHoverStart={() => setHovered(i)}
                onHoverEnd={() => setHovered(null)}
              >
                {/* accent top line on hover */}
                <motion.div
                  animate={{ scaleX: hovered === i ? 1 : 0 }}
                  transition={{ duration:0.25 }}
                  style={{
                    position:'absolute', top:0, left:0, right:0, height:2,
                    background:`linear-gradient(90deg,${f.color},transparent)`,
                    transformOrigin:'left',
                  }}
                />
                <div style={{
                  width:36, height:36, borderRadius:10, marginBottom:10,
                  background:`linear-gradient(135deg,${f.color}22,${f.color}11)`,
                  border:`1.5px solid ${f.color}33`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                }}>
                  <f.icon style={{ width:16, height:16, color:f.color }} />
                </div>
                <p style={{ fontSize:11.5, fontWeight:800, color:'#1e1b4b', margin:'0 0 2px', letterSpacing:'-0.01em' }}>{f.title}</p>
                <p style={{ fontSize:10.5, color:'#9ca3af', margin:0, lineHeight:1.4, fontWeight:600 }}>{f.text}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity:0 }}
            animate={{ opacity:1 }}
            transition={{ duration:1, delay:1.1 }}
            style={{ display:'flex', alignItems:'center', gap:12, marginTop:'2rem' }}
          >
            <div style={{ display:'flex' }}>
              {[Award, CheckCircle2, Globe].map((Icon, i) => (
                <div key={i} style={{
                  width:30, height:30, borderRadius:'50%',
                  background:'linear-gradient(135deg,#eef2ff,#ede9fe)',
                  border:'1.5px solid rgba(99,102,241,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  marginLeft: i===0 ? 0 : -8, zIndex: 3-i,
                }}>
                  <Icon style={{ width:13, height:13, color:'#6366f1' }} />
                </div>
              ))}
            </div>
            <span style={{ fontSize:11, fontWeight:700, color:'#9ca3af', textTransform:'uppercase', letterSpacing:'0.08em' }}>Trusted by 500+ Manufacturers</span>
          </motion.div>
        </div>

        {/* ── RIGHT PANEL ── */}
        <div className="lp-right">
          <ParallaxCard mouseX={mouse.x} mouseY={mouse.y}>
            <motion.div
              initial={{ opacity:0, y:30 }}
              animate={{ opacity:1, y:0 }}
              transition={{ duration:0.7, type:'spring', bounce:0.28 }}
            >
              <div className="lp-card">
                {/* top gradient accent */}
                <div style={{
                  position:'absolute', top:0, left:0, right:0, height:3,
                  background:'linear-gradient(90deg,#6366f1,#8b5cf6,#a855f7,#06b6d4)',
                  borderRadius:'28px 28px 0 0',
                }} />

                {/* sparkle dots in card */}
                {[{t:'14%',l:'88%',s:6,c:'#a78bfa'},{t:'82%',l:'5%',s:5,c:'#60a5fa'},{t:'55%',l:'92%',s:4,c:'#34d399'}].map((sp,i)=>(
                  <motion.div key={i}
                    animate={{ scale:[1,1.6,1], opacity:[0.5,1,0.5] }}
                    transition={{ duration:2.5+i*0.8, delay:i*0.6, repeat:Infinity }}
                    style={{ position:'absolute', top:sp.t, left:sp.l, width:sp.s, height:sp.s,
                      borderRadius:'50%', background:sp.c, pointerEvents:'none', zIndex:2 }}
                  />
                ))}

                {/* mobile logo */}
                <div className="lp-mobile-logo" style={{ display:'none', alignItems:'center', gap:12, marginBottom:'1.75rem' }}>
                  <div style={{
                    width:42, height:42, borderRadius:12,
                    background:'linear-gradient(135deg,#6366f1,#a855f7)',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    boxShadow:'0 6px 20px rgba(99,102,241,0.35)',
                  }}>
                    <ShieldCheck style={{ width:20, height:20, color:'#fff' }} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h1 style={{ fontSize:'1.25rem', fontWeight:900, color:'#1e1b4b', letterSpacing:'-0.03em', margin:0 }}>QMS ERP</h1>
                    <p style={{ fontSize:10, fontWeight:700, color:'#6366f1', letterSpacing:'0.15em', textTransform:'uppercase', margin:'3px 0 0' }}>Enterprise Pro</p>
                  </div>
                </div>

                {/* header */}
                <div style={{ textAlign:'center', marginBottom:'1.5rem' }}>
                  <motion.h2
                    initial={{ opacity:0, y:-10 }}
                    animate={{ opacity:1, y:0 }}
                    transition={{ delay:0.2 }}
                    style={{ fontSize:'clamp(1.5rem,2.5vw,1.9rem)', fontWeight:900, color:'#1e1b4b', letterSpacing:'-0.03em', margin:'0 0 6px' }}
                  >
                    Welcome Back 👋
                  </motion.h2>
                  <p style={{ fontSize:13, color:'#9ca3af', fontWeight:500, margin:0 }}>Sign in to your QMS portal</p>
                </div>

                {/* demo card */}
                <motion.div
                  whileHover={{ scale:1.015 }} whileTap={{ scale:0.985 }}
                  className="lp-demo"
                  onClick={fillDemo}
                >
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <Zap style={{ width:13, height:13, color:'#6366f1' }} />
                      <span style={{ fontSize:10.5, fontWeight:800, color:'#4338ca', textTransform:'uppercase', letterSpacing:'0.1em' }}>Quick Demo Access</span>
                    </div>
                    <span style={{
                      fontSize:9, padding:'3px 8px', fontWeight:800,
                      background:'linear-gradient(135deg,#6366f1,#a855f7)',
                      color:'#fff', borderRadius:6, letterSpacing:'0.05em', textTransform:'uppercase',
                    }}>Auto-Fill</span>
                  </div>
                  <div style={{
                    display:'flex', gap:16, fontSize:11.5, fontFamily:'monospace',
                    background:'rgba(238,242,255,0.8)', padding:'7px 12px', borderRadius:8,
                    color:'#6b7280',
                  }}>
                    <span>User:&nbsp;<strong style={{ color:'#4338ca' }}>admin</strong></span>
                    <span>Pass:&nbsp;<strong style={{ color:'#4338ca' }}>qms2026</strong></span>
                  </div>
                </motion.div>

                {/* form */}
                <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>

                  {/* username */}
                  <div>
                    <label style={{
                      display:'block', fontSize:10, fontWeight:800,
                      color: focused==='username' ? '#6366f1' : '#9ca3af',
                      textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:6,
                      transition:'color 0.2s',
                    }}>Username ID</label>
                    <div style={{ position:'relative' }}>
                      <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                        <UserIcon style={{ width:17, height:17, color: focused==='username' ? '#6366f1' : '#c4b5fd' }} />
                      </span>
                      <input
                        className="lp-input"
                        type="text"
                        value={username}
                        onChange={e => { setUsername(e.target.value); setError(''); }}
                        onFocus={() => setFocused('username')}
                        onBlur={() => setFocused(null)}
                        placeholder="Enter admin ID"
                        style={{ paddingLeft:46 }}
                      />
                    </div>
                  </div>

                  {/* password */}
                  <div>
                    <label style={{
                      display:'block', fontSize:10, fontWeight:800,
                      color: focused==='password' ? '#6366f1' : '#9ca3af',
                      textTransform:'uppercase', letterSpacing:'0.15em', marginBottom:6,
                      transition:'color 0.2s',
                    }}>Security Key</label>
                    <div style={{ position:'relative' }}>
                      <span style={{ position:'absolute', left:14, top:'50%', transform:'translateY(-50%)', pointerEvents:'none' }}>
                        <Lock style={{ width:17, height:17, color: focused==='password' ? '#6366f1' : '#c4b5fd' }} />
                      </span>
                      <input
                        className="lp-input"
                        type={showPw ? 'text' : 'password'}
                        value={password}
                        onChange={e => { setPassword(e.target.value); setError(''); }}
                        onFocus={() => setFocused('password')}
                        onBlur={() => setFocused(null)}
                        placeholder="••••••••••••"
                        style={{ paddingLeft:46, paddingRight:48 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPw(!showPw)}
                        style={{
                          position:'absolute', right:14, top:'50%', transform:'translateY(-50%)',
                          background:'none', border:'none', cursor:'pointer',
                          color:'#c4b5fd', display:'flex', alignItems:'center',
                          padding:0, transition:'color 0.2s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.color='#6366f1')}
                        onMouseLeave={e => (e.currentTarget.style.color='#c4b5fd')}
                      >
                        {showPw ? <EyeOff style={{ width:17, height:17 }} /> : <Eye style={{ width:17, height:17 }} />}
                      </button>
                    </div>
                  </div>

                  {/* error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity:0, y:-8, height:0 }}
                        animate={{ opacity:1, y:0,  height:'auto' }}
                        exit={{ opacity:0, y:-8, height:0 }}
                        style={{ overflow:'hidden' }}
                      >
                        <div style={{
                          display:'flex', alignItems:'center', gap:8,
                          padding:'10px 14px',
                          background:'rgba(254,226,226,0.8)',
                          border:'1.5px solid rgba(252,165,165,0.5)',
                          borderRadius:10, color:'#dc2626',
                          fontSize:12.5, fontWeight:700,
                        }}>
                          <AlertCircle style={{ width:15, height:15, flexShrink:0 }} />
                          {error}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* submit */}
                  <motion.button
                    whileHover={{ scale: loading ? 1 : 1.025 }}
                    whileTap={{ scale: loading ? 1 : 0.97 }}
                    type="submit"
                    disabled={loading}
                    className="lp-btn"
                    style={{ marginTop:'0.5rem' }}
                  >
                    <span className="lp-btn-shimmer" />
                    {loading ? (
                      <>
                        <div style={{
                          width:18, height:18, border:'2px solid rgba(255,255,255,0.4)',
                          borderTopColor:'#fff', borderRadius:'50%',
                          animation:'spin 0.7s linear infinite',
                        }} />
                        Authenticating…
                      </>
                    ) : (
                      <>
                        <LogIn style={{ width:18, height:18 }} />
                        Secure Sign In
                        <ArrowRight style={{ width:16, height:16 }} />
                      </>
                    )}
                  </motion.button>
                </form>

                {/* footer */}
                <div style={{
                  marginTop:'1.5rem', paddingTop:'1.25rem',
                  borderTop:'1.5px solid rgba(139,92,246,0.1)',
                  display:'flex', flexDirection:'column', alignItems:'center', gap:5,
                }}>
                  <div style={{ display:'flex', alignItems:'center', gap:5, fontSize:10.5, fontWeight:700, color:'#c4b5fd', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                    <Lock style={{ width:11, height:11 }} />
                    End-to-end Encrypted
                  </div>
                  <div style={{ fontSize:10, fontWeight:700, color:'#d8b4fe', textTransform:'uppercase', letterSpacing:'0.1em' }}>
                    Powered by QMS Enterprise v3.4.1
                  </div>
                </div>
              </div>
            </motion.div>
          </ParallaxCard>
        </div>

        {/* gradient hue keyframe */}
        <style>{`
          @keyframes hueShift {
            0%   { background-position: 0%   50%; }
            50%  { background-position: 100% 50%; }
            100% { background-position: 0%   50%; }
          }
        `}</style>
      </div>
    </>
  );
}
