import { useNavigate } from 'react-router-dom';

export const getStatusStyles = (status) => {
  switch (status) {
    case 'PENDING_ASSIGNMENT': return 'bg-red-50 text-red-600 border-red-200';
    case 'PENDING_ASSESSMENT': return 'bg-amber-50 text-amber-600 border-amber-200';
    case 'PENDING_REVIEW': return 'bg-blue-50 text-blue-600 border-blue-200';
    case 'CLOSED': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
    default: return 'bg-slate-50 text-slate-600 border-slate-200';
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'PENDING_ASSIGNMENT': return 'Needs Assignment';
    case 'PENDING_ASSESSMENT': return 'In Progress';
    case 'PENDING_REVIEW': return 'Review Required';
    case 'CLOSED': return 'Resolved';
    default: return status.replace(/_/g, ' ');
  }
};

export default function TicketCard({ ticket }) {
  const navigate = useNavigate();

  return (
    <div
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
  );
}
