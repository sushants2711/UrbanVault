import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicket, performTicketAction, getUsers } from '../api';

export default function TicketDetail({ simulateUser }) {
  const { id: ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [users, setUsers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState('');
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const fetchTicket = async () => {
    try {
      const res = await getTicket(ticketId);
      setTicket(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicket();
    getUsers().then(res => {
      setUsers(res.data.filter(u => u.role === 'WORKER'));
    });
  }, [ticketId]);

  const handleAction = async (actionType) => {
    setActionLoading(true);
    try {
      const data = { action: actionType, actor_name: simulateUser, comment: '' };
      if (actionType === 'ASSIGN_WORKER') data.assignee_id = selectedWorker;
      if (actionType === 'SUBMIT_ASSESSMENT') data.comment = resolutionNotes;
      await performTicketAction(ticketId, data);
      fetchTicket(); 
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const handleComment = async () => {
    if (!comment.trim()) return;
    setActionLoading(true);
    try {
      const api = (await import('../api')).default;
      await api.post('activities/', {
        ticket: ticketId,
        type: 'COMMENT',
        actor_name: simulateUser,
        text: comment
      });
      setComment('');
      fetchTicket();
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-slate-700">Ticket not found</h2>
        <button onClick={() => navigate('/')} className="mt-4 text-indigo-600 font-semibold hover:underline">Return to Dashboard</button>
      </div>
    );
  }

  const getStatusStyles = (status) => {
    switch(status) {
      case 'PENDING_ASSIGNMENT': return 'bg-red-50 text-red-600 border-red-200';
      case 'PENDING_ASSESSMENT': return 'bg-amber-50 text-amber-600 border-amber-200';
      case 'PENDING_REVIEW': return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'CLOSED': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
      default: return 'bg-slate-50 text-slate-600 border-slate-200';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'PENDING_ASSIGNMENT': return 'Needs Assignment';
      case 'PENDING_ASSESSMENT': return 'In Progress';
      case 'PENDING_REVIEW': return 'Review Required';
      case 'CLOSED': return 'Resolved';
      default: return status.replace(/_/g, ' ');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <button 
        onClick={() => navigate('/')}
        className="flex items-center text-slate-500 hover:text-indigo-600 font-semibold mb-6 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Details & Actions */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Main Info Card */}
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

          {/* Action Cards based on Role & Status */}
          {ticket.status === 'PENDING_ASSIGNMENT' && simulateUser === 'Department POC' && (
            <div className="bg-red-50 rounded-3xl p-6 border border-red-200">
              <h3 className="text-lg font-bold text-red-800 mb-4">Action Required: Assign Technician</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <select 
                  value={selectedWorker} 
                  onChange={(e) => setSelectedWorker(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-red-200 bg-white text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="" disabled>Select a technician...</option>
                  {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
                <button 
                  onClick={() => handleAction('ASSIGN_WORKER')}
                  disabled={!selectedWorker || actionLoading}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap shadow-md shadow-red-200"
                >
                  Assign Ticket
                </button>
              </div>
            </div>
          )}

          {ticket.status === 'PENDING_ASSESSMENT' && simulateUser === 'Worker/Technician' && (
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 flex flex-col gap-4">
              <div>
                <h3 className="text-lg font-bold text-amber-800">You are assigned to this ticket.</h3>
                <p className="text-amber-700 text-sm mt-1">Please provide details of your fix before marking as assessed.</p>
              </div>
              <textarea
                rows="3"
                placeholder="What did you fix? (e.g. 'Replaced the AC filter and verified cooling')"
                value={resolutionNotes}
                onChange={(e) => setResolutionNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-amber-200 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors text-sm resize-none"
              ></textarea>
              <div className="flex justify-end">
                <button 
                  onClick={() => handleAction('SUBMIT_ASSESSMENT')}
                  disabled={actionLoading || !resolutionNotes.trim()}
                  className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap shadow-md shadow-amber-200 w-full sm:w-auto"
                >
                  Submit Assessment
                </button>
              </div>
            </div>
          )}

          {ticket.status === 'PENDING_REVIEW' && simulateUser === 'Department POC' && (
            <div className="bg-blue-50 rounded-3xl p-6 border border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h3 className="text-lg font-bold text-blue-800">Assessment Submitted</h3>
                <p className="text-blue-700 text-sm mt-1">Please review the work and mark the ticket as resolved.</p>
              </div>
              <button 
                onClick={() => handleAction('MARK_RESOLVED')}
                disabled={actionLoading}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold py-3 px-6 rounded-xl transition-colors whitespace-nowrap shadow-md shadow-blue-200 w-full sm:w-auto"
              >
                Mark Resolved
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Activity Feed */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-[600px] lg:h-auto">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800">Activity</h2>
            <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-lg">{ticket.activities.length} updates</span>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative">
            <div className="absolute left-11 top-6 bottom-6 w-0.5 bg-slate-200"></div>
            
            <div className="flex flex-col gap-6 relative">
              {ticket.activities.map((act, idx) => (
                <div key={act.id} className="flex gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-white shadow-sm ring-4 ring-slate-50 ${act.type === 'EVENT' ? 'bg-indigo-500' : 'bg-emerald-500'}`}>
                    {act.actor_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                    <p className="text-sm text-slate-800">
                      <span className="font-bold">{act.actor_name}</span>
                      {act.type === 'EVENT' ? ' ' : ' commented: '}
                      <span className={act.type === 'EVENT' ? 'text-slate-500' : 'text-slate-700 mt-1 block'}>
                        {act.text}
                      </span>
                    </p>
                    <span className="text-xs font-semibold text-slate-400 mt-2 block">
                      {new Date(act.created_at).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-white rounded-b-3xl">
            <textarea
              rows="2"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors text-sm mb-3 resize-none"
            ></textarea>
            <div className="flex justify-end">
              <button 
                onClick={handleComment}
                disabled={actionLoading || !comment.trim()}
                className="bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-bold py-2 px-5 rounded-xl transition-colors text-sm"
              >
                Post Comment
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
