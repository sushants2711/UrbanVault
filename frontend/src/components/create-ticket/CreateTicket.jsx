import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIssues, getFloors, createTicket } from '../../api/api';
import QuickIssues from './QuickIssues';
import SelectionGroup from './SelectionGroup';

export default function CreateTicket() {
  const navigate = useNavigate();
  const [issuesOptions, setIssuesOptions] = useState([]);
  const [floorsOptions, setFloorsOptions] = useState([]);
  const [selectedIssues, setSelectedIssues] = useState([]);
  const [selectedFloors, setSelectedFloors] = useState([]);
  const [description, setDescription] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getIssues().then(res => setIssuesOptions(res.data)).catch(console.error);
    getFloors().then(res => setFloorsOptions(res.data)).catch(console.error);
  }, []);

  const handleQuickIssue = (issueName) => {
    const issue = issuesOptions.find(i => i.name === issueName);
    if (issue) {
      if (selectedIssues.includes(issue.id)) {
        setSelectedIssues(selectedIssues.filter(id => id !== issue.id));
      } else {
        setSelectedIssues([...selectedIssues, issue.id]);
      }
    }
  };

  const toggleIssue = (id) => {
    if (selectedIssues.includes(id)) {
      setSelectedIssues(selectedIssues.filter(i => i !== id));
    } else {
      setSelectedIssues([...selectedIssues, id]);
    }
  };

  const toggleFloor = (id) => {
    if (selectedFloors.includes(id)) {
      setSelectedFloors(selectedFloors.filter(f => f !== id));
    } else {
      setSelectedFloors([...selectedFloors, id]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedIssues.length === 0 || selectedFloors.length === 0) {
      setError("Please select at least one issue and one floor.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await createTicket({
        issues: selectedIssues,
        floors: selectedFloors,
        description
      });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.non_field_errors?.[0] || "An error occurred while creating the ticket.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] bg-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        <div className="px-6 py-8 sm:px-8 border-b border-gray-100 bg-white">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Submit a New Request</h2>
          <p className="mt-2 text-sm text-gray-500">
            Let us know what's wrong, and our team will get it fixed as soon as possible.
          </p>
        </div>

        <div className="px-6 py-6 sm:px-8">
          {error && (
            <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-100">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{error}</h3>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            
            <QuickIssues 
              selectedIssues={selectedIssues} 
              handleQuickIssue={handleQuickIssue} 
              issuesOptions={issuesOptions} 
            />

            <SelectionGroup 
              label="Select Issue(s)"
              options={issuesOptions}
              selectedIds={selectedIssues}
              toggleFn={toggleIssue}
              activeColorClass="bg-indigo-600"
            />

            <SelectionGroup 
              label="Select Floor(s)"
              options={floorsOptions}
              selectedIds={selectedFloors}
              toggleFn={toggleFloor}
              activeColorClass="bg-teal-600"
            />

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-2">Detailed Description (Optional)</label>
              <textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please provide any additional context..."
                className="block w-full rounded-xl border-gray-300 bg-white px-4 py-3 text-gray-900 border focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm shadow-sm transition-colors placeholder:text-gray-400"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-x-4 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || selectedIssues.length === 0 || selectedFloors.length === 0}
                className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
