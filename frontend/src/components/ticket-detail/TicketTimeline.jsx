export default function TicketTimeline({
  ticket,
  comment,
  setComment,
  handleComment,
  actionLoading
}) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 flex flex-col h-[600px] lg:h-auto">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-800">Activity</h2>
        <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded-lg">
          {ticket.activities.length} updates
        </span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 bg-slate-50 relative">
        <div className="absolute left-11 top-6 bottom-6 w-0.5 bg-slate-200"></div>
        
        <div className="flex flex-col gap-6 relative">
          {ticket.activities.map((act) => (
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
  );
}
