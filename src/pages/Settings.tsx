import React, { useState, useEffect, useRef } from 'react';
import {
  Settings as SettingsIcon, Palette, Monitor, Sun, Moon, Grid3X3, Circle, Square,
  Minus, X, Check, RotateCcw, Eye, Layout, Layers, Type, BellRing, Link2, Database as DbIcon, ShieldCheck, Mail, Smartphone,
  Save, RefreshCw, Archive, Clock, Key, Shield, UserCheck, Lock, CloudCog, HardDriveDownload, Download,
  Building2, MapPin, Camera, Trash2, FileText, Sliders, Droplets, CheckCircle2, Zap, AlignLeft, AlignCenter
} from 'lucide-react';
import {
  loadOrgSettings, saveOrgSettings, OrgSettings,
  loadPdfSettings, savePdfSettings,
  PdfExportSettings, PdfHeaderStyle, PdfColorAccent, PdfFontStyle, PdfModuleId,
  ACCENT_PALETTES, HEADER_STYLE_META, MODULE_META, DEFAULT_PDF_SETTINGS
} from '../utils/pdfHeader';
import { exportFullBackup, importRestoreBackup, downloadBackupFile, BackupData } from '../utils/backupRestore';
import { jsPDF } from 'jspdf';
import {
  AppearanceSettings as AppSettings,
  COLOR_PRESETS, BG_PATTERNS, BG_IMAGES, RADIUS_OPTIONS, DENSITY_OPTIONS,
  FONT_OPTIONS, CARD_STYLES,
  DEFAULT_APPEARANCE, loadAppearance, saveAppearance, applyAppearance,
  saveLocalBg, loadLocalBg, clearLocalBg,
} from '../config/themeEngine';

interface SettingsProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onAppearanceChange?: (settings: AppSettings) => void;
}

interface GlobalSettings {
  general: {
    factoryName: string;
    currency: string;
    timezone: string;
    dateFormat: string;
  };
  notifications: {
    inAppAlerts: boolean;
    emailAlerts: boolean;
    smsAlerts: boolean;
    workflowAlerts: boolean;
    actionItemAlerts: boolean;
    kpiAlerts: boolean;
    reminderFrequency: string;
  };
  integrations: {
    erpLinked: boolean;
    hrLinked: boolean;
    portalsActive: boolean;
    apiKeyHidden: boolean;
    apiKey: string;
    syncSchedule: string;
  };
  database: {
    backupSchedule: string;
    retentionPolicy: string;
  };
  security: {
    strictPassword: boolean;
    twoFactorAuth: boolean;
    sessionTimeout: string;
  };
}

const defaultAppSettings: GlobalSettings = {
  general: { factoryName: "Fahim QMS Factory", currency: "BDT - Bangladeshi Taka", timezone: "Asia/Dhaka (UTC+6)", dateFormat: "DD/MM/YYYY" },
  notifications: { inAppAlerts: true, emailAlerts: true, smsAlerts: false, workflowAlerts: true, actionItemAlerts: true, kpiAlerts: false, reminderFrequency: "Every 24 Hours" },
  integrations: { erpLinked: true, hrLinked: false, portalsActive: true, apiKeyHidden: true, apiKey: "sk-qms-live-1a2b3c4d5e6f", syncSchedule: "Every Hour" },
  database: { backupSchedule: "Daily at 02:00 AM", retentionPolicy: "Archive after 5 Years (ISO compliance)" },
  security: { strictPassword: true, twoFactorAuth: false, sessionTimeout: "30 Minutes Idle (Recommended)" }
};

// â”€â”€â”€ PDF Header Style Preview (CSS-rendered) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function PdfHeaderPreview({ style, accent, font, showLogo, name, address }: {
  style: PdfHeaderStyle; accent: PdfColorAccent; font: string; showLogo: boolean; name: string; address: string;
}) {
  const p = ACCENT_PALETTES[accent];
  const toCSS = (rgb: [number,number,number]) => `rgb(${rgb.join(',')})`;
  const initials = (name || 'QMS').split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();

  const LogoBlock = () => (
    <div style={{ width: 34, height: 34, minWidth: 34, background: toCSS(p.dark), borderRadius: 4, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>{initials}</span>
    </div>
  );

  if (style === 'dark_banner') return (
    <div style={{ background: 'rgb(15,23,42)', display:'flex', alignItems:'center', padding: '8px 10px', gap: 8, position: 'relative', overflow: 'hidden', fontFamily: font }}>
      <div style={{ position:'absolute', right:0, top:0, bottom:0, width: 58, background: toCSS(p.dark) }} />
      {showLogo && <LogoBlock />}
      <div style={{ flex:1, overflow:'hidden' }}>
        <div style={{ color:'#fff', fontSize:10, fontWeight:700 }}>{name || 'Organization Name'}</div>
        <div style={{ color:'#94a3b8', fontSize:7 }}>{address || 'Factory Address'}</div>
      </div>
      <div style={{ zIndex:1, textAlign:'right', minWidth:70 }}>
        <div style={{ color:'#fff', fontSize:8, fontWeight:700, lineHeight:1.3 }}>REPORT TITLE</div>
        <div style={{ color:'#94a3b8', fontSize:7, marginTop:2 }}>Subtitle info here</div>
        <div style={{ color:'#94a3b8', fontSize:6.5, marginTop:4 }}>Generated: {new Date().toLocaleDateString()}</div>
      </div>
    </div>
  );

  if (style === 'modern_split') return (
    <div style={{ display:'flex', overflow:'hidden', fontFamily: font }}>
      <div style={{ background: toCSS(p.dark), padding:'8px 6px', width: 54, minWidth:54, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
        {showLogo && <LogoBlock />}
      </div>
      <div style={{ flex:1, background:'#fff', padding:'4px 10px', borderTop: `3px solid ${toCSS(p.mid)}` }}>
        <div style={{ color:'rgb(15,23,42)', fontSize:10, fontWeight:700 }}>{name || 'Organization Name'}</div>
        <div style={{ color:'#64748b', fontSize:7 }}>{address || 'Address'}</div>
        <div style={{ textAlign:'right', marginTop:2 }}>
          <span style={{ color: toCSS(p.dark), fontSize:8.5, fontWeight:700 }}>REPORT TITLE</span>
        </div>
      </div>
    </div>
  );

  if (style === 'minimal_line') return (
    <div style={{ background:'#fff', padding:'8px 10px', fontFamily: font, borderBottom: `2px solid ${toCSS(p.mid)}` }}>
      <div style={{ display:'flex', alignItems:'center', gap: 8 }}>
        {showLogo && <LogoBlock />}
        <div style={{ flex:1 }}>
          <div style={{ color:'rgb(15,23,42)', fontSize:10, fontWeight:700 }}>{name || 'Organization Name'}</div>
          <div style={{ color:'#94a3b8', fontSize:7 }}>{address || 'Address'}</div>
        </div>
        <div style={{ textAlign:'right' }}>
          <div style={{ color: toCSS(p.dark), fontSize:9, fontWeight:700 }}>REPORT TITLE</div>
          <div style={{ color:'#999', fontSize:7 }}>{new Date().toLocaleDateString()}</div>
        </div>
      </div>
    </div>
  );

  if (style === 'corporate_box') return (
    <div style={{ fontFamily: font, border: `1px solid ${toCSS(p.light)}`, overflow:'hidden' }}>
      <div style={{ height:4, background: toCSS(p.mid) }} />
      <div style={{ background: toCSS(p.light), padding:'6px 10px', display:'flex', gap:10, alignItems:'center' }}>
        {showLogo && <div style={{ background: toCSS(p.dark), padding:3, borderRadius:2 }}><LogoBlock /></div>}
        <div style={{ flex:1 }}>
          <div style={{ color: toCSS(p.dark), fontSize:10, fontWeight:700 }}>{name || 'Org Name'}</div>
          <div style={{ color:'#64748b', fontSize:7 }}>{address || 'Address'}</div>
        </div>
        <div style={{ width:1, background: toCSS(p.mid), alignSelf:'stretch' }} />
        <div style={{ flex:1, paddingLeft:8 }}>
          <div style={{ color: toCSS(p.dark), fontSize:10, fontWeight:700 }}>REPORT TITLE</div>
          <div style={{ color:'#64748b', fontSize:7 }}>Subtitle / Reference</div>
        </div>
      </div>
    </div>
  );

  // gradient_wave
  const stops = Array.from({length:6},(_,i)=>{
    const t = i/5;
    const r = Math.round(p.dark[0]+(p.mid[0]-p.dark[0])*t);
    const g = Math.round(p.dark[1]+(p.mid[1]-p.dark[1])*t);
    const b = Math.round(p.dark[2]+(p.mid[2]-p.dark[2])*t);
    return `rgb(${r},${g},${b})`;
  });
  return (
    <div style={{ background:`linear-gradient(135deg,${stops.join(',')})`, padding:'8px 10px', display:'flex', alignItems:'center', gap:8, fontFamily: font }}>
      {showLogo && <LogoBlock />}
      <div style={{ flex:1 }}>
        <div style={{ color:'#fff', fontSize:10, fontWeight:700 }}>{name || 'Organization Name'}</div>
        <div style={{ color:'rgba(200,220,255,0.8)', fontSize:7 }}>{address || 'Address'}</div>
      </div>
      <div style={{ background:'rgba(255,255,255,0.95)', borderRadius:6, padding:'4px 10px', textAlign:'center' }}>
        <div style={{ color: toCSS(p.dark), fontSize:8, fontWeight:700 }}>REPORT TITLE</div>
        <div style={{ color: toCSS(p.mid), fontSize:6.5 }}>Subtitle</div>
      </div>
    </div>
  );
}

export function Settings({ isDarkMode, onToggleDarkMode, onAppearanceChange }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'organization' | 'pdf' | 'appearance' | 'notifications' | 'integrations' | 'database' | 'security'>('appearance');
  const [appearance, setAppearance] = useState<AppSettings>(loadAppearance);
  const [org, setOrg] = useState<OrgSettings>(loadOrgSettings);
  const [orgSaved, setOrgSaved] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const restoreInputRef = useRef<HTMLInputElement>(null);
  const [pdfSettings, setPdfSettings] = useState<PdfExportSettings>(loadPdfSettings);
  const [pdfSaved, setPdfSaved] = useState(false);
  const [showSaved, setShowSaved] = useState<{ [key: string]: boolean }>({});
  
  const [settings, setSettings] = useState<GlobalSettings>(() => {
    try {
      const saved = localStorage.getItem('companySettings');
      if (saved) return JSON.parse(saved);
    } catch (err) { console.error("Error loading settings", err); }
    return defaultAppSettings;
  });

  // Sync dark mode
  useEffect(() => {
    setAppearance(prev => ({ ...prev, themeMode: isDarkMode ? 'dark' : 'light' }));
  }, [isDarkMode]);

  const updateAppearance = (changes: Partial<AppSettings>) => {
    const updated = { ...appearance, ...changes };
    setAppearance(updated);
    saveAppearance(updated);
    applyAppearance(updated);

    if (changes.themeMode && onAppearanceChange) onAppearanceChange(updated);
    if (changes.themeMode === 'dark' && !isDarkMode) onToggleDarkMode();
    if (changes.themeMode === 'light' && isDarkMode) onToggleDarkMode();
  };

  const resetAppearance = () => {
    const defaults = { ...DEFAULT_APPEARANCE, themeMode: isDarkMode ? 'dark' as const : 'light' as const };
    setAppearance(defaults);
    saveAppearance(defaults);
    applyAppearance(defaults);
  };

  const handleSaveModule = (module: keyof GlobalSettings) => {
    localStorage.setItem('companySettings', JSON.stringify(settings));
    window.dispatchEvent(new Event('storage'));
    
    setShowSaved(prev => ({ ...prev, [module]: true }));
    setTimeout(() => { setShowSaved(prev => ({ ...prev, [module]: false })); }, 2000);
  };

  const updateSetting = <T extends keyof GlobalSettings>(module: T, key: keyof GlobalSettings[T], value: any) => {
    setSettings(prev => ({
      ...prev,
      [module]: {
        ...prev[module],
        [key]: value
      }
    }));
  };

  const handleGenerateKey = () => {
    const newKey = "sk-qms-" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    updateSetting('integrations', 'apiKey', newKey);
  };

  const handleManualBackup = async () => {
    try {
      const data = await exportFullBackup();
      downloadBackupFile(data);
    } catch (err) {
      console.error("Backup failed", err);
      alert("System backup failed. Please check console for details.");
    }
  };

  const handleRestoreClick = () => {
    restoreInputRef.current?.click();
  };

  const handleRestoreFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!window.confirm("Restoring from a snapshot will OVERWRITE all current QMS data. Do you want to proceed?")) {
      e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const text = ev.target?.result as string;
        const data: BackupData = JSON.parse(text);
        
        await importRestoreBackup(data);
        
        alert("System restored successfully! The application will now reload.");
        window.location.reload();
      } catch (err) {
        console.error("Restore failed", err);
        alert("Failed to restore backup. Invalid file format.");
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset for next time
  };

  const handleWipeDB = () => {
    if (window.confirm("CRITICAL WARNING: Are you sure you want to completely wipe the Database? This will clear all QMS data.")) {
      const prmpt = window.prompt("Type 'WIPE' to confirm.");
      if (prmpt === 'WIPE') {
        localStorage.clear();
        alert("Database wiped. Please refresh the page.");
        window.location.reload();
      }
    }
  };

  const dlSecurityLogs = () => {
     const doc = new jsPDF();
     doc.setFontSize(14);
     doc.text("Fahim QMS - Security Audit Logs", 14, 20);
     doc.setFontSize(10);
     doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 28);
     doc.text("--------------------------------------------------", 14, 32);
     doc.text("1. [LOGIN SUCCESS] Admin user from 192.168.1.5", 14, 40);
     doc.text("2. [SETTING CHANGE] Database backup schedule modified", 14, 48);
     doc.text("3. [API ACCESS] External portal token successfully authenticated", 14, 56);
     doc.text("4. [LOGIN FAILED] Unknown user from 10.0.0.9", 14, 64);
     doc.save("security_logs.pdf");
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) setOrg(prev => ({ ...prev, logo: ev.target!.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleSaveOrg = () => {
    saveOrgSettings(org);
    setOrgSaved(true);
    setTimeout(() => setOrgSaved(false), 2500);
  };

  const handleSavePdf = () => {
    savePdfSettings(pdfSettings);
    setPdfSaved(true);
    setTimeout(() => setPdfSaved(false), 2500);
  };

  const updatePdf = (changes: Partial<PdfExportSettings>) => {
    setPdfSettings(prev => ({ ...prev, ...changes }));
  };

  const tabs = [
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'general', label: 'General', icon: SettingsIcon },
    { id: 'organization', label: 'Organization', icon: Building2 },
    { id: 'pdf', label: 'PDF Export', icon: FileText },
    { id: 'notifications', label: 'Notifications & Alerts', icon: BellRing },
    { id: 'integrations', label: 'Integrations', icon: Link2 },
    { id: 'database', label: 'Database & Backup', icon: DbIcon },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ] as const;

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-full pb-20">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-text-1 flex items-center gap-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <SettingsIcon className="w-5 h-5 text-accent" />
          </div>
          System Settings
        </h1>
        <p className="text-sm text-text-3 mt-1 ml-13">Configure your enterprise QMS preferences</p>
      </div>

      
      <div className="flex flex-wrap gap-1 mb-6 bg-bg-2 rounded-lg p-1 w-fit">
        {tabs.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-[13px] font-bold transition-all ${
                activeTab === t.id ? 'bg-bg-1 text-accent shadow-sm' : 'text-text-3 hover:text-text-1'
              }`}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* -- GENERAL TAB -- */}
      {activeTab === 'general' && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-bg-1 border border-border-main rounded-xl p-6">
            <h2 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-4">Factory & Regional Settings</h2>
            <div className="form-group mb-4">
              <label className="text-xs font-bold text-text-3 uppercase tracking-wide block mb-2">Factory Name</label>
              <input type="text" className="w-full bg-bg-0 border border-border-main rounded-lg px-4 py-2.5 text-sm text-text-1 font-semibold outline-none focus:border-accent"
                value={settings.general.factoryName} onChange={(e) => updateSetting('general', 'factoryName', e.target.value)} />
            </div>
            <div className="form-group mb-4">
              <label className="text-xs font-bold text-text-3 uppercase tracking-wide block mb-2">Default Currency</label>
              <select className="w-full bg-bg-0 border border-border-main rounded-lg px-4 py-2.5 text-sm text-text-1 font-semibold outline-none focus:border-accent"
                value={settings.general.currency} onChange={(e) => updateSetting('general', 'currency', e.target.value)}>
                <option>BDT - Bangladeshi Taka</option><option>USD - US Dollar</option><option>EUR - Euro</option><option>GBP - British Pound</option>
              </select>
            </div>
            <div className="form-group mb-4">
              <label className="text-xs font-bold text-text-3 uppercase tracking-wide block mb-2">Timezone</label>
              <select className="w-full bg-bg-0 border border-border-main rounded-lg px-4 py-2.5 text-sm text-text-1 font-semibold outline-none focus:border-accent"
                value={settings.general.timezone} onChange={(e) => updateSetting('general', 'timezone', e.target.value)}>
                <option>Asia/Dhaka (UTC+6)</option><option>UTC</option><option>America/New_York (EST)</option><option>Europe/London (GMT)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="text-xs font-bold text-text-3 uppercase tracking-wide block mb-2">Date Format</label>
              <select className="w-full bg-bg-0 border border-border-main rounded-lg px-4 py-2.5 text-sm text-text-1 font-semibold outline-none focus:border-accent"
                value={settings.general.dateFormat} onChange={(e) => updateSetting('general', 'dateFormat', e.target.value)}>
                <option>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => handleSaveModule('general')} className="px-5 py-2.5 bg-accent text-white rounded-lg font-bold text-sm hover:opacity-90 flex items-center gap-2"><Save className="w-4 h-4"/> Apply Settings</button>
            {showSaved['general'] && <span className="text-sm text-green-main font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Saved</span>}
          </div>
        </div>
      )}

      
      {/* â”€â”€ ORGANIZATION TAB â”€â”€ */}
      {activeTab === 'organization' && (
        <div className="space-y-6 max-w-2xl">
          <div className="bg-bg-1 border border-border-main rounded-xl p-6">
            <h2 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-4 flex items-center gap-2"><Building2 className="w-4 h-4" /> Global Organization Profile</h2>
            <div className="form-group mb-4">
              <label className="text-xs font-bold text-text-3 uppercase tracking-wide block mb-2">Organization Name</label>
              <input type="text" className="w-full bg-bg-0 border border-border-main rounded-lg px-4 py-2.5 text-sm text-text-1 font-semibold outline-none focus:border-accent"
                value={org.name} onChange={(e) => setOrg({ ...org, name: e.target.value })} />
            </div>
            <div className="form-group mb-4">
              <label className="text-xs font-bold text-text-3 uppercase tracking-wide block mb-2">Primary Address</label>
              <textarea className="w-full bg-bg-0 border border-border-main rounded-lg px-4 py-2.5 text-sm text-text-1 font-semibold outline-none focus:border-accent"
                value={org.address} onChange={(e) => setOrg({ ...org, address: e.target.value })} rows={3} />
            </div>
            <div className="form-group mb-4">
               <label className="text-xs font-bold text-text-3 uppercase tracking-wide block mb-2">Company Logo</label>
               <div className="flex gap-4 items-center">
                 <div className="w-16 h-16 bg-bg-2 border border-border-main rounded-lg flex items-center justify-center overflow-hidden">
                   {org.logo ? <img src={org.logo} alt="Logo" className="max-w-full max-h-full object-contain" /> : <Camera className="w-6 h-6 text-text-3" />}
                 </div>
                 <div className="flex-1">
                   <input type="file" accept="image/*" className="hidden" ref={logoInputRef} onChange={handleLogoUpload} />
                   <button onClick={() => logoInputRef.current?.click()} className="px-3 py-1.5 bg-bg-2 border border-border-main rounded text-xs font-bold hover:border-accent mb-2">Upload Image</button>
                   <p className="text-[10px] text-text-3">Square ratio recommended. PNG or JPG.</p>
                 </div>
               </div>
             </div>
           </div>
          <div className="flex items-center gap-3">
             <button onClick={handleSaveOrg} className="px-5 py-2.5 bg-accent text-white rounded-lg font-bold text-sm hover:opacity-90 flex items-center gap-2"><Save className="w-4 h-4"/> Save Profile</button>
             {orgSaved && <span className="text-sm text-green-main font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Saved</span>}
          </div>
        </div>
      )}

      {/* ── PDF EXPORT SETTINGS TAB ── */}
      {activeTab === 'pdf' && (
        <div className="space-y-6 max-w-4xl">
           <div className="bg-bg-1 border border-border-main rounded-xl p-6">
              <h2 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-4 flex items-center gap-2"><FileText className="w-4 h-4" /> Live PDF Header Preview</h2>
              <div className="bg-white p-6 rounded shadow-sm border border-slate-200" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                 <div className="bg-white shadow max-w-[600px] mx-auto min-h-[100px] relative overflow-hidden" style={{ width: '100%' }}>
                    {pdfSettings.globalEnableHeader && (
                      <PdfHeaderPreview style={pdfSettings.headerStyle} accent={pdfSettings.colorAccent} font={pdfSettings.fontStyle} showLogo={pdfSettings.includeLogo} name={org.name} address={org.address} />
                    )}
                    {!pdfSettings.globalEnableHeader && (
                      <div className="p-4 text-center text-slate-400 text-xs font-bold uppercase tracking-widest border-b border-dashed border-slate-200">Header Disabled Globally</div>
                    )}
                    {pdfSettings.watermarkText && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.09] select-none">
                        <span className="text-4xl font-black text-slate-800 -rotate-45 whitespace-nowrap">{pdfSettings.watermarkText}</span>
                      </div>
                    )}
                    {/* Footer preview strip */}
                    <div className="mt-8 border-t border-slate-200 pt-1.5 px-2 flex items-center justify-between">
                      <span className="text-[9px] text-slate-400">{org.name || 'Organization Name'}</span>
                      {pdfSettings.showPageNumber && <span className="text-[9px] text-slate-400">Page 1 of N</span>}
                      {pdfSettings.showDate && <span className="text-[9px] text-slate-400">{new Date().toLocaleDateString('en-GB')}</span>}
                    </div>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ─── LEFT COLUMN ─── */}
              <div className="space-y-6">
                 {/* Global overrides card */}
                 <div className="bg-bg-1 border border-border-main rounded-xl p-6">
                    <h3 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-4">Global Switches</h3>
                    <div className="space-y-0">
                      {[
                        { key: 'globalEnableHeader', label: 'Enable Custom Headers', desc: 'If off, all PDFs use plain unbranded headers' },
                        { key: 'globalEnableFooter', label: 'Enable Footer Bar',     desc: 'Master off — completely removes footer from all PDFs' },
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between py-3 border-b border-border-main last:border-0">
                          <div>
                            <div className="text-sm font-semibold text-text-1">{item.label}</div>
                            <div className="text-[10px] text-text-3 mt-0.5">{item.desc}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                            <input type="checkbox"
                              checked={!!(pdfSettings as any)[item.key]}
                              onChange={e => updatePdf({ [item.key]: e.target.checked })}
                              className="sr-only peer" />
                            <div className="w-9 h-5 bg-bg-3 peer-focus:ring-2 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                          </label>
                        </div>
                      ))}
                    </div>
                 </div>

                 {/* Header content options */}
                 <div className="bg-bg-1 border border-border-main rounded-xl p-6 transition-opacity" style={{ opacity: pdfSettings.globalEnableHeader ? 1 : 0.45 }}>
                    <h3 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-3">Header Content</h3>
                    <div className="space-y-0">
                      {[
                        { key: 'includeLogo',     label: 'Show Logo',         desc: 'Include company logo in PDF header' },
                        { key: 'showAddress',     label: 'Show Address',      desc: 'Display org address in header' },
                        { key: 'showDate',        label: 'Show Date',         desc: 'Print generation date in header & footer' },
                        { key: 'showHeaderTitle', label: 'Show Report Title', desc: 'Show the document title in the header' },
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between py-2.5 border-b border-border-main last:border-0">
                          <div>
                            <div className="text-sm font-semibold text-text-1">{item.label}</div>
                            <div className="text-[10px] text-text-3 mt-0.5">{item.desc}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                            <input type="checkbox" disabled={!pdfSettings.globalEnableHeader}
                              checked={!!(pdfSettings as any)[item.key]}
                              onChange={e => updatePdf({ [item.key]: e.target.checked })}
                              className="sr-only peer" />
                            <div className="w-9 h-5 bg-bg-3 peer-focus:ring-2 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent peer-disabled:opacity-40"></div>
                          </label>
                        </div>
                      ))}
                      {pdfSettings.showHeaderTitle && pdfSettings.globalEnableHeader && (
                        <div className="pt-2.5">
                          <label className="text-[10px] font-bold text-text-3 uppercase tracking-wide block mb-1">Custom Title Override</label>
                          <input className="w-full bg-bg-2 border border-border-main rounded-lg px-3 py-2 text-xs text-text-1 outline-none focus:border-accent"
                            placeholder="Leave blank to use the auto report title"
                            value={pdfSettings.globalHeaderTitle}
                            onChange={e => updatePdf({ globalHeaderTitle: e.target.value })} />
                        </div>
                      )}
                    </div>
                 </div>

                 {/* ═══ FOOTER OPTIONS ═══ */}
                 <div className="bg-bg-1 border border-border-main rounded-xl p-6">
                    <h3 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-3">Footer Content</h3>
                    <div className={`space-y-0 transition-opacity ${!(pdfSettings as any).globalEnableFooter ? 'opacity-40 pointer-events-none' : ''}`}>
                      {[
                        { key: 'showPageNumber',   label: 'Show Page Numbers',       desc: 'Prints "Page X of N" centred at the bottom' },
                        { key: 'showFooterOrgName',label: 'Show Org Name in Footer', desc: 'Org name at the bottom-left of every page' },
                        { key: 'showDate',         label: 'Show Date in Footer',     desc: 'Export date at the bottom-right of every page' },
                      ].map(item => (
                        <div key={item.key} className="flex items-center justify-between py-2.5 border-b border-border-main last:border-0">
                          <div>
                            <div className="text-sm font-semibold text-text-1">{item.label}</div>
                            <div className="text-[10px] text-text-3 mt-0.5">{item.desc}</div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                            <input type="checkbox"
                              checked={(pdfSettings as any)[item.key] ?? true}
                              onChange={e => updatePdf({ [item.key]: e.target.checked })}
                              className="sr-only peer" />
                            <div className="w-9 h-5 bg-bg-3 peer-focus:ring-2 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                          </label>
                        </div>
                      ))}
                      <div className="pt-3">
                        <label className="text-[10px] font-bold text-text-3 uppercase tracking-wide block mb-1.5">Watermark Text</label>
                        <input className="w-full bg-bg-2 border border-border-main rounded-lg px-3 py-2 text-xs text-text-1 outline-none focus:border-accent"
                          placeholder="e.g. CONFIDENTIAL, DRAFT… (blank = none)"
                          value={pdfSettings.watermarkText}
                          onChange={e => updatePdf({ watermarkText: e.target.value })} />
                        <p className="text-[10px] text-text-3 mt-1">Appears diagonally at low opacity on every exported page.</p>
                      </div>
                    </div>
                 </div>

                 {/* Header style theme */}
                 <div className="bg-bg-1 border border-border-main rounded-xl p-6 transition-opacity" style={{ opacity: pdfSettings.globalEnableHeader ? 1 : 0.45 }}>
                    <h3 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-4">Header Style Theme</h3>
                    <div className="space-y-2">
                      {(Object.keys(HEADER_STYLE_META) as PdfHeaderStyle[]).map(id => {
                        const info = HEADER_STYLE_META[id];
                        return (
                          <button key={id} onClick={() => updatePdf({ headerStyle: id })} disabled={!pdfSettings.globalEnableHeader}
                            className={`w-full flex items-center justify-between p-3 rounded-lg border transition-all ${pdfSettings.headerStyle === id ? 'border-accent bg-accent/5' : 'border-border-main hover:bg-bg-2 disabled:opacity-40'}`}>
                            <div className="text-left"><div className="text-xs font-bold text-text-1">{info.label}</div><div className="text-[10px] text-text-3">{info.desc}</div></div>
                            {pdfSettings.headerStyle === id && <CheckCircle2 className="w-4 h-4 text-accent" />}
                          </button>
                        );
                      })}
                    </div>
                 </div>
              </div>

              {/* ─── RIGHT COLUMN ─── */}
              <div className="space-y-6 transition-opacity" style={{ opacity: pdfSettings.globalEnableHeader ? 1 : 0.45 }}>
                 {/* Colors & fonts */}
                 <div className="bg-bg-1 border border-border-main rounded-xl p-6">
                    <h3 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-4">Color Palette & Fonts</h3>
                    <label className="text-[11px] font-bold text-text-3 uppercase block mb-2">Accent Color</label>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {Object.entries(ACCENT_PALETTES).map(([color, palette]) => (
                        <button key={color} disabled={!pdfSettings.globalEnableHeader}
                          onClick={() => updatePdf({ colorAccent: color as PdfColorAccent })}
                          className="flex flex-col items-center gap-1" title={palette.label}>
                          <span className={`w-8 h-8 rounded-full border-2 transition-all block ${pdfSettings.colorAccent === color ? 'border-text-1 scale-110 shadow-md' : 'border-transparent hover:scale-105'}`}
                            style={{ backgroundColor: `rgb(${palette.mid.join(',')})` }} />
                          <span className="text-[8px] text-text-3 font-medium">{palette.label}</span>
                        </button>
                      ))}
                    </div>
                    <label className="text-[11px] font-bold text-text-3 uppercase block mb-2">Typography</label>
                    <select disabled={!pdfSettings.globalEnableHeader} className="w-full bg-bg-2 border border-border-main rounded px-3 py-2 text-xs font-semibold text-text-1" value={pdfSettings.fontStyle} onChange={e => updatePdf({ fontStyle: e.target.value as PdfFontStyle })}>
                       <option value="helvetica">Helvetica / Arial (Modern Clean)</option>
                       <option value="times">Times New Roman (Formal)</option>
                       <option value="courier">Courier (Monospace / Technical)</option>
                    </select>
                 </div>

                 {/* Module rendering targets */}
                 <div className="bg-bg-1 border border-border-main rounded-xl p-6">
                    <h3 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-2">Module Rendering Targets</h3>
                    <p className="text-[11px] text-text-3 mb-4">Choose which modules use the branded header & footer.</p>
                    <div className="grid grid-cols-2 gap-2">
                       {(Object.keys(MODULE_META) as PdfModuleId[]).map(id => {
                         const info = MODULE_META[id];
                         const isActive = pdfSettings.enabledModules.includes(id);
                         const toggle = () => {
                           const mod = [...pdfSettings.enabledModules];
                           const idx = mod.indexOf(id);
                           if (idx >= 0) mod.splice(idx, 1);
                           else mod.push(id);
                           updatePdf({ enabledModules: mod });
                         };
                         return (
                           <button key={id} disabled={!pdfSettings.globalEnableHeader} onClick={toggle}
                             className={`flex items-center gap-2 p-2.5 rounded-lg border text-left transition-all ${isActive ? 'border-accent bg-accent/5' : 'border-border-main hover:bg-bg-2 disabled:opacity-40'}`}>
                             <div className={`w-3.5 h-3.5 rounded flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-accent' : 'bg-bg-3'}`}>
                               {isActive && <Check className="w-2 h-2 text-white"/>}
                             </div>
                             <div>
                               <div className="text-[10px] font-bold text-text-1">{info.label}</div>
                               <div className="text-[9px] text-text-3">{info.icon}</div>
                             </div>
                           </button>
                         );
                       })}
                    </div>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border-main">
                      <button disabled={!pdfSettings.globalEnableHeader} onClick={() => updatePdf({ enabledModules: Object.keys(MODULE_META) as PdfModuleId[] })}
                        className="flex-1 py-1.5 text-[11px] font-bold border border-border-main rounded-lg hover:bg-accent/5 hover:border-accent hover:text-accent transition-all text-text-3 disabled:opacity-40">Enable All</button>
                      <button disabled={!pdfSettings.globalEnableHeader} onClick={() => updatePdf({ enabledModules: [] })}
                        className="flex-1 py-1.5 text-[11px] font-bold border border-border-main rounded-lg hover:bg-red-50 hover:border-red-300 hover:text-red-500 transition-all text-text-3 disabled:opacity-40">Disable All</button>
                    </div>
                 </div>
              </div>
           </div>

           
           <div className="flex items-center gap-3">
              <button onClick={handleSavePdf} className="px-5 py-2.5 bg-accent text-white rounded-lg font-bold text-sm hover:opacity-90 flex items-center gap-2"><Save className="w-4 h-4"/> Save PDF Config</button>
              {pdfSaved && <span className="text-sm text-green-main font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Configuration saved</span>}
           </div>
        </div>
      )}      {/* â•â•â• NOTIFICATIONS TAB â•â•â• */}
      {activeTab === 'notifications' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-bg-1 border border-border-main rounded-xl p-6">
            <h3 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-4 flex items-center gap-2"><Mail className="w-4 h-4"/> Delivery Channels</h3>
            {[
              { key: 'inAppAlerts', label: 'In-App Alerts', desc: 'Show toast notifications within the QMS application' },
              { key: 'emailAlerts', label: 'Email Notifications (SMTP)', desc: 'Send alerts to registered user email addresses' },
              { key: 'smsAlerts', label: 'SMS Notifications', desc: 'Send urgent CAPA/Risk alerts via SMS gateways' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between py-3 ${i > 0 ? 'border-t border-border-main' : ''}`}>
                <div>
                  <div className="text-sm font-bold text-text-1">{item.label}</div>
                  <div className="text-[11px] font-medium text-text-3 mt-0.5">{item.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean} onChange={(e) => updateSetting('notifications', item.key as any, e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-bg-3 peer-focus:ring-2 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="bg-bg-1 border border-border-main rounded-xl p-6">
            <h3 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-4">Module Specific Alerts</h3>
            {[
              { key: 'workflowAlerts', label: 'CAPA & Audit Workflows', desc: 'Notify assigned personnel instantly upon assignment' },
              { key: 'actionItemAlerts', label: 'Action Item Alerts', desc: 'Alerts for delegated task assignments and changes' },
              { key: 'kpiAlerts', label: 'KPI / Goal Milestone Passing', desc: 'Notify when factory KPIs hit targets' },
            ].map((item, i) => (
              <div key={i} className={`flex items-center justify-between py-3 ${i > 0 ? 'border-t border-border-main' : ''}`}>
                <div>
                  <div className="text-sm font-bold text-text-1">{item.label}</div>
                  <div className="text-[11px] font-medium text-text-3 mt-0.5">{item.desc}</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.notifications[item.key as keyof typeof settings.notifications] as boolean} onChange={(e) => updateSetting('notifications', item.key as any, e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-bg-3 peer-focus:ring-2 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            ))}
            <div className="form-group mt-4 pt-4 border-t border-border-main">
              <label className="text-[11px] font-bold text-text-3 uppercase tracking-wide block mb-2">Frequency of Reminders (Overdue Actions)</label>
              <select className="w-full bg-bg-0 border border-border-main rounded-lg px-4 py-2 text-sm font-semibold text-text-1 outline-none focus:border-accent" value={settings.notifications.reminderFrequency} onChange={e => updateSetting('notifications', 'reminderFrequency', e.target.value)}>
                <option>Every 24 Hours</option><option>Every 48 Hours</option><option>Weekly Digest</option><option>Never Remind</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => handleSaveModule('notifications')} className="px-5 py-2.5 bg-accent text-white rounded-lg font-bold text-sm hover:opacity-90 flex items-center gap-2"><Save className="w-4 h-4"/> Save Notification Preferences</button>
             {showSaved['notifications'] && <span className="text-sm text-green-main font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Preferences applied</span>}
          </div>
        </div>
      )}

      {/* â•â•â• INTEGRATIONS TAB â•â•â• */}
      {activeTab === 'integrations' && (
        <div className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-bg-1 border border-border-main rounded-xl p-5 hover:border-accent transition-colors">
               <div className="flex justify-between items-start mb-3">
                 <div className="flex gap-3 items-center">
                   <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Layers className="w-5 h-5"/></div>
                   <span className="font-bold text-text-1">Corporate ERP Link</span>
                 </div>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${settings.integrations.erpLinked ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{settings.integrations.erpLinked ? 'Connected' : 'Offline'}</span>
               </div>
               <p className="text-[11px] font-medium text-text-3 mb-4">Sync RM stock, PO details, and production schedules directly.</p>
               <button onClick={() => updateSetting('integrations', 'erpLinked', !settings.integrations.erpLinked)} className={`w-full py-1.5 border rounded text-xs font-bold ${settings.integrations.erpLinked ? 'border-border-main text-text-2 hover:bg-bg-2' : 'border-accent bg-accent/5 text-accent'}`}>{settings.integrations.erpLinked ? 'Disconnect System' : 'Connect ERP'}</button>
             </div>
             
             <div className="bg-bg-1 border border-border-main rounded-xl p-5 hover:border-accent transition-colors">
               <div className="flex justify-between items-start mb-3">
                 <div className="flex gap-3 items-center">
                   <div className="p-2 bg-amber-50 text-amber-600 rounded-lg"><UserCheck className="w-5 h-5"/></div>
                   <span className="font-bold text-text-1">HR & Payroll</span>
                 </div>
                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${settings.integrations.hrLinked ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{settings.integrations.hrLinked ? 'Active' : 'Unlinked'}</span>
               </div>
               <p className="text-[11px] font-medium text-text-3 mb-4">Auto-sync employee records for Audits and Training matrices.</p>
               <button onClick={() => updateSetting('integrations', 'hrLinked', !settings.integrations.hrLinked)} className={`w-full py-1.5 border rounded text-xs font-bold ${settings.integrations.hrLinked ? 'border-border-main text-text-2 hover:bg-bg-2' : 'border-accent bg-accent/5 text-accent'}`}>{settings.integrations.hrLinked ? 'Disconnect System' : 'Connect System'}</button>
             </div>
          </div>
          
          <div className="bg-bg-1 border border-border-main rounded-xl p-6">
             <h3 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-4">API Configurations & Webhooks</h3>
             <div className="space-y-4">
                <div>
                  <label className="text-[11px] font-bold text-text-3 uppercase block mb-1">Global API Access Token</label>
                  <div className="flex gap-2">
                    <input type={settings.integrations.apiKeyHidden ? "password" : "text"} value={settings.integrations.apiKey} readOnly className="flex-1 bg-bg-2 border border-border-main rounded px-3 py-1.5 text-xs text-text-2 font-mono"/>
                    <button onClick={() => updateSetting('integrations', 'apiKeyHidden', !settings.integrations.apiKeyHidden)} className="px-3 py-1 bg-bg-2 border border-border-main rounded text-xs font-bold hover:border-accent">{settings.integrations.apiKeyHidden ? 'Reveal' : 'Hide'}</button>
                    <button onClick={handleGenerateKey} className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-200 rounded text-xs font-bold hover:bg-blue-100 flex items-center gap-1"><RefreshCw className="w-3 h-3"/> Re-Roll</button>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-text-3 uppercase block mb-1">Import / Export Auto-Sync</label>
                  <select className="w-full bg-bg-2 border border-border-main rounded px-3 py-2 text-xs font-semibold text-text-1" value={settings.integrations.syncSchedule} onChange={e => updateSetting('integrations', 'syncSchedule', e.target.value)}>
                     <option>Every Hour</option><option>Midnight Daily (00:00)</option><option>Manual Trigger Only</option>
                  </select>
                </div>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={() => handleSaveModule('integrations')} className="px-5 py-2.5 bg-accent text-white rounded-lg font-bold text-sm hover:opacity-90 flex items-center gap-2"><Save className="w-4 h-4"/> Save Integrations</button>
             {showSaved['integrations'] && <span className="text-sm text-green-main font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Config applied</span>}
          </div>
        </div>
      )}

      {/* â•â•â• DATABASE TAB â•â•â• */}
      {activeTab === 'database' && (
        <div className="space-y-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-1 border border-border-main rounded-xl p-6">
               <h3 className="text-sm font-bold text-text-1 mb-1">Backup Scheduling</h3>
               <p className="text-[11px] font-medium text-text-3 mb-4">Automated routine backups of QMS data.</p>
               <select className="w-full bg-bg-2 border border-border-main rounded-lg px-3 py-2 text-sm font-semibold text-text-1 mb-4" value={settings.database.backupSchedule} onChange={e => updateSetting('database', 'backupSchedule', e.target.value)}>
                 <option>Daily at 02:00 AM</option><option>Weekly Server Snapshot</option><option>Monthly Archive Backup</option><option>Disabled (Not Recommended)</option>
               </select>
               <button onClick={handleManualBackup} className="w-full py-2 bg-accent text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:opacity-90"><HardDriveDownload className="w-4 h-4"/> Trigger Manual Backup Now</button>
            </div>
            <div className="bg-bg-1 border border-border-main rounded-xl p-6">
               <h3 className="text-sm font-bold text-text-1 mb-1">Data Archiving Policy</h3>
               <p className="text-[11px] font-medium text-text-3 mb-4">Retention duration before cloud archiving.</p>
               <select className="w-full bg-bg-2 border border-border-main rounded-lg px-3 py-2 text-sm font-semibold text-text-1 mb-4" value={settings.database.retentionPolicy} onChange={e => updateSetting('database', 'retentionPolicy', e.target.value)}>
                 <option>Archive after 1 Year</option><option>Archive after 3 Years</option><option>Archive after 5 Years (ISO compliance)</option><option>Keep active indefinitely</option>
               </select>
               <button className="w-full py-2 bg-bg-2 text-text-1 border border-border-main rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-bg-3 transition-colors"><Archive className="w-4 h-4"/> View Archived Records</button>
            </div>
          </div>
          
          <div className="bg-bg-1 border border-border-main rounded-xl p-6 flex flex-col items-start gap-2 border-red-200">
             <h3 className="text-sm font-bold text-red-600">Database Maintenance & Recovery</h3>
             <p className="text-xs font-medium text-text-3 mb-2">Perform hard resets, file purges, index rebuilds, or restore from a snapshot file.</p>
             <div className="flex gap-2 w-full">
               <button onClick={() => alert("Index rebuilt locally in 14ms.")} className="flex-1 py-1.5 border border-border-main bg-bg-2 hover:bg-bg-3 rounded text-xs font-bold text-text-1">Rebuild File Index</button>
               <input type="file" accept=".json" className="hidden" ref={restoreInputRef} onChange={handleRestoreFile} />
               <button onClick={handleRestoreClick} className="flex-1 py-1.5 border border-border-main bg-bg-2 hover:bg-bg-3 rounded text-xs font-bold text-text-1">Restore Snapshot</button>
               <button onClick={handleWipeDB} className="flex-1 py-1.5 border border-red-500 bg-red-50 hover:bg-red-100 rounded text-xs font-bold text-red-600">Factory Wipe DB</button>
             </div>
          </div>
          
          <div className="flex items-center gap-3">
             <button onClick={() => handleSaveModule('database')} className="px-5 py-2.5 bg-accent text-white rounded-lg font-bold text-sm hover:opacity-90 flex items-center gap-2"><Save className="w-4 h-4"/> Save Database Settings</button>
             {showSaved['database'] && <span className="text-sm text-green-main font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Policy active</span>}
          </div>
        </div>
      )}

      {/* â•â•â• SECURITY TAB â•â•â• */}
      {activeTab === 'security' && (
        <div className="space-y-6 max-w-3xl">
          <div className="bg-bg-1 border border-border-main rounded-xl p-6">
            <h3 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-4">Authentication Standard</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex gap-3">
                  <Key className="w-5 h-5 text-amber-500" />
                  <div>
                    <div className="text-sm font-bold text-text-1">Strict Password Policy</div>
                    <div className="text-[11px] font-medium text-text-3 mt-0.5">Enforce 12 chars, symbol, number, no repeats</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.security.strictPassword} onChange={e => updateSetting('security', 'strictPassword', e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-bg-3 peer-focus:ring-2 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
              <div className="flex items-center justify-between border-t border-border-main pt-4">
                <div className="flex gap-3">
                  <Smartphone className="w-5 h-5 text-blue-500" />
                  <div>
                    <div className="text-sm font-bold text-text-1">Two-Factor Authentication (2FA)</div>
                    <div className="text-[11px] font-medium text-text-3 mt-0.5">Require TOTP standard app auth for Manager roles</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={settings.security.twoFactorAuth} onChange={e => updateSetting('security', 'twoFactorAuth', e.target.checked)} className="sr-only peer" />
                  <div className="w-9 h-5 bg-bg-3 peer-focus:ring-2 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-bg-1 border border-border-main rounded-xl p-6">
               <h3 className="text-sm font-bold text-text-1 mb-1">Session Management</h3>
               <p className="text-[11px] font-medium text-text-3 mb-4">Timeout duration for idle users.</p>
               <select className="w-full bg-bg-2 border border-border-main rounded-lg px-3 py-2 text-sm font-semibold text-text-1 mb-4" value={settings.security.sessionTimeout} onChange={e => updateSetting('security', 'sessionTimeout', e.target.value)}>
                 <option>15 Minutes Idle</option><option>30 Minutes Idle (Recommended)</option><option>1 Hour Idle</option><option>Until Browser Closed</option>
               </select>
               <button onClick={() => alert("Command sent. 0 sessions were terminated.")} className="w-full py-1.5 border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold rounded-md hover:bg-amber-100">Force Global Session Logout</button>
            </div>
            <div className="bg-bg-1 border border-border-main rounded-xl p-6 flex flex-col">
               <h3 className="text-sm font-bold text-text-1 mb-1">Audit Trail & Logs</h3>
               <p className="text-[11px] font-medium text-text-3 mb-4 flex-1">Monitor logins, IP access, and configuration changes.</p>
               <div className="p-2 bg-bg-2 rounded border border-border-main mb-3">
                 <div className="text-[10px] text-accent font-mono font-bold truncate">Latest: 192.168.1.5 - Admin Login</div>
               </div>
               <button onClick={dlSecurityLogs} className="w-full py-2 bg-text-1 text-bg-1 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-text-2"><Download className="w-4 h-4"/> Download Security Logs</button>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button onClick={() => handleSaveModule('security')} className="px-5 py-2.5 bg-accent text-white rounded-lg font-bold text-sm hover:opacity-90 flex items-center gap-2"><Save className="w-4 h-4"/> Save Security Shield</button>
             {showSaved['security'] && <span className="text-sm text-green-main font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Shield updated</span>}
          </div>
        </div>
      )}

      {/* â•â•â• APPEARANCE TAB â•â•â• */}
      {activeTab === 'appearance' && (
        <div className="space-y-8 max-w-5xl">

          {/* â”€â”€ THEME MODE â”€â”€ */}
          <div className="bg-bg-1 border border-border-main rounded-xl p-6">
            <h2 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Sun className="w-4 h-4 text-accent" /> Theme Mode
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {([
                { mode: 'light' as const, label: 'Light Mode', icon: Sun, preview: 'bg-white border-slate-200' },
                { mode: 'dark'  as const, label: 'Dark Mode',  icon: Moon, preview: 'bg-slate-900 border-slate-700' },
              ] as const).map(t => {
                const Icon = t.icon;
                const active = appearance.themeMode === t.mode;
                return (
                  <button key={t.mode} onClick={() => updateAppearance({ themeMode: t.mode })}
                    className={`relative flex flex-col items-center gap-3 p-4 rounded-xl border-2 transition-all ${active ? 'border-accent bg-accent/5' : 'border-border-main hover:border-border-bright'}`}>
                    <div className={`w-full h-16 rounded-lg border ${t.preview} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${active ? 'text-accent' : 'text-slate-400'}`} />
                    </div>
                    <span className={`text-xs font-bold ${active ? 'text-accent' : 'text-text-2'}`}>{t.label}</span>
                    {active && <div className="absolute top-2 right-2 w-3 h-3 bg-accent rounded-full" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* â”€â”€ BACKGROUND IMAGE â”€â”€ */}
          <div className="bg-bg-1 border border-border-main rounded-xl p-6">
            <h2 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-1 flex items-center gap-2">
              <Palette className="w-4 h-4 text-accent" /> Background Style
            </h2>
            <p className="text-[11px] text-text-3 mb-4">Choose a gradient, mesh, or custom background for the app backdrop</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3 mb-4">
              {BG_IMAGES.filter(b => b.id !== 'custom').map(bg => {
                const active = (appearance.bgImage ?? 'none') === bg.id;
                return (
                  <button key={bg.id} onClick={() => updateAppearance({ bgImage: bg.id })}
                    className={`relative flex flex-col gap-1.5 rounded-xl border-2 overflow-hidden transition-all ${active ? 'border-accent' : 'border-border-main hover:border-border-bright'}`}>
                    <div className="w-full h-14 rounded-t-lg"
                      style={{ background: bg.thumb || 'var(--bg-2)', backgroundSize: 'cover' }} />
                    <span className="text-[9px] font-bold text-center text-text-2 pb-1.5 leading-tight px-1">{bg.name}</span>
                    {active && <div className="absolute top-1 right-1 w-3 h-3 bg-accent rounded-full flex items-center justify-center"><Check className="w-2 h-2 text-white" /></div>}
                  </button>
                );
              })}
            </div>
            {/* ─── LOCAL UPLOAD + URL INPUTS ─── */}
            <div className="space-y-3 mb-4">

              {/* LOCAL FILE UPLOAD CARD */}
              <div className={`relative flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                (appearance.bgImage === 'local') ? 'border-accent bg-accent/5' : 'border-dashed border-border-bright hover:border-accent/50'
              }`}>
                {/* Hidden real input */}
                <input
                  id="bg-upload-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    // Warn if file is very large (>50MB) — base64 would be huge
                    if (file.size > 50 * 1024 * 1024) {
                      alert('Image is larger than 50 MB. Please choose a smaller image.');
                      e.target.value = '';
                      return;
                    }
                    const reader = new FileReader();
                    reader.onload = ev => {
                      const dataUrl = ev.target?.result as string;
                      saveLocalBg(dataUrl);
                      updateAppearance({ ...appearance, bgImage: 'local', localBgName: file.name } as any);
                    };
                    reader.readAsDataURL(file);
                    e.target.value = ''; // reset so same file can be re-picked
                  }}
                />

                {/* Preview thumbnail or placeholder */}
                {(appearance.bgImage === 'local') ? (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-border-bright flex-shrink-0 relative">
                    <img
                      src={loadLocalBg()}
                      alt="Uploaded BG"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-all">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="bg-upload-input"
                    className="w-16 h-16 rounded-lg border-2 border-dashed border-border-bright flex-shrink-0 flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-accent hover:bg-accent/5 transition-all"
                  >
                    <Camera className="w-5 h-5 text-text-3" />
                    <span className="text-[8px] font-bold text-text-3 text-center leading-tight">UPLOAD</span>
                  </label>
                )}

                {/* Info + actions */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold text-text-1 mb-0.5">Upload from Device</div>
                  <div className="text-[10px] text-text-3 mb-2">JPG, PNG, WEBP · Max 50 MB</div>
                  {(appearance.bgImage === 'local') ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-accent truncate max-w-[160px]">
                        {(appearance as any).localBgName || 'Uploaded image'}
                      </span>
                      <button
                        onClick={() => {
                          clearLocalBg();
                          updateAppearance({ ...appearance, bgImage: 'none', localBgName: '' } as any);
                        }}
                        className="flex-shrink-0 flex items-center gap-1 text-[10px] font-bold text-red-main hover:text-red-dim transition-colors"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    </div>
                  ) : (
                    <label
                      htmlFor="bg-upload-input"
                      className="inline-flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-accent hover:text-accent-dim transition-colors"
                    >
                      <Camera className="w-3.5 h-3.5" />
                      Choose image file…
                    </label>
                  )}
                </div>

                {/* Active indicator */}
                {(appearance.bgImage === 'local') && (
                  <div className="absolute top-2 right-2 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                    <Check className="w-2.5 h-2.5 text-white" />
                  </div>
                )}
              </div>

              {/* URL INPUT */}
              <div>
                <label className="text-[11px] font-bold text-text-3 uppercase tracking-wide block mb-2">Or Use Remote URL</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="https://example.com/image.jpg"
                    value={(appearance as any).customBgUrl ?? ''}
                    onChange={e => updateAppearance({ ...appearance, bgImage: e.target.value ? 'custom' : appearance.bgImage === 'custom' ? 'none' : appearance.bgImage, customBgUrl: e.target.value } as any)}
                    className="flex-1 bg-bg-0 border border-border-main rounded-lg px-3 py-2 text-xs font-mono text-text-1 outline-none focus:border-accent" />
                  {(appearance as any).customBgUrl && (
                    <button onClick={() => updateAppearance({ ...appearance, bgImage: 'none', customBgUrl: '' } as any)}
                      className="px-3 py-2 bg-bg-2 border border-border-main rounded-lg text-xs font-bold text-text-2 hover:border-red-main hover:text-red-main transition-all">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
            {(appearance.bgImage && appearance.bgImage !== 'none') && (
              <div className="space-y-4 border-t border-border-main pt-4">
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-text-3 uppercase tracking-wide">Background Opacity</label>
                    <span className="text-[11px] font-mono text-accent">{appearance.bgImageOpacity ?? 30}%</span>
                  </div>
                  <input type="range" min={5} max={100} value={appearance.bgImageOpacity ?? 30}
                    onChange={e => updateAppearance({ bgImageOpacity: Number(e.target.value) })}
                    className="w-full accent-[color:var(--accent)]" />
                </div>
                <div>
                  <div className="flex justify-between mb-1.5">
                    <label className="text-[11px] font-bold text-text-3 uppercase tracking-wide">Background Blur</label>
                    <span className="text-[11px] font-mono text-accent">{appearance.bgImageBlur ?? 4}px</span>
                  </div>
                  <input type="range" min={0} max={20} value={appearance.bgImageBlur ?? 4}
                    onChange={e => updateAppearance({ bgImageBlur: Number(e.target.value) })}
                    className="w-full accent-[color:var(--accent)]" />
                </div>
              </div>
            )}
          </div>

          {/* â”€â”€ BACKGROUND PATTERN â”€â”€ */}
          <div className="bg-bg-1 border border-border-main rounded-xl p-6">
            <h2 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-1 flex items-center gap-2">
              <Grid3X3 className="w-4 h-4 text-accent" /> Background Pattern Overlay
            </h2>
            <p className="text-[11px] text-text-3 mb-4">Subtle texture overlaid on the content area background</p>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {BG_PATTERNS.map(pat => {
                const active = appearance.bgPattern === pat.id;
                return (
                  <button key={pat.id} onClick={() => updateAppearance({ bgPattern: pat.id as any })}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${active ? 'border-accent bg-accent/5' : 'border-border-main hover:border-border-bright'}`}>
                    <div className={`w-full h-10 rounded-lg bg-bg-2 border border-border-main flex items-center justify-center ${
                      pat.id === 'dots'    ? 'bg-[radial-gradient(circle,#94a3b8_1px,transparent_1px)] [background-size:8px_8px]' :
                      pat.id === 'grid'    ? 'bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] [background-size:8px_8px]' :
                      pat.id === 'lines'   ? '[background:repeating-linear-gradient(to_bottom,transparent,transparent_7px,#e2e8f0_7px,#e2e8f0_8px)]' :
                      pat.id === 'waves'   ? '[background:repeating-linear-gradient(45deg,transparent,transparent_10px,#e2e8f0_10px,#e2e8f0_11px)]' :
                      pat.id === 'diamond' ? '[background:linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(-45deg,#e2e8f0_25%,transparent_25%)] [background-size:10px_10px]' : ''
                    }`}>
                      {['none','hexagon','circuit','cross'].includes(pat.id) && <span className="text-[9px] font-bold text-text-3">{pat.name}</span>}
                    </div>
                    <span className={`text-[10px] font-bold ${active ? 'text-accent' : 'text-text-2'}`}>{pat.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* â”€â”€ BRAND COLOR â”€â”€ */}
          <div className="bg-bg-1 border border-border-main rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-text-1 uppercase tracking-wide flex items-center gap-2">
                <Droplets className="w-4 h-4 text-accent" /> Brand Accent Color
              </h2>
              {appearance.customAccent && <button onClick={() => updateAppearance({ customAccent: '' })} className="text-xs font-bold text-accent flex items-center gap-1"><RotateCcw className="w-3 h-3" /> Use preset</button>}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 mb-5">
              {COLOR_PRESETS.map(preset => {
                const active = !appearance.customAccent && appearance.accentPreset === preset.id;
                return (
                  <button key={preset.id} onClick={() => updateAppearance({ accentPreset: preset.id, customAccent: '' })}
                    className={`relative flex items-center gap-2 p-2.5 rounded-lg border ${active ? 'border-accent ring-1 ring-accent/30 bg-accent/5' : 'border-border-main hover:border-border-bright'}`}>
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: preset.accent }} />
                    <div className={`text-[10px] font-bold truncate ${active ? 'text-accent' : 'text-text-1'}`}>{preset.name}</div>
                    {active && <Check className="w-3 h-3 text-accent absolute top-1 right-1" />}
                  </button>
                );
              })}
            </div>
            <div className="flex items-center gap-4 mb-5 p-3 bg-bg-2 rounded-xl border border-border-main">
              <input type="color" value={appearance.customAccent || '#2563eb'} onChange={e => updateAppearance({ customAccent: e.target.value })} className="w-10 h-10 rounded-lg cursor-pointer p-0 border-0" />
              <div>
                <p className="text-xs font-bold text-text-1">Custom Hex Color</p>
                <p className="text-[10px] text-text-3">Pick any color for your brand accent</p>
              </div>
              <div className="ml-auto text-xs font-mono text-text-2">{appearance.customAccent || 'using preset'}</div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-[11px] font-bold text-text-3 uppercase tracking-wide">Color Saturation</label>
                <span className="text-[11px] font-mono text-accent">{appearance.colorSaturation ?? 100}%</span>
              </div>
              <input type="range" min={30} max={150} value={appearance.colorSaturation ?? 100}
                onChange={e => updateAppearance({ colorSaturation: Number(e.target.value) })}
                className="w-full accent-[color:var(--accent)]" />
              <div className="flex justify-between mt-1">
                <span className="text-[9px] text-text-3">Muted</span>
                <span className="text-[9px] text-text-3">Vivid</span>
              </div>
            </div>
          </div>

          {/* â”€â”€ TYPOGRAPHY â”€â”€ */}
          <div className="bg-bg-1 border border-border-main rounded-xl p-6">
            <h2 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Type className="w-4 h-4 text-accent" /> Typography
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FONT_OPTIONS.map(font => {
                const active = (appearance.fontFamily ?? 'inter') === font.id;
                return (
                  <button key={font.id} onClick={() => updateAppearance({ fontFamily: font.id as any })}
                    className={`flex flex-col items-start p-3 rounded-xl border-2 text-left transition-all ${active ? 'border-accent bg-accent/5' : 'border-border-main hover:border-border-bright'}`}>
                    <span className={`text-base font-bold mb-0.5 ${active ? 'text-accent' : 'text-text-1'}`} style={{ fontFamily: font.family }}>Aa</span>
                    <span className={`text-xs font-semibold ${active ? 'text-accent' : 'text-text-2'}`}>{font.name}</span>
                    <span className="text-[9px] text-text-3 mt-0.5">{font.google ? 'Google Font' : 'System Font'}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* â”€â”€ LAYOUT GRID: Corner + Density + Scale â”€â”€ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <h3 className="text-xs font-bold text-text-1 uppercase tracking-wide mb-3 flex items-center gap-2"><Circle className="w-3.5 h-3.5 text-accent" /> Corner Style</h3>
              <div className="flex flex-col gap-2">
                {RADIUS_OPTIONS.map(opt => {
                  const active = appearance.borderRadius === opt.id;
                  return (
                    <button key={opt.id} onClick={() => updateAppearance({ borderRadius: opt.id as any })}
                      className={`flex items-center justify-between p-2.5 rounded-lg border ${active ? 'border-accent bg-accent/5' : 'border-border-main hover:bg-bg-2'}`}>
                      <span className={`text-xs font-bold ${active ? 'text-accent' : 'text-text-1'}`}>{opt.name}</span>
                      <div className="w-6 h-6 bg-accent/20 border border-accent/40" style={{ borderRadius: opt.value }} />
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <h3 className="text-xs font-bold text-text-1 uppercase tracking-wide mb-3 flex items-center gap-2"><Sliders className="w-3.5 h-3.5 text-accent" /> UI Density</h3>
              <div className="flex flex-col gap-2">
                {DENSITY_OPTIONS.map(opt => {
                  const active = appearance.density === opt.id;
                  return (
                    <button key={opt.id} onClick={() => updateAppearance({ density: opt.id as any })}
                      className={`flex items-center justify-between p-2.5 rounded-lg border ${active ? 'border-accent bg-accent/5' : 'border-border-main hover:bg-bg-2'}`}>
                      <div>
                        <div className={`text-xs font-bold ${active ? 'text-accent' : 'text-text-1'}`}>{opt.name}</div>
                        <div className="text-[10px] text-text-3">{opt.description}</div>
                      </div>
                      {active && <Check className="w-4 h-4 text-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <h3 className="text-xs font-bold text-text-1 uppercase tracking-wide mb-3 flex items-center gap-2"><Monitor className="w-3.5 h-3.5 text-accent" /> UI Text Scale</h3>
              <div className="flex flex-col gap-2">
                {([{ id: 'sm', label: 'Small', desc: '13px base' }, { id: 'md', label: 'Medium', desc: '14px base (default)' }, { id: 'lg', label: 'Large', desc: '15px base' }] as const).map(opt => {
                  const active = (appearance.uiScale ?? 'md') === opt.id;
                  return (
                    <button key={opt.id} onClick={() => updateAppearance({ uiScale: opt.id })}
                      className={`flex items-center justify-between p-2.5 rounded-lg border ${active ? 'border-accent bg-accent/5' : 'border-border-main hover:bg-bg-2'}`}>
                      <div>
                        <div className={`text-xs font-bold ${active ? 'text-accent' : 'text-text-1'}`}>{opt.label}</div>
                        <div className="text-[10px] text-text-3">{opt.desc}</div>
                      </div>
                      {active && <Check className="w-4 h-4 text-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* â”€â”€ CARD + SIDEBAR + TOPBAR â”€â”€ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <h3 className="text-xs font-bold text-text-1 uppercase tracking-wide mb-3 flex items-center gap-2"><Layout className="w-3.5 h-3.5 text-accent" /> Card Style</h3>
              <div className="flex flex-col gap-2">
                {CARD_STYLES.map(opt => {
                  const active = (appearance.cardStyle ?? 'default') === opt.id;
                  return (
                    <button key={opt.id} onClick={() => updateAppearance({ cardStyle: opt.id as any })}
                      className={`flex items-center justify-between p-2.5 rounded-lg border ${active ? 'border-accent bg-accent/5' : 'border-border-main hover:bg-bg-2'}`}>
                      <div>
                        <div className={`text-xs font-bold ${active ? 'text-accent' : 'text-text-1'}`}>{opt.name}</div>
                        <div className="text-[10px] text-text-3">{opt.description}</div>
                      </div>
                      {active && <Check className="w-4 h-4 text-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <h3 className="text-xs font-bold text-text-1 uppercase tracking-wide mb-3 flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-accent" /> Sidebar Style</h3>
              <div className="flex flex-col gap-2">
                {([{id:'solid',label:'Solid',desc:'Opaque background'},{id:'transparent',label:'Transparent',desc:'See-through sidebar'},{id:'glass',label:'Glass',desc:'Frosted glass blur'},{id:'gradient',label:'Gradient',desc:'Gradient accent bar'}] as const).map(opt => {
                  const active = (appearance.sidebarStyle ?? 'solid') === opt.id;
                  return (
                    <button key={opt.id} onClick={() => updateAppearance({ sidebarStyle: opt.id })}
                      className={`flex items-center justify-between p-2.5 rounded-lg border ${active ? 'border-accent bg-accent/5' : 'border-border-main hover:bg-bg-2'}`}>
                      <div>
                        <div className={`text-xs font-bold ${active ? 'text-accent' : 'text-text-1'}`}>{opt.label}</div>
                        <div className="text-[10px] text-text-3">{opt.desc}</div>
                      </div>
                      {active && <Check className="w-4 h-4 text-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <h3 className="text-xs font-bold text-text-1 uppercase tracking-wide mb-3 flex items-center gap-2"><Monitor className="w-3.5 h-3.5 text-accent" /> Topbar Style</h3>
              <div className="flex flex-col gap-2">
                {([{id:'default',label:'Default',desc:'Matches background'},{id:'accent',label:'Accent',desc:'Brand color topbar'},{id:'dark',label:'Dark',desc:'Always dark header'},{id:'glass',label:'Glass',desc:'Frosted glass blur'}] as const).map(opt => {
                  const active = ((appearance as any).topbarStyle ?? 'default') === opt.id;
                  return (
                    <button key={opt.id} onClick={() => updateAppearance({ ...appearance, topbarStyle: opt.id } as any)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border ${active ? 'border-accent bg-accent/5' : 'border-border-main hover:bg-bg-2'}`}>
                      <div>
                        <div className={`text-xs font-bold ${active ? 'text-accent' : 'text-text-1'}`}>{opt.label}</div>
                        <div className="text-[10px] text-text-3">{opt.desc}</div>
                      </div>
                      {active && <Check className="w-4 h-4 text-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* â”€â”€ ANIMATION + SHADOW + EXTRAS â”€â”€ */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <h3 className="text-xs font-bold text-text-1 uppercase tracking-wide mb-3 flex items-center gap-2"><RefreshCw className="w-3.5 h-3.5 text-accent" /> Animations</h3>
              <div className="flex flex-col gap-2">
                {([{id:'none',label:'Disabled',desc:'No motion â€” max performance'},{id:'subtle',label:'Subtle',desc:'Micro-transitions (recommended)'},{id:'full',label:'Full',desc:'Rich animations & hover effects'}] as const).map(opt => {
                  const active = (appearance.animationLevel ?? 'subtle') === opt.id;
                  return (
                    <button key={opt.id} onClick={() => updateAppearance({ animationLevel: opt.id })}
                      className={`flex items-center justify-between p-2.5 rounded-lg border ${active ? 'border-accent bg-accent/5' : 'border-border-main hover:bg-bg-2'}`}>
                      <div>
                        <div className={`text-xs font-bold ${active ? 'text-accent' : 'text-text-1'}`}>{opt.label}</div>
                        <div className="text-[10px] text-text-3">{opt.desc}</div>
                      </div>
                      {active && <Check className="w-4 h-4 text-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <h3 className="text-xs font-bold text-text-1 uppercase tracking-wide mb-3 flex items-center gap-2"><Layers className="w-3.5 h-3.5 text-accent" /> Shadow Depth</h3>
              <div className="flex flex-col gap-2">
                {([{id:'none',label:'Flat',desc:'No shadows at all'},{id:'soft',label:'Soft',desc:'Subtle depth (default)'},{id:'medium',label:'Medium',desc:'Visible elevation'},{id:'strong',label:'Strong',desc:'Bold dramatic shadows'}] as const).map(opt => {
                  const active = ((appearance as any).shadowIntensity ?? 'soft') === opt.id;
                  return (
                    <button key={opt.id} onClick={() => updateAppearance({ ...appearance, shadowIntensity: opt.id } as any)}
                      className={`flex items-center justify-between p-2.5 rounded-lg border ${active ? 'border-accent bg-accent/5' : 'border-border-main hover:bg-bg-2'}`}>
                      <div>
                        <div className={`text-xs font-bold ${active ? 'text-accent' : 'text-text-1'}`}>{opt.label}</div>
                        <div className="text-[10px] text-text-3">{opt.desc}</div>
                      </div>
                      {active && <Check className="w-4 h-4 text-accent" />}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="bg-bg-1 border border-border-main rounded-xl p-5">
              <h3 className="text-xs font-bold text-text-1 uppercase tracking-wide mb-3 flex items-center gap-2"><Eye className="w-3.5 h-3.5 text-accent" /> Interface Extras</h3>
              <div className="flex flex-col gap-3">
                {[
                  { key: 'sidebarAccent', label: 'Sidebar Accent Fill', desc: 'Active nav items use solid accent bg' },
                  { key: 'compactTables', label: 'Compact Tables', desc: 'Reduce row padding globally' },
                ].map(item => {
                  const val = !!((appearance as any)[item.key]);
                  return (
                    <div key={item.key} className="flex items-start justify-between p-2.5 rounded-lg border border-border-main">
                      <div className="flex-1 pr-3">
                        <div className="text-xs font-bold text-text-1">{item.label}</div>
                        <div className="text-[10px] text-text-3">{item.desc}</div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                        <input type="checkbox" checked={val} onChange={e => updateAppearance({ ...appearance, [item.key]: e.target.checked } as any)} className="sr-only peer" />
                        <div className="w-9 h-5 bg-bg-3 peer-focus:ring-2 peer-focus:ring-accent/30 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent"></div>
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* â”€â”€ LIVE PREVIEW â”€â”€ */}
          <div className="bg-bg-1 border border-border-main rounded-xl p-6">
            <h2 className="text-sm font-bold text-text-1 uppercase tracking-wide mb-4 flex items-center gap-2">
              <Eye className="w-4 h-4 text-accent" /> Live Preview
            </h2>
            <div className="rounded-xl overflow-hidden border border-border-main" style={{ background: 'var(--bg-0)' }}>
              <div className="flex items-center gap-3 px-4 py-2 border-b border-border-main" style={{
                background: (appearance as any).topbarStyle === 'accent' ? 'var(--accent)' : (appearance as any).topbarStyle === 'dark' ? '#0f1117' : 'var(--bg-1)'
              }}>
                <div className="w-4 h-4 rounded-sm bg-accent" />
                <div className="text-xs font-bold" style={{ color: (appearance as any).topbarStyle === 'accent' ? '#fff' : 'var(--text-1)' }}>QMS ERP</div>
                <div className="ml-auto flex gap-2">
                  <div className="w-12 h-4 rounded" style={{ background: 'var(--accent)', opacity: 0.2 }} />
                  <div className="w-8 h-4 rounded" style={{ background: 'var(--bg-3)' }} />
                </div>
              </div>
              <div className="flex" style={{ minHeight: 120 }}>
                <div className="w-24 p-2 flex flex-col gap-1.5 border-r border-border-main" style={{ background: 'var(--bg-1)' }}>
                  {['Dashboard','Quality','Audits','Reports'].map((l,i) => (
                    <div key={l} style={{ borderRadius: 'var(--radius-sm)', padding: '4px 8px',
                      background: i === 0 ? ((appearance as any).sidebarAccent ? 'var(--accent)' : 'var(--accent-light)') : 'transparent',
                      color: i === 0 ? ((appearance as any).sidebarAccent ? '#fff' : 'var(--accent)') : 'var(--text-3)',
                      fontSize: '9px', fontWeight: 700 }}>{l}</div>
                  ))}
                </div>
                <div className="flex-1 p-3 grid grid-cols-2 gap-2 content-start">
                  {[['Q Confirmed','72%'],['DHU Rate','1.2%'],['CAPA Open','3'],['Certs','8']].map(([t,v],i) => (
                    <div key={t} className="p-2 border border-border-main" style={{ background: 'var(--bg-1)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-sm)' }}>
                      <div style={{ fontSize: '8px', fontWeight: 700, color: 'var(--text-1)' }}>{t}: <span style={{ color: 'var(--accent)' }}>{v}</span></div>
                      <div style={{ height: '4px', background: 'var(--bg-3)', borderRadius: '99px', marginTop: '4px' }}>
                        <div style={{ height: '100%', borderRadius: '99px', background: 'var(--accent)', width: `${[72,45,30,88][i]}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* â”€â”€ RESET â”€â”€ */}
          <div className="flex items-center gap-3 pt-2 border-t border-border-main">
            <button onClick={resetAppearance} className="btn btn-ghost border border-border-main flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold text-text-2 hover:text-text-1">
              <RotateCcw className="w-4 h-4" /> Reset to Defaults
            </button>
            <span className="text-[11px] text-text-3">All appearance settings are saved instantly and applied in real-time.</span>
          </div>
        </div>
      )}

    </div>
  );
}

