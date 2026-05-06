import { useState, useEffect } from "react";
import LandingPage   from "./components/LandingPage";
import LoginPage     from "./components/LoginPage";
import SignupPage    from "./components/SignupPage";
import LoadingScreen from "./components/LoadingScreen";
import Onboarding    from "./components/Onboarding";
import Profile       from "./components/Profile";
import Dashboard     from "./components/Dashboard";
import MainLayout        from "./components/MainLayout";
import WeeklyReportModal from "./components/WeeklyReportModal";
import SuccessScreen     from "./components/SuccessScreen";
import { useUser }       from "./context/UserContext";

export default function App() {
  const { saveOnboardingData } = useUser();
  const [dark, setDark]                 = useState(false);
  const [loginOpen, setLogin]           = useState(false);
  const [signupOpen, setSignup]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [loadingType, setLoadingType]   = useState("login");
  const [showOnboarding, setOnboarding] = useState(false);
  const [backTo, setBackTo]             = useState("signup");
  const [profileData, setProfileData]   = useState(() => {
    const saved = localStorage.getItem("nutriai_profile_data");
    return saved ? JSON.parse(saved) : {};
  });
  
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [currentView, setCurrentView]       = useState("dashboard");
  const [showReport, setShowReport]         = useState(false);

  // Hydrate UserContext on initial load if we have saved data
  useEffect(() => {
    if (onboardingDone && Object.keys(profileData).length > 0) {
      saveOnboardingData(profileData);
    }
  }, []);

  const openLogin  = () => { setSignup(false); setLogin(true);  };
  const openSignup = () => { setLogin(false);  setSignup(true); };

  function startLoading(type, closeModal) {
    closeModal();
    setLoadingType(type);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setBackTo(type);
      setOnboarding(true);
    }, 2200);
  }

  /* Onboarding complete with full data → mark done */
  function handleOnboardingComplete(data) {
    localStorage.setItem("nutriai_profile_data", JSON.stringify(data));
    setProfileData(prev => ({ ...prev, ...data }));
    saveOnboardingData(data);
    setOnboarding(false);
    if (backTo === 'profile') {
      // Editing existing profile — go straight back, no success screen
      setCurrentView('profile');
    } else {
      // First-time onboarding — show success screen
      setShowSuccessScreen(true);
    }
    window.scrollTo(0, 0);
  }

  function handleSuccessComplete() {
    localStorage.setItem("nutriai_onboarded", "true");
    setShowSuccessScreen(false);
    setOnboardingDone(true);
    setCurrentView("dashboard");
  }

  /* "Complete Profile" / "Edit Profile" on Profile page → reopen Onboarding pre-filled */
  function handleCompleteProfile() {
    setBackTo("profile");
    setOnboarding(true);
  }

  function handleOnboardingBack(target) {
    setOnboarding(false);
    if (backTo === 'profile') {
      // Cancel from edit mode — just return to profile
      setCurrentView('profile');
    } else if (target === "signup") openSignup();
    else if (target === "login") openLogin();
  }

  function handleLogout() {
    localStorage.removeItem("nutriai_onboarded");
    localStorage.removeItem("nutriai_profile_data");
    setOnboardingDone(false);
    setProfileData({});
    setCurrentView("dashboard");
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="font-sans antialiased text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 transition-colors duration-300">

        {/* Landing page always rendered underneath */}
        {!onboardingDone && !showOnboarding && (
          <LandingPage
            dark={dark}
            setDark={setDark}
            onLoginClick={openLogin}
            onSignupClick={openSignup}
          />
        )}

        <LoginPage
          open={loginOpen}
          onClose={() => setLogin(false)}
          dark={dark}
          onSwitchToSignup={openSignup}
          onSubmit={() => { setLogin(false); startLoading("login", () => {}); }}
        />
        <SignupPage
          open={signupOpen}
          onClose={() => setSignup(false)}
          dark={dark}
          onSwitchToLogin={openLogin}
          onSubmit={() => { setSignup(false); startLoading("signup", () => {}); }}
        />

        <LoadingScreen visible={loading} type={loadingType} dark={dark} />

        {showOnboarding && (
          <Onboarding
            dark={dark}
            setDark={setDark}
            onComplete={handleOnboardingComplete}
            onBack={handleOnboardingBack}
            backTo={backTo}
            initialData={backTo === 'profile' && Object.keys(profileData).length > 0 ? profileData : null}
          />
        )}

        {onboardingDone && !showOnboarding && (
          <MainLayout
            dark={dark}
            setDark={setDark}
            profileData={profileData}
            activeNav={currentView}
            onNavigate={setCurrentView}
            onLogout={handleLogout}
            onUpgrade={() => setCurrentView('plans')}
            onOpenReport={() => setShowReport(true)}
          >
            {currentView === 'dashboard' && <Dashboard dark={dark} />}
            {currentView === 'meal-logs' && <Dashboard dark={dark} />}
            {currentView === 'nia' && <Dashboard dark={dark} />}
            {(currentView === 'profile' || currentView === 'plans' || currentView === 'settings') && (
              <Profile
                dark={dark}
                profileData={profileData}
                onboardingDone={onboardingDone}
                onCompleteProfile={handleCompleteProfile}
                activeTab={currentView}
              />
            )}
          </MainLayout>
        )}

        {/* Success Transition Screen */}
        {showSuccessScreen && <SuccessScreen onGetStarted={handleSuccessComplete} />}

        {/* Weekly Report Modal */}
        {showReport && <WeeklyReportModal onClose={() => setShowReport(false)} />}
      </div>
    </div>
  );
}
