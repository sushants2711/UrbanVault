import { Link } from 'react-router-dom';

export default function Layout({ children, simulateUser, setSimulateUser }) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-slate-50 font-sans text-slate-900">
      
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            
            {/* Logo area */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                </svg>
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-800">
                UrbanVault <span className="text-slate-400 font-medium">Tickets</span>
              </h1>
            </Link>

            {/* Role Simulator */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col text-right mr-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Simulating Role</span>
                <span className="text-sm font-semibold text-indigo-600">{simulateUser}</span>
              </div>
              <div className="relative">
                <select
                  value={simulateUser}
                  onChange={(e) => setSimulateUser(e.target.value)}
                  className="appearance-none bg-slate-100 hover:bg-slate-200 border-none text-slate-700 font-semibold py-2.5 pl-4 pr-10 rounded-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-colors"
                >
                  <option value="Client">Client</option>
                  <option value="Department POC">Department POC</option>
                  <option value="Worker/Technician">Worker/Technician</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-500">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow w-full py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

    </div>
  );
}
