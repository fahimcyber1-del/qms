import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
  totalRecords: number;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  pageSize, 
  onPageSizeChange, 
  totalRecords 
}: PaginationProps) {
  if (totalPages <= 1 && totalRecords <= pageSize) {
    return (
      <div className="p-4 border-t border-border-main flex justify-between items-center bg-bg-1/50">
        <p className="text-xs font-bold text-text-3 uppercase tracking-widest">
          Showing <span className="text-text-1">{totalRecords}</span> total records
        </p>
      </div>
    );
  }

  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalRecords);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisiblePages - 1);
      
      if (end === totalPages) {
        start = Math.max(1, end - maxVisiblePages + 1);
      }
      
      for (let i = start; i <= end; i++) pages.push(i);
    }
    return pages;
  };

  return (
    <div className="p-6 border-t border-border-main flex flex-col sm:flex-row justify-between items-center gap-4 bg-bg-1/50">
      <div className="flex items-center gap-4">
        <p className="text-xs font-black text-text-3 uppercase tracking-[0.1em]">
          Displaying <span className="text-text-1">{startRange}-{endRange}</span> of <span className="text-text-1">{totalRecords}</span> Intelligence Entries
        </p>
        <div className="h-4 w-px bg-border-main hidden sm:block"></div>
        <div className="flex items-center gap-2">
           <span className="text-[10px] font-black text-text-3 uppercase">Rows:</span>
           <select 
             value={pageSize} 
             onChange={(e) => onPageSizeChange(Number(e.target.value))}
             className="bg-bg-2 border border-border-main rounded-lg px-2 py-1 text-xs font-bold text-text-1 focus:ring-2 focus:ring-accent outline-none"
           >
             <option value={10}>10</option>
             <option value={25}>25</option>
             <option value={50}>50</option>
             <option value={100}>100</option>
           </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onPageChange(1)} 
          disabled={currentPage === 1}
          className="p-2 rounded-xl hover:bg-bg-2 disabled:opacity-20 text-text-2 border border-border-main transition-all"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="p-2 rounded-xl hover:bg-bg-2 disabled:opacity-20 text-text-2 border border-border-main transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-1 mx-2">
          {getPageNumbers().map(num => (
            <button
              key={num}
              onClick={() => onPageChange(num)}
              className={`w-10 h-10 rounded-xl text-xs font-black transition-all ${
                currentPage === num 
                  ? 'bg-accent text-white shadow-lg shadow-accent/20' 
                  : 'text-text-2 hover:bg-bg-2 border border-border-main'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl hover:bg-bg-2 disabled:opacity-20 text-text-2 border border-border-main transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button 
          onClick={() => onPageChange(totalPages)} 
          disabled={currentPage === totalPages}
          className="p-2 rounded-xl hover:bg-bg-2 disabled:opacity-20 text-text-2 border border-border-main transition-all"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
