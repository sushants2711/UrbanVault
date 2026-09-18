import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTickets } from '../../api';
import ListControls from './ListControls';
import TicketCard from './TicketCard';
import Pagination from '../common/Pagination';

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

      <ListControls 
        tab={tab} setTab={setTab}
        searchInput={searchInput} setSearchInput={setSearchInput}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        filterBy={filterBy} setFilterBy={setFilterBy}
        sortBy={sortBy} setSortBy={setSortBy}
        setPage={setPage}
      />

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
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} setPage={setPage} />
    </div>
  );
}
