import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, CheckCircle2, AlertCircle, Plus, Download, 
  Search, Filter, Calendar, Eye, Edit2, Trash2, FileText, 
  ChevronRight, Truck, Clock, User, Building, X, Package, DollarSign
} from 'lucide-react';
import { getTable } from '../db/db';
import * as XLSX from 'xlsx';
import { exportTableToPDF } from '../utils/pdfExportUtils';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 }
};

interface OrderRecord {
  id: string;
  orderNo: string;
  buyer: string;
  styleNo: string;
  qty: number;
  shipDate: string;
  status: string;
  responsiblePerson: string;
  createdAt: string;
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

export function BuyerOrderSummary({ onNavigate }: Props) {
  const [records, setRecords] = useState<OrderRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => {
    const load = async () => {
      const data = await getTable('orderSummary').toArray();
      setRecords(data as any);
    };
    load();
  }, []);

  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      const matchesSearch = 
        r.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.styleNo.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

      return matchesSearch && matchesStatus;
    });
  }, [records, searchQuery, filterStatus]);

  const stats = useMemo(() => {
    return {
      totalOrders: records.length,
      shipped: records.filter(r => r.status === 'Shipped' || r.status === 'Ready').length,
      inProduction: records.filter(r => r.status === 'In Production' || r.status === 'Running').length,
      pending: records.filter(r => r.status === 'Pending' || r.status === 'New').length
    };
  }, [records]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure?")) {
      await getTable('orderSummary').delete(id);
      setRecords(records.filter(r => r.id !== id));
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredRecords);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Order Summary");
    XLSX.writeFile(wb, "Buyer_Order_Summary.xlsx");
  };

  const exportPDF = () => {
    exportTableToPDF({
      moduleName: 'Buyer Order Summary',
      columns: ['Order #', 'Buyer', 'Style', 'Qty', 'Ship Date', 'Status'],
      rows: filteredRecords.map(r => [r.orderNo, r.buyer, r.styleNo, r.qty.toLocaleString(), r.shipDate, r.status]),
      fileName: 'Buyer_Order_Summary_Report'
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-text-1 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8 text-accent" />
            Buyer Order Summary
          </h1>
          <p className="text-text-2 text-base mt-2">Centralized tracking of buyer orders, styles, and shipment timelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportExcel}>
            <Download className="w-4 h-4" /> Excel
          </button>
          <button className="btn btn-ghost flex items-center gap-2" onClick={exportPDF}>
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => onNavigate('buyer-order-summary-form', { mode: 'create' })}>
            <Plus className="w-4 h-4" /> New Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {[
          { label: 'Cumulative Orders', value: stats.totalOrders, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Completed / Shipped', value: stats.shipped, icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10' },
          { label: 'In Production', value: stats.inProduction, icon: Clock, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'New / Pending', value: stats.pending, icon: DollarSign, color: 'text-purple-main', bg: 'bg-purple-main/10' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl p-6 flex items-center gap-5 shadow-sm hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-7 h-7" />
            </div>
            <div>
              <div className="text-sm font-medium text-text-2 mb-1">{stat.label}</div>
              <div className="text-3xl font-bold text-text-1 tracking-tight">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 bg-bg-1 p-3 rounded-2xl border border-border-main shadow-sm">
        <div className="relative flex-1 min-w-[250px]">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-text-2" />
          <input 
            type="text" 
            placeholder="Search order #, buyer, or style..." 
            className="w-full bg-bg-2 border-none rounded-xl pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-2"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-8 bg-border-main hidden md:block"></div>
        <select className="bg-bg-2 border-none rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-accent outline-none text-text-1" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="All">All Statuses</option>
          <option value="New">New Order</option>
          <option value="In Production">In Production</option>
          <option value="Ready">Ready for Ship</option>
          <option value="Shipped">Shipped</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/50 border-b border-border-main text-[10px] uppercase tracking-widest text-text-2 font-black">
                <th className="p-4 pl-6">Order & Style</th>
                <th className="p-4">Buyer Identity</th>
                <th className="p-4 text-center">Quantity</th>
                <th className="p-4 text-center">Ex-Factory Date</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredRecords.map(r => (
                <tr key={r.id} className="hover:bg-bg-2/60 transition-all duration-200 group">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-text-1 text-sm">{r.orderNo}</div>
                    <div className="text-[11px] text-text-3 mt-1 font-mono uppercase tracking-tight">{r.styleNo}</div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                       <div className="w-7 h-7 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-[10px] font-black text-accent uppercase">
                          {r.buyer.substring(0, 2)}
                       </div>
                       <span className="text-sm font-semibold text-text-1">{r.buyer}</span>
                    </div>
                  </td>
                  <td className="p-4 text-center font-bold text-text-1 text-sm">
                    {r.qty.toLocaleString()}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                       <span className={`text-xs font-bold ${new Date(r.shipDate) < new Date() ? 'text-red-500' : 'text-text-2'}`}>
                         {new Date(r.shipDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}
                       </span>
                       <span className="text-[9px] text-text-3 uppercase mt-0.5 tracking-tighter font-black">Contracted</span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-tighter border ${
                      r.status === 'Shipped' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                      r.status === 'In Production' || r.status === 'Running' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                      'bg-purple-main/10 text-purple-main border-purple-main/20'
                    }`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-accent/10 hover:text-accent text-text-2" onClick={() => onNavigate('buyer-order-summary-form', { mode: 'view', data: r })}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-blue-500/10 hover:text-blue-500 text-text-2" onClick={() => onNavigate('buyer-order-summary-form', { mode: 'edit', data: r })}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-500/10 hover:text-red-500 text-text-2" onClick={() => handleDelete(r.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center ml-auto group-hover:hidden">
                      <ChevronRight className="w-4 h-4 text-text-3 opacity-30" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
