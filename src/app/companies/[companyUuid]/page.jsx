'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CompanyPage({ params }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Note: React wrapping params check in NextJS 15+ 
    // Just safely accessing it here
    const fetchCompanyData = async () => {
      try {
        const { companyUuid } = params;
        const res = await fetch(`/api/companies/${companyUuid}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (params) fetchCompanyData();
  }, [params]);

  if (loading) {
    return <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center text-slate-500">Loading company profile...</div>;
  }

  if (!data) {
    return <div className="min-h-screen bg-slate-50 p-8 flex items-center justify-center text-red-500">Company not found or failed to load.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-900">
      <div className="max-w-5xl mx-auto">
        <Link href="/salaries" className="text-indigo-600 font-semibold mb-6 inline-block">&larr; Back to Salaries</Link>
        
        {/* Header section */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">{data.company}</h1>
            <p className="text-slate-500 text-lg">Verified Compensation Insights</p>
          </div>
          <div className="mt-6 md:mt-0 bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
            <p className="text-sm text-slate-500 uppercase font-semibold tracking-wider mb-1">Median Total Comp</p>
            <p className="text-3xl font-extrabold text-indigo-600">${data.medianComp.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Level Distribution */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-1 h-fit">
            <h3 className="font-bold text-lg mb-4 border-b border-slate-100 pb-2">Level Distribution</h3>
            <ul className="space-y-3">
              {Object.entries(data.distribution).sort((a,b)=>b[1]-a[1]).map(([level, count]) => (
                <li key={level} className="flex justify-between items-center">
                  <span className="font-medium bg-slate-100 text-slate-700 py-1 px-2 rounded text-sm">{level}</span>
                  <span className="text-slate-500 text-sm font-semibold">{count} reports</span>
                </li>
              ))}
              {Object.keys(data.distribution).length === 0 && (
                <p className="text-slate-500 text-sm">No level data available.</p>
              )}
            </ul>
          </div>

          {/* Salaries List */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm md:col-span-2 overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <h3 className="font-bold text-lg">Recent Salary Reports</h3>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="p-4 font-semibold">Role & Level</th>
                  <th className="p-4 font-semibold">Base + Bonus + Stock</th>
                  <th className="p-4 font-semibold text-right">Total Comp</th>
                </tr>
              </thead>
              <tbody>
                {data.salaries.map((s) => (
                  <tr key={s.salaryUuid} className="border-b border-slate-50 hover:bg-slate-50">
                    <td className="p-4">
                      <p className="font-bold text-slate-800">{s.role}</p>
                      <p className="text-sm text-slate-500 mt-1">
                        <span className="bg-slate-200 text-slate-800 py-0.5 px-1.5 rounded text-xs mr-2">{s.companyLevel}</span>
                        {s.yoeTotal} yrs exp • {s.location}
                      </p>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-1 text-xs font-mono text-slate-600">
                        <span>Base: ${s.baseSalary.toLocaleString()}</span>
                        <span>Bonus: ${s.bonus.toLocaleString()}</span>
                        <span>Stock: ${s.stockGrant.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="p-4 text-right font-extrabold text-lg text-slate-900">
                      ${s.totalComp.toLocaleString()}
                    </td>
                  </tr>
                ))}
                {data.salaries.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-slate-500">No salaries found for this company.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
