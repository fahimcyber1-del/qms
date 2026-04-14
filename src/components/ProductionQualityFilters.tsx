import React from 'react';

export const ProductionQualityFilters = ({
  filterUnit, setFilterUnit,
  filterShift, setFilterShift,
  filterDateFrom, setFilterDateFrom,
  filterDateTo, setFilterDateTo,
  filterDhuMin, setFilterDhuMin,
  filterDhuMax, setFilterDhuMax,
  filterText, setFilterText,
  units,
  onClear
}: any) => {
  return (
    <div className="card mb-4">
      <div className="card-header flex justify-between items-center">
        <div className="card-title">Filters</div>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 bg-gray-50 border-b">
        <div className="form-group">
          <label className="text-xs font-bold text-gray-600">Unit</label>
          <select className="form-control" value={filterUnit} onChange={e => setFilterUnit(e.target.value)}>
            <option value="All">All Units</option>
            {units.map((u: string) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div className="form-group">
          <label className="text-xs font-bold text-gray-600">Shift</label>
          <select className="form-control" value={filterShift} onChange={e => setFilterShift(e.target.value)}>
            <option value="All">All Shifts</option>
            <option value="Day">Day</option>
            <option value="Night">Night</option>
          </select>
        </div>
        <div className="form-group">
          <label className="text-xs font-bold text-gray-600">Date From</label>
          <input type="date" className="form-control" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="text-xs font-bold text-gray-600">Date To</label>
          <input type="date" className="form-control" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="text-xs font-bold text-gray-600">Min DHU %</label>
          <input type="number" className="form-control" placeholder="Min" value={filterDhuMin} onChange={e => setFilterDhuMin(e.target.value)} />
        </div>
        <div className="form-group">
          <label className="text-xs font-bold text-gray-600">Max DHU %</label>
          <input type="number" className="form-control" placeholder="Max" value={filterDhuMax} onChange={e => setFilterDhuMax(e.target.value)} />
        </div>
        <div className="form-group md:col-span-2 lg:col-span-3">
          <label className="text-xs font-bold text-gray-600">Search</label>
          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Search Line, Buyer, Style..." 
              className="form-control flex-1" 
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
            <button className="btn btn-ghost" onClick={onClear}>Clear</button>
          </div>
        </div>
      </div>
    </div>
  );
};
