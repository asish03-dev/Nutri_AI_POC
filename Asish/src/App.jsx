import { useState } from "react";
import LandingPage   from "./components/LandingPage";
import LoginPage     from "./components/LoginPage";
import SignupPage    from "./components/SignupPage";
import LoadingScreen from "./components/LoadingScreen";
import Onboarding    from "./components/Onboarding";
import Profile       from "./components/Profile";

export default function App() {
  const [dark, setDark]                 = useState(false);
  const [loginOpen, setLogin]           = useState(false);
  const [signupOpen, setSignup]         = useState(false);
  const [loading, setLoading]           = useState(false);
  const [loadingType, setLoadingType]   = useState("login");
  const [showOnboarding, setOnboarding] = useState(false);
  const [showProfile, setProfile]       = useState(false);
  const [backTo, setBackTo]             = useState("signup");
  const [profileData, setProfileData]   = useState({});
  
  const [onboardingDone, setOnboardingDone] = useState(false);

  const openLogin  = () => { setSignup(false); setLogin(true);  };
  const openSignup = () => { setLogin(false);  setSignup(true); };

  function startLoading(type, closeModal) {
    closeModal();
    setLoadingType(type);
    setLoading(true);
    // Reset login/signup button submitting state is handled inside modals
    setTimeout(() => {
      setLoading(false);
      setBackTo(type);
      setOnboarding(true);
    }, 2200);
  }

  function handleOnboardingBack(target) {
    setOnboarding(false);
    if (target === "signup") openSignup();
    else if (target === "login") openLogin();
    else if (target === "profile") setProfile(true);
  }

  /* Onboarding complete with full data → mark done */
  function handleOnboardingComplete(data) {
    localStorage.setItem("nutriai_onboarded", "true");
    setProfileData(prev => ({ ...prev, ...data }));
    setOnboardingDone(true);
    setOnboarding(false);
    setProfile(true);
  }

  /* "Complete Profile" / "Edit Profile" on Profile page → reopen Onboarding pre-filled */
  function handleCompleteProfile() {
    setProfile(false);
    setOnboarding(true);
    setBackTo("profile");
  }

  function handleLogout() {
    setProfile(false);
    setOnboardingDone(false);
    setProfileData({});
  }

  return (
    <div className={dark ? "dark" : ""}>
      <div className="font-sans antialiased">

        {/* Landing page always rendered underneath */}
        {!showProfile && !showOnboarding && (
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
          onSubmit={() => startLoading("login", () => setLogin(false))}
        />
        <SignupPage
          open={signupOpen}
          onClose={() => setSignup(false)}
          dark={dark}
          onSwitchToLogin={openLogin}
          onSubmit={() => startLoading("signup", () => setSignup(false))}
        />

        <LoadingScreen visible={loading} type={loadingType} />

        {showOnboarding && (
          <Onboarding
            onComplete={handleOnboardingComplete}
            onBack={handleOnboardingBack}
            backTo={backTo}
            initialData={profileData}
          />
        )}

        {showProfile && (
          <Profile
            dark={dark}
            setDark={setDark}
            profileData={profileData}
            onboardingDone={onboardingDone}
            onCompleteProfile={handleCompleteProfile}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}
