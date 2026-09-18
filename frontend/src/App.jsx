import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import TicketList from './components/ticket-list/TicketList';
import TicketDetail from './components/ticket-detail/TicketDetail';
import CreateTicket from './components/create-ticket/CreateTicket';

function App() {
  const [simulateUser, setSimulateUser] = useState('Client'); 

  return (
    <BrowserRouter>
      <Layout simulateUser={simulateUser} setSimulateUser={setSimulateUser}>
        <Routes>
          <Route path="/" element={<TicketList />} />
          <Route path="/ticket/:id" element={<TicketDetail simulateUser={simulateUser} />} />
          <Route path="/create" element={<CreateTicket />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
