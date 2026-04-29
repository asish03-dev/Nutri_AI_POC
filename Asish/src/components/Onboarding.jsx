import { useState, useRef } from "react";
import {
  Leaf, ArrowLeft, Camera, User, ChevronDown,
  Ruler, Weight, Activity, Briefcase,
  Flame, AlertTriangle, Calculator,
} from "lucide-react";
import SuccessScreen from "./SuccessScreen";

const inputCls =
  "w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 " +
  "text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 " +
  "transition-all duration-200 placeholder-gray-300";

const selectCls =
  "w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 " +
  "text-sm outline-none appearance-none focus:border-emerald-400 focus:ring-2 " +
  "focus:ring-emerald-400/10 transition-all duration-200 cursor-pointer";

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div className="relative">
        {Icon && <Icon size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />}
        {children}
      </div>
    </div>
  );
}

function StepSlide({ children, dir }) {
  return (
    <div style={{ animation: `slideIn${dir} 320ms cubic-bezier(0.4,0,0.2,1) forwards` }}>
      {children}
      <style>{`
        @keyframes slideInRight { from { opacity:0; transform:translateX(32px); } to { opacity:1; transform:translateX(0); } }
        @keyframes slideInLeft  { from { opacity:0; transform:translateX(-32px); } to { opacity:1; transform:translateX(0); } }
      `}</style>
    </div>
  );
}

function StepIndicator({ current, total }) {
  return (
    <div className="flex flex-col items-center gap-3 mb-10">
      <div className="flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i + 1 === current ? 24 : 8,
              height: 8,
              background: i + 1 <= current ? "#10b981" : "#e5e7eb",
              opacity: i + 1 < current ? 0.45 : 1,
            }}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-gray-400">Step {current} of {total}</span>
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
    allergies:    initialData.allergies    || "",
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
    setTimeout(() => { setExiting(false); onBack(backTo); }, 400);
  }

  if (done) {
    return <SuccessScreen onGetStarted={() => onComplete({ ...form, photo, skipped })} />;
  }

  return (
    <div className="fixed inset-0 z-[250] overflow-y-auto bg-white">

      {/* Exit spinner */}
      {exiting && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-white/70 backdrop-blur-sm">
          <svg className="animate-spin h-8 w-8 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
            <path className="opacity-80" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
          </svg>
        </div>
      )}

      {/* ── Navbar: logo + text top-left ── */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center">
          {/* Logo top-left */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500 flex items-center justify-center">
              <Leaf size={13} className="text-white" />
            </div>
            <span className="text-sm font-bold text-gray-900">NutriAi</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-0.5 bg-gray-100">
          <div
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(step / TOTAL) * 100}%` }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-lg mx-auto px-6 pt-6 pb-28">

        {/* Back button — below navbar */}
        <div className="mb-8">
          <button
            onClick={step === 1 ? exitWithSpin : goBack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 transition-all duration-150"
          >
            <ArrowLeft size={14} />
            {step === 1
              ? `Back to ${backTo === "signup" ? "Sign Up" : backTo === "login" ? "Log In" : "Profile"}`
              : "Back"}
          </button>
        </div>

        <StepSlide key={step} dir={dir}>

          {/* Step indicator — centered */}
          <StepIndicator current={step} total={TOTAL} />

          {/* ── Step 1: Personal Details ── */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Personal Details</h2>
              <p className="text-sm text-gray-500 mb-8">Let's start with the basics about you.</p>

              <div className="flex flex-col items-center mb-8">
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                <button
                  type="button"
                  onClick={() => fileRef.current.click()}
                  className="group relative w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-105"
                  style={{
                    border: photo ? "none" : "2px dashed #d1d5db",
                    background: photo ? "transparent" : "#f9fafb",
                    boxShadow: photo ? "0 8px 24px rgba(0,0,0,0.12)" : "none",
                  }}
                >
                  {photo ? (
                    <img src={photo} alt="Profile" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <Camera size={20} className="text-gray-400 group-hover:text-gray-500 transition-colors" />
                  )}
                  {photo && (
                    <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Camera size={18} className="text-white" />
                    </div>
                  )}
                </button>
                <p className="text-xs text-gray-400 mt-2">{photo ? "Change photo" : "Add photo (optional)"}</p>
              </div>

              <div className="space-y-4">
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
                      <option value="">Select</option>
                      <option>Male</option>
                      <option>Female</option>
                      <option>Other</option>
                      <option>Prefer not to say</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </Field>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 2: Body Metrics ── */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Body Metrics</h2>
              <p className="text-sm text-gray-500 mb-8">Help us personalise your nutrition plan.</p>
              <div className="space-y-4">
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
                <div className="mt-5 p-4 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                    <Activity size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700">Estimated BMI</p>
                    <p className="text-lg font-bold text-emerald-600">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Your Lifestyle</h2>
              <p className="text-sm text-gray-500 mb-8">Tell us about your daily routine.</p>
              <div className="space-y-4">
                <Field label="Activity Level" icon={Activity}>
                  <select value={form.activity} onChange={e => set("activity", e.target.value)} className={selectCls}>
                    <option value="">Select activity level</option>
                    <option value="sedentary">Sedentary — little or no exercise</option>
                    <option value="moderate">Moderate — exercise 3–5 days/week</option>
                    <option value="active">Active — daily exercise or intense training</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </Field>
                <Field label="Category" icon={Briefcase}>
                  <select value={form.category} onChange={e => set("category", e.target.value)} className={selectCls}>
                    <option value="">Select your category</option>
                    <option>Student</option>
                    <option>Working Professional</option>
                    <option>Homemaker</option>
                    <option>Others</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { val: "sedentary", emoji: "🪑", label: "Sedentary" },
                  { val: "moderate",  emoji: "🚶", label: "Moderate"  },
                  { val: "active",    emoji: "🏃", label: "Active"    },
                ].map(a => (
                  <button
                    key={a.val}
                    type="button"
                    onClick={() => set("activity", a.val)}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-150"
                    style={{
                      borderColor: form.activity === a.val ? "#10b981" : "#e5e7eb",
                      background:  form.activity === a.val ? "#f0fdf4" : "white",
                    }}
                  >
                    <span className="text-xl">{a.emoji}</span>
                    <span className="text-xs font-semibold text-gray-600">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 4: Health & Preferences ── */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Health & Preferences</h2>
              <p className="text-sm text-gray-500 mb-8">Almost done — help us keep your plan safe.</p>
              <div className="space-y-6">

                {/* Calorie target */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Daily Calorie Target
                    <span className="ml-1.5 text-xs font-normal text-gray-400">kcal/day</span>
                  </label>
                  {form.height && form.weight && form.age && form.gender && form.activity && (() => {
                    const w = parseFloat(form.weight), h = parseFloat(form.height), a = parseFloat(form.age);
                    const bmr = form.gender === "Female"
                      ? 10 * w + 6.25 * h - 5 * a - 161
                      : 10 * w + 6.25 * h - 5 * a + 5;
                    const mult = { sedentary: 1.2, moderate: 1.55, active: 1.725 };
                    const tdee = Math.round(bmr * (mult[form.activity] || 1.2));
                    return (
                      <div className="mb-3 p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                          <Calculator size={14} className="text-amber-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-semibold text-amber-700 mb-0.5">Suggested (Mifflin-St Jeor)</p>
                          <p className="text-xl font-bold text-amber-600">{tdee} <span className="text-sm font-normal">kcal</span></p>
                          <button
                            type="button"
                            onClick={() => set("calories", String(tdee))}
                            className="mt-2 px-3 py-1 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 transition-colors"
                          >
                            Use this value
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                  <Field label="" icon={Flame}>
                    <input type="number" placeholder="e.g. 2000" value={form.calories}
                      onChange={e => set("calories", e.target.value)} className={inputCls} />
                  </Field>
                </div>

                {/* Allergies — plain textarea only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Allergies
                    <span className="ml-1.5 text-xs font-normal text-gray-400">Optional</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Peanuts, Dairy, Gluten..."
                    value={form.allergies}
                    onChange={e => set("allergies", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition-all placeholder-gray-300 resize-none"
                  />
                </div>

                {/* Health issues */}
                <div>
                  <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700 mb-1.5">
                    <AlertTriangle size={13} className="text-amber-400" />
                    Health Issues / Medical Conditions
                    <span className="text-xs font-normal text-gray-400">Optional</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Diabetes, Hypertension, PCOS, Thyroid..."
                    value={form.healthIssues}
                    onChange={e => set("healthIssues", e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-gray-900 text-sm outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/10 transition-all placeholder-gray-300 resize-none"
                  />
                </div>

              </div>
            </div>
          )}

        </StepSlide>

        {/* Action buttons */}
        <div className="mt-8 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={step < TOTAL ? goNext : finish}
            className="w-full py-3.5 rounded-xl bg-emerald-500 text-white font-semibold text-sm hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-500/20"
          >
            {step < TOTAL ? "Continue →" : "Complete Setup →"}
          </button>
          <button
            type="button"
            onClick={handleSkip}
            className="w-full py-3 rounded-xl border border-gray-200 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 transition-all"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
