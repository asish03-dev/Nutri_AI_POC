import { Leaf, Sun, Moon, Camera, Sparkles } from "lucide-react";

const FOOD_BG    = "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=1400&q=85";
const MEAL_PHOTO = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&q=85";

const T = "transition-all duration-500 ease-in-out";

/* ─── Navbar ─────────────────────────────────────────────── */
function Navbar({ dark, setDark }) {
  return (
    <nav
      className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
      style={{
        background: dark
          ? "linear-gradient(90deg,rgba(10,15,30,0.92) 0%,rgba(13,26,46,0.92) 100%)"
          : "linear-gradient(90deg,rgba(255,255,255,0.82) 0%,rgba(240,244,255,0.82) 100%)",
        backdropFilter: "blur(20px)",
        borderBottom: dark ? "1px solid rgba(99,102,241,0.18)" : "1px solid rgba(99,102,241,0.1)",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-xl shadow-lg"
          style={{ background: "linear-gradient(135deg,#6366f1 0%,#14b8a6 100%)", boxShadow: "0 4px 14px rgba(99,102,241,0.4)" }}
        >
          <Leaf size={17} className="text-white" />
        </div>
        <span
          className={`text-xl font-black tracking-tight ${T}`}
          style={dark
            ? { background: "linear-gradient(90deg,#a5b4fc,#5eead4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
            : { background: "linear-gradient(90deg,#4f46e5,#0f766e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }
          }
        >
          NutriAi
        </span>
      </div>

      {/* Right side: dark toggle */}
      <button
        onClick={() => setDark(!dark)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm shadow-sm ${T}`}
        style={{
          border: dark ? "1px solid rgba(99,102,241,0.3)" : "1px solid rgba(99,102,241,0.2)",
          background: dark ? "rgba(99,102,241,0.15)" : "rgba(99,102,241,0.06)",
          color: dark ? "#a5b4fc" : "#4f46e5",
        }}
      >
        {dark
          ? <Sun size={15} className="text-yellow-400" />
          : <Moon size={15} style={{ color: "#6366f1" }} />
        }
        <span>{dark ? "Light" : "Dark"}</span>
      </button>
    </nav>
  );
}

/* ─── iPhone Mockup ──────────────────────────────────────── */
function IPhoneMockup() {
  return (
    <div className="relative">
      {/* Ambient glow */}
      <div className="absolute inset-0 scale-110 rounded-[3rem] blur-3xl bg-emerald-400/25 pointer-events-none" />

      {/* Frame */}
      <div
        className="relative overflow-hidden rounded-[3rem] bg-black"
        style={{
          width: 280,
          height: 580,
          border: "8px solid #1c1c1e",
          boxShadow:
            "0 60px 120px rgba(0,0,0,0.45), 0 20px 40px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
        }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-30" />

        {/* Screen */}
        <div className="absolute inset-0 bg-[#0a0a0a] flex flex-col">
          {/* Status bar */}
          <div className="flex justify-between items-center px-6 pt-12 pb-1">
            <span className="text-white text-xs font-semibold">9:41</span>
            <div className="flex items-center gap-1">
              <div className="w-4 h-2 border border-white/50 rounded-sm">
                <div className="w-3/4 h-full bg-white/50 rounded-sm" />
              </div>
            </div>
          </div>

          {/* App header */}
          <div className="px-5 py-2 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-emerald-500 flex items-center justify-center">
                <span className="text-white text-[8px] font-black">N</span>
              </div>
              <span className="text-white text-sm font-bold">NutriAi</span>
            </div>
            <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-xs">👤</div>
          </div>

          {/* Meal photo + scan overlay */}
          <div className="mx-4 rounded-2xl overflow-hidden relative flex-1 max-h-[210px]">
            <img
              src={MEAL_PHOTO}
              alt="Meal"
              className="w-full h-full object-cover"
              style={{ filter: "brightness(0.85) saturate(1.2)" }}
            />
            {/* Corner brackets */}
            {[
              "top-3 left-3 border-l-2 border-t-2 rounded-tl-lg",
              "top-3 right-3 border-r-2 border-t-2 rounded-tr-lg",
              "bottom-3 left-3 border-l-2 border-b-2 rounded-bl-lg",
              "bottom-3 right-3 border-r-2 border-b-2 rounded-br-lg",
            ].map((cls, i) => (
              <div key={i} className={`absolute w-5 h-5 border-white/75 ${cls}`} />
            ))}
            {/* Scan line */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4/5 h-px bg-emerald-400/90 shadow-[0_0_12px_4px_rgba(52,211,153,0.55)]" />
            </div>
            {/* Label */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/55 backdrop-blur-sm border border-white/20">
              <Camera size={11} className="text-white" />
              <span className="text-white text-[10px] font-medium whitespace-nowrap">
                Take a photo of your meal
              </span>
            </div>
          </div>

          {/* Nutrition cards */}
          <div className="px-4 pt-3 grid grid-cols-3 gap-2">
            {[
              { label: "Calories", value: "485", unit: "kcal", bg: "bg-orange-500/20", text: "text-orange-400" },
              { label: "Protein",  value: "32g",  unit: "",     bg: "bg-blue-500/20",   text: "text-blue-400"    },
              { label: "Carbs",    value: "48g",  unit: "",     bg: "bg-emerald-500/20",text: "text-emerald-400" },
            ].map((item) => (
              <div key={item.label} className={`rounded-xl p-2 ${item.bg}`}>
                <p className={`text-[10px] font-medium ${item.text} opacity-80`}>{item.label}</p>
                <p className={`text-sm font-bold ${item.text}`}>
                  {item.value}
                  <span className="text-[9px] font-normal ml-0.5">{item.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* AI insight */}
          <div className="mx-4 mt-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30">
            <div className="flex items-start gap-2">
              <Sparkles size={12} className="text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-emerald-400 text-[10px] font-semibold mb-0.5">AI Insight</p>
                <p className="text-white/65 text-[9px] leading-relaxed">
                  Great balanced meal! High in protein and fiber. Consider adding healthy fats.
                </p>
              </div>
            </div>
          </div>

          {/* Bottom nav */}
          <div className="mt-auto mx-4 mb-4 flex justify-around py-2 rounded-2xl bg-white/5 border border-white/10">
            {["🏠", "📷", "📊", "👤"].map((icon, i) => (
              <button
                key={i}
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm ${i === 1 ? "bg-emerald-500" : ""}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Glass sheen */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 50%)" }}
        />
      </div>

      {/* Floating avocado badge */}
      <div className="absolute -left-14 top-1/3 flex items-center gap-2 px-3 py-2 rounded-2xl bg-white shadow-xl border border-gray-100">
        <span className="text-lg">🥑</span>
        <div>
          <p className="text-[10px] text-gray-400 font-medium">Healthy Fat</p>
          <p className="text-xs font-bold text-gray-800">Avocado</p>
        </div>
      </div>

      {/* Floating streak badge */}
      <div className="absolute -right-12 bottom-1/3 flex items-center gap-2 px-3 py-2 rounded-2xl bg-white shadow-xl border border-gray-100">
        <span className="text-lg">🔥</span>
        <div>
          <p className="text-[10px] text-gray-400 font-medium">Streak</p>
          <p className="text-xs font-bold text-gray-800">14 days</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Landing Page ───────────────────────────────────────── */
export default function LandingPage({ dark, setDark, onLoginClick, onSignupClick }) {
  return (
    <section className={`relative min-h-screen overflow-hidden ${T} ${dark ? "bg-gray-950" : "bg-[#f8f6f0]"}`}>

      {/* Background food photo */}
      <div className="absolute bottom-0 left-0 right-0 h-[52%] overflow-hidden">
        <img
          src={FOOD_BG}
          alt="Healthy food spread"
          className={`w-full h-full object-cover object-top ${T}`}
          style={{ filter: `brightness(${dark ? 0.35 : 0.92}) saturate(1.1)` }}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${T} ${dark ? "from-gray-950 via-gray-950/50" : "from-[#f8f6f0] via-[#f8f6f0]/30"} to-transparent`} />
        <div className={`absolute inset-0 bg-gradient-to-r ${T} ${dark ? "from-gray-950/70 via-transparent to-gray-950/70" : "from-[#f8f6f0]/60 via-transparent to-[#f8f6f0]/60"}`} />
      </div>

      {/* Navbar */}
      <Navbar dark={dark} setDark={setDark} />

      {/* Main grid */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-16 flex flex-col lg:flex-row items-center gap-16 min-h-screen">

        {/* LEFT */}
        <div className="flex-1 flex flex-col items-start max-w-xl">

          {/* Badge */}
          <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 border ${T} ${dark ? "bg-emerald-900/40 border-emerald-700/50" : "bg-emerald-50 border-emerald-200"}`}>
            <Sparkles size={14} className="text-emerald-500" />
            <span className="text-xs font-semibold text-emerald-600 tracking-wide uppercase">
              AI-Powered Nutrition
            </span>
          </div>

          {/* Headline */}
          <h1 className={`text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight mb-5 ${T} ${dark ? "text-white" : "text-gray-900"}`}>
            Master Your
            <br />
            <span className="text-emerald-500">Nutrition</span>
            <br />
            with AI
          </h1>

          {/* Subheadline */}
          <p className={`text-base lg:text-lg leading-relaxed mb-8 max-w-md ${T} ${dark ? "text-gray-400" : "text-gray-500"}`}>
            Instant meal scanning&nbsp;•&nbsp;Accurate nutrition insights&nbsp;•&nbsp;
            Personalized guidance to help build lasting healthy habits
          </p>

          {/* CTA Buttons */}
          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={onLoginClick}
              className={`px-7 py-3.5 rounded-full font-semibold text-sm ${T} shadow-lg hover:-translate-y-0.5
                ${dark ? "bg-white text-gray-900 hover:bg-gray-100 shadow-white/10" : "bg-gray-900 text-white hover:bg-gray-800 shadow-gray-900/20"}`}
            >
              Log In
            </button>
            <button
              onClick={onSignupClick}
              className={`px-7 py-3.5 rounded-full bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-400 ${T} shadow-lg shadow-emerald-500/30 hover:-translate-y-0.5`}
            >
              Sign Up Free
            </button>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex-1 flex justify-center lg:justify-end items-center">
          <IPhoneMockup />
        </div>
      </div>

      {/* Feature pills */}
      <div className="relative z-10 flex justify-center gap-3 flex-wrap pb-10 px-6">
        {[
          { icon: "⚡", text: "Instant Scan" },
          { icon: "🎯", text: "Personalized Goals" },
          { icon: "📈", text: "Progress Tracking" },
          { icon: "🧠", text: "AI Recommendations" },
        ].map((f) => (
          <div
            key={f.text}
            className={`flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-sm border shadow-sm ${T}
              ${dark ? "bg-gray-800/80 border-gray-700 text-gray-300" : "bg-white/80 border-white/60 text-gray-700"}`}
          >
            <span className="text-sm">{f.icon}</span>
            <span className="text-xs font-semibold">{f.text}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
