import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-50 font-sans text-slate-900">
      <main className="flex-1 flex flex-col items-center justify-center p-8 md:p-24 bg-white shadow-sm m-4 md:m-8 rounded-2xl border border-slate-100">
        
        <div className="text-center max-w-3xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-900">
            Levels over Titles.
            <br />
            <span className="text-indigo-600">Real Compensation Data.</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
            A compensation intelligence system designed to give you structured, queryable, and comparable salary insights. Because an SDE2 at Amazon isn't the same as an SDE2 at Google.
          </p>

          <div className="pt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/salaries"
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all text-center"
            >
              Explore Salaries
            </Link>
            <Link 
              href="/companies"
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold shadow-sm transition-all text-center"
            >
              Browse Companies
            </Link>
            <Link 
              href="/compare"
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl font-semibold shadow-sm transition-all text-center"
            >
              Compare Offers
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl">
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-lg mb-2">Standardized Levels</h3>
            <p className="text-slate-600">We map internal company titles to a standardized 1-10 scale so you can compare apples to apples.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-lg mb-2">Total Comp Breakdown</h3>
            <p className="text-slate-600">See the exact split between base salary, stock grants, and performance bonuses.</p>
          </div>
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <h3 className="font-bold text-lg mb-2">Data Integrity</h3>
            <p className="text-slate-600">Strict validation and confidence scoring ensures you're looking at realistic, verified numbers.</p>
          </div>
        </div>

      </main>
    </div>
  );
}
