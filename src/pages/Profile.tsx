import React, { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { motion, AnimatePresence } from 'motion/react';
import {
  User, Mail, Phone, Building2, Briefcase, Shield, Camera,
  Save, Check, Eye, EyeOff, KeyRound, X, AlertCircle, LogOut,
  Edit3, Lock
} from 'lucide-react';
import type { UserProfile } from './Login';

// ─── Canvas crop helper ─────────────────────────────────────────
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener('load', () => resolve(image));
    image.addEventListener('error', reject);
    image.setAttribute('crossOrigin', 'anonymous');
    image.src = url;
  });

const getCroppedImg = async (imageSrc: string, pixelCrop: any): Promise<string | null> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement('canvas');
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;
  ctx.drawImage(image, pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height, 0, 0, pixelCrop.width, pixelCrop.height);
  return canvas.toDataURL('image/jpeg', 0.92);
};

// ─── Types ──────────────────────────────────────────────────────
interface ProfileData {
  name: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  employeeId: string;
  location: string;
}

interface ProfileProps {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
}

const DEPARTMENTS = ['Quality Assurance', 'Production', 'Compliance', 'HR', 'IE/Tech', 'Logistics', 'Audit', 'Management'];
const ROLES = ['Quality Manager', 'QC Inspector', 'Audit Lead', 'Compliance Officer', 'System Admin', 'Production Manager', 'HR Manager'];

// ─── Password Modal ─────────────────────────────────────────────
function PasswordModal({ onClose }: { onClose: () => void }) {
  const [current, setCurrent] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (current !== 'qms2026') { setError('Current password is incorrect.'); return; }
    if (newPw.length < 6) { setError('New password must be at least 6 characters.'); return; }
    if (newPw !== confirm) { setError('Passwords do not match.'); return; }
    setError('');
    setSaved(true);
    setTimeout(onClose, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-accent" style={{ color: 'var(--accent)' }} />
            <h3 className="font-bold text-base" style={{ color: 'var(--text-1)' }}>Change Password</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: 'var(--text-3)' }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        {saved ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
              <Check className="w-6 h-6 text-green-500" />
            </div>
            <p className="font-bold" style={{ color: 'var(--text-1)' }}>Password updated successfully</p>
          </div>
        ) : (
          <div className="space-y-4">
            {[
              { label: 'Current Password', val: current, set: setCurrent, show: showCurrent, setShow: setShowCurrent },
              { label: 'New Password', val: newPw, set: setNewPw, show: showNew, setShow: setShowNew },
              { label: 'Confirm New Password', val: confirm, set: setConfirm, show: showNew, setShow: setShowNew },
            ].map(({ label, val, set, show, setShow }, i) => (
              <div key={i}>
                <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>{label}</label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={val}
                    onChange={e => { set(e.target.value); setError(''); }}
                    className="w-full px-4 pr-10 py-2.5 rounded-lg text-sm font-medium outline-none"
                    style={{ background: 'var(--bg-2)', border: '1px solid var(--border)', color: 'var(--text-1)' }}
                  />
                  <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }}>
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
            {error && (
              <div className="flex items-center gap-2 text-sm px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                <AlertCircle className="w-4 h-4" />{error}
              </div>
            )}
            <div className="flex gap-3 pt-2">
              <button onClick={handleSave} className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2" style={{ background: 'var(--accent)' }}>
                <Save className="w-4 h-4" /> Save Password
              </button>
              <button onClick={onClose} className="px-4 py-2.5 rounded-xl text-sm font-bold border" style={{ borderColor: 'var(--border)', color: 'var(--text-2)' }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Input Field ────────────────────────────────────────────────
function FieldRow({ label, icon: Icon, value, onChange, type = 'text', children }: {
  label: string; icon: any; value: string; onChange?: (v: string) => void;
  type?: string; children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>{label}</label>
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-3)' }}>
          <Icon className="w-4 h-4" />
        </div>
        {children ? children : (
          <input
            type={type}
            value={value}
            onChange={e => onChange?.(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none transition-all"
            style={{ background: 'var(--bg-0)', border: '1.5px solid var(--border)', color: 'var(--text-1)' }}
            onFocus={e => (e.target.style.borderColor = 'var(--accent)')}
            onBlur={e => (e.target.style.borderColor = 'var(--border)')}
          />
        )}
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────
export function Profile({ avatarUrl, setAvatarUrl }: ProfileProps) {
  const [profile, setProfile] = useState<ProfileData>(() => {
    try {
      const saved = localStorage.getItem('qms_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved) as UserProfile;
        return {
          name: parsed.name || 'System Admin',
          email: parsed.email || 'admin@qmserp.com',
          phone: (parsed as any).phone || '',
          role: parsed.role || 'Quality Manager',
          department: parsed.department || 'Quality Assurance',
          employeeId: (parsed as any).employeeId || 'EMP-0001',
          location: (parsed as any).location || '',
        };
      }
    } catch (_) {}
    return {
      name: 'System Admin',
      email: 'admin@qmserp.com',
      phone: '',
      role: 'Quality Manager',
      department: 'Quality Assurance',
      employeeId: 'EMP-0001',
      location: '',
    };
  });

  const set = (key: keyof ProfileData, val: string) => setProfile(p => ({ ...p, [key]: val }));

  const [saved, setSaved] = useState(false);
  const [showPwModal, setShowPwModal] = useState(false);

  // Avatar crop state
  const [rawImage, setRawImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedPixels, setCroppedPixels] = useState<any>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: any, pixels: any) => setCroppedPixels(pixels), []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const reader = new FileReader();
      reader.onload = () => setRawImage(reader.result as string);
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCropSave = async () => {
    if (rawImage && croppedPixels) {
      const cropped = await getCroppedImg(rawImage, croppedPixels);
      if (cropped) setAvatarUrl(cropped);
      setRawImage(null);
    }
  };

  const handleSaveProfile = () => {
    const existing = localStorage.getItem('qms_user_profile');
    const current = existing ? JSON.parse(existing) : {};
    localStorage.setItem('qms_user_profile', JSON.stringify({ ...current, ...profile }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const initials = profile.name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'QM';

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full pb-20" style={{ color: 'var(--text-1)' }}>
      <AnimatePresence>{showPwModal && <PasswordModal onClose={() => setShowPwModal(false)} />}</AnimatePresence>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent-light)' }}>
            <User className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          </div>
          <div>
            <h1 className="text-xl font-bold" style={{ color: 'var(--text-1)' }}>User Profile</h1>
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>Manage your personal information</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">

        {/* ── Avatar Card ── */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-6 flex flex-col items-center gap-5"
          style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}
        >
          {/* Avatar */}
          <div className="relative">
            <div className="w-28 h-28 rounded-full overflow-hidden flex items-center justify-center text-2xl font-black text-white border-4"
              style={{ background: avatarUrl ? 'transparent' : 'var(--accent)', borderColor: 'var(--border)' }}>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : initials}
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>
          <input type="file" accept="image/*" ref={fileRef} onChange={handleFileChange} className="hidden" />

          <div className="text-center">
            <p className="font-bold text-base" style={{ color: 'var(--text-1)' }}>{profile.name}</p>
            <p className="text-sm" style={{ color: 'var(--text-3)' }}>{profile.role}</p>
            <span className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
              <Shield className="w-3 h-3" /> {profile.department}
            </span>
          </div>

          <div className="w-full space-y-2 text-sm">
            {[
              { icon: Mail, text: profile.email || '—' },
              { icon: Phone, text: profile.phone || '—' },
              { icon: Building2, text: profile.department },
            ].map(({ icon: Icon, text }, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'var(--bg-2)' }}>
                <Icon className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--text-3)' }} />
                <span className="truncate text-xs" style={{ color: 'var(--text-2)' }}>{text}</span>
              </div>
            ))}
          </div>

          {/* Crop panel */}
          {rawImage && (
            <div className="w-full">
              <div className="h-48 relative rounded-xl overflow-hidden">
                <Cropper
                  image={rawImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                />
              </div>
              <div className="flex gap-2 mt-3">
                <button onClick={handleCropSave}
                  className="flex-1 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background: 'var(--accent)' }}>
                  Apply Crop
                </button>
                <button onClick={() => setRawImage(null)}
                  className="px-3 py-2 rounded-xl text-xs font-bold"
                  style={{ background: 'var(--bg-2)', color: 'var(--text-2)' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Info Card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Personal Info */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-5">
              <Edit3 className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h2 className="font-bold text-sm uppercase tracking-wide" style={{ color: 'var(--text-1)' }}>Personal Information</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FieldRow label="Full Name" icon={User} value={profile.name} onChange={v => set('name', v)} />
              <FieldRow label="Email Address" icon={Mail} value={profile.email} onChange={v => set('email', v)} type="email" />
              <FieldRow label="Phone Number" icon={Phone} value={profile.phone} onChange={v => set('phone', v)} type="tel" />
              <FieldRow label="Employee ID" icon={Briefcase} value={profile.employeeId} onChange={v => set('employeeId', v)} />
              <FieldRow label="Role" icon={Shield} value={profile.role} onChange={v => set('role', v)}>
                <select
                  value={profile.role}
                  onChange={e => set('role', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none"
                  style={{ background: 'var(--bg-0)', border: '1.5px solid var(--border)', color: 'var(--text-1)' }}
                >
                  {ROLES.map(r => <option key={r}>{r}</option>)}
                </select>
              </FieldRow>
              <FieldRow label="Department" icon={Building2} value={profile.department} onChange={v => set('department', v)}>
                <select
                  value={profile.department}
                  onChange={e => set('department', e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm font-medium outline-none"
                  style={{ background: 'var(--bg-0)', border: '1.5px solid var(--border)', color: 'var(--text-1)' }}
                >
                  {DEPARTMENTS.map(d => <option key={d}>{d}</option>)}
                </select>
              </FieldRow>
            </div>

            <div className="flex items-center gap-3 mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
              <button
                id="save-profile-btn"
                onClick={handleSaveProfile}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
                style={{ background: 'var(--accent)', boxShadow: '0 4px 12px rgba(37,99,235,0.25)' }}
              >
                {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {saved ? 'Saved!' : 'Save Profile'}
              </button>
              {saved && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-sm font-bold text-green-500 flex items-center gap-1"
                >
                  <Check className="w-4 h-4" /> Changes saved successfully
                </motion.span>
              )}
            </div>
          </div>

          {/* Security */}
          <div className="rounded-2xl p-6" style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
            <div className="flex items-center gap-2 mb-5">
              <Shield className="w-4 h-4" style={{ color: 'var(--accent)' }} />
              <h2 className="font-bold text-sm uppercase tracking-wide" style={{ color: 'var(--text-1)' }}>Security</h2>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--bg-2)' }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--bg-0)', border: '1px solid var(--border)' }}>
                  <KeyRound className="w-4 h-4" style={{ color: 'var(--text-3)' }} />
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: 'var(--text-1)' }}>Password</p>
                  <p className="text-xs" style={{ color: 'var(--text-3)' }}>Last changed: Never</p>
                </div>
              </div>
              <button
                id="change-password-btn"
                onClick={() => setShowPwModal(true)}
                className="px-4 py-2 rounded-lg text-xs font-bold border transition-all hover:opacity-80"
                style={{ borderColor: 'var(--border)', color: 'var(--text-2)', background: 'var(--bg-1)' }}
              >
                Change Password
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
