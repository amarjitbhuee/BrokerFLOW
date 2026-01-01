
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Handshake, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Profile, Escrow } from '../types.ts';

interface DealsProps {
  user: Profile;
}

const Deals: React.FC<DealsProps> = ({ user }) => {
  const navigate = useNavigate();
  // Fixed: Added missing mandatory fields to comply with Escrow interface
  const mockDeals: Escrow[] = [
    { 
      id: 'd1', 
      agent_id: 'agent-123', 
      address: '123 Ocean View Dr', 
      deal_type: 'SELLER', 
      status: 'OPEN', 
      close_date: '2023-11-15', 
      created_at: '2023-10-05',
      representing: 'SELLER',
      deposit_received: true,
      contingencies: []
    },
    { 
      id: 'd2', 
      agent_id: 'agent-123', 
      address: '99 Mountain Pass', 
      deal_type: 'BUYER', 
      status: 'CLOSED', 
      close_date: '2023-10-20', 
      created_at: '2023-09-15',
      representing: 'BUYER',
      deposit_received: true,
      contingencies: []
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Active Deals</h2>
          <p className="text-slate-500">Manage your pending escrows and closings.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow-sm transition-colors">
          Open New Escrow
        </button>
      </div>

      <div className="space-y-4">
        {mockDeals.map((deal) => (
          <div 
            key={deal.id} 
            onClick={() => navigate(`/deals/${deal.id}`)}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                deal.deal_type === 'SELLER' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <Handshake className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-lg font-bold text-slate-900">{deal.address}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    deal.status === 'OPEN' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {deal.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {deal.deal_type} Side
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Est. Close: {deal.close_date}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Est. Net</p>
                <p className="text-lg font-bold text-emerald-600">$12,450.00</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Deals;
