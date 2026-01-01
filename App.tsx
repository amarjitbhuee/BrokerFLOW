
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Dashboard from './views/Dashboard.tsx';
import Listings from './views/Listings.tsx';
import Pendings from './views/Pendings.tsx';
import PendingDetail from './views/PendingDetail.tsx';
import Finances from './views/Finances.tsx';
import Closed from './views/Closed.tsx';
import { Profile } from './types.ts';

const App: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setUser({
        id: 'agent-123',
        org_id: 'brokerage-789',
        team_id: 'team-456',
        full_name: 'John Realtor',
        role: 'AGENT',
      });
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-500">Initializing PropTrack Pro...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout user={user!} />}>
          <Route index element={<Dashboard user={user!} />} />
          <Route path="listings" element={<Listings user={user!} />} />
          <Route path="pendings" element={<Pendings user={user!} />} />
          <Route path="pendings/:id" element={<PendingDetail user={user!} />} />
          <Route path="closed" element={<Closed user={user!} />} />
          <Route path="finances" element={<Finances user={user!} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
