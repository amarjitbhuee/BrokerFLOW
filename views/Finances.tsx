
import React from 'react';
import { 
  TrendingUp, 
  Calculator, 
  Plus, 
  PieChart
} from 'lucide-react';
import { Expense } from '../types.ts';

interface FinancesProps {
  expenses: Expense[];
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
  incomeTarget: number;
  setIncomeTarget: (val: number) => void;
  expenseCap: number;
  setExpenseCap: (val: number) => void;
}

const Finances: React.FC<FinancesProps> = ({ 
  expenses, setExpenses, incomeTarget, setIncomeTarget, expenseCap, setExpenseCap 
}) => {
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const actualIncome = 0; // In a full app, this comes from closed deals' net commission sum

  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const ProgressBar = ({ current, target, color }: { current: number, target: number, color: string }) => {
    const percentage = target > 0 ? Math.min((current / target) * 100, 100) : 0;
    return (
      <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2">
        <div 
          className={`h-2.5 rounded-full transition-all duration-1000 ${color}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  const handleAddExpense = () => {
    const amount = prompt("Expense Amount:");
    const desc = prompt("Description:");
    if (amount && desc) {
      const newExp: Expense = {
        id: `e-${Date.now()}`,
        amount: parseFloat(amount),
        description: desc,
        category: 'Marketing',
        date: new Date().toISOString().split('T')[0],
        created_at: new Date().toISOString()
      };
      setExpenses(prev => [...prev, newExp]);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Finances & Budgeting</h2>
          <p className="text-slate-500">Manage your business targets and overhead.</p>
        </div>
        <button 
          onClick={handleAddExpense}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow-sm transition-colors"
        >
          <Plus className="h-4 w-4" /> Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <button 
              onClick={() => {
                const newTarget = prompt("Enter new Yearly Income Target:", incomeTarget.toString());
                if (newTarget) setIncomeTarget(parseFloat(newTarget));
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Adjust Target
            </button>
          </div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Yearly Income Target</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{fmt.format(actualIncome)}</span>
            <span className="text-slate-400 font-medium text-sm">/ {fmt.format(incomeTarget)}</span>
          </div>
          <ProgressBar current={actualIncome} target={incomeTarget} color="bg-emerald-500" />
          <p className="mt-2 text-xs text-slate-400 font-medium">
            {incomeTarget > 0 ? Math.round((actualIncome / incomeTarget) * 100) : 0}% of goal reached
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 rounded-lg">
              <PieChart className="h-6 w-6 text-rose-600" />
            </div>
            <button 
              onClick={() => {
                const newCap = prompt("Enter new Yearly Expense Cap:", expenseCap.toString());
                if (newCap) setExpenseCap(parseFloat(newCap));
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Adjust Cap
            </button>
          </div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Yearly Expense Cap</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{fmt.format(totalExpenses)}</span>
            <span className="text-slate-400 font-medium text-sm">/ {fmt.format(expenseCap)}</span>
          </div>
          <ProgressBar current={totalExpenses} target={expenseCap} color="bg-rose-500" />
          <p className="mt-2 text-xs text-slate-400 font-medium">
            {expenseCap > 0 ? Math.round((totalExpenses / expenseCap) * 100) : 0}% of cap utilized
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Expense Ledger</h3>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Total: {fmt.format(totalExpenses)}</span>
        </div>
        <div className="divide-y divide-slate-50">
          {expenses.map((expense) => (
            <div key={expense.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">{expense.description}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 text-slate-600 uppercase">{expense.category}</span>
                    <span className="text-xs text-slate-400">{expense.date}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-slate-900">{fmt.format(expense.amount)}</p>
                <button 
                  onClick={() => setExpenses(prev => prev.filter(e => e.id !== expense.id))}
                  className="text-[10px] font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="py-20 text-center bg-slate-50/50">
              <Calculator className="h-12 w-12 text-slate-200 mx-auto mb-2" />
              <p className="text-slate-400 font-medium">No expenses recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Finances;
