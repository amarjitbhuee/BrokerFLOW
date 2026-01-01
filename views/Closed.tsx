
import React, { useState, useMemo } from 'react';
import { 
  History, 
  Download, 
  Search, 
  TrendingUp, 
  MapPin, 
  ChevronDown 
} from 'lucide-react';
import { Profile, Escrow } from '../types.ts';

// Define Period type outside to be accessible for state typing
type Period = 'YTD' | '2023' | '2022' | 'Older';

// Added ClosedProps interface to fix prop typing error in App.tsx
interface ClosedProps {
  user: Profile;
}

interface ClosedDeal extends Escrow {
  netCommission: number;
  grossCommission: number;
}

// Fixed: Switched to standard function component to resolve IntrinsicAttributes error in App.tsx
const Closed = ({ user }: ClosedProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('YTD');
  const [searchQuery, setSearchQuery] = useState('');

  // Fixed: Added mandatory Escrow fields (representing, deposit_received, contingencies) to mock data
  const mockHistory: ClosedDeal[] = [
    { 
      id: 'c1', 
      address: '445 Shoreline Drive', 
      deal_type: 'SELLER', 
      status: 'CLOSED', 
      close_date: '2024-03-12', 
      created_at: '2024-01-05', 
      agent_id: 'agent-123', 
      netCommission: 12400, 
      grossCommission: 18000,
      representing: 'SELLER',
      deposit_received: true,
      contingencies: []
    },
    { 
      id: 'c2', 
      address: '12 Village Creek', 
      deal_type: 'BUYER', 
      status: 'CLOSED', 
      close_date: '2024-05-18', 
      created_at: '2024-03-20', 
      agent_id: 'agent-123', 
      netCommission: 9800, 
      grossCommission: 14500,
      representing: 'BUYER',
      deposit_received: true,
      contingencies: []
    },
    { 
      id: 'c3', 
      address: '99 Summit Pass', 
      deal_type: 'SELLER', 
      status: 'CLOSED', 
      close_date: '2023-11-20', 
      created_at: '2023-09-15', 
      agent_id: 'agent-123', 
      netCommission: 24000, 
      grossCommission: 32000,
      representing: 'SELLER',
      deposit_received: true,
      contingencies: []
    },
    { 
      id: 'c4', 
      address: '821 Oak Avenue', 
      deal_type: 'BUYER', 
      status: 'CLOSED', 
      close_date: '2023-06-05', 
      created_at: '2023-04-10', 
      agent_id: 'agent-123', 
      netCommission: 11200, 
      grossCommission: 16000,
      representing: 'BUYER',
      deposit_received: true,
      contingencies: []
    },
    { 
      id: 'c5', 
      address: '77 Pebble Road', 
      deal_type: 'SELLER', 
      status: 'CLOSED', 
      close_date: '2022-08-14', 
      created_at: '2022-06-01', 
      agent_id: 'agent-123', 
      netCommission: 8500, 
      grossCommission: 12000,
      representing: 'SELLER',
      deposit_received: true,
      contingencies: []
    },
  ];

  const filteredDeals = useMemo(() => {
    return mockHistory.filter(deal => {
      const year = new Date(deal.close_date || '').getFullYear();
      const matchesPeriod = 
        selectedPeriod === 'YTD' ? year === 2024 :
        selectedPeriod === '2023' ? year === 2023 :
        selectedPeriod === '2022' ? year === 2022 :
        year < 2022;

      const matchesSearch = deal.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesPeriod && matchesSearch;
    });
  }, [selectedPeriod, searchQuery]);

  const totals = useMemo(() => {
    return filteredDeals.reduce((acc, curr) => ({
      net: acc.net + curr.netCommission,
      gross: acc.gross + curr.grossCommission,
      count: acc.count + 1
    }), { net: 0, gross: 0, count: 0 });
  }, [filteredDeals]);

  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Closed History</h2>
          <p className="text-slate-500">Analyze your production across fiscal periods.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-slate-50 transition-colors">
          <Download className="h-4 w-4" />
          Export Report
        </button>
      </div>

      {/* Filter Bar */}
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
              {period === 'YTD' ? 'Year to Date' : period}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by address..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-emerald-600 rounded-xl p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Total Net Income</p>
          <p className="text-2xl font-black">{fmt.format(totals.net)}</p>
        </div>
        <div className="bg-slate-900 rounded-xl p-5 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest opacity-80 mb-1">Gross GCI</p>
          <p className="text-2xl font-black">{fmt.format(totals.gross)}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Units Closed</p>
          <p className="text-2xl font-black text-slate-900">{totals.count}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Address</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Close Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Gross GCI</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Net Profit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDeals.map((deal) => (
                <tr key={deal.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{deal.address}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-500 font-medium">{deal.close_date}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      deal.deal_type === 'SELLER' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {deal.deal_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-bold text-slate-900">{fmt.format(deal.grossCommission)}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-black text-emerald-600">{fmt.format(deal.netCommission)}</span>
                  </td>
                </tr>
              ))}
              {filteredDeals.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center">
                    <History className="h-12 w-12 text-slate-200 mx-auto mb-2" />
                    <p className="text-slate-400 font-medium">No closed deals found for this period.</p>
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
