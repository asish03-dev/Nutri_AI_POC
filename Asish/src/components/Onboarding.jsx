import { useState, useRef, useEffect } from 'react';
import { Camera, ChevronLeft, Flame, Check, Activity, Plus, X, Leaf, ChevronDown } from 'lucide-react';

const TOTAL_STEPS = 7;

const getBmiCategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Underweight', color: '#3B82F6' };
  if (bmi < 25) return { label: 'Healthy', color: '#14B8A6' };
  if (bmi < 30) return { label: 'Overweight', color: '#F59E0B' };
  return { label: 'Obese', color: '#EF4444' };
};

/* ── Custom Dropdown ── */
const Select = ({ name, value, onChange, options, placeholder }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => (o.value ?? o) === value);
  const label = selected ? (selected.label ?? selected) : null;

  return (
    <div ref={ref} className="relative w-full">
      <button
        type="button"
        className={`w-full h-12 pl-4 pr-10 border rounded-[18px] text-[15px] outline-none cursor-pointer flex items-center text-left transition-all duration-200 ${open
          ? 'border-[#14B8A6] shadow-[0_0_0_3px_rgba(20,184,166,0.12)] dark:shadow-[0_0_0_3px_rgba(20,184,166,0.15)] bg-white dark:bg-slate-800'
          : 'border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-[#14B8A6] focus:shadow-[0_0_0_3px_rgba(20,184,166,0.12)] dark:focus:shadow-[0_0_0_3px_rgba(20,184,166,0.15)] hover:border-[#14B8A6]/50'
          } shadow-[0_2px_10px_rgba(0,0,0,0.02)]`}
        onClick={() => setOpen(o => !o)}
      >
        <span className={`flex-1 truncate ${label ? 'text-[#0F172A] dark:text-slate-100 font-medium' : 'text-[#475569]/60 dark:text-slate-500'}`}>
          {label || placeholder}
        </span>
        <ChevronDown size={16} className={`absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-[20px] shadow-[0_12px_40px_rgba(15,23,42,0.08)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-[200] max-h-[240px] overflow-y-auto py-2">
          {options.map(opt => {
            const val = opt.value ?? opt;
            const lbl = opt.label ?? opt;
            const isActive = value === val;
            return (
              <div
                key={val}
                className={`px-5 py-3 text-[14px] cursor-pointer flex items-center gap-3 transition-colors duration-150 ${isActive
                  ? 'bg-[#14B8A6]/10 dark:bg-[#14B8A6]/10 text-[#14B8A6] font-bold'
                  : 'text-[#475569] dark:text-slate-400 hover:bg-[#FAFBFC] dark:hover:bg-slate-700 hover:text-[#0F172A] dark:hover:text-slate-200 font-medium'
                  }`}
                onClick={() => { onChange({ target: { name, value: val } }); setOpen(false); }}
              >
                {isActive && <Check size={16} strokeWidth={3} className="text-[#14B8A6] shrink-0" />}
                {lbl}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const ChipGroup = ({ items, selected, onToggle, onAdd, addValue, onAddChange, placeholder }) => (
  <div className="flex flex-col gap-3.5">
    <div className="flex flex-wrap gap-2.5">
      {items.map(item => {
        const isActive = selected.includes(item);
        return (
          <button
            key={item}
            type="button"
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-[18px] border text-[14px] font-semibold cursor-pointer transition-all duration-200 select-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] ${isActive
              ? 'border-[#14B8A6] bg-[#14B8A6]/10 text-[#14B8A6]'
              : 'border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#475569] dark:text-slate-400 hover:border-[#14B8A6] hover:text-[#14B8A6] hover:bg-[#FAFBFC] dark:hover:bg-[#14B8A6]/10'
              }`}
            onClick={() => onToggle(item)}
          >
            {isActive && <Check size={14} strokeWidth={3} />} {item}
          </button>
        );
      })}
      {selected.filter(s => !items.includes(s)).map(item => (
        <button
          key={item}
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[18px] border border-[#14B8A6] bg-[#14B8A6]/10 text-[#14B8A6] text-[14px] font-semibold cursor-pointer transition-all select-none shadow-[0_2px_10px_rgba(0,0,0,0.02)] hover:bg-[#14B8A6]/20"
          onClick={() => onToggle(item)}
        >
          {item} <X size={14} strokeWidth={3} />
        </button>
      ))}
    </div>
    <div className="flex gap-3">
      <input
        type="text"
        value={addValue}
        onChange={onAddChange}
        placeholder={placeholder}
        onKeyDown={(e) => e.key === 'Enter' && onAdd()}
        className="flex-1 h-12 px-4 border border-[#E2E8F0] dark:border-slate-700 rounded-[18px] text-[15px] font-medium text-[#0F172A] dark:text-slate-100 bg-white dark:bg-slate-800 outline-none transition-all duration-200 placeholder-[#475569]/50 dark:placeholder-slate-600 focus:border-[#14B8A6] focus:ring-[3px] focus:ring-[#14B8A6]/10 dark:focus:ring-[#14B8A6]/15 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
      />
      <button
        type="button"
        className="w-12 h-12 rounded-[18px] border border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 text-[#475569] dark:text-slate-400 flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-[#14B8A6] hover:text-[#14B8A6] hover:bg-[#FAFBFC] dark:hover:bg-[#14B8A6]/10 shadow-[0_2px_10px_rgba(0,0,0,0.02)] shrink-0"
        onClick={onAdd}
      >
        <Plus size={20} strokeWidth={2.5} />
      </button>
    </div>
  </div>
);

const Onboarding = ({ onComplete, onBack, dark = false, initialData = null, backTo = '' }) => {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileRef = useRef();

  const buildForm = (d) => ({
    firstName: d?.firstName || '', lastName: d?.lastName || '',
    dobDay: d?.dobDay || '', dobMonth: d?.dobMonth || '', dobYear: d?.dobYear || '',
    gender: d?.gender || '', phone: d?.phone || '',
    height: d?.height || '', weight: d?.weight || '', targetWeight: d?.targetWeight || '',
    waterGoal: d?.waterGoal ? String(d.waterGoal) : '3',
    mainGoal: d?.mainGoal || '', activityLevel: d?.activityLevel || '',
    occupation: d?.occupation || '', sleepSchedule: d?.sleepSchedule || '',
    dietaryPreference: d?.dietaryPreference || '', cookingOil: d?.cookingOil || '',
    regionalCulture: d?.regionalCulture || '',
    allergies: Array.isArray(d?.allergies) ? d.allergies : [],
    healthIssues: Array.isArray(d?.healthIssues) ? d.healthIssues : [],
    likedFoods: d?.likedFoods || '', dislikedFoods: d?.dislikedFoods || '',
    customAllergy: '', customHealthIssue: '',
    mealsPerDay: d?.mealsPerDay || '', cookingTime: d?.cookingTime || '',
    groceryBudget: d?.groceryBudget || '', mealLocation: d?.mealLocation || '',
    mainCarbs: d?.mainCarbs || '',
    calorieTarget: d?.calorieTarget || 0, bmi: d?.bmi || 0, selectedPlan: d?.selectedPlan || ''
  });

  const [formData, setFormData] = useState(() => buildForm(initialData));

  // When initialData changes (e.g. Edit Profile clicked), reload the form
  useEffect(() => {
    setFormData(buildForm(initialData));
    setStep(1);
    setIsAnalyzing(false);
    setPhotoPreview(null);
  }, [initialData]);

  const isEditMode = backTo === 'profile';

  // Restore photo preview if we have a saved photo from initialData
  useEffect(() => {
    if (initialData?.photo) {
      setPhotoPreview(initialData.photo);
    }
  }, []);

  const set = (name, value) => setFormData(prev => ({ ...prev, [name]: value }));
  const handleChange = (e) => set(e.target.name, e.target.value);

  const toggleChip = (category, value) =>
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(i => i !== value)
        : [...prev[category], value]
    }));

  const addCustom = (category, inputKey) => {
    const val = formData[inputKey].trim();
    if (val && !formData[category].includes(val)) {
      setFormData(prev => ({ ...prev, [category]: [...prev[category], val], [inputKey]: '' }));
    }
  };

  const calculateResults = () => {
    const w = parseFloat(formData.weight);
    const h = parseFloat(formData.height);
    const age = formData.dobYear ? new Date().getFullYear() - parseInt(formData.dobYear) : 30;
    if (!w || !h) return;
    const bmi = parseFloat((w / ((h / 100) ** 2)).toFixed(1));
    let bmr = 10 * w + 6.25 * h - 5 * age + (formData.gender === 'Male' ? 5 : -161);
    const multipliers = { Sedentary: 1.2, 'Lightly Active': 1.375, 'Moderately Active': 1.55, 'Very Active': 1.725 };
    let cal = Math.round(bmr * (multipliers[formData.activityLevel] || 1.3));
    if (formData.mainGoal === 'Fat Loss') cal -= 500;
    if (formData.mainGoal === 'Muscle Gain') cal += 300;
    if (formData.mainGoal === 'Weight Gain') cal += 500;
    setFormData(prev => ({ ...prev, bmi, calorieTarget: cal }));
  };

  const canProceed = () => {
    if (step === 1) return formData.firstName.trim().length > 0;
    if (step === 2) return formData.height && formData.weight && formData.targetWeight && formData.waterGoal;
    return true;
  };

  const handleNext = () => {
    if (step === 5) {
      setIsAnalyzing(true);
      setStep(6);
      calculateResults();
      setTimeout(() => setIsAnalyzing(false), 2800);
    } else if (step < TOTAL_STEPS) {
      setStep(s => s + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(s => s - 1);
    else if (onBack) onBack();
  };

  const handleFinish = () => {
    const age = formData.dobYear ? new Date().getFullYear() - parseInt(formData.dobYear) : '';
    if (onComplete) onComplete({
      // computed / display fields
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      age,
      // raw form fields (needed for Edit Profile pre-fill)
      firstName: formData.firstName,
      lastName: formData.lastName,
      dobDay: formData.dobDay,
      dobMonth: formData.dobMonth,
      dobYear: formData.dobYear,
      phone: formData.phone,
      email: '',
      photo: photoPreview,
      gender: formData.gender,
      height: formData.height,
      weight: formData.weight,
      targetWeight: formData.targetWeight,
      waterGoal: parseFloat(formData.waterGoal) || 3.0,
      mainGoal: formData.mainGoal,
      activityLevel: formData.activityLevel,
      occupation: formData.occupation,
      category: formData.occupation,
      sleepSchedule: formData.sleepSchedule,
      dietaryPreference: formData.dietaryPreference,
      cookingOil: formData.cookingOil,
      regionalCulture: formData.regionalCulture,
      allergies: formData.allergies,
      healthIssues: formData.healthIssues,
      likedFoods: formData.likedFoods,
      dislikedFoods: formData.dislikedFoods,
      mealsPerDay: formData.mealsPerDay,
      cookingTime: formData.cookingTime,
      groceryBudget: formData.groceryBudget,
      mealLocation: formData.mealLocation,
      mainCarbs: formData.mainCarbs,
      bmi: formData.bmi,
      calorieTarget: formData.calorieTarget,
      selectedPlan: formData.selectedPlan,
    });
  };

  // Convert file to base64 for persistence across sessions
  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Save current step's data and finish if in edit mode
  const handleSaveChanges = () => {
    handleFinish();
  };

  const bmiInfo = formData.bmi ? getBmiCategory(formData.bmi) : null;


  const inputClass = "h-12 px-4 border border-[#E2E8F0] dark:border-slate-700 rounded-[18px] text-[15px] font-medium text-[#0F172A] dark:text-slate-100 bg-white dark:bg-slate-800 outline-none transition-all duration-200 placeholder-[#475569]/50 dark:placeholder-slate-600 focus:border-[#14B8A6] focus:ring-[3px] focus:ring-[#14B8A6]/10 dark:focus:ring-[#14B8A6]/15 shadow-[0_2px_10px_rgba(0,0,0,0.02)]";
  const labelClass = "text-[14px] font-semibold text-[#475569] dark:text-slate-400 tracking-[0.01em] pl-1";
  const titleClass = "text-[34px] font-extrabold tracking-[-0.02em] text-[#0F172A] dark:text-slate-100 leading-tight";
  const subtitleClass = "text-[16px] font-medium text-[#475569] dark:text-slate-400 leading-relaxed -mt-2.5";

  return (
    <div className={dark ? 'dark' : ''}>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-in { animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
        @keyframes customSpin {
          to { transform: rotate(360deg); }
        }
        .animate-custom-spin { animation: customSpin 0.8s linear infinite; }
      `}</style>

      <div className="min-h-screen bg-[#FAFBFC] dark:bg-[#0a0f1a] text-[#0F172A] dark:text-slate-100 font-sans antialiased flex flex-col">

        {/* Navbar */}
        <nav className="sticky top-0 z-50 h-[72px] bg-white/90 dark:bg-[#0a0f1a]/90 backdrop-blur-md border-b border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between px-6 md:px-12 transition-all shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none">
          <div className="flex items-center gap-2.5">
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#0D9488', letterSpacing: '-1px' }}>
              Nutri<span style={{ color: '#3B82F6' }}>AI</span>
            </div>
          </div>
        </nav>

        {/* Page */}
        <div className="flex justify-center px-6 pt-10 pb-24 flex-1">
          <div className="w-full max-w-[720px]">

            {/* Back button */}
            <div className="min-h-[44px] flex items-center mb-4">
              {!isAnalyzing && (
                <button
                  className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#475569] dark:text-slate-400 hover:text-[#14B8A6] dark:hover:text-[#14B8A6] hover:bg-[#14B8A6]/10 dark:hover:bg-[#14B8A6]/10 rounded-[14px] px-3.5 py-2 transition-all duration-200"
                  onClick={handleBack}
                >
                  <ChevronLeft size={18} strokeWidth={2.5} /> Back
                </button>
              )}
            </div>

            {/* Progress */}
            {!isAnalyzing && step !== 6 && (
              <div className="mb-12 pl-1">
                <span className="block text-[14px] font-bold text-[#475569] dark:text-slate-500 mb-3 tracking-[0.04em] uppercase">
                  Step {step} of {TOTAL_STEPS}
                </span>
                <div className="h-[6px] bg-[#E2E8F0] dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#14B8A6] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
                  />
                </div>
              </div>
            )}

            {/* ── Step 1: Basic Identity ── */}
            {step === 1 && (
              <div className="flex flex-col gap-6 fade-in">
                <h1 className={titleClass}>Let's get to know you</h1>
                <div className="flex flex-col items-center gap-4 my-4">
                  <div
                    className="w-[120px] h-[120px] rounded-[32px] border-[3px] border-dashed border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-center cursor-pointer relative overflow-hidden transition-all duration-300 hover:border-[#14B8A6] hover:bg-[#FAFBFC] dark:hover:bg-[#14B8A6]/10 group shadow-[0_8px_24px_rgba(0,0,0,0.04)] dark:shadow-none"
                    onClick={() => fileRef.current.click()}
                  >
                    {photoPreview
                      ? <img src={photoPreview} alt="profile" className="w-full h-full object-cover" />
                      : <Camera size={34} strokeWidth={1.5} className="text-[#475569]/60 dark:text-slate-500" />}
                    <div className="absolute inset-0 bg-[#0F172A]/50 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <Camera size={20} color="#fff" strokeWidth={2} />
                    </div>
                  </div>
                  <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
                  <p className="text-[14px] font-medium text-[#475569] dark:text-slate-500 tracking-wide">Upload profile photo</p>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>First Name</label>
                    <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" className={inputClass} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Last Name</label>
                    <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" className={inputClass} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Date of Birth</label>
                    <div className="grid grid-cols-[0.6fr_1.2fr_0.8fr] gap-2.5">
                      <Select name="dobDay" value={formData.dobDay} onChange={handleChange} placeholder="Day" options={Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, '0'))} />
                      <Select name="dobMonth" value={formData.dobMonth} onChange={handleChange} placeholder="Month" options={['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']} />
                      <Select name="dobYear" value={formData.dobYear} onChange={handleChange} placeholder="Year" options={Array.from({ length: 80 }, (_, i) => String(new Date().getFullYear() - i))} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Gender</label>
                    <Select name="gender" value={formData.gender} onChange={handleChange} placeholder="Select gender" options={['Male', 'Female', 'Other']} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Phone Number</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+91 98765 43210" className={inputClass} />
                </div>
              </div>
            )}

            {/* ── Step 2: Body Metrics ── */}
            {step === 2 && (
              <div className="flex flex-col gap-6 fade-in">
                <div className="flex flex-col gap-2">
                  <h1 className={titleClass}>Your body metrics</h1>
                  <p className={subtitleClass}>We use these to calculate your personalised calorie targets</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-4">
                  {[
                    { label: 'Height', name: 'height', unit: 'cm', placeholder: '175' },
                    { label: 'Current Weight', name: 'weight', unit: 'kg', placeholder: '70' },
                    { label: 'Target Weight', name: 'targetWeight', unit: 'kg', placeholder: '65' },
                    { label: 'Daily Water Goal', name: 'waterGoal', unit: 'L', placeholder: '3' },
                  ].map(({ label, name, unit, placeholder }) => (
                    <div key={name} className="bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-[20px] p-6 flex flex-col gap-3.5 transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none focus-within:border-[#14B8A6] focus-within:ring-[3px] focus-within:ring-[#14B8A6]/10 dark:focus-within:ring-[#14B8A6]/15 focus-within:shadow-[0_8px_30px_rgba(20,184,166,0.12)] focus-within:-translate-y-1">
                      <label className="text-[13px] font-bold text-[#475569] dark:text-slate-400 uppercase tracking-[0.08em]">{label}</label>
                      <div className="flex items-baseline gap-2">
                        <input type="number" name={name} value={formData[name]} onChange={handleChange} placeholder={placeholder} className="w-full border-none outline-none text-[42px] font-extrabold tracking-[-0.03em] text-[#0F172A] dark:text-slate-100 bg-transparent placeholder-[#E2E8F0] dark:placeholder-slate-700" />
                        <span className="text-[16px] font-bold text-[#475569] dark:text-slate-500 whitespace-nowrap">{unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 3: Goal & Lifestyle ── */}
            {step === 3 && (
              <div className="flex flex-col gap-6 fade-in">
                <div className="flex flex-col gap-2">
                  <h1 className={titleClass}>What are you looking to achieve?</h1>
                  <p className={subtitleClass}>This helps us personalise your nutrition plan</p>
                </div>
                <div className="flex flex-col gap-2 mt-2">
                  <label className={labelClass}>Main Goal</label>
                  <Select name="mainGoal" value={formData.mainGoal} onChange={handleChange} placeholder="Select your goal"
                    options={['Fat Loss', 'Muscle Gain', 'Maintain Weight', 'Build Strength', 'Improve Endurance', 'General Fitness', 'Weight Gain', 'Body Recomposition']} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Activity Level</label>
                  <Select name="activityLevel" value={formData.activityLevel} onChange={handleChange} placeholder="Select activity level"
                    options={[
                      { value: 'Sedentary', label: 'Sedentary — Desk job, little to no exercise' },
                      { value: 'Lightly Active', label: 'Lightly Active — Light exercise 1–3 days/week' },
                      { value: 'Moderately Active', label: 'Moderately Active — Moderate exercise 3–5 days/week' },
                      { value: 'Very Active', label: 'Very Active — Hard exercise 6–7 days/week' },
                    ]} />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Occupation</label>
                    <Select name="occupation" value={formData.occupation} onChange={handleChange} placeholder="Select"
                      options={['Desk / Office Worker', 'Student', 'Healthcare Worker', 'Physical / Manual Labor', 'Homemaker', 'Freelancer / Remote', 'Other']} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Sleep Schedule</label>
                    <Select name="sleepSchedule" value={formData.sleepSchedule} onChange={handleChange} placeholder="Select"
                      options={['Less than 6 hours', '6–8 hours', 'More than 8 hours']} />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 4: Food & Health Profile ── */}
            {step === 4 && (
              <div className="flex flex-col gap-6 fade-in">
                <div className="flex flex-col gap-2">
                  <h1 className={titleClass}>Food & Health Profile</h1>
                  <p className={subtitleClass}>Help us understand your dietary needs and health background</p>
                </div>
                <div className="grid grid-cols-2 gap-5 mt-2">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Dietary Preference</label>
                    <Select name="dietaryPreference" value={formData.dietaryPreference} onChange={handleChange} placeholder="Select"
                      options={['Vegetarian', 'Vegan', 'Non-Vegetarian', 'Eggetarian', 'Pescatarian', 'Keto', 'Paleo']} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Preferred Cooking Oil</label>
                    <Select name="cookingOil" value={formData.cookingOil} onChange={handleChange} placeholder="Select"
                      options={['Olive Oil', 'Coconut Oil', 'Mustard Oil', 'Sunflower Oil', 'Ghee', 'Avocado Oil']} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Regional Culture</label>
                  <Select name="regionalCulture" value={formData.regionalCulture} onChange={handleChange} placeholder="Select your food culture"
                    options={['Bengali', 'Punjabi', 'South Indian', 'Gujarati / Rajasthani', 'Maharashtrian', 'North Indian', 'North-Eastern', 'Odia', 'Western / Continental', 'Other']} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Allergies</label>
                  <ChipGroup
                    items={['Peanuts', 'Dairy', 'Gluten', 'Soy', 'Shellfish', 'Tree Nuts', 'Eggs']}
                    selected={formData.allergies}
                    onToggle={(v) => toggleChip('allergies', v)}
                    onAdd={() => addCustom('allergies', 'customAllergy')}
                    addValue={formData.customAllergy}
                    onAddChange={(e) => set('customAllergy', e.target.value)}
                    placeholder="e.g. Egg"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Health Issues</label>
                  <ChipGroup
                    items={['Diabetes', 'PCOS', 'Thyroid', 'Hypertension', 'High Cholesterol', 'IBS', 'Anemia']}
                    selected={formData.healthIssues}
                    onToggle={(v) => toggleChip('healthIssues', v)}
                    onAdd={() => addCustom('healthIssues', 'customHealthIssue')}
                    addValue={formData.customHealthIssue}
                    onAddChange={(e) => set('customHealthIssue', e.target.value)}
                    placeholder="e.g. PCOS, Diabetes"
                  />
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Liked Foods (Optional)</label>
                    <textarea
                      name="likedFoods"
                      value={formData.likedFoods}
                      onChange={handleChange}
                      placeholder="e.g. Paneer, Chicken, Mango..."
                      className="w-full p-4 border border-[#E2E8F0] dark:border-slate-700 rounded-[20px] text-[15px] font-medium text-[#0F172A] dark:text-slate-100 bg-white dark:bg-slate-800 outline-none resize-y leading-relaxed transition-all duration-200 placeholder-[#475569]/50 dark:placeholder-slate-600 focus:border-[#14B8A6] focus:ring-[3px] focus:ring-[#14B8A6]/10 dark:focus:ring-[#14B8A6]/15 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                      rows={3}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Disliked Foods (Optional)</label>
                    <textarea
                      name="dislikedFoods"
                      value={formData.dislikedFoods}
                      onChange={handleChange}
                      placeholder="e.g. Bitter gourd, Mushrooms..."
                      className="w-full p-4 border border-[#E2E8F0] dark:border-slate-700 rounded-[20px] text-[15px] font-medium text-[#0F172A] dark:text-slate-100 bg-white dark:bg-slate-800 outline-none resize-y leading-relaxed transition-all duration-200 placeholder-[#475569]/50 dark:placeholder-slate-600 focus:border-[#14B8A6] focus:ring-[3px] focus:ring-[#14B8A6]/10 dark:focus:ring-[#14B8A6]/15 shadow-[0_2px_10px_rgba(0,0,0,0.02)]"
                      rows={3}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ── Step 5: Habits & Constraints ── */}
            {step === 5 && (
              <div className="flex flex-col gap-6 fade-in">
                <div className="flex flex-col gap-2">
                  <h1 className={titleClass}>Habits & Constraints</h1>
                  <p className={subtitleClass}>Fine-tune your plan around your daily routine</p>
                </div>
                <div className="grid grid-cols-2 gap-5 mt-2">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Meals per Day</label>
                    <Select name="mealsPerDay" value={formData.mealsPerDay} onChange={handleChange} placeholder="Select"
                      options={['2 Meals', '3 Meals', '4 Meals', '5+ Meals (with snacks)']} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Cooking Time Available</label>
                    <Select name="cookingTime" value={formData.cookingTime} onChange={handleChange} placeholder="Select"
                      options={['Under 15 mins', '15–30 mins', '30–60 mins', 'I love to cook']} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Grocery Budget</label>
                    <Select name="groceryBudget" value={formData.groceryBudget} onChange={handleChange} placeholder="Select"
                      options={['Standard (₹1,500–3,000/mo)', 'Medium (₹3,000–6,000/mo)', 'High (₹6,000+/mo)']} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className={labelClass}>Meal Location</label>
                    <Select name="mealLocation" value={formData.mealLocation} onChange={handleChange} placeholder="Select"
                      options={['Home-cooked', 'Office / Canteen', 'Mix of both', 'Mostly eating out']} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className={labelClass}>Main Carbs Preference</label>
                  <Select name="mainCarbs" value={formData.mainCarbs} onChange={handleChange} placeholder="Select"
                    options={['Rice', 'Roti / Chapati', 'Bread', 'Oats / Quinoa', 'Mixed']} />
                </div>
              </div>
            )}

            {/* ── Step 6: Magic Result ── */}
            {step === 6 && (
              <div className="flex flex-col items-center gap-6 text-center fade-in">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center gap-6 py-24">
                    <div className="w-14 h-14 border-[4px] border-[#E2E8F0] dark:border-slate-800 border-t-[#14B8A6] dark:border-t-[#14B8A6] rounded-full animate-custom-spin" />
                    <h2 className="text-[24px] font-bold tracking-[-0.02em] text-[#0F172A] dark:text-slate-100">NutriAI is analysing your profile…</h2>
                    <p className="text-[16px] font-medium text-[#475569] dark:text-slate-500">Crafting your personalised metabolic roadmap</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-6 w-full fade-in">
                    <div className="text-[56px] leading-none mb-2">🎉</div>
                    <div className="flex flex-col gap-2">
                      <h1 className={titleClass}>Your Profile is Ready!</h1>
                      <p className={subtitleClass}>Here's what we calculated based on your data</p>
                    </div>
                    <div className="grid grid-cols-2 gap-5 w-full mt-6">
                      <div className="bg-white dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-[24px] p-8 flex flex-col items-center gap-3 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-none">
                        <Activity size={28} color="#14B8A6" strokeWidth={2.5} />
                        <div className="text-[12px] font-bold text-[#475569] uppercase tracking-[0.08em]">Your BMI</div>
                        <div className="text-[44px] font-extrabold tracking-[-0.03em] leading-none" style={{ color: bmiInfo?.color }}>{formData.bmi}</div>
                        <div className="text-[12px] font-bold px-3 py-1 rounded-[10px]" style={{ background: bmiInfo?.color + '18', color: bmiInfo?.color }}>{bmiInfo?.label}</div>
                      </div>
                      <div className="border border-[#14B8A6]/30 bg-gradient-to-br from-[#14B8A6]/5 to-white dark:from-[#14B8A6]/10 dark:to-slate-800 rounded-[24px] p-8 flex flex-col items-center gap-3 text-center shadow-[0_8px_30px_rgba(20,184,166,0.1)] dark:shadow-none">
                        <Flame size={28} color="#F97316" strokeWidth={2.5} />
                        <div className="text-[12px] font-bold text-[#475569] dark:text-slate-400 uppercase tracking-[0.08em]">Daily Calorie Target</div>
                        <div className="flex flex-col items-center gap-1.5 w-full">
                          <div className="flex items-center gap-2 w-full justify-center">
                            <input
                              type="number"
                              name="calorieTarget"
                              value={formData.calorieTarget}
                              onChange={handleChange}
                              className="w-full max-w-[140px] h-[52px] px-3 border border-[#14B8A6]/40 dark:border-[#14B8A6]/30 rounded-[14px] outline-none text-[26px] font-extrabold tracking-[-0.02em] text-[#0F172A] dark:text-slate-100 bg-white dark:bg-slate-700 text-center focus:border-[#14B8A6] focus:ring-[3px] focus:ring-[#14B8A6]/15 transition-all duration-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            />
                            <span className="text-[15px] font-bold text-[#475569] dark:text-slate-400 shrink-0">kcal</span>
                          </div>
                          <div className="text-[11px] font-medium text-[#475569]/60 dark:text-slate-500">Tap to edit</div>
                        </div>
                      </div>
                    </div>
                    <button className="mt-8 px-12 py-5 text-[17px] font-bold text-white bg-[#14B8A6] rounded-[20px] shadow-[0_8px_24px_rgba(20,184,166,0.3)] hover:bg-[#0D9488] hover:shadow-[0_12px_32px_rgba(20,184,166,0.4)] hover:-translate-y-[2px] active:translate-y-0 transition-all duration-300" onClick={handleNext}>
                      Let's Start My Journey →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* ── Step 7: Pricing ── */}
            {step === 7 && (
              <div className="flex flex-col gap-6 fade-in">
                <div className="flex flex-col gap-2">
                  <h1 className="text-[34px] font-extrabold tracking-[-0.02em] text-[#0F172A] dark:text-slate-100 leading-tight text-center">Choose your plan</h1>
                  <p className="text-[16px] font-medium text-[#475569] dark:text-slate-400 leading-relaxed -mt-2.5 text-center">Unlock the full power of NutriAI tailored to your goals</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">

                  {/* Free */}
                  <div className={`bg-white dark:bg-slate-800 border rounded-[24px] p-8 flex flex-col gap-6 cursor-pointer relative transition-all duration-300 hover:border-[#14B8A6] hover:shadow-[0_12px_40px_rgba(20,184,166,0.12)] hover:-translate-y-1 ${formData.selectedPlan === 'Free' ? 'border-[#14B8A6] shadow-[0_0_0_4px_rgba(20,184,166,0.15),0_12px_40px_rgba(20,184,166,0.15)] dark:shadow-[0_0_0_4px_rgba(20,184,166,0.15)]' : 'border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border-slate-700'}`} onClick={() => set('selectedPlan', 'Free')}>
                    <div className="text-[20px] font-bold text-[#0F172A] dark:text-slate-100 tracking-[-0.01em]">Free</div>
                    <div className="text-[36px] font-extrabold text-[#0F172A] dark:text-slate-100 tracking-[-0.03em] leading-none">₹0<span className="text-[15px] font-bold text-[#475569] tracking-normal ml-1">/month</span></div>
                    <ul className="flex flex-col gap-3.5 flex-1 list-none mt-2">
                      {['Basic calorie tracking', 'Generic meal templates', 'Community access'].map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-[14px] font-semibold text-[#475569] dark:text-slate-400 leading-snug"><Check size={18} strokeWidth={3} className="text-[#14B8A6] shrink-0" />{f}</li>
                      ))}
                      {['AI Chat Guidance', 'Personalised meal plans', 'Priority support'].map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-[14px] font-semibold text-[#E2E8F0] dark:text-slate-600 leading-snug"><Check size={18} strokeWidth={3} className="text-[#FAFBFC] dark:text-slate-700 shrink-0" />{f}</li>
                      ))}
                    </ul>
                    <button className={`w-full h-[52px] rounded-[16px] border text-[15px] font-bold transition-all duration-300 mt-2 ${formData.selectedPlan === 'Free' ? 'bg-[#14B8A6] border-[#14B8A6] text-white shadow-[0_8px_20px_rgba(20,184,166,0.3)] hover:bg-[#0D9488]' : 'border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-slate-400 hover:border-[#14B8A6] hover:text-[#14B8A6] dark:hover:text-[#14B8A6]'}`}>
                      {formData.selectedPlan === 'Free' ? '✓ Selected' : 'Get Started'}
                    </button>
                  </div>

                  {/* Standard */}
                  <div className={`border rounded-[24px] p-8 flex flex-col gap-6 cursor-pointer relative transition-all duration-300 hover:border-[#14B8A6] hover:shadow-[0_12px_40px_rgba(20,184,166,0.12)] hover:-translate-y-1 bg-gradient-to-br from-[#14B8A6]/5 to-white dark:from-[#14B8A6]/10 dark:to-slate-800 ${formData.selectedPlan === 'Standard' ? 'border-[#14B8A6] shadow-[0_0_0_4px_rgba(20,184,166,0.15),0_12px_40px_rgba(20,184,166,0.15)] dark:shadow-[0_0_0_4px_rgba(20,184,166,0.15)]' : 'border-[#14B8A6]/40 shadow-[0_8px_24px_rgba(20,184,166,0.06)] dark:border-slate-700'}`} onClick={() => set('selectedPlan', 'Standard')}>
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#0F172A] dark:bg-[#14B8A6] text-white text-[12px] font-bold tracking-[0.06em] uppercase px-4 py-1.5 rounded-full whitespace-nowrap shadow-md">Most Popular</div>
                    <div className="text-[20px] font-bold text-[#0F172A] dark:text-slate-100 tracking-[-0.01em]">Standard</div>
                    <div className="text-[36px] font-extrabold text-[#0F172A] dark:text-slate-100 tracking-[-0.03em] leading-none">₹149<span className="text-[15px] font-bold text-[#475569] tracking-normal ml-1">/month</span></div>
                    <ul className="flex flex-col gap-3.5 flex-1 list-none mt-2">
                      {['Smart calorie & macro tracking', 'Personalised meal plans', 'Basic AI Chat Support', 'Weekly progress reports'].map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-[14px] font-semibold text-[#0F172A] dark:text-slate-300 leading-snug"><Check size={18} strokeWidth={3} className="text-[#14B8A6] shrink-0" />{f}</li>
                      ))}
                      {['24/7 Advanced AI Coach', 'Grocery list automation'].map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-[14px] font-semibold text-[#E2E8F0] dark:text-slate-600 leading-snug"><Check size={18} strokeWidth={3} className="text-[#FAFBFC] dark:text-slate-700 shrink-0" />{f}</li>
                      ))}
                    </ul>
                    <button className={`w-full h-[52px] rounded-[16px] border text-[15px] font-bold transition-all duration-300 mt-2 ${formData.selectedPlan === 'Standard' ? 'bg-[#14B8A6] border-[#14B8A6] text-white shadow-[0_8px_20px_rgba(20,184,166,0.3)] hover:bg-[#0D9488]' : 'border-[#14B8A6] bg-[#14B8A6] text-white hover:bg-[#0D9488]'}`}>
                      {formData.selectedPlan === 'Standard' ? '✓ Selected' : 'Get Started'}
                    </button>
                  </div>

                  {/* Premium */}
                  <div className={`border rounded-[24px] p-8 flex flex-col gap-6 cursor-pointer relative transition-all duration-300 hover:border-[#14B8A6] hover:shadow-[0_12px_40px_rgba(20,184,166,0.12)] hover:-translate-y-1 bg-gradient-to-br from-orange-50/50 to-white dark:from-orange-500/5 dark:to-slate-800 ${formData.selectedPlan === 'Premium' ? 'border-[#14B8A6] shadow-[0_0_0_4px_rgba(20,184,166,0.15),0_12px_40px_rgba(20,184,166,0.15)] dark:shadow-[0_0_0_4px_rgba(20,184,166,0.15)]' : 'border-[#E2E8F0] shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:border-slate-700'}`} onClick={() => set('selectedPlan', 'Premium')}>
                    <div className="text-[20px] font-bold text-[#0F172A] dark:text-slate-100 tracking-[-0.01em]">Premium</div>
                    <div className="text-[36px] font-extrabold text-[#0F172A] dark:text-slate-100 tracking-[-0.03em] leading-none">₹349<span className="text-[15px] font-bold text-[#475569] tracking-normal ml-1">/month</span></div>
                    <ul className="flex flex-col gap-3.5 flex-1 list-none mt-2">
                      {['Everything in Standard', '24/7 Advanced AI Coach', 'Grocery list automation', 'Custom recipe generation', '1-on-1 dietitian access', 'Priority support'].map(f => (
                        <li key={f} className="flex items-start gap-2.5 text-[14px] font-semibold text-[#0F172A] dark:text-slate-300 leading-snug"><Check size={18} strokeWidth={3} className="text-[#14B8A6] shrink-0" />{f}</li>
                      ))}
                    </ul>
                    <button className={`w-full h-[52px] rounded-[16px] border text-[15px] font-bold transition-all duration-300 mt-2 ${formData.selectedPlan === 'Premium' ? 'bg-[#14B8A6] border-[#14B8A6] text-white shadow-[0_8px_20px_rgba(20,184,166,0.3)] hover:bg-[#0D9488]' : 'border-[#E2E8F0] dark:border-slate-700 bg-white dark:bg-slate-900 text-[#0F172A] dark:text-slate-400 hover:border-[#14B8A6] hover:text-[#14B8A6] dark:hover:text-[#14B8A6]'}`}>
                      {formData.selectedPlan === 'Premium' ? '✓ Selected' : 'Get Started'}
                    </button>
                  </div>

                </div>
                {formData.selectedPlan && (
                  <div className="flex items-center justify-center mt-12 pt-8 border-t border-[#E2E8F0] dark:border-slate-800 fade-in">
                    <button className="w-full inline-flex items-center justify-center h-[60px] px-8 bg-[#14B8A6] text-white text-[17px] font-bold rounded-[20px] tracking-[-0.01em] transition-all duration-300 shadow-[0_8px_24px_rgba(20,184,166,0.3)] hover:bg-[#0D9488] hover:shadow-[0_12px_32px_rgba(20,184,166,0.4)] hover:-translate-y-[2px] active:translate-y-0" onClick={handleFinish}>
                      Continue to Dashboard →
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Footer actions for steps 1–5 */}
            {step < 6 && (
              <div className="flex items-center justify-between mt-12 pt-8 border-t border-[#E2E8F0] dark:border-slate-800">
                {isEditMode ? (
                  <button
                    className="text-[15px] font-bold text-[#475569] dark:text-slate-500 px-4 py-2.5 rounded-[14px] hover:text-[#0F172A] dark:hover:text-slate-300 hover:bg-[#FAFBFC] dark:hover:bg-slate-800 transition-all duration-200"
                    onClick={() => onBack && onBack()}
                  >Cancel</button>
                ) : (
                  <button className="text-[15px] font-bold text-[#475569] dark:text-slate-500 px-4 py-2.5 rounded-[14px] hover:text-[#0F172A] dark:hover:text-slate-300 hover:bg-[#FAFBFC] dark:hover:bg-slate-800 transition-all duration-200" onClick={handleNext}>Skip for now</button>
                )}
                <div className="flex items-center gap-3">
                  {isEditMode && (
                    <button
                      className="inline-flex items-center justify-center h-[52px] px-8 text-[#0D9488] text-[15px] font-bold rounded-[18px] border-2 border-[#14B8A6] hover:bg-[#14B8A6]/10 transition-all duration-200"
                      onClick={handleSaveChanges}
                    >
                      Save Changes
                    </button>
                  )}
                  <button
                    className={`inline-flex items-center justify-center h-[52px] px-10 text-white text-[16px] font-bold rounded-[18px] tracking-[-0.01em] transition-all duration-300 ${canProceed() ? 'bg-[#14B8A6] shadow-[0_8px_24px_rgba(20,184,166,0.3)] hover:bg-[#0D9488] hover:shadow-[0_12px_32px_rgba(20,184,166,0.4)] hover:-translate-y-[2px] active:translate-y-0' : 'bg-[#94A3B8] dark:bg-slate-700 cursor-not-allowed opacity-70'}`}
                    onClick={() => canProceed() && handleNext()}
                    disabled={!canProceed()}
                  >
                    {isEditMode ? 'Next →' : 'Continue'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
