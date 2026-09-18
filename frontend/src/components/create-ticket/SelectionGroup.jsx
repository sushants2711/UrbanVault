export default function SelectionGroup({ label, options, selectedIds, toggleFn, activeColorClass }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-900 mb-3">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="flex flex-wrap gap-2">
        {options.map(item => (
          <button
            type="button"
            key={item.id}
            onClick={() => toggleFn(item.id)}
            className={`px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 focus:outline-none ${
              selectedIds.includes(item.id)
                ? `${activeColorClass} text-white border-transparent`
                : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
}
