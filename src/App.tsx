import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './components/Sidebar';
import { Topbar } from './components/Topbar';
import { Dashboard } from './pages/Dashboard';
import { ProductionQuality } from './pages/ProductionQuality';
import { ProductionQualityForm } from './pages/ProductionQualityForm';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Reports } from './pages/OtherPages';
import { Certification } from './pages/Certification';
import { RiskManagementPage } from './pages/RiskManagementPage';
import { TraceabilityPage } from './pages/TraceabilityPage';
import { SOPManagement } from './pages/SOPManagement';
import { SOPForm } from './pages/SOPForm';
import { QualityManual } from './pages/QualityManual';
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
import { DocumentControl } from './pages/DocumentControl';
import { DocumentControlForm } from './pages/DocumentControlForm';
import { JDModule } from './pages/JDModule';
import { FollowUpAudit } from './pages/FollowUpAudit';
import { FlowChartPage } from './pages/FlowChartPage';
import { OrganogramPage } from './pages/OrganogramPage';
import { TrainingModule } from './pages/TrainingModule';
import { SupplierModule } from './pages/SupplierModule';
import { UniversalModule } from './components/universal/UniversalModule';
import { MODULE_CONFIGS } from './config/moduleConfigs';
import { loadAppearance, applyAppearance } from './config/themeEngine';

import { seedUniversalModules } from './utils/databaseSeeder';


export default function App() {
  const [loading, setLoading] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [pageParams, setPageParams] = useState<any>(null);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = loadAppearance();
    return saved.themeMode === 'dark';
  });

  // Initialize theme and seed data on mount
  useEffect(() => {
    const saved = loadAppearance();
    applyAppearance(saved);
    seedUniversalModules();
  }, []);

  const navigate = (page: string, params: any = null) => {
    setCurrentPage(page);
    setPageParams(params);
    setSidebarOpen(false);
  };
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<{id: number, msg: string, title: string, type: string}[]>([]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleShowNotif = (msg: string, title: string, type: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg, title, type }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3500);
  };

  const toggleSidebar = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(!sidebarOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const renderPage = () => {
    const commonProps = { params: pageParams, onNavigate: navigate };
    
    switch (currentPage) {
      // ── Core Pages (existing implementations) ──
      case 'dashboard': return <Dashboard onNavigate={navigate} />;
      case 'prod-quality': return <ProductionQuality {...commonProps} />;
      case 'prod-quality-form': return <ProductionQualityForm {...commonProps} />;
      case 'inspection': return <Inspection {...commonProps} />;
      case 'inspection-form': return <InspectionForm {...commonProps} />;
      case 'defect-list': return <DefectLibrary {...commonProps} />;
      case 'audit': return <Audit {...commonProps} />;
      case 'audit-form': return <AuditForm {...commonProps} />;
      case 'capa': return <CAPA {...commonProps} />;
      case 'capa-form': return <CAPAForm {...commonProps} />;
      case 'follow-up': return <FollowUpAudit />;
      case 'certification': return <Certification {...commonProps} />;
      case 'risk': return <RiskManagementPage {...commonProps} />;
      case 'traceability': return <TraceabilityPage onNavigate={navigate} />;
      case 'sop': return <SOPManagement {...commonProps} />;
      case 'sop-form': return <SOPForm {...commonProps} />;
      case 'quality-manual': return <QualityManual {...commonProps} />;
      case 'guidelines': return <OperationalGuidelines {...commonProps} />;
      case 'procedure': return <ProcedureManagement {...commonProps} />;
      case 'procedure-form': return <ProcedureForm {...commonProps} />;
      case 'doc-control': return <DocumentControl {...commonProps} />;
      case 'doc-control-form': return <DocumentControlForm {...commonProps} />;
      case 'job-desc': return <JDModule {...commonProps} />;
      case 'reports': return <Reports {...commonProps} />;
      case 'settings': return <Settings isDarkMode={isDarkMode} onToggleDarkMode={() => setIsDarkMode(!isDarkMode)} />;
      case 'profile': return <Profile avatarUrl={avatarUrl} setAvatarUrl={setAvatarUrl} />;

      // ── Universal Module Pages (Training handles its own specific dashboard) ──
      case 'training': return <TrainingModule onNavigate={navigate} />;
      case 'supplier': return <SupplierModule onNavigate={navigate} />;
      case 'complaints': return <UniversalModule config={MODULE_CONFIGS.customerComplaints} onNavigate={navigate} />;
      case 'testing': return <UniversalModule config={MODULE_CONFIGS.testing} onNavigate={navigate} />;
      case 'process-flow': return <FlowChartPage onNavigate={navigate} />;
      case 'meeting': return <UniversalModule config={MODULE_CONFIGS.meetingMinutes} onNavigate={navigate} />;
      case 'buyer-summary': return <UniversalModule config={MODULE_CONFIGS.orderSummary} onNavigate={navigate} />;
      case 'kpi': return <UniversalModule config={MODULE_CONFIGS.kpiRecords} onNavigate={navigate} />;
      case 'goals': return <UniversalModule config={MODULE_CONFIGS.qualityGoals} onNavigate={navigate} />;
      case 'calibration': return <UniversalModule config={MODULE_CONFIGS.calibrationRecords} onNavigate={navigate} />;

      // ── New Mandatory QMS Modules ──
      case 'ncr': return <UniversalModule config={MODULE_CONFIGS.ncr} onNavigate={navigate} />;
      case 'rca': return <UniversalModule config={MODULE_CONFIGS.rootCauseAnalysis} onNavigate={navigate} />;
      case 'management-review': return <UniversalModule config={MODULE_CONFIGS.managementReview} onNavigate={navigate} />;
      case 'equipment-maintenance': return <UniversalModule config={MODULE_CONFIGS.equipmentMaintenance} onNavigate={navigate} />;
      case 'incoming-qc': return <UniversalModule config={MODULE_CONFIGS.incomingQC} onNavigate={navigate} />;
      case 'final-inspection': return <UniversalModule config={MODULE_CONFIGS.finalInspection} onNavigate={navigate} />;
      case 'continuous-improvement': return <UniversalModule config={MODULE_CONFIGS.continuousImprovement} onNavigate={navigate} />;
      case 'process-interaction': return <UniversalModule config={MODULE_CONFIGS.processInteractionMatrix} onNavigate={navigate} />;
      case 'record-retention': return <UniversalModule config={MODULE_CONFIGS.recordRetention} onNavigate={navigate} />;
      case 'change-management': return <UniversalModule config={MODULE_CONFIGS.changeManagement} onNavigate={navigate} />;
      case 'product-safety': return <UniversalModule config={MODULE_CONFIGS.productSafety} onNavigate={navigate} />;
      case 'organogram': return <OrganogramPage onNavigate={navigate} />;

      default: return <Dashboard onNavigate={navigate} />;
    }
  };

  const getPageTitle = () => {
    const titles: Record<string, string> = {
      'dashboard': 'Dashboard',
      'prod-quality': 'Production Quality',
      'kpi': 'KPI Management',
      'goals': 'Quality Goals',
      'capa': 'CAPA Management',
      'settings': 'Global Settings',
      'profile': 'User Profile',
      'defect-list': 'Defect Library',
      'inspection': 'Inspection',
      'audit': 'Audit Management',
      'follow-up': 'Follow-Up Audit',
      'certification': 'Certifications',
      'risk': 'Risk Assessment',
      'traceability': 'Product Traceability',
      'sop': 'SOP Management',
      'quality-manual': 'Quality Manual',
      'guidelines': 'Operational Guidelines',
      'procedure': 'Procedure Management',
      'doc-control': 'Document Control',
      'job-desc': 'Job Description',
      'training': 'Training Management',
      'supplier': 'Supplier Management',
      'buyer-summary': 'Buyer / Order Summary',
      'complaints': 'Customer Complaints',
      'testing': 'Testing Management',
      'calibration': 'Calibration Management',
      'process-flow': 'Flow Chart',
      'meeting': 'Meeting Minutes',
      'reports': 'Reports & Analytics',
      'ncr': 'Nonconformance (NCR)',
      'rca': 'Root Cause Analysis',
      'management-review': 'Management Review',
      'equipment-maintenance': 'Equipment Maintenance',
      'incoming-qc': 'Incoming Quality Control',
      'final-inspection': 'Final Inspection',
      'continuous-improvement': 'Continuous Improvement',
      'process-interaction': 'Process Interaction Matrix',
      'record-retention': 'Record Retention Control',
      'change-management': 'Change Management',
      'product-safety': 'Product Safety',
      'organogram': 'Organogram',
    };
    return titles[currentPage] || 'Fahim QMS Project';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading Fahim QMS Project...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="app">
      <Sidebar collapsed={collapsed} sidebarOpen={sidebarOpen} currentPage={currentPage} onNavigate={navigate} onCloseSidebar={() => setSidebarOpen(false)} onToggleSidebar={toggleSidebar} />
      
      {/* Mobile Sidebar Overlay */}
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
          onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
          onShowNotif={handleShowNotif}
          onNavigate={navigate}
          onToggleSidebar={toggleSidebar}
        />
        <div id="content" className="bg-bg-0">
          {renderPage()}
        </div>
      </div>

      {/* Notifications */}
      <div className="notif" id="notif-container">
        {notifications.map(n => (
          <div key={n.id} className="notif-item show" style={{ borderLeft: `3px solid var(--${n.type === 'green' ? 'green' : n.type === 'amber' ? 'amber' : n.type === 'red' ? 'red' : 'accent'})` }}>
            <div className="n-title">{n.title}</div>
            <div className="n-body">{n.msg}</div>
          </div>
        ))}
      </div>

      {/* Copyright Credit in Bottom Corner */}
      <div className="fixed bottom-3 right-4 z-50 pointer-events-none opacity-60">
        <p className="text-[10px] font-semibold text-text-3 tracking-wider">
          CREATED BY <span className="text-accent font-bold">MOHAMMAD FAHIM</span> &copy; 2026
        </p>
      </div>
    </div>
  );
}
