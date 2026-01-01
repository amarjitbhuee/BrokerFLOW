
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
  Plus,
  Trash2,
  User,
  Phone,
  Mail,
  Calendar,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { Profile, Escrow, Commission, Expense, Contingency } from '../types.ts';
import { parseCommissionStub, ParsedCommission } from '../services/geminiService.ts';

interface PendingDetailProps {
  user: Profile;
}

const ContactCard: React.FC<{ title: string; contact?: { name: string; email?: string; phone?: string } }> = ({ title, contact }) => (
  <div className="bg-white border border-slate-100 rounded-lg p-4 shadow-sm">
    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">{title}</h4>
    {contact ? (
      <div className="space-y-2">
        <p className="text-sm font-bold text-slate-900">{contact.name}</p>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Mail className="h-3 w-3" />
          <a href={`mailto:${contact.email}`} className="hover:text-indigo-600 transition-colors">{contact.email}</a>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Phone className="h-3 w-3" />
          <a href={`tel:${contact.phone}`} className="hover:text-indigo-600 transition-colors">{contact.phone}</a>
        </div>
      </div>
    ) : (
      <p className="text-xs text-slate-400 italic">No contact info added</p>
    )}
  </div>
);

const PendingDetail: React.FC<PendingDetailProps> = ({ user }) => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'overview' | 'commission' | 'expenses' | 'files'>('overview');
  
  const [pending, setPending] = useState<Escrow>({
    id: id || 'p1',
    agent_id: 'agent-123',
    address: '123 Ocean View Dr',
    deal_type: 'SELLER',
    status: 'OPEN',
    close_date: '2024-11-15',
    created_at: '2023-10-05',
    representing: 'SELLER',
    deposit_amount: 5000,
    deposit_received: true,
    escrow_officer: { name: 'Sarah Miller', email: 'sarah@firsttitle.com', phone: '555-0102' },
    buyer_info: { name: 'Alice & Bob Johnson', email: 'thejohnsons@email.com', phone: '555-0199' },
    seller_info: { name: 'Robert Smith', email: 'rsmith@homeseller.com', phone: '555-0144' },
    contingencies: [
      { id: 'ct1', name: 'Home Inspection', due_date: '2024-10-25', status: 'MET' },
      { id: 'ct2', name: 'Appraisal', due_date: '2024-11-01', status: 'PENDING' },
      { id: 'ct3', name: 'Loan Approval', due_date: '2024-11-05', status: 'PENDING' }
    ]
  });

  const [commission, setCommission] = useState<Commission | null>({
    id: 'c1',
    escrow_id: id || 'p1',
    gross_commission: 15000,
    broker_split: 3000,
    team_split: 1500,
    admin_fees: 500,
    net_commission: 10000,
    is_confirmed: true
  });

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 'e1', escrow_id: id || 'p1', category: 'Photography', amount: 350, description: 'Listing photos', date: '2023-10-06', created_at: '2023-10-06' }
  ]);
  const [isOcrLoading, setIsOcrLoading] = useState(false);

  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const toggleContingency = (ctId: string) => {
    setPending(prev => ({
      ...prev,
      contingencies: prev.contingencies.map(ct => 
        ct.id === ctId ? { ...ct, status: ct.status === 'MET' ? 'PENDING' : 'MET' } : ct
      )
    }));
  };

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
          escrow_id: pending.id,
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

  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const netProfit = (commission?.net_commission || 0) - totalExpenses;

  return (
    <div className="space-y-6">
      <Link to="/pendings" className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Pendings
      </Link>

      <div className="flex flex-col lg:flex-row justify-between items-start gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-bold text-slate-900">{pending.address}</h2>
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
              pending.representing === 'SELLER' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              Representing {pending.representing}
            </span>
          </div>
          <p className="text-slate-500 flex items-center gap-2">
            <span className="bg-slate-100 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-tight">ESCROW OPEN</span>
            • Close Date: <span className="font-bold text-slate-900">{pending.close_date}</span>
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all flex items-center gap-2">
            <ShieldCheck className="h-4 w-4" />
            Close Escrow
          </button>
        </div>
      </div>

      <div className="border-b border-slate-200">
        <nav className="flex gap-8">
          {[
            { id: 'overview', icon: Info, label: 'Contract Overview' },
            { id: 'commission', icon: DollarSign, label: 'Financials' },
            { id: 'expenses', icon: Receipt, label: 'Transaction Expenses' },
            { id: 'files', icon: FileText, label: 'Documents' }
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

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 min-h-[500px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column: Stakeholders & Dates */}
            <div className="xl:col-span-2 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ContactCard title="Escrow Officer" contact={pending.escrow_officer} />
                <ContactCard title="Buyer" contact={pending.buyer_info} />
                <ContactCard title="Seller" contact={pending.seller_info} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Contingencies Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Clock className="h-5 w-5 text-indigo-600" />
                      Contingencies
                    </h3>
                    <button className="text-[10px] font-bold text-indigo-600 hover:underline">Add Custom</button>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-3">
                    {pending.contingencies.map((ct) => (
                      <div key={ct.id} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-100 hover:border-indigo-200 transition-colors group">
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => toggleContingency(ct.id)}
                            className={`h-5 w-5 rounded border-2 flex items-center justify-center transition-all ${
                              ct.status === 'MET' ? 'bg-emerald-500 border-emerald-500' : 'bg-white border-slate-200'
                            }`}
                          >
                            {ct.status === 'MET' && <CheckCircle2 className="h-3 w-3 text-white" />}
                          </button>
                          <div>
                            <p className={`text-sm font-bold ${ct.status === 'MET' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{ct.name}</p>
                            <p className="text-[10px] text-slate-500">Due: {ct.due_date}</p>
                          </div>
                        </div>
                        <div className="hidden group-hover:block">
                          <button className="text-slate-300 hover:text-rose-600">
                             <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Deposit Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-indigo-600" />
                    Deposit Tracking
                  </h3>
                  <div className={`p-6 rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center text-center ${
                    pending.deposit_received ? 'bg-emerald-50 border-emerald-200' : 'bg-amber-50 border-amber-200'
                  }`}>
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center mb-3 ${
                      pending.deposit_received ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {pending.deposit_received ? <CheckCircle2 className="h-6 w-6" /> : <Clock className="h-6 w-6" />}
                    </div>
                    <p className="text-xl font-black text-slate-900">{fmt.format(pending.deposit_amount || 0)}</p>
                    <p className={`text-xs font-bold uppercase tracking-wider mb-4 ${
                      pending.deposit_received ? 'text-emerald-700' : 'text-amber-700'
                    }`}>
                      EMD {pending.deposit_received ? 'Received' : 'Pending Receipt'}
                    </p>
                    {!pending.deposit_received && (
                      <button 
                        onClick={() => setPending({...pending, deposit_received: true})}
                        className="bg-white border border-amber-200 text-amber-700 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-amber-100 transition-colors"
                      >
                        Mark as Received
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Key Metrics */}
            <div className="space-y-6">
               <div className="bg-indigo-900 rounded-xl p-8 text-white shadow-xl">
                  <h4 className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Estimated Net GCI</h4>
                  <p className="text-4xl font-black mb-6">{fmt.format(netProfit)}</p>
                  <div className="space-y-3">
                    <div className="flex justify-between text-xs font-medium opacity-80 border-b border-white/10 pb-2">
                      <span>Gross Commission</span>
                      <span>{fmt.format(commission?.gross_commission || 0)}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium opacity-80 border-b border-white/10 pb-2">
                      <span>Total Deductions</span>
                      <span>-{fmt.format((commission?.gross_commission || 0) - (commission?.net_commission || 0))}</span>
                    </div>
                    <div className="flex justify-between text-xs font-medium opacity-80 text-rose-300">
                      <span>Transaction Expenses</span>
                      <span>-{fmt.format(totalExpenses)}</span>
                    </div>
                  </div>
               </div>

               <div className="bg-slate-50 border border-slate-100 rounded-xl p-6">
                  <h4 className="text-sm font-bold text-slate-900 mb-4">Transaction Timeline</h4>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-white border border-slate-100 flex items-center justify-center text-slate-400">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Opening Date</p>
                        <p className="text-sm font-bold text-slate-800">{pending.created_at}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-medium">Projected Closing</p>
                        <p className="text-sm font-bold text-slate-800">{pending.close_date}</p>
                      </div>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        )}

        {activeTab === 'commission' && (
          <div className="space-y-8">
            {!commission && !isOcrLoading && (
              <div className="max-w-md mx-auto text-center py-12">
                <Upload className="h-12 w-12 text-indigo-200 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2 text-slate-800">Parse Commission Stub</h3>
                <p className="text-sm text-slate-500 mb-6">Let our AI calculate your splits automatically.</p>
                <label className="cursor-pointer bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-700 transition-colors shadow-lg block">
                  Select Stub Image
                  <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                </label>
              </div>
            )}

            {isOcrLoading && (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
                <p className="font-bold text-slate-900">AI is extracting financial data...</p>
              </div>
            )}

            {commission && !isOcrLoading && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-slate-900">Commission Breakdown</h3>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${commission.is_confirmed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {commission.is_confirmed ? 'Confirmed' : 'Needs Review'}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between bg-slate-50 p-3 rounded-lg text-sm">
                      <span className="text-slate-500 font-medium">Gross Commission</span>
                      <span className="font-bold text-slate-900">{fmt.format(commission.gross_commission)}</span>
                    </div>
                    <div className="flex justify-between p-3 text-sm border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Broker Split</span>
                      <span className="font-bold text-slate-900">-{fmt.format(commission.broker_split)}</span>
                    </div>
                    <div className="flex justify-between p-3 text-sm border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Team Split</span>
                      <span className="font-bold text-slate-900">-{fmt.format(commission.team_split)}</span>
                    </div>
                    <div className="flex justify-between p-3 text-sm border-b border-slate-50">
                      <span className="text-slate-500 font-medium">Admin Fees</span>
                      <span className="font-bold text-slate-900">-{fmt.format(commission.admin_fees)}</span>
                    </div>
                    <div className="flex justify-between p-3 pt-6">
                      <span className="font-bold text-slate-900">Net Commission</span>
                      <span className="text-2xl font-black text-indigo-600">{fmt.format(commission.net_commission)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'expenses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold">Transaction Expenses</h3>
              <button 
                onClick={() => {
                  const amount = prompt("Expense Amount:");
                  const description = prompt("Expense Description:");
                  if (amount && description) {
                    setExpenses([...expenses, {
                      id: Math.random().toString(),
                      escrow_id: pending.id,
                      category: 'Other',
                      amount: parseFloat(amount),
                      description,
                      date: new Date().toISOString().split('T')[0],
                      created_at: new Date().toISOString()
                    }]);
                  }
                }}
                className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-indigo-100 transition-colors"
              >
                <Plus className="h-4 w-4" /> Add Expense
              </button>
            </div>
            
            <div className="divide-y divide-slate-100 bg-slate-50 rounded-xl overflow-hidden border border-slate-200">
              {expenses.map((exp) => (
                <div key={exp.id} className="p-4 flex items-center justify-between bg-white">
                  <div>
                    <p className="text-sm font-bold text-slate-900">{exp.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded uppercase">{exp.category}</span>
                      <span className="text-xs text-slate-400">{exp.date}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="font-black text-rose-600">{fmt.format(exp.amount)}</p>
                    <button 
                      onClick={() => setExpenses(expenses.filter(e => e.id !== exp.id))}
                      className="text-slate-300 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
              {expenses.length === 0 && (
                <div className="py-20 text-center">
                  <p className="text-slate-400 font-medium">No expenses for this pending escrow.</p>
                </div>
              )}
            </div>
            <div className="p-4 bg-rose-50 rounded-xl flex items-center justify-between border border-rose-100">
              <span className="text-sm font-bold text-rose-700 uppercase tracking-tighter">Total Deal Deductions</span>
              <span className="text-xl font-black text-rose-700">{fmt.format(totalExpenses)}</span>
            </div>
          </div>
        )}

        {activeTab === 'files' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-slate-200 flex items-center gap-4 hover:border-indigo-300 transition-all cursor-pointer group bg-slate-50/50">
              <div className="h-10 w-10 bg-indigo-50 text-indigo-600 rounded flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-slate-900 truncate">Purchase_Contract.pdf</p>
                <p className="text-[10px] text-slate-400">Uploaded 10/05/2023</p>
              </div>
            </div>
            <button className="p-4 rounded-lg border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-2 hover:bg-slate-50 transition-colors group">
              <Plus className="h-6 w-6 text-slate-300 group-hover:text-indigo-600" />
              <span className="text-xs font-bold text-slate-400 group-hover:text-indigo-600">Upload Document</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingDetail;
