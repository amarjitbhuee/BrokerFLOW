
import React from 'react';
import { TrendingUp, DollarSign, Briefcase, Calculator } from 'lucide-react';
import { Profile, DashboardStats, Escrow, Expense } from '../types.ts';

interface DashboardProps {
  user: Profile;
  pendingsCount: number;
  expenses: Expense[];
  closedDeals: Escrow[];
}

const StatCard: React.FC<{ label: string; value: string; icon: React.ElementType; color: string }> = ({ label, value, icon: Icon, color }) => (
  <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  </div>
);

const Dashboard: React.FC<DashboardProps> = ({ user, pendingsCount, expenses, closedDeals }) => {
  const currentYear = new Date().getFullYear();
  
  // Calculate dynamic stats
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const dealsThisYear = closedDeals.filter(d => d.close_date && new Date(d.close_date).getFullYear() === currentYear);
  
  // Note: For a real app, commission data would be joined. Mocking simple calculation here.
  const ytdGross = dealsThisYear.length * 15000; // Mock assumption for demo if no commission data
  const ytdNet = ytdGross * 0.7 - totalExpenses; // Mock 70/30 split assumption

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user.full_name.split(' ')[0]}</h2>
        <p className="text-slate-500">Here's a summary of your production for {currentYear}.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="YTD Gross Commission" 
          value={formatter.format(ytdGross)} 
          icon={TrendingUp} 
          color="bg-emerald-500" 
        />
        <StatCard 
          label="Active Pendings" 
          value={pendingsCount.toString()} 
          icon={Briefcase} 
          color="bg-amber-500" 
        />
        <StatCard 
          label="Deals Closed (YTD)" 
          value={dealsThisYear.length.toString()} 
          icon={Briefcase} 
          color="bg-blue-500" 
        />
        <StatCard 
          label="Total Expenses" 
          value={formatter.format(totalExpenses)} 
          icon={Calculator} 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-bold mb-4">Recent Closings</h3>
          <div className="space-y-4">
            {dealsThisYear.slice(0, 3).map((deal, i) => (
              <div key={deal.id} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border-l-4 border-indigo-400">
                <div className="min-w-[80px] text-xs font-bold text-slate-400 uppercase">
                  {new Date(deal.close_date!).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{deal.address}</p>
                  <p className="text-xs text-slate-500">{deal.representing} Side</p>
                </div>
              </div>
            ))}
            {dealsThisYear.length === 0 && (
              <div className="py-8 text-center">
                <p className="text-slate-400 text-sm">No closings recorded for {currentYear} yet.</p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Calculator className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold">Pipeline Management</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-xs">New users start with a clean slate. Track every dollar from lead to close.</p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-shadow shadow-md">
            + Open New Escrow
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
