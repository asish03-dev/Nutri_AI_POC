import { useState } from "react";
import {
  Leaf, User, Settings, LogOut, Sun, Moon,
  Camera, Edit3, Lock, CheckCircle, Star,
  Zap, Crown, ChevronRight, LayoutDashboard,
  AlertCircle, Shield, Sparkles,
} from "lucide-react";

function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
        active
          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-100"
          : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
      }`}
    >
      <Icon size={16} className={active ? "text-emerald-500" : ""} />
      {label}
      {active && <div className="ml-auto w-1.5 h-4 rounded-full bg-emerald-500" />}
    </button>
  );
}

function DetailChip({ label, value, dark }) {
  return (
    <div className={`rounded-xl p-4 border ${dark ? "bg-slate-800/60 border-slate-700/50" : "bg-slate-50 border-slate-100"}`}>
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
        {label}
      </p>
      <p className={`text-sm font-semibold ${value ? (dark ? "text-white" : "text-slate-900") : dark ? "text-slate-600" : "text-slate-300"}`}>
        {value || "—"}
      </p>
    </div>
  );
}

function PlanCard({ name, price, period, features, popular, icon: Icon, dark }) {
  return (
    <div className={`relative rounded-2xl p-6 border-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
      popular
        ? "border-emerald-500 shadow-lg shadow-emerald-500/10"
        : dark
          ? "border-slate-700 hover:border-slate-600"
          : "border-slate-200 hover:border-slate-300"
    } ${dark ? "bg-slate-800/70" : "bg-white"}`}>

      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-emerald-500 shadow-md">
          <Star size={9} fill="white" /> Most Popular
        </div>
      )}

      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          popular ? "bg-emerald-500" : dark ? "bg-slate-700" : "bg-slate-100"
        }`}>
          <Icon size={18} className={popular ? "text-white" : dark ? "text-slate-300" : "text-slate-500"} />
        </div>
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-widest ${dark ? "text-slate-500" : "text-slate-400"}`}>{name}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-2xl font-black ${dark ? "text-white" : "text-slate-900"}`}>₹{price}</span>
            <span className={`text-xs font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>/{period}</span>
          </div>
        </div>
      </div>

      <ul className="space-y-2.5 mb-6">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2.5">
            <CheckCircle size={13} className="text-emerald-500 shrink-0 mt-0.5" />
            <span className={`text-sm leading-snug ${dark ? "text-slate-300" : "text-slate-600"}`}>{f}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
          popular
            ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/20"
            : dark
              ? "border border-slate-600 text-slate-300 hover:border-emerald-500 hover:text-emerald-400"
              : "border border-slate-200 text-slate-700 hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50"
        }`}
      >
        {popular ? "Upgrade Now →" : "Get Started →"}
      </button>
    </div>
  );
}

function getPlans(category) {
  const isStudent = category === "Student";
  return [
    {
      name: "Basic", price: isStudent ? 99 : 199, period: "month", icon: Zap, popular: false,
      features: [
        "20 meal scans per day",
        "Basic nutrition breakdown",
        "7-day meal history",
        "Email support",
      ],
    },
    {
      name: "Pro", price: isStudent ? 199 : 299, period: "month", icon: Crown, popular: true,
      features: [
        "Unlimited meal scanning",
        "AI-powered nutrition insights",
        "Custom weekly meal plans",
        "Priority 24/7 support",
        "Advanced progress analytics",
        "Allergy-aware recommendations",
      ],
    },
  ];
}

export default function Profile({ dark, setDark, profileData, onboardingDone, onCompleteProfile, onLogout }) {
  const [activeNav, setActiveNav] = useState("profile");

  const {
    name = "", email = "", photo = null,
    age = "", gender = "", height = "", weight = "",
    category = "", allergies = [], healthIssues = "",
  } = profileData || {};

  const plans = getPlans(category);

  return (
    <div className={`min-h-screen flex ${dark ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-900"} transition-colors duration-300`}>

      {/* ── Sidebar ── */}
      <aside
        className="w-60 shrink-0 flex flex-col fixed top-0 left-0 h-screen z-20"
        style={{
          background: dark ? "#0a0f1a" : "#ffffff",
          borderRight: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #f1f5f9",
        }}
      >
        {/* Logo */}
        <div className="px-5 py-4 border-b" style={{ borderColor: dark ? "rgba(255,255,255,0.06)" : "#f1f5f9" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Leaf size={13} className="text-white" />
            </div>
            <span className={`text-sm font-bold tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>NutriAI</span>
            <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-100">
              BETA
            </span>
          </div>
        </div>

        {/* User card */}
        <div className="px-4 py-3 mx-3 mt-3 rounded-xl" style={{ background: dark ? "rgba(255,255,255,0.04)" : "#f8fafc", border: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #f1f5f9" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-emerald-100 flex items-center justify-center">
              {photo
                ? <img src={photo} alt="avatar" className="w-full h-full object-cover" />
                : <User size={15} className="text-emerald-600" />
              }
            </div>
            <div className="min-w-0">
              <p className={`text-sm font-semibold truncate ${dark ? "text-white" : "text-slate-900"}`}>{name || "Your Name"}</p>
              <p className={`text-[11px] truncate ${dark ? "text-slate-500" : "text-slate-400"}`}>{category || "NutriAI User"}</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          <p className={`px-3 mb-2 text-[10px] font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>Menu</p>
          <NavItem icon={User}            label="Profile"  active={activeNav === "profile"}  onClick={() => setActiveNav("profile")} />
          <NavItem icon={LayoutDashboard} label="Plans"    active={activeNav === "plans"}    onClick={() => setActiveNav("plans")} />
          <NavItem icon={Settings}        label="Settings" active={activeNav === "settings"} onClick={() => setActiveNav("settings")} />
        </nav>

        {/* Logout */}
        <div className="px-3 py-4" style={{ borderTop: dark ? "1px solid rgba(255,255,255,0.06)" : "1px solid #f1f5f9" }}>
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150"
          >
            <LogOut size={15} /> Log Out
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-60 flex-1 min-h-screen">

        {/* Top navbar */}
        <div className={`sticky top-0 z-10 flex items-center justify-between px-8 py-3.5 border-b backdrop-blur-md transition-colors duration-300 ${
          dark ? "bg-slate-950/90 border-slate-800/80" : "bg-white/90 border-slate-100"
        }`}>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>Dashboard</p>
            <h2 className={`text-sm font-semibold mt-0.5 ${dark ? "text-white" : "text-slate-900"}`}>
              {name ? `Welcome back, ${name.split(" ")[0]} 👋` : "Your Profile"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Upgrade button */}
            <button
              onClick={() => setActiveNav("plans")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/20"
            >
              <Crown size={13} /> Upgrade
            </button>

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

        <div className="px-8 py-8 max-w-4xl space-y-6">

          {/* Incomplete profile banner */}
          {!onboardingDone && (
            <div className={`flex items-center gap-4 p-5 rounded-2xl border ${
              dark ? "border-emerald-800/40 bg-emerald-900/10" : "border-emerald-100 bg-emerald-50/60"
            }`}>
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                <AlertCircle size={18} className="text-emerald-600" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${dark ? "text-emerald-300" : "text-emerald-800"}`}>Complete your profile</p>
                <p className={`text-xs mt-0.5 ${dark ? "text-emerald-400/60" : "text-emerald-600/70"}`}>
                  Add your details to unlock personalised meal plans and AI insights.
                </p>
              </div>
              <button
                onClick={onCompleteProfile}
                className="shrink-0 px-4 py-2 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition-colors"
              >
                Complete Now →
              </button>
            </div>
          )}

          {/* Profile header */}
          <div className={`rounded-2xl border overflow-hidden shadow-sm ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
            <div className="h-1 bg-emerald-500" />
            <div className="p-8 flex items-end gap-6">
              <div className="relative shrink-0">
                <div className="w-24 h-24 rounded-2xl overflow-hidden shadow-md">
                  {photo
                    ? <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center bg-emerald-500">
                        <User size={36} className="text-white" />
                      </div>
                  }
                </div>
                <button
                  onClick={onCompleteProfile}
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-md hover:bg-emerald-600 transition-colors"
                >
                  <Camera size={13} className="text-white" />
                </button>
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <h1 className={`text-2xl font-bold tracking-tight truncate ${dark ? "text-white" : "text-slate-900"}`}>
                  {name || "Your Name"}
                </h1>
                <p className={`text-sm mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  {email || "your@email.com"}
                </p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {category && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {category}
                    </span>
                  )}
                  {onboardingDone && (
                    <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                      <CheckCircle size={10} className="text-emerald-500" /> Profile Complete
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className={`rounded-2xl p-8 border shadow-sm ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-base font-bold ${dark ? "text-white" : "text-slate-900"}`}>Personal Information</h2>
                <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>Your health profile details</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onCompleteProfile}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
                    dark ? "border-slate-700 text-slate-300 hover:border-slate-600" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Edit3 size={12} /> Edit
                </button>
                <button
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all duration-150 ${
                    dark ? "border-slate-700 text-slate-300 hover:border-slate-600" : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <Lock size={12} /> Password
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <DetailChip label="Full Name" value={name}                          dark={dark} />
              <DetailChip label="Age"       value={age ? `${age} yrs` : ""}      dark={dark} />
              <DetailChip label="Gender"    value={gender}                        dark={dark} />
              <DetailChip label="Height"    value={height ? `${height} cm` : ""} dark={dark} />
              <DetailChip label="Weight"    value={weight ? `${weight} kg` : ""} dark={dark} />
            </div>

            {allergies && allergies.length > 0 && (
              <div className="mt-5">
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-2.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>Allergies</p>
                <div className="flex flex-wrap gap-2">
                  {allergies.map(a => (
                    <span key={a} className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {healthIssues && (
              <div className="mt-5">
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>Health Notes</p>
                <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{healthIssues}</p>
              </div>
            )}
          </div>

          {/* Plans */}
          {activeNav !== "settings" && (
            <div className={`rounded-2xl p-8 border shadow-sm ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={15} className="text-emerald-500" />
                    <h2 className={`text-base font-bold ${dark ? "text-white" : "text-slate-900"}`}>Choose Your Plan</h2>
                  </div>
                  <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    Unlock the full power of AI-driven nutrition.
                    {category && <span className={`ml-1 font-semibold ${dark ? "text-emerald-400" : "text-emerald-600"}`}>{category} pricing applied.</span>}
                  </p>
                </div>
              </div>

              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6 ${
                dark ? "bg-slate-800 border border-slate-700 text-slate-400" : "bg-slate-100 border border-slate-200 text-slate-500"
              }`}>
                <Shield size={10} className="text-emerald-500" />
                Currently on <span className="font-semibold text-emerald-500 ml-0.5">Free Plan</span> — 5 scans/day
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {plans.map(plan => <PlanCard key={plan.name} {...plan} dark={dark} />)}
              </div>

              <div className={`mt-5 flex items-center gap-3 p-4 rounded-xl ${
                dark ? "bg-slate-800/50 border border-slate-700/40" : "bg-slate-50 border border-slate-100"
              }`}>
                <CheckCircle size={13} className="text-emerald-500 shrink-0" />
                <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  All plans include a <span className="font-semibold">7-day free trial</span>. Cancel anytime.
                </p>
                <button className="ml-auto flex items-center gap-1 text-sm font-semibold text-emerald-500 hover:text-emerald-600 transition-colors shrink-0 whitespace-nowrap">
                  Compare plans <ChevronRight size={13} />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
