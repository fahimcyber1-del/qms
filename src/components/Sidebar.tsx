import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import { 
  LayoutDashboard, 
  Settings, 
  Microscope, 
  BarChart3, 
  Target, 
  Search, 
  AlertTriangle, 
  ClipboardList, 
  Wrench, 
  RefreshCw, 
  Award, 
  Zap, 
  Link, 
  FileText, 
  BookOpen, 
  Pin, 
  Files, 
  Archive, 
  User, 
  GraduationCap, 
  Factory, 
  Package, 
  Megaphone, 
  TestTube2, 
  Settings2, 
  GitBranch, 
  Users, 
  LineChart,
  LogOut,
  ChevronLeft,
  ChevronRight,
  AlertOctagon,
  SearchCode,
  Briefcase,
  ClipboardCheck,
  CheckSquare,
  TrendingUp,
  Grid3X3,
  ShieldAlert,
  Network
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  sidebarOpen: boolean;
  currentPage: string;
  onNavigate: (page: string) => void;
  onCloseSidebar: () => void;
  onToggleSidebar: () => void;
}

export function Sidebar({ collapsed, sidebarOpen, currentPage, onNavigate, onCloseSidebar, onToggleSidebar }: SidebarProps) {
  const navItems = [
    { group: 'Overview', items: [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    ]},
    { group: 'Quality Management', items: [
      { id: 'prod-quality', icon: Microscope, label: 'Production Quality' },
      { id: 'inspection', icon: Search, label: 'Inspection' },
      { id: 'defect-list', icon: AlertTriangle, label: 'Defect Library' },
      { id: 'kpi', icon: BarChart3, label: 'KPI Management' },
      { id: 'goals', icon: Target, label: 'Quality Goals' },
      { id: 'testing', icon: TestTube2, label: 'Testing' },
      { id: 'ncr', icon: AlertOctagon, label: 'NCR' },
      { id: 'rca', icon: SearchCode, label: 'Root Cause Analysis' },
      { id: 'continuous-improvement', icon: TrendingUp, label: 'Improvement' },
    ]},
    { group: 'Audit & Compliance', items: [
      { id: 'audit', icon: ClipboardList, label: 'Audit' },
      { id: 'capa', icon: Wrench, label: 'CAPA' },
      { id: 'follow-up', icon: RefreshCw, label: 'Follow-Up Audit' },
      { id: 'certification', icon: Award, label: 'Certifications' },
      { id: 'risk', icon: Zap, label: 'Risk Assessment' },
      { id: 'management-review', icon: Briefcase, label: 'Management Review' },
      { id: 'change-management', icon: RefreshCw, label: 'Change Management' },
    ]},
    { group: 'Production Quality', items: [
      { id: 'incoming-qc', icon: ClipboardCheck, label: 'Incoming QC' },
      { id: 'final-inspection', icon: CheckSquare, label: 'Final Inspection' },
      { id: 'traceability', icon: Link, label: 'Traceability' },
      { id: 'calibration', icon: Settings2, label: 'Calibration' },
      { id: 'equipment-maintenance', icon: Wrench, label: 'Maintenance' },
      { id: 'product-safety', icon: ShieldAlert, label: 'Product Safety' },
    ]},
    { group: 'Supplier & Customer', items: [
      { id: 'supplier', icon: Factory, label: 'Supplier Management' },
      { id: 'buyer-summary', icon: Package, label: 'Order Summary' },
      { id: 'complaints', icon: Megaphone, label: 'Complaints' },
    ]},
    { group: 'Documents', items: [
      { id: 'doc-control', icon: Archive, label: 'Document Control' },
      { id: 'sop', icon: FileText, label: 'SOP Management' },
      { id: 'quality-manual', icon: BookOpen, label: 'Quality Manual' },
      { id: 'guidelines', icon: Pin, label: 'Guidelines' },
      { id: 'procedure', icon: Files, label: 'Procedures' },
      { id: 'process-flow', icon: GitBranch, label: 'Flow Chart' },
      { id: 'record-retention', icon: Archive, label: 'Record Retention' },
      { id: 'process-interaction', icon: Grid3X3, label: 'Process Matrix' },
    ]},
    { group: 'HR & Organization', items: [
      { id: 'job-desc', icon: User, label: 'Job Description' },
      { id: 'training', icon: GraduationCap, label: 'Training' },
      { id: 'organogram', icon: Network, label: 'Organogram' },
      { id: 'meeting', icon: Users, label: 'Meeting Minutes' },
    ]},
    { group: 'Reports & Settings', items: [
      { id: 'reports', icon: LineChart, label: 'Reports' },
      { id: 'settings', icon: Settings, label: 'Settings' },
    ]}
  ];

  return (
    <nav 
      id="sidebar" 
      className={cn(
        collapsed ? "w-[56px] collapsed" : "w-[264px]", 
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        "flex flex-col h-full bg-bg-1 border-r border-border-main transition-all duration-200 z-50 fixed lg:relative"
      )}
    >
      {/* Header */}
      <div className={cn("h-[56px] flex items-center px-4 border-b border-border-main gap-3 flex-shrink-0", collapsed ? "justify-center" : "justify-between")}>
        {!collapsed && (
          <div className="flex items-center gap-3 transition-opacity duration-200">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-xs flex-shrink-0 shadow-sm">
              QMS
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-text-1 leading-tight">
                Fahim QMS
              </span>
              <span className="text-[10px] text-text-3 font-medium">
                Quality System Project
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0 shadow-sm">
            QMS
          </div>
        )}
        <button 
          onClick={onToggleSidebar}
          className="hidden lg:flex p-1 hover:bg-bg-2 text-text-3 hover:text-text-1 transition-all rounded-md items-center justify-center"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
      
      {/* Nav Body */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-0 space-y-5 custom-scrollbar">
        {navItems.map((group, i) => (
          <div key={i} className="space-y-0.5">
            {!collapsed && (
              <div className="text-[10px] font-semibold text-text-3 tracking-wide uppercase px-5 mb-1.5 flex items-center gap-2">
                {group.group}
              </div>
            )}
            <div className="space-y-px">
              {group.items.map(item => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    className={cn(
                      "w-full flex items-center gap-2.5 py-[7px] transition-all duration-150 group relative",
                      collapsed ? "px-0 justify-center" : "px-5",
                      isActive 
                        ? "text-accent bg-accent-light font-semibold" 
                        : "text-text-2 hover:bg-bg-2 hover:text-text-1"
                    )}
                    onClick={() => {
                      onNavigate(item.id);
                      onCloseSidebar();
                    }}
                    aria-label={item.label}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="activeNav"
                        className="absolute left-0 top-0 bottom-0 w-[3px] bg-accent rounded-r-full"
                        transition={{ type: "spring", stiffness: 400, damping: 40 }}
                      />
                    )}
                    <div className={cn(
                      "flex items-center justify-center w-5 h-5 flex-shrink-0 transition-colors",
                      isActive ? "text-accent" : "group-hover:text-text-1"
                    )}>
                      <Icon className="w-[18px] h-[18px]" strokeWidth={isActive ? 2.2 : 1.8} />
                    </div>
                    {!collapsed && (
                      <span className="text-[13px] whitespace-nowrap overflow-hidden flex-1 text-left">
                        {item.label}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border-main">
        <div className={cn("flex items-center gap-2.5 p-2 bg-bg-2 rounded-lg", collapsed && "justify-center px-0")}>
          <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center text-accent font-semibold text-xs flex-shrink-0">
            JD
          </div>
          {!collapsed && (
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-semibold text-text-1 truncate">John Doe</p>
              <p className="text-[10px] text-text-3 truncate">Quality Lead</p>
            </div>
          )}
          {!collapsed && (
            <button
              className="p-1.5 text-text-3 hover:text-red-main hover:bg-red-main/10 transition-all rounded-md"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
