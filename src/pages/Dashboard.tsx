import React, { useEffect, useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  Award,
  BarChart3,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  Factory,
  Gauge,
  GraduationCap,
  Layers3,
  ShieldAlert,
  Sparkles,
  Target,
  TrendingUp,
  Wrench,
} from 'lucide-react';
import { motion } from 'motion/react';
import { getCertificates, getDaysUntilExpiry } from '../utils/certificateUtils';
import { getProductionQualityRecords } from '../utils/qualityUtils';
import { getProcedures } from '../utils/procedureUtils';
import { getDocuments } from '../utils/docUtils';
import { CertificateRecord } from '../types';
import { db } from '../db/db';
import { AppearanceSettings, loadAppearance } from '../config/themeEngine';
import { SmartKPI, calculateActualValue, formatRadarData } from '../utils/kpiEngine';

interface Defect {
  name: string;
  count: number;
}

interface InspectionRecord {
  id: string;
  date: string;
  unit: string;
  section: string;
  lineNumber: string;
  checkedQuantity: number;
  goodsQuantity: number;
  totalDefects: number;
  topDefects: Defect[];
  uid: string;
  source: string;
  createdAt: unknown;
}

interface BuyerOrder {
  id: string;
  orderNo: string;
  status: string;
  qty: number;
  createdAt: any;
}

interface AQLInspection {
  id: string;
  type: string;
  result: string;
  createdAt: any;
}

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

const PALETTE = {
  navy: '#123b7a',
  blue: '#1d5fd1',
  cyan: '#0f9bb8',
  emerald: '#08916a',
  amber: '#d98a11',
  red: '#d9485f',
  slate: '#5f6f8a',
  indigo: '#5b5bd6',
  teal: '#0d9488',
  rose: '#e11d48',
};

const CHART_COLORS = [PALETTE.blue, PALETTE.cyan, PALETTE.emerald, PALETTE.amber, PALETTE.red];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05, delayChildren: 0.03 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 240, damping: 24 } },
};

const DASHBOARD_STYLE_PRESETS = {
  modern: {
    rootBg: 'radial-gradient(circle at top left, rgba(29,95,209,0.12), transparent 28%), radial-gradient(circle at top right, rgba(15,155,184,0.12), transparent 22%), var(--bg-0)',
    panelBg: 'linear-gradient(180deg, color-mix(in srgb, var(--bg-1) 94%, white 6%), color-mix(in srgb, var(--bg-1) 98%, black 2%))',
    panelBorder: 'color-mix(in srgb, var(--border) 84%, white 16%)',
    panelShadow: 'var(--shadow-sm)',
    tileBg: 'linear-gradient(180deg, var(--dash-accent-soft), transparent 55%), var(--bg-1)',
    heroBg: 'linear-gradient(135deg, rgba(10,31,73,0.98), rgba(18,59,122,0.94) 42%, rgba(7,119,135,0.94))',
    heroBorder: 'rgba(255,255,255,0.08)',
    heroShadow: '0 24px 80px rgba(7, 25, 63, 0.28)',
    heroOverlay: 'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.18), transparent 22%), radial-gradient(circle at 80% 0%, rgba(255,255,255,0.12), transparent 18%)',
    heroOrb: 'rgba(255,255,255,0.10)',
  },
  corporate: {
    rootBg: 'linear-gradient(180deg, #f6f8fc, var(--bg-0))',
    panelBg: 'linear-gradient(180deg, #ffffff, #f8fbff)',
    panelBorder: 'rgba(37,99,235,0.16)',
    panelShadow: '0 14px 34px rgba(15,23,42,0.06)',
    tileBg: 'linear-gradient(180deg, var(--dash-accent-soft), rgba(255,255,255,0.88))',
    heroBg: 'linear-gradient(135deg, #123b7a, #1d5fd1 58%, #0f9bb8)',
    heroBorder: 'rgba(29,95,209,0.18)',
    heroShadow: '0 18px 48px rgba(18,59,122,0.18)',
    heroOverlay: 'linear-gradient(135deg, rgba(255,255,255,0.14), transparent 45%)',
    heroOrb: 'rgba(255,255,255,0.14)',
  },
  minimal: {
    rootBg: 'linear-gradient(180deg, #fbfcfe, var(--bg-0))',
    panelBg: 'linear-gradient(180deg, #ffffff, #ffffff)',
    panelBorder: 'rgba(148,163,184,0.22)',
    panelShadow: 'none',
    tileBg: 'linear-gradient(180deg, rgba(148,163,184,0.04), #ffffff)',
    heroBg: 'linear-gradient(135deg, #ffffff, #f8fafc)',
    heroBorder: 'rgba(148,163,184,0.20)',
    heroShadow: 'none',
    heroOverlay: 'linear-gradient(135deg, rgba(148,163,184,0.10), transparent 55%)',
    heroOrb: 'rgba(148,163,184,0.10)',
  },
  glassmorphic: {
    rootBg: 'radial-gradient(circle at top left, rgba(124,58,237,0.14), transparent 30%), radial-gradient(circle at 80% 10%, rgba(14,165,233,0.16), transparent 26%), linear-gradient(180deg, rgba(248,250,252,0.96), rgba(241,245,249,0.96))',
    panelBg: 'linear-gradient(180deg, rgba(255,255,255,0.58), rgba(255,255,255,0.38))',
    panelBorder: 'rgba(255,255,255,0.44)',
    panelShadow: '0 18px 48px rgba(15,23,42,0.10)',
    tileBg: 'linear-gradient(180deg, rgba(255,255,255,0.62), rgba(255,255,255,0.42))',
    heroBg: 'linear-gradient(135deg, rgba(59,130,246,0.82), rgba(124,58,237,0.78) 54%, rgba(14,165,233,0.74))',
    heroBorder: 'rgba(255,255,255,0.24)',
    heroShadow: '0 22px 72px rgba(59,130,246,0.18)',
    heroOverlay: 'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.26), transparent 20%), radial-gradient(circle at 78% 6%, rgba(255,255,255,0.20), transparent 18%)',
    heroOrb: 'rgba(255,255,255,0.22)',
  },
  neon: {
    rootBg: 'radial-gradient(circle at top left, rgba(168,85,247,0.22), transparent 30%), radial-gradient(circle at top right, rgba(16,185,129,0.18), transparent 22%), linear-gradient(180deg, #020617, #0f172a)',
    panelBg: 'linear-gradient(180deg, rgba(15,23,42,0.96), rgba(2,6,23,0.92))',
    panelBorder: 'rgba(148,163,184,0.18)',
    panelShadow: '0 0 0 1px rgba(124,58,237,0.18), 0 18px 48px rgba(124,58,237,0.14)',
    tileBg: 'linear-gradient(180deg, var(--dash-accent-soft), rgba(15,23,42,0.94))',
    heroBg: 'linear-gradient(135deg, rgba(3,7,18,0.98), rgba(76,29,149,0.94) 48%, rgba(6,95,70,0.92))',
    heroBorder: 'rgba(167,139,250,0.22)',
    heroShadow: '0 0 0 1px rgba(167,139,250,0.16), 0 24px 80px rgba(124,58,237,0.20)',
    heroOverlay: 'radial-gradient(circle at 20% 20%, rgba(167,139,250,0.26), transparent 22%), radial-gradient(circle at 84% 0%, rgba(52,211,153,0.22), transparent 18%)',
    heroOrb: 'rgba(167,139,250,0.14)',
  },
  executive: {
    rootBg: 'radial-gradient(circle at top left, rgba(214,166,59,0.10), transparent 28%), linear-gradient(180deg, #eef3fb, var(--bg-0))',
    panelBg: 'linear-gradient(180deg, #ffffff, #f8fbff)',
    panelBorder: 'rgba(183,139,45,0.22)',
    panelShadow: '0 16px 40px rgba(15,23,42,0.08)',
    tileBg: 'linear-gradient(180deg, var(--dash-accent-soft), rgba(255,255,255,0.92))',
    heroBg: 'linear-gradient(135deg, #0f1f3d, #183a71 58%, #224f96)',
    heroBorder: 'rgba(214,166,59,0.22)',
    heroShadow: '0 20px 60px rgba(15,31,61,0.24)',
    heroOverlay: 'linear-gradient(135deg, rgba(214,166,59,0.18), transparent 48%)',
    heroOrb: 'rgba(214,166,59,0.18)',
  },
  sunset: {
    rootBg: 'radial-gradient(circle at top left, rgba(251,146,60,0.16), transparent 28%), radial-gradient(circle at top right, rgba(251,113,133,0.14), transparent 24%), linear-gradient(180deg, #fff7ed, var(--bg-0))',
    panelBg: 'linear-gradient(180deg, #fffdfb, #fff7ed)',
    panelBorder: 'rgba(234,88,12,0.18)',
    panelShadow: '0 14px 36px rgba(249,115,22,0.10)',
    tileBg: 'linear-gradient(180deg, var(--dash-accent-soft), rgba(255,255,255,0.90))',
    heroBg: 'linear-gradient(135deg, #7c2d12, #ea580c 52%, #fb7185)',
    heroBorder: 'rgba(251,146,60,0.18)',
    heroShadow: '0 22px 68px rgba(234,88,12,0.18)',
    heroOverlay: 'radial-gradient(circle at 18% 22%, rgba(255,237,213,0.20), transparent 22%), radial-gradient(circle at 82% 0%, rgba(255,255,255,0.10), transparent 18%)',
    heroOrb: 'rgba(255,237,213,0.18)',
  },
  mono: {
    rootBg: 'linear-gradient(180deg, #e2e8f0, #f8fafc)',
    panelBg: 'linear-gradient(180deg, #ffffff, #f1f5f9)',
    panelBorder: 'rgba(100,116,139,0.24)',
    panelShadow: '0 12px 28px rgba(15,23,42,0.08)',
    tileBg: 'linear-gradient(180deg, rgba(100,116,139,0.10), rgba(255,255,255,0.94))',
    heroBg: 'linear-gradient(135deg, #0f172a, #1e293b 52%, #334155)',
    heroBorder: 'rgba(148,163,184,0.20)',
    heroShadow: '0 18px 56px rgba(15,23,42,0.20)',
    heroOverlay: 'linear-gradient(135deg, rgba(255,255,255,0.10), transparent 50%)',
    heroOrb: 'rgba(255,255,255,0.10)',
  },
  cyberpunk: {
    rootBg: 'linear-gradient(180deg, #0f0c29, #302b63 60%, #24243e)',
    panelBg: 'linear-gradient(180deg, rgba(0,0,0,0.8), rgba(20,20,20,0.95))',
    panelBorder: 'rgba(236,72,153,0.4)',
    panelShadow: '0 8px 32px rgba(236,72,153,0.15)',
    tileBg: 'linear-gradient(180deg, rgba(236,72,153,0.1), rgba(0,0,0,0.4))',
    heroBg: 'linear-gradient(135deg, #111, #222 40%, #000)',
    heroBorder: 'rgba(6,182,212,0.5)',
    heroShadow: '0 12px 40px rgba(6,182,212,0.3)',
    heroOverlay: 'linear-gradient(45deg, rgba(236,72,153,0.2), transparent 40%)',
    heroOrb: 'rgba(236,72,153,0.2)',
  },
  nature: {
    rootBg: 'radial-gradient(circle at top left, rgba(134,239,172,0.2), transparent 40%), linear-gradient(180deg, #f0fdf4, var(--bg-0))',
    panelBg: 'linear-gradient(180deg, #ffffff, #f8fafc)',
    panelBorder: 'rgba(34,197,94,0.15)',
    panelShadow: '0 10px 30px rgba(21,128,61,0.08)',
    tileBg: 'linear-gradient(180deg, rgba(220,252,231,0.6), rgba(240,253,244,0.2))',
    heroBg: 'linear-gradient(135deg, #14532d, #166534 50%, #15803d)',
    heroBorder: 'rgba(134,239,172,0.3)',
    heroShadow: '0 12px 48px rgba(20,83,45,0.2)',
    heroOverlay: 'linear-gradient(135deg, rgba(255,255,255,0.15), transparent 45%)',
    heroOrb: 'rgba(134,239,172,0.15)',
  },
  holographic: {
    rootBg: 'radial-gradient(circle at top right, rgba(236,72,153,0.15), transparent 30%), radial-gradient(circle at top left, rgba(6,182,212,0.15), transparent 30%), linear-gradient(180deg, #ffffff, #fdf4ff)',
    panelBg: 'linear-gradient(180deg, rgba(255,255,255,0.7), rgba(255,255,255,0.4))',
    panelBorder: 'rgba(255,255,255,0.6)',
    panelShadow: '0 18px 48px rgba(139,92,246,0.1)',
    tileBg: 'linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0.5))',
    heroBg: 'linear-gradient(135deg, rgba(167,139,250,0.8), rgba(244,114,182,0.8) 50%, rgba(56,189,248,0.8))',
    heroBorder: 'rgba(255,255,255,0.5)',
    heroShadow: '0 24px 60px rgba(236,72,153,0.2)',
    heroOverlay: 'radial-gradient(circle at 40% 40%, rgba(255,255,255,0.3), transparent 30%)',
    heroOrb: 'rgba(255,255,255,0.4)',
  },
};

type DashboardStylePreset = {
  rootBg: string;
  panelBg: string;
  panelBorder: string;
  panelShadow: string;
  tileBg: string;
  heroBg: string;
  heroBorder: string;
  heroShadow: string;
  heroOverlay: string;
  heroOrb: string;
};

type DashboardStyleId = keyof typeof DASHBOARD_STYLE_PRESETS;

const DASHBOARD_DARK_OVERRIDES: Partial<Record<DashboardStyleId, Partial<DashboardStylePreset>>> = {
  modern: {
    rootBg:
      'radial-gradient(circle at top left, color-mix(in srgb, var(--accent) 16%, transparent), transparent 28%), radial-gradient(circle at top right, rgba(14,165,233,0.16), transparent 24%), linear-gradient(180deg, var(--bg-0), color-mix(in srgb, var(--bg-0) 92%, black 8%))',
    panelBg:
      'linear-gradient(180deg, color-mix(in srgb, var(--bg-1) 94%, white 6%), color-mix(in srgb, var(--bg-1) 96%, black 4%))',
    panelBorder: 'color-mix(in srgb, var(--border) 88%, white 12%)',
    panelShadow: 'var(--shadow-md)',
    tileBg:
      'linear-gradient(180deg, var(--dash-accent-soft), color-mix(in srgb, var(--bg-1) 94%, black 6%))',
  },
  corporate: {
    rootBg:
      'radial-gradient(circle at top left, var(--accent-light), transparent 28%), linear-gradient(180deg, var(--bg-0), color-mix(in srgb, var(--bg-0) 88%, black 12%))',
    panelBg:
      'linear-gradient(180deg, color-mix(in srgb, var(--bg-1) 96%, white 4%), var(--bg-1))',
    panelBorder: 'color-mix(in srgb, var(--accent) 24%, var(--border))',
    panelShadow: 'var(--shadow-md)',
    tileBg:
      'linear-gradient(180deg, var(--dash-accent-soft), color-mix(in srgb, var(--bg-1) 94%, black 6%))',
    heroBg:
      'linear-gradient(135deg, #091120, #123b7a 58%, color-mix(in srgb, var(--accent) 38%, #0f172a))',
    heroBorder: 'rgba(255,255,255,0.08)',
    heroShadow: '0 22px 60px rgba(2,6,23,0.34)',
    heroOverlay: 'linear-gradient(135deg, rgba(255,255,255,0.12), transparent 45%)',
    heroOrb: 'rgba(59,130,246,0.16)',
  },
  minimal: {
    rootBg:
      'linear-gradient(180deg, var(--bg-0), color-mix(in srgb, var(--bg-0) 90%, black 10%))',
    panelBg:
      'linear-gradient(180deg, var(--bg-1), color-mix(in srgb, var(--bg-1) 96%, black 4%))',
    panelBorder: 'var(--border)',
    panelShadow: 'var(--shadow-sm)',
    tileBg: 'linear-gradient(180deg, rgba(148,163,184,0.06), var(--bg-1))',
    heroBg:
      'linear-gradient(135deg, color-mix(in srgb, var(--bg-1) 94%, white 6%), color-mix(in srgb, var(--bg-2) 92%, black 8%))',
    heroBorder: 'var(--border)',
    heroShadow: 'var(--shadow-sm)',
    heroOverlay: 'linear-gradient(135deg, rgba(148,163,184,0.08), transparent 55%)',
    heroOrb: 'rgba(148,163,184,0.12)',
  },
  glassmorphic: {
    rootBg:
      'radial-gradient(circle at top left, rgba(124,58,237,0.18), transparent 30%), radial-gradient(circle at 80% 10%, rgba(14,165,233,0.16), transparent 24%), linear-gradient(180deg, var(--bg-0), color-mix(in srgb, var(--bg-0) 90%, black 10%))',
    panelBg: 'linear-gradient(180deg, rgba(22,24,34,0.74), rgba(22,24,34,0.52))',
    panelBorder: 'rgba(255,255,255,0.10)',
    panelShadow: '0 18px 48px rgba(2,6,23,0.22)',
    tileBg: 'linear-gradient(180deg, rgba(59,130,246,0.12), rgba(22,24,34,0.56))',
    heroBg:
      'linear-gradient(135deg, rgba(17,24,39,0.96), rgba(59,130,246,0.78) 48%, rgba(124,58,237,0.72))',
    heroBorder: 'rgba(255,255,255,0.10)',
    heroShadow: '0 24px 72px rgba(15,23,42,0.26)',
    heroOverlay:
      'radial-gradient(circle at 18% 22%, rgba(255,255,255,0.16), transparent 20%), radial-gradient(circle at 78% 6%, rgba(255,255,255,0.12), transparent 18%)',
    heroOrb: 'rgba(255,255,255,0.14)',
  },
  executive: {
    rootBg:
      'radial-gradient(circle at top left, rgba(214,166,59,0.14), transparent 28%), linear-gradient(180deg, var(--bg-0), color-mix(in srgb, var(--bg-0) 90%, black 10%))',
    panelBg:
      'linear-gradient(180deg, color-mix(in srgb, var(--bg-1) 94%, white 6%), var(--bg-1))',
    panelBorder: 'rgba(214,166,59,0.18)',
    panelShadow: 'var(--shadow-md)',
    tileBg:
      'linear-gradient(180deg, rgba(214,166,59,0.08), color-mix(in srgb, var(--bg-1) 94%, black 6%))',
    heroBg: 'linear-gradient(135deg, #0a1224, #0f1f3d 48%, #183a71)',
    heroBorder: 'rgba(214,166,59,0.18)',
    heroShadow: '0 22px 64px rgba(2,6,23,0.32)',
    heroOverlay: 'linear-gradient(135deg, rgba(214,166,59,0.14), transparent 48%)',
    heroOrb: 'rgba(214,166,59,0.14)',
  },
  sunset: {
    rootBg:
      'radial-gradient(circle at top left, rgba(251,146,60,0.14), transparent 28%), radial-gradient(circle at top right, rgba(251,113,133,0.12), transparent 24%), linear-gradient(180deg, var(--bg-0), color-mix(in srgb, var(--bg-0) 90%, black 10%))',
    panelBg:
      'linear-gradient(180deg, color-mix(in srgb, var(--bg-1) 94%, white 6%), var(--bg-1))',
    panelBorder: 'rgba(234,88,12,0.18)',
    panelShadow: 'var(--shadow-md)',
    tileBg:
      'linear-gradient(180deg, rgba(234,88,12,0.08), color-mix(in srgb, var(--bg-1) 94%, black 6%))',
    heroBg: 'linear-gradient(135deg, #431407, #9a3412 48%, #fb7185)',
    heroBorder: 'rgba(251,146,60,0.18)',
    heroShadow: '0 22px 64px rgba(67,20,7,0.32)',
    heroOverlay:
      'radial-gradient(circle at 18% 22%, rgba(255,237,213,0.14), transparent 22%), radial-gradient(circle at 82% 0%, rgba(255,255,255,0.08), transparent 18%)',
    heroOrb: 'rgba(255,237,213,0.12)',
  },
  mono: {
    rootBg:
      'linear-gradient(180deg, var(--bg-0), color-mix(in srgb, var(--bg-0) 88%, black 12%))',
    panelBg:
      'linear-gradient(180deg, var(--bg-1), color-mix(in srgb, var(--bg-1) 96%, black 4%))',
    panelBorder: 'rgba(148,163,184,0.18)',
    panelShadow: 'var(--shadow-md)',
    tileBg:
      'linear-gradient(180deg, rgba(148,163,184,0.08), color-mix(in srgb, var(--bg-1) 94%, black 6%))',
    heroBg: 'linear-gradient(135deg, #020617, #0f172a 52%, #1e293b)',
    heroBorder: 'rgba(148,163,184,0.18)',
    heroShadow: '0 20px 60px rgba(2,6,23,0.30)',
    heroOverlay: 'linear-gradient(135deg, rgba(255,255,255,0.08), transparent 50%)',
    heroOrb: 'rgba(255,255,255,0.08)',
  },
};

function resolveDashboardStyle(style?: string): DashboardStyleId {
  return style && style in DASHBOARD_STYLE_PRESETS ? (style as DashboardStyleId) : 'modern';
}

function getDashboardStylePreset(
  style: DashboardStyleId,
  themeMode: AppearanceSettings['themeMode']
): DashboardStylePreset {
  const base = DASHBOARD_STYLE_PRESETS[style] ?? DASHBOARD_STYLE_PRESETS.modern;
  if (themeMode !== 'dark') return base;
  return { ...base, ...(DASHBOARD_DARK_OVERRIDES[style] ?? {}) };
}

function formatShortDate(date: Date) {
  return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function getStatusTone(value: number, good: number, warn: number) {
  if (value >= good) return { label: 'Strong', color: PALETTE.emerald };
  if (value >= warn) return { label: 'Watch', color: PALETTE.amber };
  return { label: 'Critical', color: PALETTE.red };
}

const axisStyle = { fill: 'var(--text-3)', fontSize: 10, fontWeight: 700 } as const;

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-2xl border p-3 shadow-2xl backdrop-blur-xl"
      style={{ background: 'rgba(9, 16, 30, 0.92)', borderColor: 'rgba(255,255,255,0.08)', minWidth: 150 }}
    >
      <p className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/65">{label}</p>
      <div className="space-y-1.5">
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
              <span className="text-[11px] font-semibold text-white/80">{entry.name}</span>
            </div>
            <span className="text-[12px] font-black text-white">
              {typeof entry.value === 'number'
                ? entry.value.toLocaleString(undefined, { maximumFractionDigits: 2 })
                : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

function Panel({
  title,
  subtitle,
  icon: Icon,
  accent,
  action,
  children,
  className = '',
}: {
  title: string;
  subtitle?: string;
  icon: any;
  accent: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.section
      variants={itemVariants}
      data-dashboard-surface="panel"
      className={`relative overflow-hidden border shadow-sm ${className}`}
      style={{
        background: 'var(--dash-panel-bg)',
        borderColor: 'var(--dash-panel-border)',
        boxShadow: 'var(--dash-panel-shadow)',
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
      />
      <div data-dashboard-region="panel-header" className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl"
            style={{ background: `${accent}16`, boxShadow: `inset 0 0 0 1px ${accent}18` }}
          >
            <Icon style={{ width: 18, height: 18, color: accent }} />
          </div>
          <div className="min-w-0">
            <h3 className="truncate text-[12px] font-black uppercase tracking-[0.18em] text-text-1">{title}</h3>
            {subtitle ? <p className="mt-1 text-xs text-text-3">{subtitle}</p> : null}
          </div>
        </div>
        {action}
      </div>
      <div data-dashboard-region="panel-body">{children}</div>
    </motion.section>
  );
}

function MetricTile({
  title,
  value,
  subtitle,
  accent,
  icon: Icon,
  trend,
  onClick,
}: {
  title: string;
  value: string | number;
  subtitle: string;
  accent: string;
  icon: any;
  trend?: string;
  onClick?: () => void;
}) {
  return (
    <motion.div
      variants={itemVariants}
      onClick={onClick}
      data-dashboard-surface="tile"
      className={`relative overflow-hidden border ${onClick ? 'cursor-pointer hover:shadow-md transition-all active:scale-[0.98]' : ''}`}
      style={{
        ['--dash-accent-soft' as any]: `${accent}10`,
        background: 'var(--dash-tile-bg)',
        borderColor: onClick ? `${accent}40` : `${accent}26`,
        boxShadow: 'var(--dash-panel-shadow)',
      }}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl"
          style={{ background: `${accent}16`, boxShadow: `inset 0 0 0 1px ${accent}20` }}
        >
          <Icon style={{ width: 18, height: 18, color: accent }} />
        </div>
        {trend ? (
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em]"
            style={{ color: accent, background: `${accent}12` }}
          >
            {trend}
          </span>
        ) : null}
      </div>
      <div className="text-[10px] font-black uppercase tracking-[0.18em] text-text-3">{title}</div>
      <div className="mt-2 text-[30px] font-black leading-none text-text-1">{value}</div>
      <div className="mt-2 text-xs leading-relaxed text-text-3">{subtitle}</div>
      {onClick && (
        <div className="absolute top-2 right-2 opacity-20 group-hover:opacity-100">
          <ArrowUpRight className="w-4 h-4" />
        </div>
      )}
    </motion.div>
  );
}

function ProgressRow({
  label,
  value,
  total,
  accent,
}: {
  label: string;
  value: number;
  total: number;
  accent: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold text-text-1">{label}</span>
        <span className="text-[11px] font-black" style={{ color: accent }}>
          {pct}%
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-bg-2">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${accent}, ${accent}aa)` }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1 }}
        />
      </div>
      <div className="mt-1 text-[10px] text-text-3">
        {value} of {total} items
      </div>
    </div>
  );
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [capas, setCapas] = useState<any[]>([]);
  const [audits, setAudits] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [documentsCount, setDocumentsCount] = useState(0);
  const [proceduresCount, setProceduresCount] = useState(0);
  const [sopsCount, setSopsCount] = useState(0);
  const [risksCount, setRisksCount] = useState(0);
  const [trainingRecords, setTrainingRecords] = useState<any[]>([]);
  const [supplierCount, setSupplierCount] = useState(0);
  const [complaintsCount, setComplaintsCount] = useState(0);
  const [kpiRecords, setKpiRecords] = useState<SmartKPI[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [risks, setRisks] = useState<any[]>([]);
  const [clockTime, setClockTime] = useState(new Date());
  const [appearance, setAppearance] = useState<AppearanceSettings>(loadAppearance);
  const [dateRange, setDateRange] = useState<number | 'custom'>(30);
  const [customDates, setCustomDates] = useState({ start: '', end: '' });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [buyerOrders, setBuyerOrders] = useState<BuyerOrder[]>([]);
  const [finalInspections, setFinalInspections] = useState<AQLInspection[]>([]);

  useEffect(() => {
    const load = async () => {
      setCertificates(getCertificates());
      setInspections(getProductionQualityRecords() as unknown as InspectionRecord[]);
      setProceduresCount(getProcedures().length);

      // Load real-time counts from DB
      const [docCount] = await Promise.all([
        db.documents.count(),
      ]);
      setDocumentsCount(docCount);
      try {
        const stored = localStorage.getItem('garmentqms_capas');
        setCapas(stored ? JSON.parse(stored) : []);
      } catch {
        setCapas([]);
      }
      try {
        const stored = localStorage.getItem('garmentqms_audits');
        setAudits(stored ? JSON.parse(stored) : []);
      } catch {
        setAudits([]);
      }
      try {
        const stored = localStorage.getItem('garmentqms_sops');
        setSopsCount(stored ? JSON.parse(stored).length : 0);
      } catch {
        setSopsCount(0);
      }
      try {
        const stored = localStorage.getItem('garmentqms_risks');
        const parsed = stored ? JSON.parse(stored) : [];
        setRisksCount(parsed.length);
        setRisks(parsed);
      } catch {
        setRisksCount(0);
        setRisks([]);
      }
      const [training, suppliersList, complaintsList, kpis, ordersList, aqlList] = await Promise.all([
        db.training.toArray(),
        db.supplierManagement.toArray(),
        db.customerComplaints.toArray(),
        db.kpiRecords.toArray(),
        db.orderSummary.toArray(),
        db.aqlInspections.toArray(),
      ]);
      setTrainingRecords(training);
      setSuppliers(suppliersList);
      setComplaints(complaintsList);
      setSupplierCount(suppliersList.length);
      setComplaintsCount(complaintsList.length);
      setBuyerOrders(ordersList as any);
      setFinalInspections(aqlList as any);
      const kpiWithVals = await Promise.all(kpis.map(async (k: any) => ({ ...k, currentValue: await calculateActualValue(k) })));
      setKpiRecords(kpiWithVals);
    };

    load();
    const refreshTimer = window.setInterval(load, 30000);
    const clockTimer = window.setInterval(() => setClockTime(new Date()), 1000);
    return () => {
      window.clearInterval(refreshTimer);
      window.clearInterval(clockTimer);
    };
  }, []);

  useEffect(() => {
    const syncAppearance = (event?: Event) => {
      const nextAppearance = (event as CustomEvent<AppearanceSettings> | undefined)?.detail ?? loadAppearance();
      setAppearance(nextAppearance);
    };

    window.addEventListener('qms-appearance-updated', syncAppearance as EventListener);
    window.addEventListener('storage', syncAppearance as EventListener);
    return () => {
      window.removeEventListener('qms-appearance-updated', syncAppearance as EventListener);
      window.removeEventListener('storage', syncAppearance as EventListener);
    };
  }, []);

  const filterDateAgo = useMemo(() => {
    if (dateRange === 'custom') return '';
    const date = new Date();
    date.setDate(date.getDate() - (dateRange as number));
    return date.toISOString().split('T')[0];
  }, [dateRange]);



  const checkDateInRange = (d: string) => {
    if (!d) return false;
    const dateStr = d.split('T')[0];
    if (dateRange === 'custom') {
      if (customDates.start && dateStr < customDates.start) return false;
      if (customDates.end && dateStr > customDates.end) return false;
      return true;
    }
    return dateStr >= filterDateAgo;
  };

  const recentInspections = useMemo(() => {
    return inspections.filter((item) => checkDateInRange(item.date || item.createdAt || ''));
  }, [inspections, filterDateAgo, dateRange, customDates]);

  const recentCapas = useMemo(() => {
    return capas.filter(item => checkDateInRange(item.createdAt || item.date || item.deadline || ''));
  }, [capas, filterDateAgo, dateRange, customDates]);

  const recentAudits = useMemo(() => {
    return audits.filter(item => checkDateInRange(item.date || item.createdAt || ''));
  }, [audits, filterDateAgo, dateRange, customDates]);

  const recentTraining = useMemo(() => {
    return trainingRecords.filter(item => checkDateInRange(item.createdAt || item.date || ''));
  }, [trainingRecords, filterDateAgo, dateRange, customDates]);

  const recentKpis = useMemo(() => {
    return kpiRecords.filter(item => checkDateInRange(item.createdAt || item.date || ''));
  }, [kpiRecords, filterDateAgo, dateRange, customDates]);

  const recentSuppliers = useMemo(() => {
    return suppliers.filter(item => checkDateInRange(item.createdAt || item.date || ''));
  }, [suppliers, filterDateAgo, dateRange, customDates]);

  const recentComplaints = useMemo(() => {
    return complaints.filter(item => checkDateInRange(item.createdAt || item.date || ''));
  }, [complaints, filterDateAgo, dateRange, customDates]);

  const recentRisks = useMemo(() => {
    return risks.filter(item => checkDateInRange(item.createdAt || item.date || ''));
  }, [risks, filterDateAgo, dateRange, customDates]);

  const recentOrders = useMemo(() => {
    return buyerOrders.filter(item => checkDateInRange(item.createdAt || ''));
  }, [buyerOrders, filterDateAgo, dateRange, customDates]);

  const recentFinalInspections = useMemo(() => {
    return finalInspections.filter(item => checkDateInRange(item.createdAt || ''));
  }, [finalInspections, filterDateAgo, dateRange, customDates]);

  const totalOrderQty = useMemo(() => {
    return buyerOrders.reduce((sum, order) => sum + (Number(order.qty) || 0), 0);
  }, [buyerOrders]);

  const qualityKpis = useMemo(() => {
    const totalChecked = recentInspections.reduce((sum, item) => sum + (item.checkedQuantity || 0), 0);
    const totalGoods = recentInspections.reduce((sum, item) => sum + (item.goodsQuantity || 0), 0);
    const totalDefects = recentInspections.reduce((sum, item) => sum + (item.totalDefects || 0), 0);
    const dhu = totalChecked > 0 ? (totalDefects / totalChecked) * 100 : 0;
    const rft = totalChecked > 0 ? (totalGoods / totalChecked) * 100 : 0;
    return { totalChecked, totalGoods, totalDefects, dhu, rft };
  }, [recentInspections]);

  const trendData = useMemo(() => {
    const grouped: Record<string, { checked: number; goods: number; defects: number }> = {};
    [...recentInspections]
      .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
      .forEach((item) => {
        const key = item.date || 'Unknown';
        if (!grouped[key]) grouped[key] = { checked: 0, goods: 0, defects: 0 };
        grouped[key].checked += item.checkedQuantity || 0;
        grouped[key].goods += item.goodsQuantity || 0;
        grouped[key].defects += item.totalDefects || 0;
      });

    return Object.entries(grouped)
      .map(([date, values]) => ({
        name: date === 'Unknown' ? 'N/A' : date.split('-').slice(1).join('/'),
        rft: values.checked > 0 ? Number(((values.goods / values.checked) * 100).toFixed(1)) : 0,
        dhu: values.checked > 0 ? Number(((values.defects / values.checked) * 100).toFixed(2)) : 0,
        defects: values.defects,
      }))
      .slice(-12);
  }, [recentInspections]);

  const defectBreakdown = useMemo(() => {
    const totals: Record<string, number> = {};
    recentInspections.forEach((item) => {
      (item.topDefects || []).forEach((defect) => {
        totals[defect.name] = (totals[defect.name] || 0) + (defect.count || 0);
      });
    });
    const total = Object.values(totals).reduce((sum, count) => sum + count, 0);
    return Object.entries(totals)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value], index) => ({
        name,
        value,
        share: total > 0 ? Math.round((value / total) * 100) : 0,
        color: CHART_COLORS[index % CHART_COLORS.length],
      }));
  }, [recentInspections]);

  const linePerformance = useMemo(() => {
    const grouped: Record<string, { checked: number; goods: number; defects: number }> = {};
    recentInspections.forEach((item) => {
      const line = item.lineNumber || 'Unknown';
      if (!grouped[line]) grouped[line] = { checked: 0, goods: 0, defects: 0 };
      grouped[line].checked += item.checkedQuantity || 0;
      grouped[line].goods += item.goodsQuantity || 0;
      grouped[line].defects += item.totalDefects || 0;
    });

    return Object.entries(grouped)
      .map(([name, values]) => ({
        name,
        rft: values.checked > 0 ? Number(((values.goods / values.checked) * 100).toFixed(1)) : 0,
        dhu: values.checked > 0 ? Number(((values.defects / values.checked) * 100).toFixed(2)) : 0,
      }))
      .sort((a, b) => b.rft - a.rft)
      .slice(0, 6);
  }, [recentInspections]);

  const auditStats = useMemo(() => {
    const total = recentAudits.length;
    const passed = recentAudits.filter((item: any) => item.overallScore != null && parseFloat(item.overallScore) >= 75).length;
    return { total, passed, rate: total > 0 ? Math.round((passed / total) * 100) : 0 };
  }, [recentAudits]);

  const capaStats = useMemo(() => {
    const open = recentCapas.filter((item) => item.status === 'Open' || item.status === 'In Progress').length;
    const overdue = recentCapas.filter((item) => item.status === 'Overdue').length;
    const closed = recentCapas.filter((item) => item.status === 'Closed').length;
    const total = recentCapas.length;
    return { open, overdue, closed, total, closureRate: total > 0 ? Math.round((closed / total) * 100) : 0 };
  }, [recentCapas]);

  const certStats = useMemo(() => {
    const expired = certificates.filter((item) => getDaysUntilExpiry(item.expiryDate) <= 0).length;
    const expiringSoon = certificates.filter((item) => {
      const daysLeft = getDaysUntilExpiry(item.expiryDate);
      return daysLeft > 0 && daysLeft <= 30;
    }).length;
    const valid = certificates.length - expired - expiringSoon;
    return { expired, expiringSoon, valid, total: certificates.length };
  }, [certificates]);

  const trainingStats = useMemo(() => {
    const grouped: Record<string, { total: number; completed: number }> = {};
    recentTraining.forEach((item: any) => {
      const department = item.department || item.data?.department || 'General';
      if (!grouped[department]) grouped[department] = { total: 0, completed: 0 };
      grouped[department].total += 1;
      const status = String(item.status || item.data?.status || '').toLowerCase();
      if (status === 'completed' || status === 'done' || status === 'active') grouped[department].completed += 1;
    });
    return Object.entries(grouped)
      .map(([department, values]) => ({
        department,
        total: values.total,
        completed: values.completed,
        score: values.total > 0 ? Math.round((values.completed / values.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4);
  }, [recentTraining]);

  const radarData = useMemo(() => {
    return formatRadarData(recentKpis);
  }, [recentKpis]);

  const commandStats = useMemo(
    () => [
      { label: 'Prod. Quality', value: recentInspections.length, page: 'prod-quality', accent: PALETTE.blue },
      { label: 'Documents', value: documentsCount, page: 'doc-control', accent: PALETTE.indigo },
      { label: 'Procedures', value: proceduresCount, page: 'procedure', accent: PALETTE.cyan },
      { label: 'SOPs', value: sopsCount, page: 'sop', accent: PALETTE.teal },
      { label: 'KPI Central', value: recentKpis.length, page: 'kpi', accent: PALETTE.emerald },
      { label: 'Risks', value: recentRisks.length, page: 'risk', accent: PALETTE.red },
      { label: 'Suppliers', value: recentSuppliers.length, page: 'supplier', accent: PALETTE.amber },
      { label: 'Complaints', value: recentComplaints.length, page: 'complaints', accent: PALETTE.rose },
    ],
    [recentComplaints.length, documentsCount, proceduresCount, recentRisks.length, sopsCount, recentSuppliers.length, recentInspections.length, recentKpis.length]
  );

  const liveFeed = useMemo(() => {
    const items = [
      {
        id: 'quality',
        label: 'Quality throughput updated',
        detail: `${qualityKpis.totalChecked.toLocaleString()} pieces checked in ${dateRange === 'custom' ? 'custom date range' : `the last ${dateRange} days`}`,
        accent: PALETTE.blue,
      },
      {
        id: 'orders',
        label: 'Buyer order tracking',
        detail: `${recentOrders.length} active orders processed in selected range`,
        accent: PALETTE.amber,
      },
      {
        id: 'inspection-summary',
        label: 'Final AQL inspection status',
        detail: `${recentFinalInspections.filter(i => i.result === 'PASS').length} lots passed and ${recentFinalInspections.filter(i => i.result === 'FAIL').length} failing lots`,
        accent: PALETTE.emerald,
      },
      {
        id: 'audit',
        label: 'Audit performance snapshot',
        detail: `${auditStats.passed}/${auditStats.total} audits meeting threshold`,
        accent: auditStats.rate >= 80 ? PALETTE.emerald : PALETTE.amber,
      },
    ];
    return items;
  }, [auditStats.passed, auditStats.rate, auditStats.total, qualityKpis.totalChecked, recentOrders.length, recentFinalInspections, dateRange]);

  const rftTone = getStatusTone(Math.round(qualityKpis.rft), 95, 88);
  const auditTone = getStatusTone(auditStats.rate, 90, 75);
  const capaTone = getStatusTone(capaStats.closureRate, 85, 65);
  const dashboardStyle = resolveDashboardStyle(appearance.dashboardStyle);
  const activeStyle = getDashboardStylePreset(dashboardStyle, appearance.themeMode);
  const heroTone = appearance.themeMode === 'dark' || dashboardStyle !== 'minimal' ? 'dark' : 'light';
  const densityTokens =
    appearance.density === 'ultra-compact'
      ? { hero: '12px', panel: '10px', tile: '10px', card: '10px' }
      : appearance.density === 'compact'
        ? { hero: '18px', panel: '14px', tile: '14px', card: '14px' }
        : appearance.density === 'spacious'
          ? { hero: '30px', panel: '24px', tile: '20px', card: '20px' }
          : appearance.density === 'airy'
            ? { hero: '42px', panel: '36px', tile: '28px', card: '28px' }
            : { hero: '24px', panel: '20px', tile: '16px', card: '18px' };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      data-dashboard-root="true"
      className="min-h-screen space-y-6 px-4 py-6 sm:px-6 lg:px-8 bg-bg-0"
      style={{
        background: appearance.bgImage && appearance.bgImage !== 'none' ? 'transparent' : 'var(--bg-0)',
        ['--dash-panel-bg' as any]: 'var(--bg-1)',
        ['--dash-panel-border' as any]: 'color-mix(in srgb, var(--border) 100%, transparent)',
        ['--dash-panel-shadow' as any]: 'var(--shadow-sm)',
        ['--dash-tile-bg' as any]: 'var(--bg-1)',
        ['--dash-hero-padding' as any]: densityTokens.hero,
        ['--dash-panel-padding' as any]: densityTokens.panel,
        ['--dash-tile-padding' as any]: densityTokens.tile,
        ['--dash-card-padding' as any]: densityTokens.card,
        ['--dash-radius-hero' as any]: 'calc(var(--radius) * 1.5)',
        ['--dash-radius-panel' as any]: 'calc(var(--radius) * 1.5)',
        ['--dash-radius-tile' as any]: 'calc(var(--radius) * 1.5)',
        ['--dash-radius-card' as any]: 'calc(var(--radius) * 1.5)',
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-text-1">Enterprise Dashboard</h1>
          <p className="text-sm text-text-3 mt-1">Real-time quality, compliance, and operational insights.</p>
        </div>

        <div className="flex justify-end flex-wrap items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-bg-1 border border-border-main rounded-md text-sm font-semibold text-text-1 hover:border-accent transition-colors shadow-sm cursor-pointer"
            >
              <Calendar className="h-4 w-4 text-text-3" />
              {dateRange === 'custom' ? 'Custom Range' : `Last ${dateRange} Days`}
              <ChevronDown className={`h-4 w-4 text-text-3 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFilterOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsFilterOpen(false)} />
                <div className="absolute top-full right-0 mt-2 w-56 flex flex-col gap-1 bg-bg-1 border border-border-main rounded-md shadow-lg p-2 z-[100]">
                  {[7, 30, 90, 365].map((days) => (
                    <button
                      key={days}
                      onClick={() => { setDateRange(days); setIsFilterOpen(false); }}
                      className={`text-left px-3 py-2 text-sm font-medium rounded-md flex justify-between items-center transition-colors cursor-pointer ${dateRange === days ? 'bg-accent/10 text-accent' : 'text-text-1 hover:bg-bg-2'
                        }`}
                    >
                      Last {days} Days
                      {dateRange === days && <CheckCircle2 className="h-4 w-4" />}
                    </button>
                  ))}
                  <div className="pt-2 mt-1 border-t border-border-main flex flex-col gap-2">
                    <span className="text-xs font-semibold text-text-3 px-2">Custom Range</span>
                    <input type="date" value={customDates.start} onChange={(e) => { setCustomDates(p => ({ ...p, start: e.target.value })); setDateRange('custom'); }} className="w-full text-sm bg-bg-2 border border-border-main rounded px-2 py-1.5 focus:border-accent outline-none text-text-1 cursor-pointer" />
                    <input type="date" value={customDates.end} onChange={(e) => { setCustomDates(p => ({ ...p, end: e.target.value })); setDateRange('custom'); }} className="w-full text-sm bg-bg-2 border border-border-main rounded px-2 py-1.5 focus:border-accent outline-none text-text-1 cursor-pointer" />
                  </div>
                </div>
              </>
            )}
          </div>
          <button
            onClick={() => onNavigate?.('settings')}
            className="flex items-center gap-2 px-4 py-2 bg-bg-1 border border-border-main rounded-md text-sm font-semibold text-text-1 hover:border-accent transition-colors shadow-sm cursor-pointer"
          >
            <Sparkles className="h-4 w-4 text-accent" />
            Appearance
          </button>
        </div>
      </div>

      <motion.div variants={containerVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricTile
          title="Right First Time"
          value={`${qualityKpis.rft.toFixed(1)}%`}
          subtitle="Primary production quality signal."
          accent={PALETTE.blue}
          icon={Target}
          trend={`${recentInspections.length} logs`}
        />
        <MetricTile
          title="Defect Pressure"
          value={qualityKpis.dhu.toFixed(2)}
          subtitle="DHU tracking (Lower is better)."
          accent={PALETTE.red}
          icon={ShieldAlert}
          trend={qualityKpis.dhu <= 3 ? 'On target' : 'Above target'}
        />
        <MetricTile
          title="Total Checked"
          value={qualityKpis.totalChecked.toLocaleString()}
          subtitle="Quality logs across units."
          accent={PALETTE.indigo}
          icon={ClipboardCheck}
          trend="Production & Quality"
          onClick={() => onNavigate?.('prod-quality')}
        />
        <MetricTile
          title="Order Management"
          value={totalOrderQty.toLocaleString()}
          subtitle="Total volume across all orders."
          accent={PALETTE.amber}
          icon={Layers3}
          trend={`${buyerOrders.length} Orders`}
          onClick={() => onNavigate?.('buyer-summary')}
        />
        <MetricTile
          title="Final Inspection"
          value={recentFinalInspections.length}
          subtitle="AQL Final audits conducted."
          accent={PALETTE.emerald}
          icon={CheckCircle2}
          trend="Standard Registry"
          onClick={() => onNavigate?.('inspection')}
        />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col">
          <Panel
            title="Operational Trend"
            subtitle="Live quality curve with RFT and DHU comparison"
            icon={TrendingUp}
            accent={PALETTE.blue}
            className="flex-1"
            action={
              <button
                onClick={() => onNavigate?.('prod-quality')}
                className="text-xs font-semibold text-accent hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Module <ChevronRight className="h-3 w-3" />
              </button>
            }
          >
            <div className="h-[320px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="rftFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PALETTE.blue} stopOpacity={0.25} />
                      <stop offset="100%" stopColor={PALETTE.blue} stopOpacity={0.01} />
                    </linearGradient>
                    <linearGradient id="dhuFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor={PALETTE.red} stopOpacity={0.15} />
                      <stop offset="100%" stopColor={PALETTE.red} stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.6} />
                  <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} dy={10} />
                  <YAxis tick={axisStyle} axisLine={false} tickLine={false} dx={-10} width={34} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="rft" name="RFT %" stroke={PALETTE.blue} fill="url(#rftFill)" strokeWidth={2.5} />
                  <Area type="monotone" dataKey="dhu" name="DHU %" stroke={PALETTE.red} fill="url(#dhuFill)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>

        <div className="lg:col-span-1 flex flex-col">
          <Panel
            title="Live Feed"
            subtitle="Critical operational signals"
            icon={Activity}
            accent={PALETTE.cyan}
            className="flex-1"
          >
            <div className="space-y-4 mt-2">
              {liveFeed.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-md bg-bg-2/60 border border-border-main flex items-start gap-3"
                >
                  <div className="mt-1 h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: item.accent }} />
                  <div>
                    <h4 className="text-[13px] font-bold text-text-1">{item.label}</h4>
                    <p className="text-[11px] text-text-3 mt-1 leading-relaxed">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Panel
          title="Defect Mix"
          subtitle="Top recurring defects distribution"
          icon={Layers3}
          accent={PALETTE.red}
        >
          <div className="flex flex-col h-[280px]">
            <div className="h-[140px] w-full shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={defectBreakdown}
                    dataKey="value"
                    nameKey="name"
                    innerRadius="65%"
                    outerRadius="90%"
                    paddingAngle={4}
                    stroke="none"
                    isAnimationActive={true}
                    animationDuration={1200}
                    animationBegin={200}
                    cornerRadius={4}
                  >
                    {defectBreakdown.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.6, type: 'spring' }}
                    className="text-2xl font-black text-text-1 leading-none"
                  >
                    {qualityKpis.totalDefects}
                  </motion.div>
                  <div className="text-[9px] font-bold uppercase tracking-wider text-text-3 mt-1">Total</div>
                </div>
              </div>
            </div>
            <div className="space-y-1.5 mt-4 overflow-y-auto pr-1 flex-1">
              {defectBreakdown.length > 0 ? (
                defectBreakdown.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + 0.3 }}
                    className="flex justify-between items-center text-xs p-1.5 rounded hover:bg-bg-2 transition-colors border border-transparent hover:border-border-main group cursor-default"
                  >
                    <span className="font-semibold text-text-2 group-hover:text-text-1 truncate pr-2 flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full block border border-white/10 shadow-sm" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="text-text-3 shrink-0 font-medium group-hover:text-text-2 bg-bg-2 px-1.5 py-0.5 rounded-sm">
                      {item.share}% ({item.value})
                    </span>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-xs text-text-3 h-full flex items-center justify-center">No defect data available</div>
              )}
            </div>
          </div>
        </Panel>

        <Panel
          title="Line Performance"
          subtitle="RFT and DHU comparison by line"
          icon={Factory}
          accent={PALETTE.amber}
        >
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={linePerformance} barGap={4} margin={{ top: 10, right: 0, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.6} />
                <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="rft" name="RFT %" fill={PALETTE.amber} radius={[4, 4, 0, 0]} barSize={12} />
                <Bar dataKey="dhu" name="DHU %" fill={PALETTE.red} radius={[4, 4, 0, 0]} barSize={12} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="KPI Performance" subtitle="Cross-functional metric scores" icon={Target} accent={PALETTE.indigo}>
          <div className="h-[280px] w-full pt-2">
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                  <PolarGrid stroke="var(--border)" opacity={0.6} />
                  <PolarAngleAxis
                    dataKey="subject"
                    tick={{ fill: 'var(--text-3)', fontSize: 10, fontWeight: 700 }}
                    tickFormatter={(tick) => tick.length > 15 ? tick.substring(0, 15) + '...' : tick}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke={PALETTE.indigo}
                    strokeWidth={2}
                    fill={PALETTE.indigo}
                    fillOpacity={0.3}
                    isAnimationActive={true}
                    animationDuration={1500}
                    animationBegin={300}
                  />
                  <Tooltip content={<CustomTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-text-3">No KPI data configured</div>
            )}
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-6">
        <Panel
          title="Compliance & Readiness"
          subtitle="Aggregated department progressions"
          icon={CheckCircle2}
          accent={PALETTE.emerald}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
            <div className="space-y-6">
              <ProgressRow label="Audit passing threshold" value={auditStats.passed} total={auditStats.total || 1} accent={PALETTE.blue} />
              <ProgressRow label="CAPA closure rate" value={capaStats.closed} total={capaStats.total || 1} accent={PALETTE.amber} />
              <ProgressRow label="Valid certificates" value={certStats.valid} total={certStats.total || 1} accent={PALETTE.emerald} />
            </div>
            <div className="space-y-4">
              {trainingStats.length > 0 ? (
                trainingStats.map((item) => (
                  <div key={item.department} className="border-b border-border-main pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-bold text-text-1">{item.department}</span>
                      <span className="font-bold text-indigo-500">{item.score}%</span>
                    </div>
                    <div className="h-2 bg-bg-2 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${item.score}%` }} />
                    </div>
                    <div className="text-[10px] text-text-3 mt-1.5">{item.completed}/{item.total} trained</div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center h-full">
                  <GraduationCap className="h-10 w-10 text-text-4 mb-3" />
                  <p className="text-sm text-text-3 font-medium">No active training metrics</p>
                </div>
              )}
            </div>
          </div>
        </Panel>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Panel title="Command Shortcuts" subtitle="Fast navigation blocks" icon={Gauge} accent={PALETTE.cyan}>
            <div className="grid gap-3 mt-3 grid-cols-2">
              {commandStats.map((item) => (
                <button
                  key={item.label}
                  onClick={() => onNavigate?.(item.page)}
                  className="flex flex-col p-4 rounded-lg bg-bg-2/50 hover:bg-bg-2 transition-colors border border-border-main text-left cursor-pointer group"
                >
                  <span className="text-xs font-bold text-text-3 whitespace-nowrap group-hover:text-text-1 transition-colors">{item.label}</span>
                  <span className="text-2xl font-black mt-2" style={{ color: item.accent }}>{item.value}</span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel title="Risk Focus" subtitle="Immediate attention required" icon={AlertTriangle} accent={PALETTE.red}>
            <div className="space-y-3 mt-3">
              {[
                { label: 'Overdue CAPA', value: capaStats.overdue, accent: PALETTE.red, page: 'capa' },
                { label: 'Expiring Certificates', value: certStats.expiringSoon, accent: PALETTE.amber, page: 'certification' },
                { label: 'Open Complaints', value: recentComplaints.length, accent: PALETTE.red, page: 'complaints' },
                { label: 'Logged Risks', value: recentRisks.length, accent: PALETTE.indigo, page: 'risk' },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => onNavigate?.(item.page)}
                  className="w-full flex items-center justify-between p-3.5 rounded-lg bg-bg-2/50 hover:bg-bg-2 transition-colors border border-border-main text-left cursor-pointer group"
                >
                  <span className="text-xs font-bold text-text-2 group-hover:text-text-1 transition-colors">{item.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black" style={{ color: item.accent }}>{item.value}</span>
                    <ChevronRight className="h-4 w-4 text-text-4 group-hover:text-text-1 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </motion.div>
  );
}
