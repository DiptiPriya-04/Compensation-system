'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ComparePage() {
  const [salaryId1, setSalaryId1] = useState('');
  const [salaryId2, setSalaryId2] = useState('');
  const [comparison, setComparison] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCompare = async (e) => {
    e.preventDefault();
    if (!salaryId1 || !salaryId2) {
      setError("Please provide both Salary IDs.");
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`/api/compare?salary1=${salaryId1}&salary2=${salaryId2}`);
      const data = await res.json();
      if (res.ok) {
        setComparison(data);
      } else {
        setError(data.error || "Failed to fetch comparison.");
        setComparison(null);
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900 font-sans">
      <div className="max-w-4xl mx-auto">
        <Link href="/" className="text-indigo-600 font-semibold mb-6 inline-block">&larr; Back Home</Link>
        <h1 className="text-4xl font-extrabold mb-4">Compare Offers</h1>
        <p className="text-slate-600 mb-8 max-w-2xl">Enter two Salary UUIDs to run a structured comparison across base, bonus, stock, and standard level mapping.</p>

        {/* Input Form */}
        <form onSubmit={handleCompare} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-end mb-8">
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Offer 1 (Salary UUID)</label>
            <input 
              value={salaryId1} 
              onChange={(e) => setSalaryId1(e.target.value)} 
              placeholder="e.g. 550e8400-e29b..."
              className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex-1 w-full">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Offer 2 (Salary UUID)</label>
            <input 
              value={salaryId2} 
              onChange={(e) => setSalaryId2(e.target.value)} 
              placeholder="e.g. 123e4567-e89b..."
              className="w-full border border-slate-200 rounded-lg p-3 outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold rounded-lg shadow-sm transition-all"
          >
            {loading ? "Comparing..." : "Compare"}
          </button>
        </form>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-8 border border-red-100">{error}</div>}

        {/* Comparison Results */}
        {comparison && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-3 bg-slate-50 border-b border-slate-200 divide-x divide-slate-200">
              <div className="p-6">
                <h3 className="font-semibold text-slate-500 uppercase tracking-wider text-sm mb-1">Metrics</h3>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-xl text-slate-900">{comparison.salary1.company}</h3>
                <p className="text-slate-500 text-sm">{comparison.salary1.role} • {comparison.salary1.level}</p>
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-xl text-slate-900">{comparison.salary2.company}</h3>
                <p className="text-slate-500 text-sm">{comparison.salary2.role} • {comparison.salary2.level}</p>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              
              <div className="grid grid-cols-3 divide-x divide-slate-100 hover:bg-slate-50 transition-colors">
                <div className="p-5 font-semibold text-slate-700 flex items-center">Base Salary</div>
                <div className="p-5 text-center font-mono text-lg">${comparison.salary1.base.toLocaleString()}</div>
                <div className="p-5 text-center font-mono text-lg">${comparison.salary2.base.toLocaleString()}</div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-slate-100 hover:bg-slate-50 transition-colors">
                <div className="p-5 font-semibold text-slate-700 flex items-center">Stock Grant</div>
                <div className="p-5 text-center font-mono text-lg">${comparison.salary1.stock.toLocaleString()}</div>
                <div className="p-5 text-center font-mono text-lg">${comparison.salary2.stock.toLocaleString()}</div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-slate-100 hover:bg-slate-50 transition-colors">
                <div className="p-5 font-semibold text-slate-700 flex items-center">Performance Bonus</div>
                <div className="p-5 text-center font-mono text-lg">${comparison.salary1.bonus.toLocaleString()}</div>
                <div className="p-5 text-center font-mono text-lg">${comparison.salary2.bonus.toLocaleString()}</div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-slate-100 bg-indigo-50/30">
                <div className="p-6 font-bold text-slate-900 text-lg flex items-center">Total Compensation</div>
                <div className="p-6 text-center font-extrabold text-2xl text-indigo-600">${comparison.salary1.total.toLocaleString()}</div>
                <div className="p-6 text-center font-extrabold text-2xl text-indigo-600">${comparison.salary2.total.toLocaleString()}</div>
              </div>

            </div>

            {comparison.differences.levelDifference !== null && (
               <div className="p-6 bg-slate-50 border-t border-slate-200 text-center">
                 <p className="text-slate-600">
                   Standardized Level Difference: <span className="font-bold text-slate-900">{comparison.differences.levelDifference} levels</span>
                 </p>
                 <p className="text-sm text-slate-500 mt-1">(Lower is a more direct lateral comparison)</p>
               </div>
            )}
            
          </div>
        )}
      </div>
    </div>
  );
}
