import { useState } from "react";
import {
  Leaf, User, Settings, LogOut, Sun, Moon,
  Camera, Edit3, Lock, CheckCircle, Star,
  Zap, Crown, ChevronRight, LayoutDashboard,
  AlertCircle, Shield, Sparkles,
} from "lucide-react";

/* ── Sidebar nav item ── */
function NavItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        active
          ? "bg-white/15 text-white shadow-sm border border-white/10"
          : "text-slate-400 hover:bg-white/8 hover:text-slate-200"
      }`}
    >
      <Icon size={17} className={active ? "text-teal-300" : ""} />
      {label}
      {active && <div className="ml-auto w-1.5 h-5 rounded-full bg-teal-400" />}
    </button>
  );
}

/* ── Profile detail chip ── */
function DetailChip({ label, value, dark }) {
  return (
    <div className={`rounded-2xl p-4 border transition-colors ${
      dark ? "bg-slate-800/60 border-slate-700/50" : "bg-slate-50 border-slate-100"
    }`}>
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
        {label}
      </p>
      <p className={`text-sm font-bold ${value ? (dark ? "text-white" : "text-slate-900") : dark ? "text-slate-600" : "text-slate-300"}`}>
        {value || "—"}
      </p>
    </div>
  );
}

/* ── Plan card ── */
function PlanCard({ name, price, period, features, popular, highlight, icon: Icon, dark }) {
  return (
    <div className={`relative rounded-2xl p-6 border-2 transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
      popular
        ? "border-teal-500 shadow-xl shadow-teal-500/15"
        : dark
          ? "border-slate-700 hover:border-teal-700"
          : "border-slate-200 hover:border-teal-300"
    } ${dark ? "bg-slate-800/70" : "bg-white"}`}>

      {/* Most popular badge */}
      {popular && (
        <div
          className="absolute -top-3.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-bold text-white shadow-lg"
          style={{ background: "linear-gradient(135deg,#0f766e,#14b8a6)" }}
        >
          <Star size={10} fill="white" /> Most Popular
        </div>
      )}

      {/* Plan header */}
      <div className="flex items-center gap-3 mb-5">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
          popular ? "bg-teal-500 shadow-lg shadow-teal-500/30" : dark ? "bg-slate-700" : "bg-slate-100"
        }`}>
          <Icon size={20} className={popular ? "text-white" : dark ? "text-slate-300" : "text-slate-600"} />
        </div>
        <div>
          <p className={`text-[11px] font-bold uppercase tracking-widest ${dark ? "text-slate-500" : "text-slate-400"}`}>{name}</p>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className={`text-2xl font-black ${dark ? "text-white" : "text-slate-900"}`}>₹{price}</span>
            <span className={`text-xs font-medium ${dark ? "text-slate-500" : "text-slate-400"}`}>/{period}</span>
          </div>
        </div>
      </div>

      {/* Feature list */}
      <ul className="space-y-2.5 mb-6">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2.5">
            <CheckCircle size={14} className="text-teal-500 shrink-0 mt-0.5" />
            <span className={`text-sm leading-snug ${dark ? "text-slate-300" : "text-slate-600"}`}>{f}</span>
          </li>
        ))}
      </ul>

      {/* CTA button */}
      <button
        className={`w-full py-3 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5 ${
          popular
            ? "text-white shadow-lg shadow-teal-500/25 hover:opacity-90"
            : dark
              ? "border border-slate-600 text-slate-300 hover:border-teal-500 hover:text-teal-400 hover:bg-teal-500/5"
              : "border border-slate-200 text-slate-700 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50"
        }`}
        style={popular ? { background: "linear-gradient(135deg,#0f766e,#14b8a6)" } : {}}
      >
        {popular ? "Upgrade to Pro →" : "Get Started →"}
      </button>
    </div>
  );
}

/* ── Plan data based on user category ── */
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
      name: "Pro", price: isStudent ? 199 : 399, period: "month", icon: Crown, popular: true,
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

      {/* ── Premium dark sidebar ── */}
      <aside
        className="w-64 shrink-0 flex flex-col fixed top-0 left-0 h-screen z-20"
        style={{
          background: "linear-gradient(180deg,#0a1628 0%,#0d1f2d 50%,#091520 100%)",
          borderRight: "1px solid rgba(20,184,166,0.12)",
        }}
      >
        {/* Sidebar logo */}
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg" style={{ background: "linear-gradient(135deg,#0f766e,#14b8a6)" }}>
              <Leaf size={15} className="text-white" />
            </div>
            <span className="text-base font-black text-white tracking-tight">NutriAI</span>
            <span className="ml-auto px-1.5 py-0.5 rounded-md text-[9px] font-bold text-teal-300 border border-teal-500/30 bg-teal-500/10">
              BETA
            </span>
          </div>
        </div>

        {/* User mini card */}
        <div className="px-4 py-4 mx-3 mt-3 rounded-xl border border-white/5 bg-white/4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0 bg-teal-500/20 flex items-center justify-center ring-2 ring-teal-500/20">
              {photo
                ? <img src={photo} alt="avatar" className="w-full h-full object-cover" />
                : <User size={17} className="text-teal-300" />
              }
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-white truncate">{name || "Your Name"}</p>
              <p className="text-[11px] text-slate-500 truncate">{category || "NutriAI User"}</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-5 space-y-1">
          <p className="px-4 mb-2 text-[10px] font-bold uppercase tracking-widest text-slate-600">Menu</p>
          <NavItem icon={User}            label="Profile"  active={activeNav === "profile"}  onClick={() => setActiveNav("profile")} />
          <NavItem icon={LayoutDashboard} label="Plans"    active={activeNav === "plans"}    onClick={() => setActiveNav("plans")} />
          <NavItem icon={Settings}        label="Settings" active={activeNav === "settings"} onClick={() => setActiveNav("settings")} />
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/5">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-red-400/80 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
          >
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main className="ml-64 flex-1 min-h-screen">

        {/* ── Premium top navbar ── */}
        <div className={`sticky top-0 z-10 flex items-center justify-between px-8 py-4 border-b backdrop-blur-md transition-colors duration-300 ${
          dark
            ? "bg-slate-950/90 border-slate-800/80"
            : "bg-white/90 border-slate-100"
        }`}>
          <div>
            <p className={`text-[10px] font-bold uppercase tracking-widest ${dark ? "text-slate-600" : "text-slate-400"}`}>
              Dashboard
            </p>
            <h2 className={`text-base font-bold mt-0.5 ${dark ? "text-white" : "text-slate-900"}`}>
              {name ? `Welcome back, ${name.split(" ")[0]} 👋` : "Your Profile"}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${
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
            <div className={`flex items-center gap-4 p-5 rounded-2xl border-2 border-dashed ${
              dark ? "border-teal-700/50 bg-teal-900/10" : "border-teal-200 bg-teal-50/60"
            }`}>
              <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
                <AlertCircle size={20} className="text-teal-500" />
              </div>
              <div className="flex-1">
                <p className={`text-sm font-bold ${dark ? "text-teal-300" : "text-teal-800"}`}>Complete your profile</p>
                <p className={`text-xs mt-0.5 ${dark ? "text-teal-400/60" : "text-teal-600/70"}`}>
                  Add your details to unlock personalised meal plans and AI insights.
                </p>
              </div>
              <button
                onClick={onCompleteProfile}
                className="shrink-0 px-4 py-2 rounded-xl text-sm font-bold text-white hover:-translate-y-0.5 transition-all duration-200 shadow-lg shadow-teal-500/20"
                style={{ background: "linear-gradient(135deg,#0f766e,#14b8a6)" }}
              >
                Complete Now →
              </button>
            </div>
          )}

          {/* ── Profile header card ── */}
          <div className={`rounded-3xl border overflow-hidden shadow-sm transition-colors duration-300 ${
            dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
          }`}>
            {/* Accent bar */}
            <div className="h-1.5" style={{ background: "linear-gradient(90deg,#0f766e,#14b8a6,#0f766e)" }} />
            <div className="p-8 flex items-end gap-6">
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="w-28 h-28 rounded-2xl overflow-hidden" style={{ boxShadow: "0 12px 40px rgba(20,184,166,0.2)" }}>
                  {photo
                    ? <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center" style={{ background: "linear-gradient(135deg,#0f766e,#14b8a6)" }}>
                        <User size={44} className="text-white" />
                      </div>
                  }
                </div>
                <button
                  onClick={onCompleteProfile}
                  className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center shadow-lg hover:bg-teal-400 transition-colors"
                >
                  <Camera size={15} className="text-white" />
                </button>
              </div>

              <div className="flex-1 min-w-0 pb-1">
                <h1 className={`text-3xl font-black tracking-tight truncate ${dark ? "text-white" : "text-slate-900"}`}>
                  {name || "Your Name"}
                </h1>
                <p className={`text-sm mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  {email || "your@email.com"}
                </p>
                <div className="flex items-center gap-2 mt-3 flex-wrap">
                  {category && (
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                      {category}
                    </span>
                  )}
                  {onboardingDone && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                      <CheckCircle size={11} /> Profile Complete
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Personal Information ── */}
          <div className={`rounded-3xl p-8 border shadow-sm transition-colors duration-300 ${
            dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
          }`}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className={`text-lg font-black ${dark ? "text-white" : "text-slate-900"}`}>Personal Information</h2>
                <p className={`text-xs mt-0.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>Your health profile details</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onCompleteProfile}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 hover:-translate-y-0.5 ${
                    dark ? "border-slate-700 text-slate-300 hover:border-teal-500 hover:text-teal-400" : "border-slate-200 text-slate-600 hover:border-teal-400 hover:text-teal-600"
                  }`}
                >
                  <Edit3 size={13} /> Edit
                </button>
                <button
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 hover:-translate-y-0.5 ${
                    dark ? "border-slate-700 text-slate-300 hover:border-slate-500" : "border-slate-200 text-slate-600 hover:border-slate-400"
                  }`}
                >
                  <Lock size={13} /> Password
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

            {/* Allergies */}
            {allergies && allergies.length > 0 && (
              <div className="mt-5">
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-2.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                  Allergies
                </p>
                <div className="flex flex-wrap gap-2">
                  {allergies.map(a => (
                    <span key={a} className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Health notes */}
            {healthIssues && (
              <div className="mt-5">
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${dark ? "text-slate-500" : "text-slate-400"}`}>
                  Health Notes
                </p>
                <p className={`text-sm leading-relaxed ${dark ? "text-slate-300" : "text-slate-600"}`}>{healthIssues}</p>
              </div>
            )}
          </div>

          {/* ── Plans section ── */}
          {activeNav !== "settings" && (
            <div className={`rounded-3xl p-8 border shadow-sm transition-colors duration-300 ${
              dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"
            }`}>
              {/* Section header */}
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles size={16} className="text-teal-500" />
                    <h2 className={`text-lg font-black ${dark ? "text-white" : "text-slate-900"}`}>Choose Your Plan</h2>
                  </div>
                  <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    Unlock the full power of AI-driven nutrition.
                    {category && <span className={`ml-1 font-semibold ${dark ? "text-teal-400" : "text-teal-600"}`}>{category} pricing applied.</span>}
                  </p>
                </div>
              </div>

              {/* Current plan pill */}
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 ${
                dark ? "bg-slate-800 border border-slate-700 text-slate-400" : "bg-slate-100 border border-slate-200 text-slate-500"
              }`}>
                <Shield size={11} className="text-teal-500" />
                Currently on <span className="font-bold text-teal-500 ml-0.5">Free Plan</span> — 5 scans/day
              </div>

              {/* Plan cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {plans.map(plan => <PlanCard key={plan.name} {...plan} dark={dark} />)}
              </div>

              {/* Footer note */}
              <div className={`mt-5 flex items-center gap-3 p-4 rounded-2xl ${
                dark ? "bg-slate-800/50 border border-slate-700/40" : "bg-slate-50 border border-slate-100"
              }`}>
                <CheckCircle size={14} className="text-teal-500 shrink-0" />
                <p className={`text-sm ${dark ? "text-slate-400" : "text-slate-500"}`}>
                  All plans include a <span className="font-semibold">7-day free trial</span>. Cancel anytime, no questions asked.
                </p>
                <button className="ml-auto flex items-center gap-1 text-sm font-semibold text-teal-500 hover:text-teal-400 transition-colors shrink-0 whitespace-nowrap">
                  Compare plans <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
