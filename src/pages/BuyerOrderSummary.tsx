import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, CheckCircle2, AlertCircle, Plus, Download, 
  Search, Filter, Calendar, Eye, Edit2, Trash2, FileText, 
  ChevronRight, Truck, Clock, User, Building, X, Package, DollarSign, 
  Activity, ArrowUpRight, LayoutGrid, List
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
  merchandiser?: string;
  responsiblePerson?: string;
  createdAt: string;
  priority?: string;
  fobPrice?: number;
  cmPrice?: number;
  unitPrice?: number;
  currency?: string;
  remarks?: string;
  fabricType?: string;
}

interface Props {
  onNavigate: (page: string, params?: any) => void;
}

import { Pagination } from '../components/Pagination';

export function BuyerOrderSummary({ onNavigate }: Props) {
  const [records, setRecords] = useState<OrderRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortConfig, setSortConfig] = useState<{key: keyof OrderRecord, direction: 'asc' | 'desc'}>({ key: 'shipDate', direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const load = async () => {
      const data = await getTable('orderSummary').toArray();
      setRecords(data as any);
    };
    load();
  }, []);

  const filteredRecords = useMemo(() => {
    let result = records.filter(r => {
      const orderNum = (r.orderNo || (r as any).orderNumber || '').toLowerCase();
      const buyerName = (r.buyer || '').toLowerCase();
      const styleRef = (r.styleNo || (r as any).style || '').toLowerCase();
      
      const matchesSearch = 
        orderNum.includes(searchQuery.toLowerCase()) ||
        buyerName.includes(searchQuery.toLowerCase()) ||
        styleRef.includes(searchQuery.toLowerCase());
      
      const matchesStatus = filterStatus === 'All' || r.status === filterStatus;

      return matchesSearch && matchesStatus;
    });

    result.sort((a: any, b: any) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [records, searchQuery, filterStatus, sortConfig]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterStatus]);

  const paginatedRecords = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredRecords.slice(startIndex, startIndex + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize);

  const stats = useMemo(() => {
    const totalQty = records.reduce((sum, r: any) => sum + (Number(r.qty) || Number(r.quantity) || 0), 0);
    const totalValue = records.reduce((sum, r: any) => sum + ((Number(r.qty) || 0) * (Number(r.fobPrice || r.unitPrice) || 10)), 0);
    
    return {
      totalOrders: records.length,
      shipped: records.filter((r: any) => r.status === 'Shipped').length,
      inProduction: records.filter((r: any) => ['In Production', 'Running', 'In Washing', 'In Packing'].includes(r.status)).length,
      pending: records.filter((r: any) => r.status === 'New' || r.status === 'Pending').length,
      totalQty,
      totalValue
    };
  }, [records]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
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
      columns: ['Order #', 'Buyer', 'Style', 'Qty', 'FOB', 'CM', 'Ship Date', 'Status'],
      rows: filteredRecords.map(r => [
        r.orderNo, 
        r.buyer, 
        r.styleNo, 
        r.qty.toLocaleString(), 
        `$${r.fobPrice || r.unitPrice || 0}`, 
        `$${r.cmPrice || 0}`,
        r.shipDate, 
        r.status
      ]),
      fileName: 'Buyer_Order_Summary_Report'
    });
  };

  const exportSinglePDF = async (record: any) => {
    const { exportDetailToPDF } = await import('../utils/pdfExportUtils');
    await exportDetailToPDF({
      moduleName: 'Order Details Summary',
      moduleId: 'order-summary',
      recordId: record.orderNo,
      fileName: `Order_${record.orderNo}`,
      fields: [
        { label: 'Order Number',     value: record.orderNo },
        { label: 'Buyer Name',       value: record.buyer },
        { label: 'Style Reference',  value: record.styleNo },
        { label: 'Order Quantity',   value: (record.qty || 0).toLocaleString() },
        { label: 'FOB Price',        value: `${record.fobPrice || record.unitPrice || 0} ${record.currency || 'USD'}` },
        { label: 'CM Price',         value: `${record.cmPrice || 0} ${record.currency || 'USD'}` },
        { label: 'Expected Ship Date', value: record.shipDate },
        { label: 'Order Status',     value: record.status },
        { label: 'Merchandiser',     value: record.merchandiser || record.responsiblePerson || '—' },
        { label: 'Priority',         value: record.priority || 'Medium' },
        { label: 'Fabric Details',   value: record.fabricType || '—' },
        { label: 'Remarks',          value: record.remarks || '—' },
      ]
    });
  };

  return (
    <motion.div className="p-4 md:p-8 space-y-8" variants={containerVariants} initial="hidden" animate="show">
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-bg-1 p-6 rounded-3xl border border-border-main shadow-sm">
        <div className="flex items-center gap-5">
           <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center text-accent shadow-inner">
              <ShoppingBag className="w-8 h-8" />
           </div>
           <div>
              <h1 className="text-3xl font-black text-text-1 tracking-tight">BUYER ORDER CENTER</h1>
              <p className="text-text-2 text-sm font-medium mt-1 uppercase tracking-widest flex items-center gap-2">
                 <Activity className="w-4 h-4 text-green-500" /> 
                 Orchestrating Style Lifecycle & Shipment Logistics
              </p>
           </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <button className="flex-1 lg:flex-none btn btn-ghost border border-border-main hover:bg-bg-2 flex items-center gap-2 px-6" onClick={exportExcel}>
            <Download className="w-4 h-4" /> Excel
          </button>
          <button className="flex-1 lg:flex-none btn btn-ghost border border-border-main hover:bg-bg-2 flex items-center gap-2 px-6" onClick={exportPDF}>
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="w-full lg:w-auto btn btn-primary flex items-center gap-2 px-8 shadow-lg shadow-accent/20" onClick={() => onNavigate('buyer-order-summary-form', { mode: 'create' })}>
            <Plus className="w-5 h-5" /> Initiate Order
          </button>
        </div>
      </div>

      {/* ── KPI Widgets ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Pipeline', value: stats.totalOrders, icon: Package, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: 'Orders' },
          { label: 'Volume Unit', value: stats.totalQty.toLocaleString(), icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-500/10', trend: 'Units' },
          { label: 'Forecast Value', value: `$${stats.totalValue.toLocaleString()}`, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10', trend: 'FOB Est' },
          { label: 'Production Load', value: stats.inProduction, icon: Clock, color: 'text-purple-main', bg: 'bg-purple-main/10', trend: 'Running' },
        ].map((stat, idx) => (
          <motion.div key={idx} variants={itemVariants} className="group bg-bg-1 border border-border-main rounded-3xl p-6 relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300">
             <div className={`absolute top-0 right-0 w-24 h-24 ${stat.bg} rounded-bl-full -mr-8 -mt-8 opacity-20 group-hover:scale-110 transition-transform duration-500`}></div>
             <div className="relative flex items-start justify-between">
                <div>
                   <div className="text-[10px] font-black text-text-3 uppercase tracking-widest mb-1">{stat.label}</div>
                   <div className="text-3xl font-black text-text-1 tracking-tighter">{stat.value}</div>
                   <div className={`text-[10px] font-bold mt-2 px-2 py-0.5 rounded-full inline-block ${stat.bg} ${stat.color}`}>
                      {stat.trend}
                   </div>
                </div>
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                   <stat.icon className="w-6 h-6" />
                </div>
             </div>
          </motion.div>
        ))}
      </div>

      {/* ── Search & Filter ── */}
      <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 bg-bg-1 p-4 rounded-3xl border border-border-main shadow-sm sticky top-24 z-30 backdrop-blur-md bg-bg-1/90">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-text-2" />
          <input 
            type="text" 
            placeholder="Search Intelligence (Order #, Buyer, Style Reference...)" 
            className="w-full bg-bg-2 border border-border-main rounded-2xl pl-12 pr-4 py-3.5 text-sm font-bold focus:ring-2 focus:ring-accent outline-none transition-all text-text-1 placeholder:text-text-3"
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <div className="w-px h-10 bg-border-main hidden lg:block"></div>
        <div className="flex items-center gap-3">
          <div className="text-[10px] font-black text-text-3 uppercase tracking-widest hidden sm:block">Workflow Phase:</div>
          <select className="bg-bg-2 border border-border-main rounded-2xl px-6 py-3.5 text-sm font-bold focus:ring-2 focus:ring-accent outline-none text-text-1 min-w-[180px] appearance-none" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="All">Complete Lifecycle</option>
            <option value="New">New Order Entry</option>
            <option value="In Production">In Production</option>
            <option value="In Washing">Process: Washing</option>
            <option value="In Packing">Process: Packing</option>
            <option value="Ready">Ready for Logistics</option>
            <option value="Shipped">Dispatched / Shipped</option>
            <option value="Cancelled">Voided / Cancelled</option>
          </select>
        </div>
      </motion.div>

      {/* ── Table ── */}
      <motion.div variants={itemVariants} className="bg-bg-1 border border-border-main rounded-3xl overflow-hidden shadow-sm relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-bg-2/40 border-b border-border-main text-[10px] uppercase tracking-[0.15em] text-text-3 font-black">
                <th className="p-6 pl-8 cursor-pointer hover:text-accent transition-colors" onClick={() => setSortConfig({ key: 'orderNo', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                  <div className="flex items-center gap-2">Order & Reference {sortConfig.key === 'orderNo' && <ArrowUpRight className={`w-3 h-3 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />}</div>
                </th>
                <th className="p-6 cursor-pointer hover:text-accent transition-colors" onClick={() => setSortConfig({ key: 'buyer', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                  <div className="flex items-center gap-2">Buyer Entity {sortConfig.key === 'buyer' && <ArrowUpRight className={`w-3 h-3 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />}</div>
                </th>
                <th className="p-6 text-center cursor-pointer hover:text-accent transition-colors" onClick={() => setSortConfig({ key: 'qty', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                  <div className="flex items-center justify-center gap-2">Capacity Unit {sortConfig.key === 'qty' && <ArrowUpRight className={`w-3 h-3 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />}</div>
                </th>
                <th className="p-6 text-center cursor-pointer hover:text-accent transition-colors" onClick={() => setSortConfig({ key: 'shipDate', direction: sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                  <div className="flex items-center justify-center gap-2">Ex-Factory Date {sortConfig.key === 'shipDate' && <ArrowUpRight className={`w-3 h-3 ${sortConfig.direction === 'desc' ? 'rotate-180' : ''}`} />}</div>
                </th>
                <th className="p-6 text-center">Status Tracking</th>
                <th className="p-6 pr-8 text-right">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {paginatedRecords.length > 0 ? paginatedRecords.map(r => {
                const orderNumber = r.orderNo || (r as any).orderNumber || '—';
                const styleRef = r.styleNo || (r as any).style || '—';
                const quantity = Number(r.qty) ?? Number((r as any).quantity) ?? 0;
                const shippingDate = r.shipDate || (r as any).deliveryDate || r.createdAt || '';
                const merchandiserName = r.merchandiser || r.responsiblePerson || '—';

                return (
                  <tr key={r.id} className="hover:bg-bg-2/30 transition-all duration-300 group">
                    <td className="p-6 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-bg-2 border border-border-main flex items-center justify-center text-accent">
                           <ShoppingBag className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <div className="font-black text-text-1 text-base tracking-tighter uppercase">{orderNumber}</div>
                             {r.priority && (
                               <span className={`text-[8px] px-2 py-0.5 rounded-full font-black uppercase shadow-sm ${
                                 r.priority === 'Urgent / AOG' ? 'bg-rose-500 text-white' :
                                 r.priority === 'High' ? 'bg-amber-500 text-white' :
                                 'bg-bg-3 text-text-3 border border-border-main'
                               }`}>
                                 {r.priority.split(' ')[0]}
                               </span>
                             )}
                          </div>
                          <div className="text-[10px] text-text-3 mt-0.5 font-bold uppercase tracking-widest">{styleRef}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                         <div className="w-9 h-9 rounded-full bg-accent/5 border border-accent/10 flex items-center justify-center text-[11px] font-black text-accent uppercase">
                            {r.buyer ? r.buyer.substring(0, 2) : '??'}
                         </div>
                         <div>
                           <div className="text-sm font-black text-text-1 uppercase">{r.buyer || '—'}</div>
                           <div className="text-[10px] text-text-3 font-bold flex items-center gap-1">
                              <User className="w-3 h-3" /> {merchandiserName}
                           </div>
                         </div>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="font-black text-text-1 text-lg font-mono">{quantity.toLocaleString()}</div>
                      <div className="flex flex-col gap-0.5 mt-1">
                        {(r.fobPrice || r.unitPrice) !== undefined && (
                          <div className="text-[9px] text-text-3 font-bold uppercase tracking-tighter">
                            FOB: <span className="text-accent">${r.fobPrice || r.unitPrice}</span>
                          </div>
                        )}
                        {r.cmPrice !== undefined && (
                          <div className="text-[9px] text-text-3 font-bold uppercase tracking-tighter">
                            CM: <span className="text-blue-500">${r.cmPrice}</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <div className="inline-flex flex-col items-center bg-bg-2/50 px-4 py-2 rounded-2xl border border-border-main">
                         <span className={`text-sm font-black font-mono ${shippingDate && new Date(shippingDate) < new Date() && r.status !== 'Shipped' ? 'text-rose-500' : 'text-text-1'}`}>
                           {shippingDate ? new Date(shippingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'}) : '—'}
                         </span>
                         <span className="text-[9px] text-text-3 uppercase mt-1 tracking-[0.1em] font-black flex items-center gap-1">
                            <Clock className="w-3 h-3" /> Contracted
                         </span>
                      </div>
                    </td>
                    <td className="p-6 text-center">
                      <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm transition-colors ${
                        r.status === 'Shipped' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        ['In Production', 'Running', 'In Washing', 'In Packing'].includes(r.status || '') ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                        'bg-purple-main/10 text-purple-main border-purple-main/20'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full mr-2 ${
                           r.status === 'Shipped' ? 'bg-green-500' : 
                           ['In Production', 'Running', 'In Washing', 'In Packing'].includes(r.status || '') ? 'bg-amber-500 animate-pulse' : 
                           'bg-purple-main'
                        }`} />
                        {r.status || 'New Entry'}
                      </span>
                    </td>
                    <td className="p-6 pr-8 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-bg-2 border border-border-main hover:border-accent hover:text-accent text-text-2 transition-all shadow-sm" onClick={() => onNavigate('buyer-order-summary-form', { mode: 'view', data: r })}>
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-bg-2 border border-border-main hover:border-blue-500 hover:text-blue-500 text-text-2 transition-all shadow-sm" onClick={() => onNavigate('buyer-order-summary-form', { mode: 'edit', data: r })}>
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-bg-2 border border-border-main hover:border-indigo-500 hover:text-indigo-500 text-text-2 transition-all shadow-sm" title="Download PDF" onClick={() => exportSinglePDF(r)}>
                          <Download className="w-4 h-4" />
                        </button>
                        <button className="w-10 h-10 rounded-xl flex items-center justify-center bg-rose-500/5 border border-rose-500/20 hover:bg-rose-500 hover:text-white text-rose-500 transition-all shadow-sm" onClick={() => handleDelete(r.id)}>
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                   <td colSpan={6} className="p-20 text-center">
                      <div className="flex flex-col items-center opacity-30">
                         <LayoutGrid className="w-16 h-16 mb-4" />
                         <p className="text-xl font-black uppercase tracking-widest text-text-2">No Active Orders Detected</p>
                         <p className="text-sm font-medium mt-2">Initialize your first merchandising lifecycle to begin tracking.</p>
                      </div>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination 
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalRecords={filteredRecords.length}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />
      </motion.div>
    </motion.div>
  );
}
