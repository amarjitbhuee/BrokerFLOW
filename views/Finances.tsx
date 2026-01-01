
import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calculator, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  PieChart
} from 'lucide-react';
import { Budget, Expense, ExpenseCategory } from '../types.ts';

const Finances: React.FC = () => {
  const [budget, setBudget] = useState<Budget>({
    year: 2024,
    incomeTarget: 200000,
    expenseCap: 25000
  });

  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 'e1', category: 'Photography', amount: 350, description: 'Listing photos for Maple Dr', date: '2024-05-12', created_at: '2024-05-12' },
    { id: 'e2', category: 'Marketing', amount: 1200, description: 'Facebook Ad Campaign Q2', date: '2024-05-15', created_at: '2024-05-15' },
    { id: 'e3', category: 'Software', amount: 99, description: 'Monthly CRM Subscription', date: '2024-05-18', created_at: '2024-05-18' },
  ]);

  const [actualIncome] = useState(145000); // Mock data
  const totalExpenses = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  const fmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

  const ProgressBar = ({ current, target, color }: { current: number, target: number, color: string }) => {
    const percentage = Math.min((current / target) * 100, 100);
    return (
      <div className="w-full bg-slate-100 rounded-full h-2.5 mt-2">
        <div 
          className={`h-2.5 rounded-full transition-all duration-1000 ${color}`} 
          style={{ width: `${percentage}%` }}
        />
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Finances & Budgeting</h2>
          <p className="text-slate-500">Track your business performance and yearly targets.</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 shadow-sm transition-colors">
          <Plus className="h-4 w-4" /> Add Expense
        </button>
      </div>

      {/* Budget Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Income Target */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-emerald-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
            <button 
              onClick={() => {
                const newTarget = prompt("Enter new Yearly Income Target:", budget.incomeTarget.toString());
                if (newTarget) setBudget({ ...budget, incomeTarget: parseFloat(newTarget) });
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Adjust Target
            </button>
          </div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Yearly Income Target</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{fmt.format(actualIncome)}</span>
            <span className="text-slate-400 font-medium text-sm">/ {fmt.format(budget.incomeTarget)}</span>
          </div>
          <ProgressBar current={actualIncome} target={budget.incomeTarget} color="bg-emerald-500" />
          <p className="mt-2 text-xs text-slate-400 font-medium">
            {Math.round((actualIncome / budget.incomeTarget) * 100)}% of goal reached
          </p>
        </div>

        {/* Expense Cap */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-rose-50 rounded-lg">
              <PieChart className="h-6 w-6 text-rose-600" />
            </div>
            <button 
              onClick={() => {
                const newCap = prompt("Enter new Yearly Expense Cap:", budget.expenseCap.toString());
                if (newCap) setBudget({ ...budget, expenseCap: parseFloat(newCap) });
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Adjust Cap
            </button>
          </div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Yearly Expense Cap</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900">{fmt.format(totalExpenses)}</span>
            <span className="text-slate-400 font-medium text-sm">/ {fmt.format(budget.expenseCap)}</span>
          </div>
          <ProgressBar current={totalExpenses} target={budget.expenseCap} color="bg-rose-500" />
          <p className="mt-2 text-xs text-slate-400 font-medium">
            {Math.round((totalExpenses / budget.expenseCap) * 100)}% of cap utilized
          </p>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Recent Expenses</h3>
          <div className="flex gap-2">
            <span className="text-xs font-semibold text-slate-400">Total: {fmt.format(totalExpenses)}</span>
          </div>
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
                <button className="text-[10px] font-bold text-rose-600 hover:underline">Remove</button>
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-medium">No expenses recorded yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Finances;
