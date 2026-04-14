import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UniversalModule } from '../components/universal/UniversalModule';
import { MODULE_CONFIGS } from '../config/moduleConfigs';
import { Factory, Link, ClipboardList } from 'lucide-react';
import { SubSupplierEvaluation } from './SubSupplierEvaluation';

interface SupplierModuleProps {
  onNavigate: (page: string, params?: any) => void;
}

export function SupplierModule({ onNavigate }: SupplierModuleProps) {
  const [activeTab, setActiveTab] = useState('supplier');

  const tabs = [
    { id: 'supplier',    label: 'Principal Supplier Management', icon: Factory },
    { id: 'evaluation',  label: 'Sub Supplier Management',       icon: ClipboardList },
  ];

  return (
    <div className="flex flex-col w-full h-full p-4 md:p-6 lg:p-8 space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-text-1 flex items-center gap-3">
            <Factory className="w-7 h-7 text-accent" />
            Supplier Multi-Tier Management
          </h1>
          <p className="text-text-3 text-sm mt-1">Manage principal suppliers, sub-suppliers and run selection evaluations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm flex overflow-x-auto custom-scrollbar flex-shrink-0">
        {tabs.map((tab) => (
           <button
             key={tab.id}
             onClick={() => setActiveTab(tab.id)}
             className={`flex items-center gap-2 px-5 py-3.5 text-sm font-semibold transition-all whitespace-nowrap min-w-max border-b-2 ${
               activeTab === tab.id 
                 ? 'text-accent border-accent bg-accent/5' 
                 : 'text-text-3 border-transparent hover:text-text-1 hover:bg-bg-2'
             }`}
           >
             <tab.icon className="w-4 h-4" />
             {tab.label}
           </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 relative border border-border-main rounded-2xl overflow-hidden bg-bg-1 shadow-sm">
        <AnimatePresence mode="wait">
          {activeTab === 'supplier' && (
            <motion.div
              key="supplier"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="absolute inset-0 overflow-auto"
            >
              <UniversalModule config={MODULE_CONFIGS.supplierManagement} onNavigate={onNavigate} />
            </motion.div>
          )}
          {activeTab === 'evaluation' && (
            <motion.div
              key="evaluation"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="absolute inset-0 overflow-auto"
            >
              <SubSupplierEvaluation />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
