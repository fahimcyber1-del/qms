import React from 'react';
import { motion } from 'motion/react';
import { 
  LucideIcon, 
  TrendingUp, 
  TrendingDown, 
  ArrowLeft,
  Download,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Stat {
  label: string;
  value: string | number;
  unit?: string;
  trend?: string;
  up?: boolean;
  icon: LucideIcon;
  color: string;
}

interface ModulePageTemplateProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  stats?: Stat[];
  onBack?: () => void;
  onAdd?: () => void;
  onExport?: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
  filters?: React.ReactNode;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export function ModulePageTemplate({
  title,
  subtitle,
  icon: Icon,
  stats = [],
  onBack,
  onAdd,
  onExport,
  actions,
  children,
  filters
}: ModulePageTemplateProps) {
  return (
    <motion.div 
      className="p-4 md:p-8 space-y-8 min-h-screen bg-bg-0"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* ── Header ── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2.5 rounded-xl border border-border-main bg-bg-1 hover:bg-bg-2 transition-all group"
            >
              <ArrowLeft className="w-5 h-5 text-text-3 group-hover:text-accent transition-colors" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-accent/10 border border-accent/20">
                <Icon className="w-6 h-6 text-accent" />
              </div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-text-1">{title}</h1>
            </div>
            <p className="text-text-3 text-sm mt-1 font-medium">{subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {onExport && (
            <button 
              onClick={onExport}
              className="flex-1 md:flex-none btn btn-ghost border-border-main flex items-center justify-center gap-2 px-6"
            >
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Export</span>
            </button>
          )}
          {onAdd && (
            <button 
              onClick={onAdd}
              className="flex-1 md:flex-none btn btn-primary flex items-center justify-center gap-2 px-6 shadow-lg shadow-accent/20"
            >
              <Plus className="w-4 h-4" />
              <span>Add Record</span>
            </button>
          )}
          {actions}
        </div>
      </div>

      {/* ── Stats Bento Grid ── */}
      {stats.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants} 
              className="bg-bg-1 border border-border-main rounded-2xl p-6 shadow-sm relative overflow-hidden group hover:border-accent/30 transition-colors"
            >
              <div className={cn(
                "absolute -top-4 -right-4 p-8 opacity-5 group-hover:opacity-10 transition-opacity",
                stat.color
              )}>
                <stat.icon className="w-20 h-20" />
              </div>
              
              <div className="text-[10px] font-black text-text-3 uppercase tracking-[0.2em] mb-3">{stat.label}</div>
              <div className="flex items-baseline gap-1.5 mt-auto">
                <span className="text-3xl font-black text-text-1 tracking-tight">{stat.value}</span>
                {stat.unit && <span className="text-sm font-bold text-text-3">{stat.unit}</span>}
              </div>
              
              {stat.trend && (
                <div className={cn(
                  "mt-4 flex items-center gap-1.5 text-[10px] font-black px-2 py-1 rounded-lg w-fit",
                  stat.up ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                )}>
                  {stat.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.trend}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {/* ── Body ── */}
      <motion.div variants={itemVariants} className="space-y-6">
        {filters && (
          <div className="bg-bg-1 border border-border-main rounded-2xl p-4 shadow-sm flex flex-wrap gap-4 items-center">
            {filters}
          </div>
        )}
        <div className="bg-bg-1 border border-border-main rounded-2xl shadow-sm overflow-hidden">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}
