import React, { useState } from 'react';
import { Sun, Moon, Crown, Download, Loader2, CheckCircle2 } from "lucide-react";

export default function Navbar({ dark, setDark, name, onUpgrade, onOpenReport }) {
  const [reportState, setReportState] = useState('idle');

  const handleGenerateReport = () => {
    setReportState('loading');
    setTimeout(() => {
      setReportState('done');
      if (onOpenReport) onOpenReport();
      setTimeout(() => setReportState('idle'), 2000);
    }, 1500);
  };

  return (
    <div className={`sticky top-0 z-10 flex items-center justify-between px-8 py-3.5 border-b backdrop-blur-md transition-colors duration-300 ${
      dark ? "bg-slate-950/90 border-slate-800/80" : "bg-white/90 border-slate-100"
    }`}>
      <div>
        <p className={`text-[10px] font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>Overview</p>
        <h2 className={`text-sm font-semibold mt-0.5 ${dark ? "text-white" : "text-slate-900"}`}>
          {name ? `Welcome back, ${name.split(" ")[0]} 👋` : "NutriAI"}
        </h2>
      </div>

      <div className="flex items-center gap-3 relative">
        {/* Generate Report from Dashboard */}
        <button 
          className="h-9 px-4 text-white rounded-lg text-sm font-semibold flex items-center gap-1.5 hover:shadow-lg transition-all duration-200"
          style={{ backgroundColor: '#14B8A6' }}
          onClick={() => reportState === 'idle' ? setReportState(reportState === 'open' ? 'idle' : 'open') : null}
        >
          {reportState === 'loading' ? <Loader2 size={14} className="animate-spin" /> : reportState === 'done' ? <CheckCircle2 size={14} /> : <Download size={14} />}
          {reportState === 'loading' ? 'Generating...' : reportState === 'done' ? 'Ready!' : 'Report'}
        </button>
        
        {reportState === 'open' && (
          <div className="absolute top-[calc(100%+8px)] right-24 w-[200px] bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 flex flex-col gap-1 z-50">
            <button onClick={handleGenerateReport} className="w-full text-left px-3 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Weekly Report
            </button>
          </div>
        )}

        {/* Upgrade button */}
        {onUpgrade && (
          <button
            onClick={onUpgrade}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/20"
          >
            <Crown size={13} /> Upgrade
          </button>
        )}

        {/* Dark toggle */}
        <button
          onClick={() => setDark(!dark)}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-150 ${
            dark
              ? "border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700"
              : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
          }`}
        >
          {dark ? <Sun size={14} className="text-yellow-400" /> : <Moon size={14} />}
          {dark ? "Light" : "Dark"}
        </button>
      </div>
    </div>
  );
}
