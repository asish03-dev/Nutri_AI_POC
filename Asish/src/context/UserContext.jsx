import { createContext, useContext, useState } from 'react';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null);
  const [dark, setDark] = useState(false);
  
  // New state for Onboarding & Dashboard data
  const [userMetrics, setUserMetrics] = useState({
    current_weight: 0,
    target_weight: 0,
    goal_type: 'loss',
    daily_calorie_goal: 1920,
    water_goal: 3.0,
  });

  const [dailyLogs, setDailyLogs] = useState({
    current_water: 2.4,
    daily_calories_consumed: 1480,
    junk_score: 8.5,
    recent_weight_logs: []
  });

  const updateUserData = (data) => setUserData(prev => ({ ...prev, ...data }));

  // Called once when onboarding completes — seeds dashboard with real user data
  const saveOnboardingData = (data) => {
    setUserData(data);
    setUserMetrics(prev => ({
      ...prev,
      current_weight:      parseFloat(data.weight)       || prev.current_weight,
      target_weight:       parseFloat(data.targetWeight) || prev.target_weight,
      daily_calorie_goal:  data.calorieTarget            || prev.daily_calorie_goal,
      water_goal:          parseFloat(data.waterGoal)    || prev.water_goal,
    }));
    setDailyLogs(prev => ({ ...prev, current_water: 0 }));
  };
  
  // Real-time update function for water
  const updateWaterIntake = (amount) => {
    setDailyLogs(prev => ({
      ...prev,
      current_water: Math.min(parseFloat((prev.current_water + amount).toFixed(2)), userMetrics.water_goal)
    }));
    // TODO: Send update to backend here
  };

  return (
    <UserContext.Provider value={{ 
      userData, setUserData, updateUserData, saveOnboardingData,
      dark, setDark,
      userMetrics, setUserMetrics,
      dailyLogs, setDailyLogs,
      updateWaterIntake
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
