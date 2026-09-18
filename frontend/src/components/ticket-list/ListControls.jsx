import { useState, useEffect } from 'react';
import { getFloors } from '../../api/api';

export default function ListControls({
  tab, setTab,
  searchInput, setSearchInput,
  statusFilter, setStatusFilter,
  filterBy, setFilterBy,
  sortBy, setSortBy,
  setPage
}) {
  const [floors, setFloors] = useState([]);

  useEffect(() => {
    const fetchFloors = async () => {
      try {
        const response = await getFloors();
        setFloors(response.data);
      } catch (err) {
        console.error("Error fetching floors:", err);
      }
    };
    fetchFloors();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 mb-8 flex flex-col lg:flex-row justify-between items-stretch lg:items-center p-2 gap-4">
      <div className="flex border-b lg:border-b-0 border-slate-200 px-2 overflow-x-auto">
        <button
          onClick={() => { setTab(0); setPage(1); setStatusFilter('all'); }}
          className={`px-4 py-4 font-bold text-sm md:text-base whitespace-nowrap border-b-2 transition-colors ${tab === 0 ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Active Tickets
        </button>
        <button
          onClick={() => { setTab(1); setPage(1); setStatusFilter('all'); }}
          className={`px-4 py-4 font-bold text-sm md:text-base whitespace-nowrap border-b-2 transition-colors ${tab === 1 ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Resolved History
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 px-2 lg:px-4 pb-2 lg:pb-0">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search issues..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-10 pr-4 py-2 w-full sm:w-64 border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {tab === 0 && (
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 sm:flex-none cursor-pointer appearance-none"
            >
              <option value="all">All Statuses</option>
              <option value="PENDING_ASSIGNMENT">Needs Assignment</option>
              <option value="PENDING_ASSESSMENT">In Progress</option>
              <option value="PENDING_REVIEW">Review Required</option>
            </select>
          )}

          <select
            value={filterBy}
            onChange={(e) => { setFilterBy(e.target.value); setPage(1); }}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 sm:flex-none cursor-pointer appearance-none"
          >
            <option value="all">All Floors</option>
            {floors.map(f => (
              <option key={f.id} value={f.name}>{f.name}</option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-1 sm:flex-none cursor-pointer appearance-none"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>
  );
}
