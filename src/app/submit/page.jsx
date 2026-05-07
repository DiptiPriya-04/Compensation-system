"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SubmissionForm() {
  const router = useRouter();
  const [companies, setCompanies] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    companyUuid: '',
    companyLevel: '',
    baseSalary: '',
    stockGrant: '',
    bonus: '',
    yoeTotal: ''
  });

  useEffect(() => {
    fetch('/api/companies')
      .then(res => res.json())
      .then(data => {
        if (data.companies) setCompanies(data.companies);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Basic client-side validation
    if (!formData.companyUuid || !formData.companyLevel || !formData.baseSalary) {
      setError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/salaries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          companyUuid: formData.companyUuid,
          companyLevel: formData.companyLevel,
          baseSalary: Number(formData.baseSalary),
          stockGrant: Number(formData.stockGrant) || 0,
          bonus: Number(formData.bonus) || 0,
          yoeTotal: Number(formData.yoeTotal) || 0,
        }),
      });

      const result = await response.json();
      if (result.success) {
        router.push('/salaries');
      } else {
        setError(result.error || "Failed to submit data.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Submit Salary Data
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="companyUuid" className="block text-sm font-medium text-gray-700">Company *</label>
              <div className="mt-1">
                <select
                  id="companyUuid"
                  name="companyUuid"
                  value={formData.companyUuid}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  required
                >
                  <option value="">Select a company</option>
                  {companies.map(c => (
                    <option key={c.companyUuid} value={c.companyUuid}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="companyLevel" className="block text-sm font-medium text-gray-700">Level (e.g., L4, SDE II) *</label>
              <div className="mt-1">
                <input
                  id="companyLevel"
                  name="companyLevel"
                  type="text"
                  required
                  value={formData.companyLevel}
                  onChange={handleChange}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="yoeTotal" className="block text-sm font-medium text-gray-700">Years of Exp</label>
                <div className="mt-1">
                  <input
                    id="yoeTotal"
                    name="yoeTotal"
                    type="number"
                    step="0.1"
                    value={formData.yoeTotal}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="baseSalary" className="block text-sm font-medium text-gray-700">Base Salary *</label>
                <div className="mt-1">
                  <input
                    id="baseSalary"
                    name="baseSalary"
                    type="number"
                    required
                    value={formData.baseSalary}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="stockGrant" className="block text-sm font-medium text-gray-700">Stock (Annual)</label>
                <div className="mt-1">
                  <input
                    id="stockGrant"
                    name="stockGrant"
                    type="number"
                    value={formData.stockGrant}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="bonus" className="block text-sm font-medium text-gray-700">Bonus</label>
                <div className="mt-1">
                  <input
                    id="bonus"
                    name="bonus"
                    type="number"
                    value={formData.bonus}
                    onChange={handleChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-400"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Data'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
