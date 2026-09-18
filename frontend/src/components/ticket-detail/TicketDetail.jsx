import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getTicket, performTicketAction, getUsers } from '../../api/api';
import TicketInfo from './TicketInfo';
import ActionPanel from './ActionPanel';
import TicketTimeline from './TicketTimeline';

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
      const api = (await import('../../api/api')).default;
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
          <TicketInfo ticket={ticket} />
          
          <ActionPanel 
            ticket={ticket}
            simulateUser={simulateUser}
            users={users}
            selectedWorker={selectedWorker}
            setSelectedWorker={setSelectedWorker}
            resolutionNotes={resolutionNotes}
            setResolutionNotes={setResolutionNotes}
            handleAction={handleAction}
            actionLoading={actionLoading}
          />
        </div>

        {/* Right Column: Activity Feed */}
        <TicketTimeline 
          ticket={ticket}
          comment={comment}
          setComment={setComment}
          handleComment={handleComment}
          actionLoading={actionLoading}
        />
      </div>
    </div>
  );
}
