
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Dashboard from './views/Dashboard.tsx';
import Listings from './views/Listings.tsx';
import Pendings from './views/Pendings.tsx';
import PendingDetail from './views/PendingDetail.tsx';
import Finances from './views/Finances.tsx';
import Closed from './views/Closed.tsx';
import Landing from './views/Landing.tsx';
import { Profile, Listing, Escrow, Expense, ListingType } from './types.ts';

// Internal type for mock storage
interface RegisteredUser extends Profile {
  email: string;
  password?: string;
  incomeTarget?: number;
  expenseCap?: number;
}

const App: React.FC = () => {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);

  // Application state
  const [listings, setListings] = useState<Listing[]>([]);
  const [pendings, setPendings] = useState<Escrow[]>([]);
  const [closedDeals, setClosedDeals] = useState<Escrow[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomeTarget, setIncomeTarget] = useState(200000);
  const [expenseCap, setExpenseCap] = useState(25000);

  // 1. Initial Load: Auth & Accounts
  useEffect(() => {
    const storedUsers = localStorage.getItem('brokerflow_accounts');
    const initialUsers = storedUsers ? JSON.parse(storedUsers) : [
      { 
        id: 'agent-123', 
        email: 'demo@brokerflow.com', 
        password: 'password', 
        full_name: 'Demo Agent', 
        role: 'AGENT',
        org_id: 'org-1',
        team_id: null,
        incomeTarget: 200000,
        expenseCap: 25000
      }
    ];
    setRegisteredUsers(initialUsers);

    const savedSession = localStorage.getItem('brokerflow_user');
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
    setLoading(false);
  }, []);

  // 2. Load User-Specific Data
  useEffect(() => {
    if (user) {
      const uId = user.id;
      const getStore = (key: string) => localStorage.getItem(`brokerflow_${key}_${uId}`);
      
      const savedListings = getStore('listings');
      const savedPendings = getStore('pendings');
      const savedClosed = getStore('closed');
      const savedExpenses = getStore('expenses');

      // Seeding Demo Data ONLY for demo account if empty
      if (uId === 'agent-123' && !savedListings && !savedPendings) {
        setListings([
          { id: 'l1', agent_id: uId, address: '742 Evergreen Terrace', property_type: 'Single Family', status: 'ACTIVE', listing_type: 'SALE', price: 450000, created_at: '2023-10-01' },
          { id: 'l2', agent_id: uId, address: '123 Ocean View Dr', property_type: 'Condo', status: 'PENDING', listing_type: 'SALE', price: 890000, created_at: '2023-10-05' },
        ]);
        setPendings([
          { 
            id: 'p1', agent_id: uId, listing_id: 'l2', address: '123 Ocean View Dr', 
            deal_type: 'SELLER', status: 'OPEN', close_date: '2024-12-15', created_at: '2023-10-05',
            representing: 'SELLER', deposit_received: true, contingencies: [] 
          }
        ]);
        setExpenses([
          { id: 'e1', category: 'Photography', amount: 350, description: 'Listing photos', date: '2024-10-01', created_at: '2024-10-01' }
        ]);
      } else {
        setListings(savedListings ? JSON.parse(savedListings) : []);
        setPendings(savedPendings ? JSON.parse(savedPendings) : []);
        setClosedDeals(savedClosed ? JSON.parse(savedClosed) : []);
        setExpenses(savedExpenses ? JSON.parse(savedExpenses) : []);
      }

      const activeUserRecord = registeredUsers.find(ru => ru.id === uId);
      if (activeUserRecord) {
        setIncomeTarget(activeUserRecord.incomeTarget || 200000);
        setExpenseCap(activeUserRecord.expenseCap || 25000);
      }
    }
  }, [user, registeredUsers]);

  // 3. Persist Changes
  useEffect(() => {
    if (user) {
      const uId = user.id;
      localStorage.setItem(`brokerflow_listings_${uId}`, JSON.stringify(listings));
      localStorage.setItem(`brokerflow_pendings_${uId}`, JSON.stringify(pendings));
      localStorage.setItem(`brokerflow_closed_${uId}`, JSON.stringify(closedDeals));
      localStorage.setItem(`brokerflow_expenses_${uId}`, JSON.stringify(expenses));
    }
  }, [listings, pendings, closedDeals, expenses, user]);

  const handleLogin = (email: string, password?: string): boolean => {
    const found = registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase() && (!password || u.password === password));
    if (found) {
      const profile: Profile = { id: found.id, org_id: found.org_id, team_id: found.team_id, full_name: found.full_name, role: found.role };
      setUser(profile);
      localStorage.setItem('brokerflow_user', JSON.stringify(profile));
      return true;
    }
    return false;
  };

  const handleSignup = (userData: { firstName: string; lastName: string; email: string; password?: string }): boolean => {
    if (registeredUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) return false;

    const newUser: RegisteredUser = {
      id: `u-${Date.now()}`,
      email: userData.email,
      password: userData.password,
      full_name: `${userData.firstName} ${userData.lastName}`,
      role: 'AGENT',
      org_id: 'brokerage-789',
      team_id: null,
      incomeTarget: 200000,
      expenseCap: 25000
    };

    const updatedUsers = [...registeredUsers, newUser];
    setRegisteredUsers(updatedUsers);
    localStorage.setItem('brokerflow_accounts', JSON.stringify(updatedUsers));
    
    // Clear state for fresh start
    setListings([]);
    setPendings([]);
    setClosedDeals([]);
    setExpenses([]);
    setIncomeTarget(200000);
    setExpenseCap(25000);
    
    setUser({ id: newUser.id, org_id: newUser.org_id, team_id: newUser.team_id, full_name: newUser.full_name, role: newUser.role });
    localStorage.setItem('brokerflow_user', JSON.stringify(newUser));
    return true;
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('brokerflow_user');
  };

  const handleAddListing = (listingData: Partial<Listing>) => {
    const newListing: Listing = {
      id: `l-${Date.now()}`,
      agent_id: user?.id || '',
      address: listingData.address || '',
      property_type: listingData.property_type || 'Single Family',
      status: 'ACTIVE',
      listing_type: listingData.listing_type || 'SALE',
      price: listingData.price,
      listing_date: listingData.listing_date,
      expiration_date: listingData.expiration_date,
      seller_name: listingData.seller_name,
      seller_contact: listingData.seller_contact,
      image_url: listingData.image_url,
      created_at: new Date().toISOString().split('T')[0]
    };
    setListings(prev => [newListing, ...prev]);
  };

  const handleUpdateListing = (id: string, updatedData: Partial<Listing>) => {
    setListings(prev => prev.map(l => l.id === id ? { ...l, ...updatedData } : l));
  };

  const handleConvertToPending = (listing: Listing) => {
    setListings(prev => prev.map(l => l.id === listing.id ? { ...l, status: 'PENDING' } : l));
    const newEscrow: Escrow = {
      id: `p-${Date.now()}`,
      agent_id: user?.id || '',
      listing_id: listing.id,
      address: listing.address,
      deal_type: 'SELLER',
      status: 'OPEN',
      close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      created_at: new Date().toISOString().split('T')[0],
      representing: 'SELLER',
      deposit_received: false,
      contingencies: [
        { id: 'c1', name: 'Inspection', due_date: '', status: 'PENDING' },
        { id: 'c2', name: 'Appraisal', due_date: '', status: 'PENDING' },
        { id: 'c3', name: 'Loan', due_date: '', status: 'PENDING' }
      ]
    };
    setPendings(prev => [newEscrow, ...prev]);
    return newEscrow.id;
  };

  if (loading) return null;

  if (!user) return <Landing onLogin={handleLogin} onSignup={handleSignup} />;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
          <Route index element={<Dashboard user={user} pendingsCount={pendings.length} expenses={expenses} closedDeals={closedDeals} />} />
          <Route path="listings" element={<Listings user={user} listings={listings} onConvertToPending={handleConvertToPending} onAddListing={handleAddListing} onUpdateListing={handleUpdateListing} />} />
          <Route path="pendings" element={<Pendings user={user} pendings={pendings} />} />
          <Route path="pendings/:id" element={<PendingDetail user={user} />} />
          <Route path="closed" element={<Closed user={user} history={closedDeals} />} />
          <Route path="finances" element={<Finances expenses={expenses} setExpenses={setExpenses} incomeTarget={incomeTarget} setIncomeTarget={setIncomeTarget} expenseCap={expenseCap} setExpenseCap={setExpenseCap} />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
