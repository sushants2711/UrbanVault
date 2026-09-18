export default function ActionPanel({
  ticket,
  simulateUser,
  users,
  selectedWorker,
  setSelectedWorker,
  resolutionNotes,
  setResolutionNotes,
  handleAction,
  actionLoading
}) {
  return (
    <>
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
    </>
  );
}
