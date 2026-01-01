
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Handshake, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { Profile, Escrow } from '../types.ts';

interface PendingsProps {
  user: Profile;
  pendings: Escrow[];
}

const Pendings: React.FC<PendingsProps> = ({ user, pendings }) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pendings</h2>
          <p className="text-slate-500">Track and manage your escrows in progress.</p>
        </div>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow-sm transition-colors">
          Open New Escrow
        </button>
      </div>

      <div className="space-y-4">
        {pendings.map((pending) => (
          <div 
            key={pending.id} 
            onClick={() => navigate(`/pendings/${pending.id}`)}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm cursor-pointer transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                pending.deal_type === 'SELLER' ? 'bg-indigo-100 text-indigo-600' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <Handshake className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-lg font-bold text-slate-900">{pending.address}</h3>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    pending.status === 'OPEN' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                  }`}>
                    {pending.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-slate-500">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {pending.deal_type} Side
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    Est. Close: {pending.close_date}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Deposit Status</p>
                <p className={`text-sm font-bold ${pending.deposit_received ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {pending.deposit_received ? 'Received' : 'Awaiting'}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ArrowRight className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
        {pendings.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
             <Handshake className="h-12 w-12 text-slate-200 mx-auto mb-2" />
             <p className="text-slate-400 font-medium">No pending escrows found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pendings;
