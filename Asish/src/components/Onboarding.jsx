import { useState, useRef } from "react";
import {
  Leaf, ArrowLeft, Camera, User, ChevronDown,
  Ruler, Weight, Activity, Briefcase,
  Flame, AlertTriangle, X as XIcon, Plus, Calculator,
} from "lucide-react";
import SuccessScreen from "./SuccessScreen";

const PREMIUM = {
  background: "linear-gradient(135deg, #6366f1 0%, #0f766e 60%, #06b6d4 100%)",
  boxShadow: "0 8px 32px rgba(99,102,241,0.35)",
};

const inputCls =
  "w-full pl-11 pr-4 py-3.5 rounded-2xl border text-gray-900 " +
  "text-base outline-none transition-all duration-200 placeholder-gray-300 " +
  "border-indigo-100 bg-white/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 shadow-sm backdrop-blur-sm";

const selectCls =
  "w-full pl-11 pr-10 py-3.5 rounded-2xl border text-gray-900 " +
  "text-base outline-none appearance-none transition-all duration-200 cursor-pointer " +
  "border-indigo-100 bg-white/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 shadow-sm backdrop-blur-sm";

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-600 mb-2">{label}</label>
      <div className="relative">
        {Icon && <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />}
        {children}
      </div>
    </div>
  );
}

function AllergyInput({ selected, onChange }) {
  const [input, setInput] = useState("");
  const inputRef = useRef();

  function add() {
    const val = input.trim();
    if (val && !selected.includes(val)) onChange([...selected, val]);
    setInput("");
    inputRef.current?.focus();
  }

  function remove(item) { onChange(selected.filter(s => s !== item)); }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type an allergy and press Enter or +"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          className="flex-1 px-4 py-3 rounded-xl border text-sm text-gray-900 outline-none transition-all duration-200 placeholder-gray-300 border-indigo-100 bg-white/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 shadow-sm"
        />
        <button
          type="button"
          onClick={add}
          className="px-4 py-3 rounded-xl text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
          style={{ background: "linear-gradient(135deg,#6366f1,#14b8a6)", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" }}
          title="Add allergy"
        >
          <Plus size={16} />
        </button>
      </div>

      {selected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selected.map(tag => (
            <span
              key={tag}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold"
              style={{ background: "rgba(99,102,241,0.08)", color: "#4f46e5", border: "1px solid rgba(99,102,241,0.25)" }}
            >
              {tag}
              <button type="button" onClick={() => remove(tag)} className="hover:text-red-500 transition-colors">
                <XIcon size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      {selected.length === 0 && (
        <p className="text-xs text-gray-400">No allergies added — leave empty if none.</p>
      )}
    </div>
  );
}

function StepSlide({ children, dir }) {
  return (
    <div style={{ animation: `slideIn${dir} 360ms cubic-bezier(0.4,0,0.2,1) forwards` }}>
      {children}
      <style>{`
        @keyframes slideInRight { from { opacity:0; transform:translateX(48px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInLeft  { from { opacity:0; transform:translateX(-48px); } to { opacity:1; transform:translateX(0); } }
      `}</style>
    </div>
  );
}

function StepDots({ current, total }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: i + 1 === current ? 28 : 8,
            height: 8,
            background: i + 1 < current
              ? "linear-gradient(90deg,#6366f1,#14b8a6)"
              : i + 1 === current
              ? "linear-gradient(90deg,#6366f1,#06b6d4)"
              : "#e5e7eb",
            boxShadow: i + 1 === current ? "0 0 10px rgba(99,102,241,0.5)" : "none",
          }}
        />
      ))}
      <span className="ml-2 text-xs font-semibold text-gray-400">
        Step <span className="font-bold" style={{ color: "#6366f1" }}>{current}</span> of {total}
      </span>
    </div>
  );
}

export default function Onboarding({ onComplete, onBack, backTo, initialData = {} }) {
  const TOTAL = 4;

  const [step, setStep]       = useState(1);
  const [dir, setDir]         = useState("Right");
  const [done, setDone]       = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [photo, setPhoto]     = useState(initialData.photo || null);
  const [exiting, setExiting] = useState(false);
  const fileRef = useRef();

  const [form, setForm] = useState({
    name:         initialData.name         || "",
    age:          initialData.age          || "",
    gender:       initialData.gender       || "",
    height:       initialData.height       || "",
    weight:       initialData.weight       || "",
    targetWeight: initialData.targetWeight || "",
    activity:     initialData.activity     || "",
    category:     initialData.category     || "",
    calories:     initialData.calories     || "",
    allergies:    initialData.allergies    || [],
    healthIssues: initialData.healthIssues || "",
  });

  function set(key, val) { setForm(f => ({ ...f, [key]: val })); }
  function goNext() { setDir("Right"); setStep(s => s + 1); }
  function goBack() { setDir("Left");  setStep(s => s - 1); }
  function finish() { setSkipped(false); setDone(true); }

  function handleSkip() {
    if (step < TOTAL) goNext();
    else { setSkipped(true); setDone(true); }
  }

  function handlePhoto(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setPhoto(ev.target.result);
    reader.readAsDataURL(file);
  }

  function exitWithSpin() {
    setExiting(true);
    setTimeout(() => { setExiting(false); onBack(backTo); }, 500);
  }

  if (done) {
    return <SuccessScreen onGetStarted={() => onComplete({ ...form, photo, skipped })} />;
  }

  return (
    <div
      className="fixed inset-0 z-[250] overflow-y-auto"
      style={{ background: "linear-gradient(160deg,#f8faff 0%,#eef9f6 45%,#f0f4ff 100%)" }}
    >
      {/* Exit spinner overlay */}
      {exiting && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center"
          style={{ backdropFilter: "blur(8px)", background: "rgba(255,255,255,0.55)" }}
        >
          <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="#6366f1" strokeWidth="3" />
            <path className="opacity-90" fill="#6366f1" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {/* Decorative blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle,#6366f1,transparent)" }} />
      <div className="fixed bottom-0 left-0 w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle,#14b8a6,transparent)" }} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle,#0ea5e9,transparent)" }} />

      {/* ── Premium navbar: NutriAI logo TOP-LEFT ── */}
      <div
        className="sticky top-0 z-10"
        style={{
          background: "linear-gradient(90deg,#0a0f1e 0%,#0d1a2e 50%,#0a1628 100%)",
          borderBottom: "1px solid rgba(99,102,241,0.2)",
          boxShadow: "0 4px 24px rgba(0,0,0,0.35)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* LEFT: NutriAI logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: "linear-gradient(135deg,#6366f1 0%,#14b8a6 100%)", boxShadow: "0 4px 14px rgba(99,102,241,0.45)" }}
            >
              <Leaf size={15} className="text-white" />
            </div>
            <span
              className="text-sm font-black tracking-tight"
              style={{ background: "linear-gradient(90deg,#a5b4fc,#5eead4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            >
              NutriAI
            </span>
          </div>
          {/* RIGHT: step badge */}
          <span
            className="px-3 py-1 rounded-full text-[11px] font-bold tracking-widest uppercase"
            style={{ background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)", color: "#a5b4fc" }}
          >
            Setup Profile
          </span>
        </div>
        {/* Gradient progress bar */}
        <div className="h-[2px]" style={{ background: "rgba(255,255,255,0.04)" }}>
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${(step / TOTAL) * 100}%`, background: "linear-gradient(90deg,#6366f1,#14b8a6,#06b6d4)" }}
          />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 pb-28">

        {/* Back button */}
        <div className="mb-8">
          <button
            onClick={step === 1 ? exitWithSpin : goBack}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 shadow-sm"
            style={{ border: "1px solid rgba(99,102,241,0.2)", background: "rgba(255,255,255,0.85)", color: "#6366f1", backdropFilter: "blur(8px)" }}
          >
            <ArrowLeft size={15} />
            {step === 1
              ? `Back to ${backTo === "signup" ? "Sign Up" : backTo === "login" ? "Log In" : "Profile"}`
              : "Back"}
          </button>
        </div>

        <StepSlide key={step} dir={dir}>

          {/* ── Step 1: Personal Details ── */}
          {step === 1 && (
            <div>
              <StepDots current={1} total={TOTAL} />
              <h2 className="text-4xl font-black mb-1 tracking-tight" style={{ background: "linear-gradient(135deg,#312e81,#0f766e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Personal Details
              </h2>
              <p className="text-gray-400 mb-10">Let's start with the basics about you.</p>

              {/* Profile photo upload */}
              <div className="flex flex-col items-center mb-10">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                <button
                  type="button"
                  onClick={() => fileRef.current.click()}
                  className="group relative w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
                  style={{
                    border: photo ? "none" : "2.5px dashed #6366f1",
                    background: photo ? "transparent" : "rgba(99,102,241,0.04)",
                    boxShadow: photo ? "0 12px 40px rgba(99,102,241,0.25)" : "none",
                  }}
                >
                  {photo ? (
                    <img src={photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                      <Camera size={20} className="text-indigo-400" />
                    </div>
                  )}
                  {photo && (
                    <div className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={22} className="text-white" />
                    </div>
                  )}
                </button>
                <p className="text-sm font-medium text-gray-400 mt-3">{photo ? "Change photo" : "Add Profile Photo"}</p>
                <p className="text-xs text-gray-300 mt-0.5">Optional</p>
              </div>

              <div className="space-y-5">
                <Field label="Full Name" icon={User}>
                  <input type="text" placeholder="Your full name" value={form.name}
                    onChange={e => set("name", e.target.value)} className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Age" icon={User}>
                    <input type="number" placeholder="25" min="10" max="100" value={form.age}
                      onChange={e => set("age", e.target.value)} className={inputCls} />
                  </Field>
                  <Field label="Gender" icon={User}>
                    <select value={form.gender} onChange={e => set("gender", e.target.value)} className={selectCls}>
                      <option value="">Select gender</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                    <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Body Metrics ── */}
          {step === 2 && (
            <div>
              <StepDots current={2} total={TOTAL} />
              <h2 className="text-4xl font-black mb-1 tracking-tight" style={{ background: "linear-gradient(135deg,#312e81,#0f766e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Body Metrics
              </h2>
              <p className="text-gray-400 mb-10">Help us understand your body to personalise your plan.</p>
              <div className="space-y-5">
                <Field label="Height (cm)" icon={Ruler}>
                  <input type="number" placeholder="170" value={form.height}
                    onChange={e => set("height", e.target.value)} className={inputCls} />
                </Field>
                <Field label="Current Weight (kg)" icon={Weight}>
                  <input type="number" placeholder="70" value={form.weight}
                    onChange={e => set("weight", e.target.value)} className={inputCls} />
                </Field>
                <Field label="Target Weight (kg)" icon={Weight}>
                  <input type="number" placeholder="65" value={form.targetWeight}
                    onChange={e => set("targetWeight", e.target.value)} className={inputCls} />
                </Field>
              </div>
              {form.height && form.weight && (
                <div
                  className="mt-6 p-4 rounded-2xl flex items-center gap-3"
                  style={{ background: "rgba(99,102,241,0.06)", border: "1px solid rgba(99,102,241,0.15)" }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                    style={{ background: "rgba(99,102,241,0.12)" }}>
                    <Activity size={15} style={{ color: "#6366f1" }} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold" style={{ color: "#6366f1" }}>Estimated BMI</p>
                    <p className="text-lg font-black" style={{ color: "#4f46e5" }}>
                      {(form.weight / ((form.height / 100) ** 2)).toFixed(1)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── Step 3: Lifestyle ── */}
          {step === 3 && (
            <div>
              <StepDots current={3} total={TOTAL} />
              <h2 className="text-4xl font-black mb-1 tracking-tight" style={{ background: "linear-gradient(135deg,#312e81,#0f766e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Your Lifestyle
              </h2>
              <p className="text-gray-400 mb-10">Tell us about your daily routine so we can tailor your nutrition.</p>
              <div className="space-y-5">
                <Field label="Activity Level" icon={Activity}>
                  <select value={form.activity} onChange={e => set("activity", e.target.value)} className={selectCls}>
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary — little or no exercise</option>
                    <option value="moderate">Moderate — exercise 3–5 days/week</option>
                    <option value="active">Active — daily exercise or intense training</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                </Field>
                <Field label="Category" icon={Briefcase}>
                  <select value={form.category} onChange={e => set("category", e.target.value)} className={selectCls}>
                    <option value="">Select your category</option>
                    <option>Student</option>
                    <option>Working Professional</option>
                    <option>Homemaker</option>
                    <option>Others</option>
                  </select>
                  <ChevronDown size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-400 pointer-events-none" />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { val: "sedentary", emoji: "🪑", label: "Sedentary" },
                  { val: "moderate",  emoji: "🚶", label: "Moderate"  },
                  { val: "active",    emoji: "🏃", label: "Active"    },
                ].map(a => (
                  <button
                    key={a.val}
                    type="button"
                    onClick={() => set("activity", a.val)}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all duration-200"
                    style={{
                      borderColor: form.activity === a.val ? "#6366f1" : "#e5e7eb",
                      background:  form.activity === a.val ? "rgba(99,102,241,0.07)" : "rgba(255,255,255,0.8)",
                      boxShadow:   form.activity === a.val ? "0 4px 16px rgba(99,102,241,0.2)" : "none",
                    }}
                  >
                    <span className="text-2xl">{a.emoji}</span>
                    <span className="text-xs font-semibold text-gray-600">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Health & Preferences ── */}
          {step === 4 && (
            <div>
              <StepDots current={4} total={TOTAL} />
              <h2 className="text-4xl font-black mb-1 tracking-tight" style={{ background: "linear-gradient(135deg,#312e81,#0f766e)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                Health & Preferences
              </h2>
              <p className="text-gray-400 mb-10">Almost done! Help us keep your plan safe and personalised.</p>
              <div className="space-y-6">

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Daily Calorie Target
                    <span className="ml-2 text-xs font-normal text-gray-400">kcal/day</span>
                  </label>

                  {form.height && form.weight && form.age && form.gender && form.activity && (() => {
                    const w = parseFloat(form.weight), h = parseFloat(form.height), a = parseFloat(form.age);
                    const bmr = form.gender === "Female"
                      ? 10 * w + 6.25 * h - 5 * a - 161
                      : 10 * w + 6.25 * h - 5 * a + 5;
                    const mult = { sedentary: 1.2, moderate: 1.55, active: 1.725 };
                    const tdee = Math.round(bmr * (mult[form.activity] || 1.2));
                    return (
                      <div className="mb-3 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                            <Calculator size={15} className="text-amber-600" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-semibold text-amber-700 mb-0.5">Suggested Target (Mifflin-St Jeor)</p>
                            <p className="text-2xl font-black text-amber-600">{tdee} <span className="text-sm font-semibold">kcal</span></p>
                            <button
                              type="button"
                              onClick={() => set("calories", String(tdee))}
                              className="mt-2 px-3 py-1 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors"
                            >
                              Use this value
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  <Field label="" icon={Flame}>
                    <input
                      type="number"
                      placeholder="e.g. 2000"
                      value={form.calories}
                      onChange={e => set("calories", e.target.value)}
                      className={inputCls}
                    />
                  </Field>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-600 mb-2">
                    Allergies
                    <span className="ml-2 text-xs font-normal text-gray-400">Type and press Enter or + to add</span>
                  </label>
                  <AllergyInput
                    selected={form.allergies}
                    onChange={val => set("allergies", val)}
                  />
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-gray-600 mb-2">
                    <AlertTriangle size={14} className="text-amber-400" />
                    Health Issues / Medical Conditions
                    <span className="text-xs font-normal text-gray-400">Optional</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Diabetes, Hypertension, PCOS, Thyroid..."
                    value={form.healthIssues}
                    onChange={e => set("healthIssues", e.target.value)}
                    className="w-full px-4 py-3.5 rounded-2xl border text-gray-900 text-base outline-none transition-all duration-200 placeholder-gray-300 resize-none border-indigo-100 bg-white/80 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-400/10 shadow-sm"
                  />
                </div>
              </div>
            </div>
          )}

        </StepSlide>

        {/* Action buttons */}
        <div className="mt-10 flex flex-col gap-3">
          <button
            type="button"
            onClick={step < TOTAL ? goNext : finish}
            className="w-full py-4 rounded-2xl text-white font-bold text-base tracking-wide transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl"
            style={PREMIUM}
          >
            {step < TOTAL ? "Continue →" : "Complete Setup →"}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-3.5 rounded-2xl text-sm font-semibold transition-all duration-200"
            style={{ border: "1.5px solid rgba(99,102,241,0.2)", color: "#6366f1", background: "rgba(99,102,241,0.04)" }}
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
