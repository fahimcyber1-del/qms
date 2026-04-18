import { UniversalRecord } from '../types';

export interface SmartKPI extends UniversalRecord {
  kpiName: string;
  kpiCategory: 'Production Quality' | 'Inspection Quality' | 'Audit Compliance' | 'Customer Satisfaction' | 'Custom';
  kpiFormula: string;
  targetValue: number;
  warningThreshold: number;
  criticalThreshold: number;
  dataSourceModule: string;
  calculationFrequency: 'Daily' | 'Weekly' | 'Monthly';
  autoDataFetch: boolean;
  status: 'Active' | 'Inactive';
  
  // Runtime calculated
  currentValue?: number;
  trend?: number;
}

import { db } from '../db/db';

export const calculateActualValue = async (kpi: SmartKPI): Promise<number> => {
  if (!kpi.autoDataFetch) return kpi.currentValue || 0;
  
  try {
    if (kpi.kpiName === 'DHU') {
      const ls = localStorage.getItem('qms_prod_quality');
      if (!ls) return 0;
      const items = JSON.parse(ls);
      let totalDefects = 0; let totalChecked = 0;
      items.forEach((i: any) => { 
        totalDefects += Number(i.totalDefects || 0); 
        totalChecked += Number(i.checkedQuantity || 0); 
      });
      return totalChecked ? Number(((totalDefects / totalChecked) * 100).toFixed(2)) : 0;
    }
    
    if (kpi.kpiName === 'RFT') {
      const ls = localStorage.getItem('qms_prod_quality');
      if (!ls) return 0;
      const items = JSON.parse(ls);
      let totalGoods = 0; let totalChecked = 0;
      items.forEach((i: any) => { 
        totalGoods += Number(i.goodsQuantity || 0); 
        totalChecked += Number(i.checkedQuantity || 0); 
      });
      return totalChecked ? Number(((totalGoods / totalChecked) * 100).toFixed(2)) : 0;
    }
    
    if (kpi.kpiName === 'Audit Pass Rate') {
      const ls = localStorage.getItem('garmentqms_audits');
      if (!ls) return 0;
      const items = JSON.parse(ls);
      let passed = 0; let total = items.length;
      items.forEach((i: any) => { if(Number(i.overallScore) >= 75) passed++; });
      return total ? Number(((passed / total) * 100).toFixed(2)) : 0;
    }
    
    if (kpi.kpiName === 'Final Inspection Pass Rate') {
      const ls = localStorage.getItem('garmentqms_inspections');
      if (!ls) return 0;
      const items = JSON.parse(ls).filter((i: any) => i.stage === 'Final');
      let passed = 0; let total = 0;
      items.forEach((i: any) => { 
        passed += Number(i.passedQuantity || i.checkedQuantity - i.totalDefects); 
        total += Number(i.checkedQuantity || 0); 
      });
      // Fallback if pieces aren't logged, use report count
      if (total === 0 && items.length > 0) {
         let passCount = items.filter((i: any) => i.result === 'Pass').length;
         return Number(((passCount / items.length) * 100).toFixed(2));
      }
      return total ? Number(((passed / total) * 100).toFixed(2)) : 0;
    }
    
    if (kpi.kpiName === 'Customer Complaint Rate') {
      try {
        const complaints = await db.customerComplaints?.toArray?.() || [];
        const totalShipments = 120; // Example baseline for demo
        return totalShipments ? Number(((complaints.length / totalShipments) * 100).toFixed(2)) : 0;
      } catch (e) {
        // Fallback for older schema
        const ls = localStorage.getItem('garmentqms_complaints');
        if (!ls) return 0;
        const complaints = JSON.parse(ls).length;
        const totalShipments = 120; // Example baseline for demo
        return totalShipments ? Number(((complaints / totalShipments) * 100).toFixed(2)) : 0;
      }
    }
  } catch (err) {
    console.error("Auto calculation failed for KPI: ", kpi.kpiName, err);
  }

  return kpi.currentValue || 0;
};

export const getKpiColor = (val: number, target: number, warn: number, crit: number, kpiName: string): { color: string, status: string } => {
  const isLowerBetter = kpiName === 'DHU' || kpiName === 'Customer Complaint Rate';
  if (isLowerBetter) {
    if (val <= target) return { color: '#10b981', status: 'Optimal' }; 
    if (val <= warn) return { color: '#f59e0b', status: 'Warning' };
    return { color: '#ef4444', status: 'Critical' }; 
  } else {
    if (val >= target) return { color: '#10b981', status: 'Optimal' }; 
    if (val >= warn) return { color: '#f59e0b', status: 'Warning' };
    return { color: '#ef4444', status: 'Critical' }; 
  }
};

export const DEFAULT_KPIS: Partial<SmartKPI>[] = [
  { kpiName: 'DHU', kpiCategory: 'Production Quality', kpiFormula: '(Total Defects / Total Checked Pieces) × 100', targetValue: 3, warningThreshold: 5, criticalThreshold: 7, dataSourceModule: 'Inspection', calculationFrequency: 'Daily', autoDataFetch: true, status: 'Active' },
  { kpiName: 'RFT', kpiCategory: 'Production Quality', kpiFormula: '(First Pass OK Pieces / Total Produced Pieces) × 100', targetValue: 95, warningThreshold: 90, criticalThreshold: 85, dataSourceModule: 'Production Quality', calculationFrequency: 'Daily', autoDataFetch: true, status: 'Active' },
  { kpiName: 'Audit Pass Rate', kpiCategory: 'Audit Compliance', kpiFormula: '(Passed Audits / Total Audits) × 100', targetValue: 90, warningThreshold: 80, criticalThreshold: 70, dataSourceModule: 'Audit Management', calculationFrequency: 'Monthly', autoDataFetch: true, status: 'Active' },
  { kpiName: 'Final Inspection Pass Rate', kpiCategory: 'Inspection Quality', kpiFormula: '(Passed Quantity / Inspected Quantity) × 100', targetValue: 98, warningThreshold: 95, criticalThreshold: 90, dataSourceModule: 'Final Inspection', calculationFrequency: 'Weekly', autoDataFetch: true, status: 'Active' },
  { kpiName: 'Customer Complaint Rate', kpiCategory: 'Customer Satisfaction', kpiFormula: '(Complaints / Total Shipments) × 100', targetValue: 1, warningThreshold: 3, criticalThreshold: 5, dataSourceModule: 'Customer Complaint', calculationFrequency: 'Monthly', autoDataFetch: true, status: 'Active' }
];

export const formatRadarData = (kpis: SmartKPI[]) => {
  return kpis.filter(k => k.status === 'Active').map(k => {
    const isLowerBetter = k.kpiName === 'DHU' || k.kpiName === 'Customer Complaint Rate';
    let score = 0;
    if (k.currentValue !== undefined) {
       if (isLowerBetter) score = Math.max(0, 100 - (k.currentValue / Math.max(1, k.targetValue)) * 50);
       else score = Math.min(100, (k.currentValue / Math.max(1, k.targetValue)) * 100);
    }
    return {
      subject: k.kpiName.replace(' Rate', '').replace('Final ', ''),
      value: score,
      fullMark: 100,
    };
  });
};
