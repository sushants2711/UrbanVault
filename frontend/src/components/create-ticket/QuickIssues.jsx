export default function QuickIssues({ selectedIssues, handleQuickIssue, issuesOptions }) {
  const quickIssuesList = ['AC not cooling', 'Internet not working', 'Pantry not cleaned', 'Lights flickering'];

  return (
    <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
        </svg>
        <h3 className="text-sm font-semibold text-blue-900">Frequently Reported (Tap to select)</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {quickIssuesList.map(qi => {
          const isSelected = selectedIssues.some(id => issuesOptions.find(opt => opt.id === id)?.name === qi);
          return (
            <button
              type="button"
              key={qi}
              onClick={() => handleQuickIssue(qi)}
              className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
                isSelected 
                  ? 'bg-blue-600 text-white shadow-sm border-transparent' 
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              {qi}
            </button>
          );
        })}
      </div>
    </div>
  );
}
