import { useState } from "react";
import {
  User, Edit3, CheckCircle, AlertCircle,
  Star, Zap, Crown, Activity, Flame, Heart, Target,
  Settings as SettingsIcon
} from "lucide-react";

function DetailChip({ label, value, dark, highlight }) {
  return (
    <div className={`rounded-xl p-4 border transition-all duration-300 ${
      highlight 
        ? (dark ? "bg-[#0D9488]/10 border-[#0D9488]/30" : "bg-teal-50 border-teal-100")
        : (dark ? "bg-slate-800/60 border-slate-700/50" : "bg-slate-50 border-slate-100")
    }`}>
      <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${
        highlight ? (dark ? "text-[#14B8A6]" : "text-teal-600") : (dark ? "text-slate-500" : "text-slate-400")
      }`}>
        {label}
      </p>
      <p className={`text-sm font-semibold ${
        highlight 
          ? (dark ? "text-white" : "text-teal-900") 
          : (value ? (dark ? "text-white" : "text-slate-900") : dark ? "text-slate-600" : "text-slate-300")
      }`}>
        {value || "—"}
      </p>
    </div>
  );
}

function TagList({ items, colorClass, dark }) {
  if (!items || items.length === 0) return <span className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>None</span>;
  const arr = Array.isArray(items) ? items : items.split(',').map(s => s.trim()).filter(Boolean);
  if (arr.length === 0) return <span className={`text-sm ${dark ? "text-slate-500" : "text-slate-400"}`}>None</span>;
  
  return (
    <div className="flex flex-wrap gap-2">
      {arr.map(item => (
        <span key={item} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${colorClass}`}>
          {item}
        </span>
      ))}
    </div>
  );
}

function PlanCard({ name, price, period, features, popular, icon: Icon, dark }) {
  return (
    <div className={`relative rounded-2xl p-6 border-2 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer ${
      popular
        ? "border-[#0D9488] shadow-lg shadow-[#0D9488]/10"
        : dark
          ? "border-slate-700 hover:border-slate-600"
          : "border-slate-200 hover:border-slate-300"
    } ${dark ? "bg-slate-800/70" : "bg-white"}`}>

      {popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white bg-[#0D9488] shadow-md">
          <Star size={9} fill="white" /> Most Popular
        </div>
      )}

      <div className="flex items-center gap-3 mb-5">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          popular ? "bg-[#0D9488]" : dark ? "bg-slate-700" : "bg-slate-100"
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
            <CheckCircle size={13} className="text-[#0D9488] shrink-0 mt-0.5" />
            <span className={`text-sm leading-snug ${dark ? "text-slate-300" : "text-slate-600"}`}>{f}</span>
          </li>
        ))}
      </ul>

      <button
        className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
          popular
            ? "bg-[#0D9488] text-white hover:bg-[#0F766E] shadow-md shadow-[#0D9488]/20"
            : dark
              ? "border border-slate-600 text-slate-300 hover:border-[#0D9488] hover:text-[#14B8A6]"
              : "border border-slate-200 text-slate-700 hover:border-[#0D9488] hover:text-[#0D9488] hover:bg-teal-50"
        }`}
      >
        {popular ? "Upgrade Now →" : "Get Started →"}
      </button>
    </div>
  );
}

function TabButton({ id, label, currentTab, setLocalTab, dark }) {
  return (
    <button
      onClick={() => setLocalTab(id)}
      className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 ${
        currentTab === id
          ? (dark ? "bg-[#0D9488] text-white shadow-md shadow-[#0D9488]/20" : "bg-[#0D9488] text-white shadow-md shadow-[#0D9488]/30")
          : (dark ? "text-slate-400 hover:bg-slate-800" : "text-slate-600 hover:bg-slate-100")
      }`}
    >
      {label}
    </button>
  );
}

export default function Profile({ dark, profileData, onboardingDone, onCompleteProfile, activeTab }) {
  const [localTab, setLocalTab] = useState("personal");

  const {
    firstName = "", lastName = "", dobYear = "", gender = "", 
    height = "", weight = "", targetWeight = "", mainGoal = "",
    activityLevel = "", dietaryPreference = "", regionalCulture = "",
    allergies = [], healthIssues = [], likedFoods = "", dislikedFoods = "",
    waterGoal = "", photo = null
  } = profileData || {};

  const name = (profileData?.name) || `${firstName} ${lastName}`.trim();
  const age = dobYear ? new Date().getFullYear() - parseInt(dobYear) : "";
  
  const isPlans = activeTab === "plans";
  const isSettings = activeTab === "settings";

  
  const currentTab = isPlans ? "plans" : isSettings ? "settings" : localTab;

  return (
    <div className="w-full relative px-6 md:px-10 py-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Incomplete Profile Banner */}
        {!onboardingDone && (
          <div className={`flex items-center gap-4 p-5 rounded-2xl border ${
            dark ? "border-[#0D9488]/40 bg-[#0D9488]/10" : "border-teal-100 bg-teal-50/60"
          }`}>
            <div className="w-10 h-10 rounded-xl bg-teal-100 dark:bg-[#0D9488]/30 flex items-center justify-center shrink-0">
              <AlertCircle size={20} className="text-[#0D9488] dark:text-[#14B8A6]" />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-bold ${dark ? "text-[#14B8A6]" : "text-teal-800"}`}>Complete your profile</p>
              <p className={`text-xs mt-0.5 ${dark ? "text-teal-400/60" : "text-teal-600/70"}`}>
                Add your details to unlock personalised meal plans and AI insights.
              </p>
            </div>
            <button
              onClick={onCompleteProfile}
              className="shrink-0 px-5 py-2.5 rounded-xl bg-[#0D9488] text-white text-sm font-bold hover:bg-[#0F766E] shadow-lg shadow-[#0D9488]/20 transition-all"
            >
              Complete Now →
            </button>
          </div>
        )}

        {/* Hero Section */}
        <div className={`rounded-3xl border overflow-hidden shadow-sm transition-colors duration-300 ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          <div className="h-24 bg-gradient-to-r from-[#6366F1] to-[#14B8A6]" />
          <div className="px-8 pb-8 flex flex-col md:flex-row gap-6 items-center md:items-end -mt-10">
            <div className="relative shrink-0 group cursor-pointer" onClick={onCompleteProfile}>
              <div className="w-28 h-28 rounded-[24px] border-4 overflow-hidden shadow-xl transition-transform group-hover:scale-105"
                style={{ borderColor: dark ? '#0F172A' : '#FFFFFF' }}>
                {photo ? (
                  <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0F766E] to-[#14B8A6]">
                    <span className="text-4xl font-black text-white">{firstName ? firstName[0].toUpperCase() : <User size={40} />}</span>
                  </div>
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-xl bg-white text-[#0D9488] flex items-center justify-center shadow-lg border border-slate-100">
                <Edit3 size={16} strokeWidth={2.5} />
              </div>
            </div>

            <div className="flex-1 text-center md:text-left min-w-0">
              <h1 className={`text-3xl font-black tracking-tight truncate ${dark ? "text-white" : "text-slate-900"}`}>
                {name || "Guest User"}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${dark ? 'bg-[#3B82F6]/10 text-[#60A5FA] border-[#3B82F6]/20' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                  {mainGoal || "Setup Goal"}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${dark ? 'bg-[#F59E0B]/10 text-[#FBBF24] border-[#F59E0B]/20' : 'bg-amber-50 text-amber-700 border-amber-100'}`}>
                  🔥 18 Day Streak
                </span>
            
              </div>
            </div>

            <div className="flex gap-4 w-full md:w-auto">
              <div className="flex-1 md:flex-none text-center bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 border border-slate-100 dark:border-slate-700/50">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current</p>
                <p className={`text-xl font-black ${dark ? 'text-white' : 'text-slate-900'}`}>{weight ? `${weight}kg` : '--'}</p>
              </div>
              <div className="flex-1 md:flex-none text-center bg-teal-50 dark:bg-[#0D9488]/10 rounded-2xl p-4 border border-teal-100 dark:border-[#0D9488]/20">
                <p className="text-[10px] font-bold text-teal-600 dark:text-[#14B8A6] uppercase tracking-widest mb-1">Target</p>
                <p className={`text-xl font-black text-[#0D9488] dark:text-[#34D399]`}>{targetWeight ? `${targetWeight}kg` : '--'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        {(!isPlans && !isSettings) && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <TabButton id="personal" label="Personal Info" currentTab={currentTab} setLocalTab={setLocalTab} dark={dark} />
            <TabButton id="nutrition" label="Nutrition & Preferences" currentTab={currentTab} setLocalTab={setLocalTab} dark={dark} />
          </div>
        )}

        {/* Content Area */}
        <div className={`rounded-3xl p-8 border shadow-sm transition-colors duration-300 ${dark ? "bg-slate-900 border-slate-800" : "bg-white border-slate-100"}`}>
          
          {/* TOP RIGHT ACTION BUTTON */}
          {(!isPlans && !isSettings) && (
            <div className="flex justify-end mb-6">
              <button
                onClick={onCompleteProfile}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all duration-150 shadow-sm ${
                  dark ? "border-slate-700 text-slate-300 hover:border-slate-500 hover:bg-slate-800" : "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Edit3 size={14} /> Edit Profile
              </button>
            </div>
          )}

          {/* TAB: Personal Info */}
          {currentTab === "personal" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <User className="text-[#0D9488]" size={20} />
                <h2 className={`text-lg font-black ${dark ? "text-white" : "text-slate-900"}`}>Physical Details</h2>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <DetailChip label="Age" value={age ? `${age} yrs` : ""} dark={dark} />
                <DetailChip label="Gender" value={gender} dark={dark} />
                <DetailChip label="Height" value={height ? `${height} cm` : ""} dark={dark} />
                <DetailChip label="Activity" value={activityLevel} dark={dark} highlight />
              </div>

              <div className="flex items-center gap-2 mt-10 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">
                <Target className="text-[#0D9488]" size={20} />
                <h2 className={`text-lg font-black ${dark ? "text-white" : "text-slate-900"}`}>Goals & Metrics</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DetailChip label="Primary Goal" value={mainGoal} dark={dark} />
                <DetailChip label="Water Goal" value={waterGoal ? `${waterGoal} Liters/Day` : ""} dark={dark} />
              </div>
            </div>
          )}

          {/* TAB: Nutrition & Preferences */}
          {currentTab === "nutrition" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-8">
              
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="text-[#F59E0B]" size={20} />
                  <h2 className={`text-lg font-black ${dark ? "text-white" : "text-slate-900"}`}>Diet Profile</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-5 rounded-2xl border ${dark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Diet Type</p>
                    <p className={`text-lg font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{dietaryPreference || "Not specified"}</p>
                  </div>
                  <div className={`p-5 rounded-2xl border ${dark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">Regional Cuisine</p>
                    <p className={`text-lg font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>{regionalCulture || "Not specified"}</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="text-red-500" size={20} />
                  <h2 className={`text-lg font-black ${dark ? "text-white" : "text-slate-900"}`}>Medical & Restrictions</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Allergies</p>
                    <TagList 
                      items={allergies} 
                      dark={dark} 
                      colorClass={dark ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-red-50 text-red-600 border border-red-100"} 
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Health Issues</p>
                    <TagList 
                      items={healthIssues} 
                      dark={dark} 
                      colorClass={dark ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-amber-50 text-amber-600 border border-amber-100"} 
                    />
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Activity className="text-[#3B82F6]" size={20} />
                  <h2 className={`text-lg font-black ${dark ? "text-white" : "text-slate-900"}`}>Food Preferences</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Loves</p>
                    <TagList 
                      items={likedFoods} 
                      dark={dark} 
                      colorClass={dark ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-emerald-50 text-emerald-600 border border-emerald-100"} 
                    />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Dislikes</p>
                    <TagList 
                      items={dislikedFoods} 
                      dark={dark} 
                      colorClass={dark ? "bg-slate-700 text-slate-300 border border-slate-600" : "bg-slate-200 text-slate-600 border border-slate-300"} 
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB: Subscription Plans */}
          {currentTab === "plans" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Crown size={24} className="text-[#0D9488]" />
                    <h2 className={`text-2xl font-black tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>NutriAI Premium</h2>
                  </div>
                  <p className={`text-sm mt-1 ${dark ? "text-slate-400" : "text-slate-500"}`}>
                    Unlock the full power of AI-driven nutrition and insights.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PlanCard name="Basic" price={199} period="month" icon={Zap} popular={false} dark={dark} features={[
                  "20 meal scans per day",
                  "Basic nutrition breakdown",
                  "7-day meal history",
                  "Email support"
                ]} />
                <PlanCard name="Pro" price={299} period="month" icon={Crown} popular={true} dark={dark} features={[
                  "Unlimited meal scanning",
                  "AI-powered nutrition insights",
                  "Custom weekly meal plans",
                  "Priority 24/7 support",
                  "Advanced progress analytics",
                  "Allergy-aware recommendations"
                ]} />
              </div>
            </div>
          )}

          {/* TAB: Settings */}
          {currentTab === "settings" && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-2 mb-8">
                <SettingsIcon className="text-[#0D9488]" size={24} />
                <h2 className={`text-2xl font-black tracking-tight ${dark ? "text-white" : "text-slate-900"}`}>App Settings</h2>
              </div>

              <div className="space-y-4">
                <div className={`p-5 rounded-2xl border flex items-center justify-between ${dark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div>
                    <p className={`text-base font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Push Notifications</p>
                    <p className={`text-xs mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Meal reminders & daily insights</p>
                  </div>
                  <div className="w-12 h-6 rounded-full bg-[#0D9488] p-1 flex justify-end cursor-pointer">
                    <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                  </div>
                </div>

                <div className={`p-5 rounded-2xl border flex items-center justify-between ${dark ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div>
                    <p className={`text-base font-bold ${dark ? 'text-white' : 'text-slate-900'}`}>Export My Data</p>
                    <p className={`text-xs mt-1 ${dark ? 'text-slate-400' : 'text-slate-500'}`}>Download all logs (DPDPA 2023)</p>
                  </div>
                  <button className={`px-4 py-2 rounded-lg text-sm font-bold border transition-colors ${dark ? 'border-slate-600 text-slate-300 hover:bg-slate-700' : 'border-slate-300 text-slate-700 hover:bg-slate-200'}`}>
                    Export CSV
                  </button>
                </div>
                
                <div className="pt-8 mt-8 border-t border-red-100 dark:border-red-900/30">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="text-red-500" size={20} />
                    <h3 className="text-lg font-black text-red-500">Danger Zone</h3>
                  </div>
                  <div className={`p-5 rounded-2xl border border-red-200 dark:border-red-900/50 bg-red-50 dark:bg-red-900/10 flex items-center justify-between`}>
                    <div>
                      <p className={`text-base font-bold text-red-700 dark:text-red-400`}>Delete Account</p>
                      <p className={`text-xs mt-1 text-red-600/70 dark:text-red-400/70`}>Permanently remove all data</p>
                    </div>
                    <button className="px-4 py-2 rounded-lg text-sm font-bold bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/60 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
