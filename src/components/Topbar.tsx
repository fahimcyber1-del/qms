import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Menu, Bell, User, Search, Globe, ShieldCheck, Sun, Moon,
  X, AlertTriangle, AlertCircle, CheckCircle2, Info, Award,
  Clock, ChevronRight, Trash2, CheckCheck, Settings, LogOut
} from 'lucide-react';
import { getCertificates, getDaysUntilExpiry } from '../utils/certificateUtils';
import type { UserProfile } from '../pages/Login';

// ── Types ──────────────────────────────────────────────────────────────────
interface NotifItem {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  category: string;
  title: string;
  body: string;
  time: string;
  read: boolean;
}

interface TopbarProps {
  title: string;
  avatarUrl: string | null;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onShowNotif: (msg: string, title: string, type: string) => void;
  onNavigate: (page: string) => void;
  onToggleSidebar: () => void;
  userProfile?: UserProfile;
  onLogout?: () => void;
}

// ── Notification Builder ──────────────────────────────────────────────────
function buildNotifications(): NotifItem[] {
  const items: NotifItem[] = [];
  const now = new Date();
  const fmt = (d: Date) =>
    d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' · Today';

  // Read notification preferences from Settings
  let prefs: Record<string, any> = {};
  try {
    const cs = localStorage.getItem('companySettings');
    if (cs) prefs = JSON.parse(cs)?.notifications ?? {};
  } catch (_) {}

  // Master switch for in-app alerts
  if (prefs.inAppAlerts === false) {
    return items;
  }

  const expiryDays   = typeof prefs.certExpiryWarningDays === 'number' ? prefs.certExpiryWarningDays : 30;
  const notifyCert   = prefs.certAlerts  !== false;
  const notifyCapa   = prefs.capaAlerts  !== false;
  const notifyAudit  = prefs.auditAlerts !== false;
  const notifyWf     = prefs.workflowAlerts !== false;
  const notifyAction = prefs.actionItemAlerts !== false;
  const notifyKpi    = prefs.kpiAlerts !== false;

  // Certificates
  if (notifyCert) {
    try {
      getCertificates().forEach(cert => {
        const days = getDaysUntilExpiry(cert.expiryDate);
        if (days <= 0) {
          items.push({
            id: `cert-exp-${cert.id}`, type: 'error', category: 'Certification',
            title: 'Certificate Expired',
            body: `"${cert.name}" (${cert.number}) expired on ${cert.expiryDate}. Immediate renewal required.`,
            time: fmt(now), read: false,
          });
        } else if (days <= expiryDays) {
          items.push({
            id: `cert-warn-${cert.id}`, type: 'warning', category: 'Certification',
            title: 'Certificate Expiring Soon',
            body: `"${cert.name}" expires in ${days} day${days !== 1 ? 's' : ''} on ${cert.expiryDate}.`,
            time: fmt(now), read: false,
          });
        }
      });
    } catch (_) {}
  }

  // CAPA
  if (notifyCapa) {
    try {
      const capaStr = localStorage.getItem('garmentqms_capas');
      if (capaStr) {
        const capas = JSON.parse(capaStr) as any[];
        const overdue = capas.filter(c => !c.deadline || c.status === 'Closed' ? false : new Date(c.deadline) < now);
        const open    = capas.filter(c => c.status === 'Open' || c.status === 'In Progress');
        overdue.forEach(c => items.push({
          id: `capa-overdue-${c.id}`, type: 'error', category: 'CAPA',
          title: 'CAPA Overdue',
          body: `"${c.nc}" — deadline was ${c.deadline}. Responsible: ${c.responsible}.`,
          time: fmt(now), read: false,
        }));
        if (open.length > 0 && overdue.length === 0) {
          items.push({
            id: 'capa-open', type: 'warning', category: 'CAPA',
            title: `${open.length} Open CAPA${open.length > 1 ? 's' : ''}`,
            body: `${open.length} corrective action${open.length > 1 ? 's are' : ' is'} pending closure.`,
            time: fmt(now), read: false,
          });
        }
      }
    } catch (_) {}
  }

  // Audits
  if (notifyAudit) {
    try {
      const auditStr = localStorage.getItem('garmentqms_audits');
      if (auditStr) {
        const audits = JSON.parse(auditStr) as any[];
        const failed = audits.filter(a => a.overallScore != null && parseFloat(a.overallScore) < 75);
        if (failed.length > 0) {
          items.push({
            id: 'audit-failed', type: 'warning', category: 'Audit',
            title: `${failed.length} Below-Standard Audit${failed.length > 1 ? 's' : ''}`,
            body: `${failed.length} audit${failed.length > 1 ? 's' : ''} scored below the 75% pass threshold.`,
            time: fmt(now), read: false,
          });
        }
      }
    } catch (_) {}
  }

  // Workflows (SOPs under review)
  if (notifyWf) {
    try {
      const sopStr = localStorage.getItem('garmentqms_sops');
      if (sopStr) {
        const sops = JSON.parse(sopStr) as any[];
        const pendingSops = sops.filter(s => s.status === 'Draft' || s.status === 'Under Review');
        if (pendingSops.length > 0) {
          items.push({
            id: 'wf-pending', type: 'info', category: 'Workflow',
            title: 'Pending SOP Reviews',
            body: `${pendingSops.length} standard operating procedure${pendingSops.length > 1 ? 's are' : ' is'} pending your review.`,
            time: fmt(now), read: false,
          });
        }
      }
    } catch (_) {}
  }

  // Action Items (Critical Risks)
  if (notifyAction) {
    try {
      const riskStr = localStorage.getItem('garmentqms_risks');
      if (riskStr) {
        const risks = JSON.parse(riskStr) as any[];
        const highRisks = risks.filter(r => r.severity === 'High' && r.status === 'Active');
        if (highRisks.length > 0) {
          items.push({
            id: 'action-risks', type: 'error', category: 'Action Item',
            title: 'Critical Focus Required',
            body: `${highRisks.length} High-severity risk${highRisks.length > 1 ? 's' : ''} require immediate mitigation actions.`,
            time: fmt(now), read: false,
          });
        }
      }
    } catch (_) {}
  }

  // KPIs (Production Quality Defaults)
  if (notifyKpi) {
    try {
      const prodStr = localStorage.getItem('qms_prod_quality');
      if (prodStr) {
        const prod = JSON.parse(prodStr) as any[];
        const recentProd = prod.slice(0, 20); // Check latest 20 batches
        const totalDefects = recentProd.reduce((acc, curr) => acc + (curr.totalDefects || 0), 0);
        if (totalDefects > 50) {
          items.push({
            id: 'kpi-dhu', type: 'warning', category: 'KPI Alert',
            title: 'High Defect Rate Detected',
            body: `Recent production recorded ${totalDefects} defects. Review DHU targets on the dashboard immediately.`,
            time: fmt(now), read: false,
          });
        } else if (prod.length > 0) {
          items.push({
            id: 'kpi-dhu-ok', type: 'success', category: 'KPI Alert',
            title: 'Quality Target Met',
            body: `Production quality is trending well within acceptable ISO performance parameters.`,
            time: fmt(now), read: false,
          });
        }
      }
    } catch (_) {}
  }

  // System info (always shown if inAppAlerts is true)
  items.push({
    id: 'sys-info', type: 'info', category: 'System',
    title: 'ISO 9001:2015 Compliance Active',
    body: 'All QMS modules are operating within ISO compliance boundaries.',
    time: fmt(now), read: true,
  });

  // Emulate mock backend dispatcher triggers
  if (prefs.emailAlerts && items.length > 0) {
    console.info(`[Notification Engine] SMTP alerts enabled. Distributing ${items.length} events to active users...`);
  }
  if (prefs.smsAlerts && items.some(i => i.type === 'error')) {
    console.info(`[Notification Engine] SMS/WhatsApp gateways enabled. Escalating critical alerts to key personnel...`);
  }
  if (prefs.reminderFrequency) {
    console.info(`[Notification Engine] Task reminders scheduled: ${prefs.reminderFrequency}`);
  }

  return items;
}

// ── Icon helpers ──────────────────────────────────────────────────────────
const TypeIcon = ({ type }: { type: NotifItem['type'] }) => {
  if (type === 'error')   return <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />;
  if (type === 'warning') return <AlertCircle   className="w-4 h-4 text-amber-500 flex-shrink-0" />;
  if (type === 'success') return <CheckCircle2  className="w-4 h-4 text-green-500 flex-shrink-0" />;
  return <Info className="w-4 h-4 text-blue-500 flex-shrink-0" />;
};

const colorBadge: Record<NotifItem['type'], string> = {
  error:   'bg-red-500/10 text-red-500',
  warning: 'bg-amber-500/10 text-amber-500',
  success: 'bg-green-500/10 text-green-500',
  info:    'bg-blue-500/10 text-blue-400',
};

// ── Component ─────────────────────────────────────────────────────────────
export function Topbar({
  title, avatarUrl, isDarkMode, onToggleDarkMode,
  onShowNotif, onNavigate, onToggleSidebar,
  userProfile, onLogout,
}: TopbarProps) {
  const [panelOpen, setPanelOpen]   = useState(false);
  const [notifs, setNotifs]         = useState<NotifItem[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const panelRef   = useRef<HTMLDivElement>(null);
  const userRef    = useRef<HTMLDivElement>(null);

  // ── Notification helpers ─────────────────────────────────────────
  const refresh = useCallback(() => setNotifs(buildNotifications()), []);
  useEffect(() => { refresh(); }, [refresh]);

  // Listen for test notifications from Settings
  useEffect(() => {
    const handler = (e: Event) => {
      const { type, title, msg } = (e as CustomEvent).detail as { type: NotifItem['type']; title: string; msg: string };
      const testItem: NotifItem = {
        id: `test-${Date.now()}`, type, category: 'Test',
        title, body: msg,
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) + ' · Now',
        read: false,
      };
      setNotifs(prev => [testItem, ...prev]);
      setPanelOpen(true);
      setTimeout(() => setNotifs(prev => prev.filter(n => n.id !== testItem.id)), 8000);
    };
    window.addEventListener('qms-test-notif', handler);
    return () => window.removeEventListener('qms-test-notif', handler);
  }, []);

  // Close panels on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current  && !panelRef.current.contains(e.target as Node))  setPanelOpen(false);
      if (userRef.current   && !userRef.current.contains(e.target as Node))   setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const unread = notifs.filter(n => !n.read).length;
  const markAllRead = () => setNotifs(prev => prev.map(n => ({ ...n, read: true })));
  const clearAll    = () => setNotifs([]);
  const dismiss     = (id: string) => setNotifs(prev => prev.filter(n => n.id !== id));
  const markRead    = (id: string) => setNotifs(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));

  const displayName     = userProfile?.name     || 'System Admin';
  const displayRole     = userProfile?.role     || 'Admin';
  const displayInitials = userProfile?.initials || 'SA';

  return (
    <div
      id="topbar"
      className="h-[56px] border-b flex items-center px-4 md:px-6 gap-3 md:gap-4 flex-shrink-0 sticky top-0 z-40"
      style={{ background: 'var(--bg-1)', borderColor: 'var(--border)' }}
    >
      {/* Mobile hamburger */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-lg transition-all"
        style={{ color: 'var(--text-2)' }}
        aria-label="Toggle Sidebar"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Page Title */}
      <div className="flex-1 truncate">
        <h1 className="font-bold text-base truncate" id="page-title" style={{ color: 'var(--text-1)' }}>
          {title}
        </h1>
      </div>

      {/* Status Pills */}
      <div className="hidden xl:flex items-center gap-2">
        {[
          { icon: Globe,       label: 'ISO 9001:2015' },
          { icon: ShieldCheck, label: 'BSCI Active' },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold"
            style={{ background: 'var(--bg-2)', color: 'var(--text-2)' }}>
            <Icon className="w-3 h-3" style={{ color: 'var(--accent)' }} /> {label}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        {/* Search */}
        <div className="hidden md:flex items-center rounded-lg px-3 py-1.5 gap-2 border transition-all"
          style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}>
          <Search className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-3)' }} />
          <input
            type="text"
            placeholder="Search modules..."
            className="bg-transparent border-none outline-none text-sm w-32"
            style={{ color: 'var(--text-1)' }}
            onFocus={e => (e.currentTarget.parentElement!.style.borderColor = 'var(--accent)')}
            onBlur={e  => (e.currentTarget.parentElement!.style.borderColor = 'var(--border)')}
          />
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={onToggleDarkMode}
          className="p-2 rounded-lg transition-all"
          style={{ color: 'var(--text-3)' }}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
        </button>

        {/* ── Bell + Notification Panel ──────────────────────────── */}
        <div className="relative" ref={panelRef}>
          <button
            className="p-2 rounded-lg transition-all relative"
            style={{ color: 'var(--text-3)' }}
            aria-label="Notifications"
            onClick={() => { setPanelOpen(v => !v); refresh(); setUserMenuOpen(false); }}
          >
            <Bell className="w-[18px] h-[18px]" />
            {unread > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-red-500 text-white text-[9px] font-black rounded-full flex items-center justify-center border-2 leading-none"
                style={{ borderColor: 'var(--bg-1)' }}>
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Panel */}
          {panelOpen && (
            <div className="absolute right-0 top-full mt-2 w-[380px] max-w-[calc(100vw-1rem)] rounded-2xl shadow-2xl overflow-hidden z-50"
              style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-2)' }}>
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                  <span className="font-bold text-sm" style={{ color: 'var(--text-1)' }}>Notifications</span>
                  {unread > 0 && (
                    <span className="px-1.5 py-0.5 bg-red-500 text-white text-[10px] font-black rounded-full">{unread}</span>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {unread > 0 && (
                    <button onClick={markAllRead} className="p-1.5 rounded-lg transition-all hover:opacity-80"
                      style={{ color: 'var(--text-3)' }} title="Mark all read">
                      <CheckCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button onClick={clearAll} className="p-1.5 rounded-lg transition-all"
                    style={{ color: 'var(--text-3)' }} title="Clear all">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { setPanelOpen(false); onNavigate('settings'); }}
                    className="p-1.5 rounded-lg transition-all"
                    style={{ color: 'var(--text-3)' }} title="Notification settings">
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => setPanelOpen(false)} className="p-1.5 rounded-lg transition-all"
                    style={{ color: 'var(--text-3)' }}>
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* List */}
              <div className="max-h-[420px] overflow-y-auto divide-y custom-scrollbar"
                style={{ borderColor: 'var(--border)' }}>
                {notifs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <CheckCircle2 className="w-10 h-10 text-green-500/40" />
                    <p className="text-sm font-medium" style={{ color: 'var(--text-3)' }}>All clear — no new alerts</p>
                  </div>
                ) : notifs.map(n => (
                  <div
                    key={n.id}
                    className="flex items-start gap-3 px-4 py-3.5 transition-all cursor-pointer group"
                    style={{ background: n.read ? 'var(--bg-1)' : 'rgba(var(--accent-rgb, 37,99,235),0.04)' }}
                    onClick={() => markRead(n.id)}
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg flex-shrink-0 ${colorBadge[n.type]}`}>
                      <TypeIcon type={n.type} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className={`text-[9px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${colorBadge[n.type]}`}>
                          {n.category}
                        </span>
                        {!n.read && <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'var(--accent)' }} />}
                      </div>
                      <p className="text-xs font-bold leading-tight" style={{ color: 'var(--text-1)' }}>{n.title}</p>
                      <p className="text-[11px] mt-0.5 leading-snug line-clamp-2" style={{ color: 'var(--text-3)' }}>{n.body}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Clock className="w-3 h-3" style={{ color: 'var(--text-3)' }} />
                        <span className="text-[10px]" style={{ color: 'var(--text-3)' }}>{n.time}</span>
                      </div>
                    </div>
                    <button
                      onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded-lg transition-all flex-shrink-0 hover:text-red-500"
                      style={{ color: 'var(--text-3)' }} title="Dismiss"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="px-4 py-2.5 border-t flex items-center justify-between"
                style={{ borderColor: 'var(--border)', background: 'var(--bg-2)' }}>
                <span className="text-[11px] font-medium" style={{ color: 'var(--text-3)' }}>
                  {notifs.length} notification{notifs.length !== 1 ? 's' : ''}
                </span>
                <button
                  onClick={() => { setPanelOpen(false); onNavigate('certification'); }}
                  className="flex items-center gap-1 text-[11px] font-bold hover:underline"
                  style={{ color: 'var(--accent)' }}
                >
                  <Award className="w-3 h-3" /> View Certifications <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="h-6 w-px mx-1" style={{ background: 'var(--border)' }} />

        {/* ── User Menu ─────────────────────────────────────────────── */}
        <div className="relative" ref={userRef}>
          <button
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl transition-all hover:opacity-80"
            style={{ background: 'transparent' }}
            aria-label="User menu"
            onClick={() => { setUserMenuOpen(v => !v); setPanelOpen(false); }}
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-black text-[11px] text-white"
              style={{ background: avatarUrl ? 'transparent' : 'var(--accent)', flexShrink: 0 }}>
              {avatarUrl && avatarUrl.trim() !== '' ? (
                <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
              ) : displayInitials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold leading-none" style={{ color: 'var(--text-1)' }}>{displayName}</p>
              <p className="text-[10px] leading-none mt-1" style={{ color: 'var(--text-3)' }}>{displayRole}</p>
            </div>
          </button>

          {/* Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl shadow-2xl overflow-hidden z-50"
              style={{ background: 'var(--bg-1)', border: '1px solid var(--border)' }}>
              {/* User info */}
              <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
                <p className="text-xs font-bold" style={{ color: 'var(--text-1)' }}>{displayName}</p>
                <p className="text-[11px]" style={{ color: 'var(--text-3)' }}>{userProfile?.email || 'admin@qmserp.com'}</p>
              </div>
              {/* Menu items */}
              {[
                { icon: User,     label: 'My Profile',  page: 'profile'  },
                { icon: Settings, label: 'Settings',    page: 'settings' },
              ].map(({ icon: Icon, label, page }) => (
                <button
                  key={page}
                  onClick={() => { setUserMenuOpen(false); onNavigate(page); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-all hover:opacity-80 text-left"
                  style={{ color: 'var(--text-2)' }}
                >
                  <Icon className="w-4 h-4" style={{ color: 'var(--text-3)' }} /> {label}
                </button>
              ))}
              <div className="border-t" style={{ borderColor: 'var(--border)' }} />
              {onLogout && (
                <button
                  onClick={() => { setUserMenuOpen(false); onLogout(); }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold transition-all text-left"
                  style={{ color: '#ef4444' }}
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
