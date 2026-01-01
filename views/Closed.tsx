
import React, { useState, useMemo } from 'react';
import { 
  History, 
  Download, 
  Search, 
  MapPin 
} from 'lucide-react';
import { Profile, Escrow } from '../types.ts';

type Period = 'YTD' | '2023' | '2022' | 'Older';

interface ClosedProps {
  user: Profile;
  history: Escrow[];
}

const Closed = ({ user, history }: ClosedProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('YTD');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDeals = useMemo(() => {
    return history.filter(deal => {
      const year = new Date(deal.close_date || '').getFullYear();
      const matchesPeriod = 
        selectedPeriod === 'YTD' ? year === new Date().getFullYear() :
        selectedPeriod === '2023' ? year === 2023 :
        selectedPeriod === '2022' ? year === 2022 :
        year < 2022;

      const matchesSearch = deal.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPeriod && matchesSearch;
    });
  }, [selectedPeriod, searchQuery, history]);

  const totals = useMemo(() => {
    return filteredDeals.reduce((acc, curr) => ({
      count: acc.count + 1
    }), { count: 0 });
  }, [filteredDeals]);

  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Closed History</h2>
          <p className="text-slate-500">Review your past performance and settlements.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="h-4 w-4" />
          Export Data
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex p-1 bg-slate-100 rounded-lg w-full sm:w-auto">
          {(['YTD', '2023', '2022', 'Older'] as Period[]).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`flex-1 sm:flex-none px-6 py-1.5 text-xs font-bold rounded-md transition-all ${
                selectedPeriod === period 
                  ? 'bg-white text-indigo-700 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {period === 'YTD' ? 'Current Year' : period}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search address..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm inline-block">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Units Closed</p>
        <p className="text-2xl font-black text-slate-900">{totals.count}</p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Close Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Representation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{deal.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                    {deal.close_date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      deal.deal_type === 'SELLER' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {deal.deal_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase">
                    {deal.representing}
                  </td>
                </tr>
              ))}
              {filteredDeals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center bg-slate-50/50">
                    <History className="h-12 w-12 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400 font-medium">No closings found for this period.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Closed;
