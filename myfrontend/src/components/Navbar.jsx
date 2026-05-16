import { Sun, Moon, Crown } from "lucide-react";

<<<<<<< HEAD
export default function Navbar({ dark, setDark, name, onUpgrade, onOpenReport }) {

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

=======
export default function Navbar({ dark, setDark, onUpgrade }) {

  return (
    <div className={`sticky top-0 z-10 flex items-center justify-end px-8 py-3.5 border-b backdrop-blur-md transition-colors duration-300 ${
      dark ? "bg-slate-950/90 border-slate-800/80" : "bg-white/90 border-slate-100"
    }`}>
>>>>>>> 7ba8efab5d7ed634e2885490524dd019b0a2596a
      <div className="flex items-center gap-3 relative">


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
