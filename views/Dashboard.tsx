
import React from 'react';
import { TrendingUp, DollarSign, Briefcase, Calculator } from 'lucide-react';
import { Profile, DashboardStats } from '../types.ts';

interface DashboardProps {
  user: Profile;
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

const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const stats: DashboardStats = {
    ytdGross: 145000,
    ytdNet: 92450,
    dealsClosed: 14,
    totalExpenses: 8420
  };

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Welcome back, {user.full_name.split(' ')[0]}</h2>
        <p className="text-slate-500">Here's a summary of your performance this year.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          label="YTD Gross Commission" 
          value={formatter.format(stats.ytdGross)} 
          icon={TrendingUp} 
          color="bg-emerald-500" 
        />
        <StatCard 
          label="YTD Net Income" 
          value={formatter.format(stats.ytdNet)} 
          icon={DollarSign} 
          color="bg-indigo-500" 
        />
        <StatCard 
          label="Deals Closed" 
          value={stats.dealsClosed.toString()} 
          icon={Briefcase} 
          color="bg-blue-500" 
        />
        <StatCard 
          label="Total Expenses" 
          value={formatter.format(stats.totalExpenses)} 
          icon={Calculator} 
          color="bg-rose-500" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="text-lg font-bold mb-4">Recent Milestones</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-lg transition-colors border-l-4 border-indigo-400">
                <div className="min-w-[80px] text-xs font-bold text-slate-400">MAY {10 + i}</div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Property {i} Closed</p>
                  <p className="text-xs text-slate-500">Net Commission: $8,420.00</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col items-center justify-center text-center">
          <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
            <Calculator className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold">Manage Pipeline</h3>
          <p className="text-sm text-slate-500 mb-6 max-w-xs">Track your real estate business from lead to close with automated splitting.</p>
          <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition-shadow shadow-md">
            + New Listing
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
