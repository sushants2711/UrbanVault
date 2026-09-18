import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../api';

export default function TicketList() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');

  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [searchInput]);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      let status = tab === 0 ? 'open' : 'closed';
      if (tab === 0 && statusFilter !== 'all') {
        status = statusFilter;
      }

      const response = await getTickets({
        status,
        page,
        search,
        floor: filterBy,
        sort_by: sortBy
      });

      setTickets(response.data.results);
      setTotalPages(Math.ceil(response.data.count / 10));
    } catch (error) {
      console.error("Error fetching tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [tab, page, search, sortBy, filterBy, statusFilter]);

  const getStatusStyles = (status) => {
    switch (status) {
      case 'PENDING_ASSIGNMENT': return 'bg-red-50 text-red-600 border-red-200';
      case 'PENDING_ASSESSMENT': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'PENDING_REVIEW': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'CLOSED': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'PENDING_ASSIGNMENT': return 'Needs Assignment';
      case 'PENDING_ASSESSMENT': return 'In Progress';
      case 'PENDING_REVIEW': return 'Review Required';
      case 'CLOSED': return 'Resolved';
      default: return status.replace(/_/g, ' ');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            Operations Board
          </h1>
          <p className="mt-2 text-lg text-slate-600 font-medium">
            Track and resolve facility issues in real-time.
          </p>
        </div>
        <button
          onClick={() => navigate('/create')}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-200 transition duration-200 ease-in-out transform hover:-translate-y-0.5 flex items-center gap-2 whitespace-nowrap"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          New Ticket
        </button>
      </div>

      {/* Controls Bar */}
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
              {['1F', '2F', '3F', '4F', '5F'].map(f => (
                <option key={f} value={f}>{f}</option>
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

      {/* Grid Content */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col justify-center items-center py-20 border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
          <svg className="w-16 h-16 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-bold text-slate-700 mb-1">No tickets found</h3>
          <p className="text-slate-500">Try adjusting your search or filters to see results.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {tickets.map((ticket) => (
            <div
              key={ticket.id}
              onClick={() => navigate(`/ticket/${ticket.id}`)}
              className="group bg-white rounded-2xl border border-slate-200 p-5 lg:p-6 cursor-pointer hover:shadow-lg hover:border-indigo-200 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <span className={`px-3 py-1 text-xs font-bold rounded-lg border ${getStatusStyles(ticket.status)}`}>
                    {getStatusLabel(ticket.status)}
                  </span>
                  <span className="text-slate-400 font-bold text-sm">
                    #{ticket.id.toString().padStart(4, '0')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">
                  {ticket.issues_detail.map(i => i.name).join(' • ')}
                </h2>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-semibold text-slate-500">
                <span>Created {new Date(ticket.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-indigo-600 group-hover:underline">View Details &rarr;</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12 mb-8 gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setPage(idx + 1)}
              className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center transition-colors ${page === idx + 1
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
