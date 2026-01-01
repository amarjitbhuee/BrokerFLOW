
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Info, 
  DollarSign, 
  Receipt, 
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Plus
} from 'lucide-react';
import { Profile, Escrow, Commission, Expense } from '../types.ts';
import { parseCommissionStub, ParsedCommission } from '../services/geminiService.ts';

interface DealDetailProps {
  user: Profile;
}

const DealDetail: React.FC<DealDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'commission' | 'expenses' | 'files'>('overview');
  
  // Fixed: Added missing mandatory fields for Escrow state
  const [deal] = useState<Escrow>({
    id: id || '1',
    agent_id: 'agent-123',
    address: '123 Ocean View Dr',
    deal_type: 'SELLER',
    status: 'OPEN',
    close_date: '2023-11-15',
    created_at: '2023-10-05',
    representing: 'SELLER',
    deposit_received: true,
    contingencies: []
  });

  const [commission, setCommission] = useState<Commission | null>({
    id: 'c1',
    escrow_id: id || '1',
    gross_commission: 15000,
    broker_split: 3000,
    team_split: 1500,
    admin_fees: 500,
    net_commission: 10000,
    is_confirmed: true
  });

  const [expenses] = useState<Expense[]>([]);
  const [isOcrLoading, setIsOcrLoading] = useState(false);

  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrLoading(true);
    
    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = (reader.result as string).split(',')[1];
      try {
        const parsed: ParsedCommission = await parseCommissionStub(base64);
        setCommission({
          id: 'new',
          escrow_id: deal.id,
          ...parsed,
          net_commission: parsed.gross_commission - parsed.broker_split - parsed.team_split - parsed.admin_fees,
          is_confirmed: false
        });
        setActiveTab('commission');
      } catch (err) {
        alert("Could not parse stub automatically.");
      } finally {
        setIsOcrLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      <Link to="/deals" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Deals
      </Link>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold text-slate-900">{deal.address}</h2>
          <p className="text-slate-500 flex items-center gap-2">
            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold">{deal.deal_type}</span>
            • Closed {deal.close_date}
          </p>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {[
            { id: 'overview', icon: Info, label: 'Overview' },
            { id: 'commission', icon: DollarSign, label: 'Commission' },
            { id: 'expenses', icon: Receipt, label: 'Expenses' },
            { id: 'files', icon: FileText, label: 'Files' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-4 px-1 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <h3 className="text-lg font-bold">Transaction Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
                  <span className="text-slate-500">Close Date</span>
                  <span className="font-medium">{deal.close_date}</span>
                </div>
                <div className="flex justify-between border-b border-slate-50 pb-2 text-sm">
                  <span className="text-slate-500">Status</span>
                  <span className="text-indigo-600 font-bold">{deal.status}</span>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6 flex flex-col items-center justify-center text-center">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Estimated Net Income</h4>
              <p className="text-4xl font-black text-emerald-600">{fmt.format(commission?.net_commission || 0)}</p>
            </div>
          </div>
        )}

        {activeTab === 'commission' && (
          <div className="space-y-8">
            {!commission && !isOcrLoading && (
              <div className="max-w-md mx-auto text-center py-12">
                <div className="h-16 w-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-2">Upload Commission Stub</h3>
                <label className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg block">
                  Select File
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            )}

            {isOcrLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                <p className="font-bold text-slate-900">AI is parsing your stub...</p>
              </div>
            )}

            {commission && !isOcrLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold">Commission Breakdown</h3>
                    <span className="flex items-center gap-1 text-amber-600 text-xs font-bold bg-amber-50 px-2 py-1 rounded-full uppercase">
                      {commission.is_confirmed ? 'Confirmed' : 'Review Needed'}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center bg-slate-50 p-3 rounded-lg">
                      <span className="font-medium text-slate-700">Gross Commission</span>
                      <span className="font-bold">{fmt.format(commission.gross_commission)}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 text-sm">
                      <span className="text-slate-500">Net Pay</span>
                      <span className="text-lg font-black text-indigo-600">{fmt.format(commission.net_commission)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-6 text-center py-12">
            <Receipt className="h-12 w-12 text-slate-200 mx-auto mb-2" />
            <p className="text-slate-500">Expense tracking enabled for active deals.</p>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-slate-200 flex items-center gap-4 hover:border-indigo-300 cursor-pointer">
              <FileText className="h-6 w-6 text-indigo-600" />
              <p className="text-sm font-bold">Contract.pdf</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DealDetail;
