import { getStatusStyles, getStatusLabel } from '../ticket-list/TicketCard';

export default function TicketInfo({ ticket }) {
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 relative overflow-hidden">
      <div className={`absolute top-0 left-0 w-2 h-full ${getStatusStyles(ticket.status).split(' ')[0]}`}></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <span className={`px-4 py-1.5 rounded-xl text-sm font-bold border ${getStatusStyles(ticket.status)}`}>
          {getStatusLabel(ticket.status)}
        </span>
        <span className="text-slate-400 font-bold">Ticket #{ticket.id.toString().padStart(4, '0')}</span>
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2 leading-tight">
        {ticket.issues_detail.map(i => i.name).join(' • ')}
      </h1>
      
      <div className="flex items-center text-slate-600 font-medium mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1.5 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
        {ticket.floors_detail.map(f => f.name).join(', ')}
      </div>

      <div className="border-t border-slate-100 pt-6 mb-6">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Description</h3>
        <p className="text-slate-700 whitespace-pre-line leading-relaxed">
          {ticket.description || <span className="italic text-slate-400">No additional details provided.</span>}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Created</h3>
          <p className="font-semibold text-slate-800">
            {new Date(ticket.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
          </p>
        </div>
        <div>
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assignee</h3>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              {ticket.assignee_detail ? ticket.assignee_detail.name.charAt(0).toUpperCase() : '?'}
            </div>
            <p className="font-semibold text-slate-800">
              {ticket.assignee_detail ? ticket.assignee_detail.name : 'Unassigned'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
