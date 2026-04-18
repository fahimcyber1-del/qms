import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';
import type { UserProfile } from '../pages/Login';
import {
  LayoutDashboard, Settings, Microscope, BarChart3, Target,
  Search, AlertTriangle, ClipboardList, Wrench, RefreshCw,
  Award, Zap, Link, FileText, BookOpen, Pin, Files, Archive,
  User, GraduationCap, Factory, Package, Megaphone, TestTube2,
  Settings2, GitBranch, Users, LineChart, LogOut,
  ChevronLeft, ChevronRight, AlertOctagon, SearchCode,
  Briefcase, ClipboardCheck, CheckSquare, TrendingUp,
  Grid3X3, ShieldAlert, Network, ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  collapsed: boolean;
  sidebarOpen: boolean;
  currentPage: string;
  onNavigate: (page: string) => void;
  onCloseSidebar: () => void;
  onToggleSidebar: () => void;
  userProfile?: UserProfile;
  onLogout?: () => void;
}

const navItems = [
  { group: 'Overview', items: [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  ]},
  { group: 'Quality Management', items: [
    { id: 'prod-quality',          icon: Microscope,    label: 'Production Quality' },
    { id: 'inspection',            icon: Search,        label: 'Inspection' },
    { id: 'defect-list',           icon: AlertTriangle, label: 'Defect Library' },
    { id: 'kpi',                   icon: BarChart3,     label: 'KPI Management' },
    { id: 'goals',                 icon: Target,        label: 'Quality Goals' },
    { id: 'testing',               icon: TestTube2,     label: 'Testing' },
    { id: 'ncr',                   icon: AlertOctagon,  label: 'NCR' },
    { id: 'rca',                   icon: SearchCode,    label: 'Root Cause Analysis' },
    { id: 'continuous-improvement',icon: TrendingUp,    label: 'Improvement' },
  ]},
  { group: 'Audit & Compliance', items: [
    { id: 'audit',             icon: ClipboardList,  label: 'Audit' },
    { id: 'capa',              icon: Wrench,         label: 'CAPA' },
    { id: 'follow-up',         icon: RefreshCw,      label: 'Follow-Up Audit' },
    { id: 'certification',     icon: Award,          label: 'Certifications' },
    { id: 'risk',              icon: Zap,            label: 'Risk Assessment' },
    { id: 'management-review', icon: Briefcase,      label: 'Management Review' },
    { id: 'change-management', icon: RefreshCw,      label: 'Change Management' },
  ]},
  { group: 'Production Quality', items: [
    { id: 'incoming-qc',          icon: ClipboardCheck, label: 'Incoming QC' },
    { id: 'final-inspection',     icon: CheckSquare,    label: 'Final Inspection' },
    { id: 'traceability',         icon: Link,           label: 'Traceability' },
    { id: 'calibration',          icon: Settings2,      label: 'Calibration' },
    { id: 'equipment-maintenance',icon: Wrench,         label: 'Maintenance' },
    { id: 'product-safety',       icon: ShieldAlert,    label: 'Product Safety' },
  ]},
  { group: 'Supplier & Customer', items: [
    { id: 'supplier',     icon: Factory,  label: 'Supplier Management' },
    { id: 'buyer-summary',icon: Package,  label: 'Order Summary' },
    { id: 'complaints',   icon: Megaphone,label: 'Complaints' },
  ]},
  { group: 'Documents', items: [
    { id: 'doc-control',       icon: Archive,   label: 'Document Control' },
    { id: 'sop',               icon: FileText,  label: 'SOP Management' },
    { id: 'quality-manual',    icon: BookOpen,  label: 'Quality Manual' },
    { id: 'guidelines',        icon: Pin,       label: 'Guidelines' },
    { id: 'procedure',         icon: Files,     label: 'Procedures' },
    { id: 'process-flow',      icon: GitBranch, label: 'Flow Chart' },
    { id: 'record-retention',  icon: Archive,   label: 'Record Retention' },
    { id: 'process-interaction',icon: Grid3X3,  label: 'Process Matrix' },
  ]},
  { group: 'HR & Organization', items: [
    { id: 'job-desc',   icon: User,          label: 'Job Description' },
    { id: 'training',   icon: GraduationCap, label: 'Training' },
    { id: 'organogram', icon: Network,       label: 'Organogram' },
    { id: 'meeting',    icon: Users,         label: 'Meeting Minutes' },
  ]},
  { group: 'Reports & Settings', items: [
    { id: 'reports',  icon: LineChart, label: 'Reports' },
    { id: 'settings', icon: Settings,  label: 'Settings' },
  ]},
];

export function Sidebar({
  collapsed, sidebarOpen, currentPage,
  onNavigate, onCloseSidebar, onToggleSidebar,
  userProfile, onLogout,
}: SidebarProps) {

  const displayName    = userProfile?.name     || 'System Admin';
  const displayRole    = userProfile?.role     || 'Quality Manager';
  const displayInitials = userProfile?.initials || 'SA';

  return (
    <nav
      id="sidebar"
      className={cn(
        collapsed ? 'w-[56px] collapsed' : 'w-[264px]',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        'flex flex-col h-full bg-bg-1 border-r border-border-main transition-all duration-200 z-50 fixed lg:relative'
      )}
    >
      {/* ── Logo / Brand ── */}
      <div className={cn(
        'h-[56px] flex items-center px-4 border-b border-border-main gap-3 flex-shrink-0',
        collapsed ? 'justify-center' : 'justify-between'
      )}>
        {!collapsed && (
          <div className="flex items-center gap-3 transition-opacity duration-200">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ background: 'var(--accent)' }}>
              <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-black text-sm" style={{ color: 'var(--text-1)' }}>QMS ERP Pro</span>
              <span className="text-[9px] font-semibold tracking-wider uppercase" style={{ color: 'var(--text-3)' }}>Enterprise Edition</span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm"
            style={{ background: 'var(--accent)' }}>
            <ShieldCheck className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
        )}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex p-1 hover:bg-bg-2 transition-all rounded-md items-center justify-center"
          style={{ color: 'var(--text-3)' }}
        >
          {collapsed
            ? <ChevronRight className="w-4 h-4" />
            : <ChevronLeft  className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Nav Body ── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden py-3 px-0 space-y-5 custom-scrollbar">
        {navItems.map((group, i) => (
          <div key={i} className="space-y-0.5">
            {!collapsed && (
              <div className="text-[9px] font-black tracking-widest uppercase px-5 mb-1.5"
                style={{ color: 'var(--text-3)' }}>
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
                      'w-full flex items-center gap-2.5 py-[7px] transition-all duration-150 group relative',
                      collapsed ? 'px-0 justify-center' : 'px-5',
                      isActive
                        ? 'bg-accent-light font-semibold'
                        : 'hover:bg-bg-2'
                    )}
                    style={isActive ? { color: 'var(--accent)' } : { color: 'var(--text-2)' }}
                    onClick={() => { onNavigate(item.id); onCloseSidebar(); }}
                    aria-label={item.label}
                    title={collapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full"
                        style={{ background: 'var(--accent)' }}
                        transition={{ type: 'spring', stiffness: 400, damping: 40 }}
                      />
                    )}
                    <div className="flex items-center justify-center w-5 h-5 flex-shrink-0">
                      <Icon
                        className="w-[18px] h-[18px]"
                        strokeWidth={isActive ? 2.2 : 1.8}
                        style={isActive ? { color: 'var(--accent)' } : { color: 'var(--text-3)' }}
                      />
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

      {/* ── User Footer ── */}
      <div className="p-3 border-t border-border-main flex-shrink-0">
        <div className={cn(
          'flex items-center gap-2.5 p-2.5 rounded-xl cursor-pointer transition-all hover:opacity-90',
          collapsed && 'justify-center px-0 py-2.5'
        )}
          style={{ background: 'var(--bg-2)' }}
          onClick={() => { onNavigate('profile'); onCloseSidebar(); }}
          title={collapsed ? `${displayName} — ${displayRole}` : undefined}
        >
          {/* Avatar circle */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center font-black text-[11px] text-white flex-shrink-0"
            style={{ background: 'var(--accent)' }}
          >
            {displayInitials}
          </div>

          {!collapsed && (
            <>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold leading-tight truncate" style={{ color: 'var(--text-1)' }}>
                  {displayName}
                </p>
                <p className="text-[10px] leading-tight truncate mt-0.5" style={{ color: 'var(--text-3)' }}>
                  {displayRole}
                </p>
              </div>
              {onLogout && (
                <button
                  onClick={e => { e.stopPropagation(); onLogout(); }}
                  className="p-1.5 rounded-lg transition-all hover:bg-red-500/10 flex-shrink-0"
                  style={{ color: 'var(--text-3)' }}
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
