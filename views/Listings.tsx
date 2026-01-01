
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, MoreVertical, Plus, ArrowRight } from 'lucide-react';
import { Profile, Listing } from '../types.ts';

interface ListingsProps {
  user: Profile;
}

const Listings: React.FC<ListingsProps> = ({ user }) => {
  const navigate = useNavigate();
  const [listings, setListings] = useState<Listing[]>([
    { id: '1', agent_id: 'agent-123', address: '742 Evergreen Terrace', property_type: 'Single Family', status: 'ACTIVE', created_at: '2023-10-01' },
    { id: '2', agent_id: 'agent-123', address: '123 Ocean View Dr', property_type: 'Condo', status: 'PENDING', created_at: '2023-10-05' },
    { id: '3', agent_id: 'agent-123', address: '456 Pine Ln', property_type: 'Townhouse', status: 'ACTIVE', created_at: '2023-10-08' },
  ]);

  const handleConvertToPending = (listing: Listing) => {
    const confirmConversion = window.confirm(`Ready to open escrow for ${listing.address}? This listing will be moved to Pendings.`);
    if (confirmConversion) {
      navigate(`/pendings/new?listingId=${listing.id}&address=${encodeURIComponent(listing.address)}`);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Active Listings</h2>
          <p className="text-slate-500">Manage your current listing inventory.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
          <Plus className="h-5 w-5" />
          Add Listing
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((listing) => (
          <div key={listing.id} className="group relative rounded-xl border border-slate-200 bg-white overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-32 bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
              <Home className="h-12 w-12 text-slate-300 group-hover:text-slate-400" />
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold tracking-widest px-2 py-0.5 rounded uppercase ${
                  listing.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                }`}>
                  {listing.status}
                </span>
                <button className="text-slate-400 hover:text-slate-600">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
              <h3 className="text-lg font-bold text-slate-900 leading-tight mb-1">{listing.address}</h3>
              <p className="text-sm text-slate-500 mb-4">{listing.property_type}</p>
              
              <button 
                onClick={() => handleConvertToPending(listing)}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-lg border-2 border-indigo-50 text-indigo-600 font-bold text-sm hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
              >
                Convert to Pending
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}

        {listings.length === 0 && (
          <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
            <p className="text-slate-400 font-medium">No active listings found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listings;
