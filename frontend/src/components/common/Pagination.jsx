export default function Pagination({ page, totalPages, setPage }) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center pb-8">
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
          className="px-4 py-2 font-bold rounded-xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>

        <div className="hidden sm:flex gap-2">
          {[...Array(totalPages)].map((_, idx) => (
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
        
        <div className="sm:hidden flex items-center px-4 font-bold text-slate-600">
          Page {page} of {totalPages}
        </div>

        <button
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 font-bold rounded-xl text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
