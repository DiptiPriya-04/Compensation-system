'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SalariesPage() {
  const [salaries, setSalaries] = null;
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ companyUuid: '', level: '', role: '', location: '' });

  // Note: we can't easily filter by company name text without modifying the API, 
  // so we'll just allow text input for role and location for this demo.
  useEffect(() => {
    fetchSalaries();
  }, [filters]);

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`/api/salaries?${query}`);
      const data = await res.json();
      setSalaries(data.salaryEntries || []);
    } catch (err) {
      console.error(err);
      setSalaries([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <Link href="/" className="text-indigo-600 font-semibold mb-4 inline-block">&larr; Back Home</Link>
            <h1 className="text-4xl font-bold">Salary Data</h1>
            <p className="text-slate-500 mt-2">Explore standardized compensation data.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mb-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Company UUID (Optional)</label>
            <input name="companyUuid" value={filters.companyUuid} onChange={handleFilterChange} className="w-full border border-slate-200 rounded-lg p-2" placeholder="e.g. 123-abc..." />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Role</label>
            <input name="role" value={filters.role} onChange={handleFilterChange} className="w-full border border-slate-200 rounded-lg p-2" placeholder="e.g. Software Engineer" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Level</label>
            <input name="level" value={filters.level} onChange={handleFilterChange} className="w-full border border-slate-200 rounded-lg p-2" placeholder="e.g. L4, SDE II" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-2">Location</label>
            <input name="location" value={filters.location} onChange={handleFilterChange} className="w-full border border-slate-200 rounded-lg p-2" placeholder="e.g. Bangalore" />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-sm uppercase tracking-wider">
                <th className="p-4 font-semibold">Company</th>
                <th className="p-4 font-semibold">Role</th>
                <th className="p-4 font-semibold">Level</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold">Experience</th>
                <th className="p-4 font-semibold text-right">Total Comp</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">Loading data...</td>
                </tr>
              ) : !salaries || salaries.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">No salary data found. Try adjusting your filters.</td>
                </tr>
              ) : (
                salaries.map((s) => (
                  <tr key={s.salaryUuid} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-medium text-indigo-600">
                      <Link href={`/companies/${s.companyUuid}`}>{s.company?.name || 'Unknown'}</Link>
                    </td>
                    <td className="p-4 text-slate-800">{s.role}</td>
                    <td className="p-4 text-slate-800 font-medium">
                      <span className="bg-slate-100 text-slate-700 py-1 px-2 rounded text-xs border border-slate-200">{s.companyLevel}</span>
                    </td>
                    <td className="p-4 text-slate-600">{s.location}</td>
                    <td className="p-4 text-slate-600">{s.yoeTotal} yrs</td>
                    <td className="p-4 font-bold text-slate-900 text-right text-lg">
                      ${s.totalComp.toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
