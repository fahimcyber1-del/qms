import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { ProductionQuality } from './pages/ProductionQuality';
import { ProductionQualityForm } from './pages/ProductionQualityForm';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import type { UserProfile } from './pages/Login';
import { ReportsAnalytics } from './pages/ReportsAnalytics';
import { Certification } from './pages/Certification';
import { RiskManagementPage } from './pages/RiskManagementPage';
import { TraceabilityPage } from './pages/TraceabilityPage';
import { SOPManagement } from './pages/SOPManagement';
import { SOPForm } from './pages/SOPForm';
import { OperationalGuidelines } from './pages/OperationalGuidelines';
import { Inspection } from './pages/Inspection';
import { InspectionForm } from './pages/InspectionForm';
import { ProcedureManagement } from './pages/ProcedureManagement';
import { ProcedureForm } from './pages/ProcedureForm';
import { AuditForm } from './pages/AuditForm';
import { Audit } from './pages/Audit';
import { CAPA } from './pages/CAPA';
import { CAPAForm } from './pages/CAPAForm';
import { DefectLibrary } from './pages/DefectLibrary';
import { FollowUpAudit } from './pages/FollowUpAudit';
import { FlowChartPage } from './pages/FlowChartPage';
import { OrganogramPage } from './pages/OrganogramPage';
import { TrainingModule } from './pages/TrainingModule';
import { SupplierModule } from './pages/SupplierModule';
import { KPIModule } from './pages/KPI';
import { UniversalModule } from './components/universal/UniversalModule';
import { MODULE_CONFIGS } from './config/moduleConfigs';
import { loadAppearance, saveAppearance, applyAppearance } from './config/themeEngine';
import { seedUniversalModules } from './utils/databaseSeeder';
// ── Dedicated Module Pages & Forms ──────────────────────────────────────────
import { QualityGoals } from './pages/QualityGoals';
import { QualityGoalsForm } from './pages/QualityGoalsForm';
import { TestingManagement } from './pages/TestingManagement';
import { TestingManagementForm } from './pages/TestingManagementForm';
import { NCR } from './pages/NCR';
import { NCRForm } from './pages/NCRForm';
import { RootCauseAnalysis } from './pages/RootCauseAnalysis';
import { RootCauseAnalysisForm } from './pages/RootCauseAnalysisForm';
import { ContinuousImprovement } from './pages/ContinuousImprovement';
import { ContinuousImprovementForm } from './pages/ContinuousImprovementForm';
import { ManagementReview } from './pages/ManagementReview';
import { ManagementReviewForm } from './pages/ManagementReviewForm';
import { IncomingQC } from './pages/IncomingQC';
import { IncomingQCForm } from './pages/IncomingQCForm';
import { Calibration } from './pages/Calibration';
import { CalibrationForm } from './pages/CalibrationForm';
import { EquipmentMaintenance } from './pages/EquipmentMaintenance';
import { EquipmentMaintenanceForm } from './pages/EquipmentMaintenanceForm';
import { ProductSafety } from './pages/ProductSafety';
import { ProductSafetyForm } from './pages/ProductSafetyForm';
import { SupplierMultiTier } from './pages/SupplierMultiTier';
import { SupplierMultiTierForm } from './pages/SupplierMultiTierForm';
import { BuyerOrderSummary } from './pages/BuyerOrderSummary';
import { BuyerOrderSummaryForm } from './pages/BuyerOrderSummaryForm';
import { CustomerComplaint } from './pages/CustomerComplaint';
import { CustomerComplaintForm } from './pages/CustomerComplaintForm';
import { DocumentControl } from './pages/DocumentControl';
import { DocumentControlForm } from './pages/DocumentControlForm';
import { QualityManuals } from './pages/QualityManuals';
import { QualityManualsForm } from './pages/QualityManualsForm';
import { RecordRetention } from './pages/RecordRetention';
import { RecordRetentionForm } from './pages/RecordRetentionForm';
import { ProcessInteractionMatrix } from './pages/ProcessInteractionMatrix';
import { ProcessInteractionMatrixForm } from './pages/ProcessInteractionMatrixForm';
import { JobDescriptionManagement } from './pages/JobDescriptionManagement';
import { JobDescriptionManagementForm } from './pages/JobDescriptionManagementForm';
import { MeetingMinutes } from './pages/MeetingMinutes';
import { MeetingMinutesForm } from './pages/MeetingMinutesForm';
import { ChangeManagementPage } from './pages/ChangeManagementPage';

// ─── Default user profile ───────────────────────────────────────
const DEFAULT_PROFILE: UserProfile = {
  name: 'System Admin',
  role: 'Quality Manager',
  email: 'admin@qmserp.com',
  department: 'Quality Assurance',
  initials: 'SA',
};

function getInitials(name: string) {
  return name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase() || 'QM';
}

export default function App() {
  // ── Auth ────────────────────────────────────────────────────────
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('qms_auth') === 'true';
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('qms_user_profile');
      if (saved) {
        const p = JSON.parse(saved);
        return { ...DEFAULT_PROFILE, ...p, initials: getInitials(p.name || DEFAULT_PROFILE.name) };
      }
    } catch (_) {}
    return DEFAULT_PROFILE;
  });

  // ── Layout ──────────────────────────────────────────────────────
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageParams, setPageParams] = useState<any>(null);

  // ── Theme ───────────────────────────────────────────────────────
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = loadAppearance();
    return saved.themeMode === 'dark';
  });

  // ── Avatar ──────────────────────────────────────────────────────
  const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
    return localStorage.getItem('qms_avatar') || null;
  });

  // ── Toast Notifications ─────────────────────────────────────────
  const [notifications, setNotifications] = useState<{ id: number; msg: string; title: string; type: string }[]>([]);

  // ── Init ────────────────────────────────────────────────────────
  useEffect(() => {
    const saved = loadAppearance();
    applyAppearance(saved);
    seedUniversalModules();
  }, []);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    const syncThemeState = (event?: Event) => {
      const nextAppearance = (event as CustomEvent | undefined)?.detail ?? loadAppearance();
      setIsDarkMode(nextAppearance.themeMode === 'dark');
    };

    window.addEventListener('qms-appearance-updated', syncThemeState as EventListener);
    window.addEventListener('storage', syncThemeState as EventListener);
    return () => {
      window.removeEventListener('qms-appearance-updated', syncThemeState as EventListener);
      window.removeEventListener('storage', syncThemeState as EventListener);
    };
  }, []);

  // Persist avatar
  useEffect(() => {
    if (avatarUrl) localStorage.setItem('qms_avatar', avatarUrl);
    else localStorage.removeItem('qms_avatar');
  }, [avatarUrl]);

  // Sync profile from storage when profile page saves
  useEffect(() => {
    const handler = () => {
      try {
        const saved = localStorage.getItem('qms_user_profile');
        if (saved) {
          const p = JSON.parse(saved);
          setUserProfile({ ...DEFAULT_PROFILE, ...p, initials: getInitials(p.name || DEFAULT_PROFILE.name) });
        }
      } catch (_) {}
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // ── Session Timeout (idle detection) ──────────────────────────
  useEffect(() => {
    if (!isLoggedIn) return;
    const TIMEOUT_MAP: Record<string, number> = {
      '15 Minutes Idle': 15,
      '30 Minutes Idle (Recommended)': 30,
      '1 Hour Idle': 60,
      'Until Browser Closed': 0,
    };
    let minutes = 30;
    try {
      const cs = localStorage.getItem('companySettings');
      if (cs) {
        const str = JSON.parse(cs)?.security?.sessionTimeout;
        if (str && TIMEOUT_MAP[str] !== undefined) minutes = TIMEOUT_MAP[str];
      }
    } catch (_) {}
    if (minutes === 0) return; // 'Until Browser Closed' — no auto-logout
    const ms = minutes * 60 * 1000;
    let timeoutId: ReturnType<typeof setTimeout>;
    const reset = () => { clearTimeout(timeoutId); timeoutId = setTimeout(doLogout, ms); };
    const events = ['mousemove', 'keydown', 'click', 'touchstart'] as const;
    events.forEach(e => window.addEventListener(e, reset, { passive: true }));
    reset();
    return () => { clearTimeout(timeoutId); events.forEach(e => window.removeEventListener(e, reset)); };
  }, [isLoggedIn]);

  // ── Force-Logout Event (from Settings) ───────────────────────
  useEffect(() => {
    const handler = () => doLogout();
    window.addEventListener('qms-force-logout', handler);
    return () => window.removeEventListener('qms-force-logout', handler);
  }, []);

  // ── Handlers ────────────────────────────────────────────────────
  const navigate = (page: string, params: any = null) => {
    setCurrentPage(page);
    setPageParams(params);
    setSidebarOpen(false);
    window.scrollTo({ top: 0 });
  };

  const handleLogin = (user: UserProfile) => {
    const profile = { ...user, initials: getInitials(user.name) };
    setUserProfile(profile);
    localStorage.setItem('qms_user_profile', JSON.stringify(profile));
    setIsLoggedIn(true);
  };

  // Programmatic logout — no confirm dialog (used by idle timeout & force logout)
  const doLogout = () => {
    localStorage.removeItem('qms_auth');
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to sign out?')) doLogout();
  };

  const handleShowNotif = (msg: string, title: string, type: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, title, type }]);
    setTimeout(() => setNotifications(prev => prev.filter(n => n.id !== id)), 3500);
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) setSidebarOpen(!sidebarOpen);
    else setCollapsed(!collapsed);
  };

  const handleToggleDarkMode = () => {
    const nextAppearance = {
      ...loadAppearance(),
      themeMode: isDarkMode ? 'light' as const : 'dark' as const,
    };
    saveAppearance(nextAppearance);
    applyAppearance(nextAppearance);
    setIsDarkMode(nextAppearance.themeMode === 'dark');
    window.dispatchEvent(new CustomEvent('qms-appearance-updated', { detail: nextAppearance }));
  };

  // ── Page Renderer ───────────────────────────────────────────────
  const renderPage = () => {
    const commonProps = { params: pageParams, onNavigate: navigate };
    switch (currentPage) {
      case 'dashboard':              return <Dashboard onNavigate={navigate} />;
      case 'prod-quality':           return <ProductionQuality {...commonProps} />;
      case 'prod-quality-form':      return <ProductionQualityForm {...commonProps} />;
      case 'inspection':             return <Inspection {...commonProps} />;
      case 'inspection-form':        return <InspectionForm {...commonProps} />;
      case 'defect-list':            return <DefectLibrary {...commonProps} />;
      case 'audit':                  return <Audit {...commonProps} />;
      case 'audit-form':             return <AuditForm {...commonProps} />;
      case 'capa':                   return <CAPA {...commonProps} />;
      case 'capa-form':              return <CAPAForm {...commonProps} />;
      case 'follow-up':              return <FollowUpAudit />;
      case 'certification':          return <Certification {...commonProps} />;
      case 'risk':                   return <RiskManagementPage {...commonProps} />;
      case 'traceability':           return <TraceabilityPage onNavigate={navigate} />;
      case 'sop':                    return <SOPManagement {...commonProps} />;
      case 'sop-form':               return <SOPForm {...commonProps} />;
      case 'guidelines':             return <OperationalGuidelines {...commonProps} />;
      case 'procedure':              return <ProcedureManagement {...commonProps} />;
      case 'procedure-form':         return <ProcedureForm {...commonProps} />;
      case 'doc-control':            return <DocumentControl {...commonProps} />;
      case 'doc-control-form':       return <DocumentControlForm {...commonProps} />;
      case 'job-desc':               return <JobDescriptionManagement {...commonProps} />;
      case 'job-description-management-form': return <JobDescriptionManagementForm {...commonProps} />;
      case 'reports':                return <ReportsAnalytics />;
      case 'settings':               return <Settings isDarkMode={isDarkMode} onToggleDarkMode={handleToggleDarkMode} />;
      case 'profile':                return <Profile avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />;
      case 'training':               return <TrainingModule onNavigate={navigate} />;
      case 'supplier':               return <SupplierModule onNavigate={navigate} />;
      case 'complaints':             return <CustomerComplaint onNavigate={navigate} />;
      case 'customer-complaint-form': return <CustomerComplaintForm onNavigate={navigate} params={pageParams} />;
      case 'testing':                return <TestingManagement onNavigate={navigate} />;
      case 'testing-management-form': return <TestingManagementForm onNavigate={navigate} params={pageParams} />;
      case 'process-flow':           return <FlowChartPage onNavigate={navigate} />;
      case 'meeting':                return <MeetingMinutes onNavigate={navigate} />;
      case 'meeting-minutes-form':   return <MeetingMinutesForm onNavigate={navigate} params={pageParams} />;
      case 'buyer-summary':          return <BuyerOrderSummary onNavigate={navigate} />;
      case 'buyer-order-summary-form': return <BuyerOrderSummaryForm onNavigate={navigate} params={pageParams} />;
      case 'kpi':                    return <KPIModule onNavigate={navigate} params={pageParams} />;
      case 'goals':
      case 'quality-goals':          return <QualityGoals onNavigate={navigate} />;
      case 'quality-goals-form':     return <QualityGoalsForm onNavigate={navigate} params={pageParams} />;
      case 'calibration':            return <Calibration onNavigate={navigate} />;
      case 'calibration-form':       return <CalibrationForm onNavigate={navigate} params={pageParams} />;
      case 'ncr':                    return <NCR onNavigate={navigate} />;
      case 'ncr-form':               return <NCRForm onNavigate={navigate} params={pageParams} />;
      case 'rca':                    return <RootCauseAnalysis onNavigate={navigate} />;
      case 'root-cause-analysis-form': return <RootCauseAnalysisForm onNavigate={navigate} params={pageParams} />;
      case 'management-review':      return <ManagementReview onNavigate={navigate} />;
      case 'management-review-form': return <ManagementReviewForm onNavigate={navigate} params={pageParams} />;
      case 'equipment-maintenance':  return <EquipmentMaintenance onNavigate={navigate} />;
      case 'equipment-maintenance-form': return <EquipmentMaintenanceForm onNavigate={navigate} params={pageParams} />;
      case 'incoming-qc':            return <IncomingQC onNavigate={navigate} />;
      case 'incoming-qc-form':       return <IncomingQCForm onNavigate={navigate} params={pageParams} />;
      case 'final-inspection':       return <UniversalModule config={MODULE_CONFIGS.finalInspection} onNavigate={navigate} />;
      case 'continuous-improvement': return <ContinuousImprovement onNavigate={navigate} />;
      case 'continuous-improvement-form': return <ContinuousImprovementForm onNavigate={navigate} params={pageParams} />;
      case 'process-interaction':    return <ProcessInteractionMatrix onNavigate={navigate} />;
      case 'process-interaction-matrix-form': return <ProcessInteractionMatrixForm onNavigate={navigate} params={pageParams} />;
      case 'record-retention':       return <RecordRetention onNavigate={navigate} />;
      case 'record-retention-form':  return <RecordRetentionForm onNavigate={navigate} params={pageParams} />;
      case 'change-management':      return <ChangeManagementPage onNavigate={navigate} />;
      case 'product-safety':         return <ProductSafety onNavigate={navigate} />;
      case 'product-safety-form':    return <ProductSafetyForm onNavigate={navigate} params={pageParams} />;
      case 'supplier-multi-tier':    return <SupplierMultiTier onNavigate={navigate} />;
      case 'supplier-multi-tier-form': return <SupplierMultiTierForm onNavigate={navigate} params={pageParams} />;
      case 'quality-manual':        return <QualityManuals onNavigate={navigate} />;
      case 'quality-manuals-form':   return <QualityManualsForm onNavigate={navigate} params={pageParams} />;
      case 'organogram':             return <OrganogramPage onNavigate={navigate} />;
      default:                       return <Dashboard onNavigate={navigate} />;
    }
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      'dashboard': 'Dashboard', 'prod-quality': 'Production Quality', 'kpi': 'KPI Management',
      'goals': 'Quality Goals', 'quality-goals': 'Quality Goals', 'capa': 'CAPA Management', 'settings': 'System Settings',
      'profile': 'User Profile', 'defect-list': 'Defect Library', 'inspection': 'Inspection',
      'audit': 'Audit Management', 'follow-up': 'Follow-Up Audit', 'certification': 'Certifications',
      'risk': 'Risk Assessment', 'traceability': 'Product Traceability', 'sop': 'SOP Management',
      'quality-manual': 'Quality Manual', 'guidelines': 'Operational Guidelines',
      'procedure': 'Procedure Management', 'doc-control': 'Document Control',
      'job-desc': 'Job Description', 'training': 'Training Management',
      'supplier': 'Supplier Management', 'buyer-summary': 'Order Summary',
      'complaints': 'Customer Complaints', 'testing': 'Testing Management',
      'calibration': 'Calibration Management', 'process-flow': 'Flow Chart',
      'meeting': 'Meeting Minutes', 'reports': 'Reports & Analytics',
      'ncr': 'Nonconformance (NCR)', 'rca': 'Root Cause Analysis',
      'management-review': 'Management Review', 'equipment-maintenance': 'Equipment Maintenance',
      'incoming-qc': 'Incoming Quality Control', 'final-inspection': 'Final Inspection',
      'continuous-improvement': 'Continuous Improvement',
      'process-interaction': 'Process Interaction Matrix',
      'record-retention': 'Record Retention', 'change-management': 'Change Management',
      'product-safety': 'Product Safety', 'organogram': 'Organogram',
    };
    return titles[currentPage] || 'QMS ERP Pro';
  };

  // ── Login Screen ─────────────────────────────────────────────────
  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  // ── Main App ─────────────────────────────────────────────────────
  return (
    <div id="app">
      <Sidebar
        collapsed={collapsed}
        sidebarOpen={sidebarOpen}
        currentPage={currentPage}
        onNavigate={navigate}
        onCloseSidebar={() => setSidebarOpen(false)}
        onToggleSidebar={toggleSidebar}
        userProfile={userProfile}
        onLogout={handleLogout}
      />

      {/* Mobile Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      <div id="main" className="flex-1">
        <Topbar
          title={getPageTitle()}
          avatarUrl={avatarUrl}
          isDarkMode={isDarkMode}
          onToggleDarkMode={handleToggleDarkMode}
          onShowNotif={handleShowNotif}
          onNavigate={navigate}
          onToggleSidebar={toggleSidebar}
          userProfile={userProfile}
          onLogout={handleLogout}
        />
        <div id="content" className="bg-bg-0">
          {renderPage()}
        </div>
      </div>

      {/* Toast Notifications */}
      <div className="notif" id="notif-container">
        {notifications.map(n => (
          <div
            key={n.id}
            className="notif-item show"
            style={{ borderLeft: `3px solid var(--${n.type === 'green' ? 'green' : n.type === 'amber' ? 'amber' : n.type === 'red' ? 'red' : 'accent'})` }}
          >
            <div className="n-title">{n.title}</div>
            <div className="n-body">{n.msg}</div>
          </div>
        ))}
      </div>

      {/* Version badge */}
      <div className="fixed bottom-3 right-4 z-50 pointer-events-none opacity-40">
        <p className="text-[9px] font-bold tracking-widest" style={{ color: 'var(--text-3)' }}>
          QMS ERP Pro v1.0 &copy; {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}
