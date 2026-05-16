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
    daily_calories_consumed: 0,
    daily_protein: 0,
    daily_carbs: 0,
    daily_fat: 0,
    junk_score: 0,
    junk_count: 0,
    recent_weight_logs: []
  });


  const updateUserData = (data) => setUserData(prev => ({ ...prev, ...data }));

  // Called once when onboarding completes — seeds dashboard with real user data
  const saveOnboardingData = (data) => {
    setUserData(data);
    setUserMetrics(prev => ({
      ...prev,
      current_weight: parseFloat(data.weight) || prev.current_weight,
      target_weight: parseFloat(data.targetWeight) || prev.target_weight,
      daily_calorie_goal: data.calorieTarget || prev.daily_calorie_goal,
      water_goal: parseFloat(data.waterGoal) || prev.water_goal,
    }));
    setDailyLogs(prev => ({ ...prev, current_water: 0 }));
  };

  const updateWaterIntake = (amount) => {
    setDailyLogs(prev => ({
      ...prev,
      current_water: Math.min(parseFloat((prev.current_water + amount).toFixed(2)), userMetrics.water_goal)
    }));
  };

  const addMealLog = (meal) => {
    setDailyLogs(prev => {
      const newCount = prev.junk_count + 1;
      return {
        ...prev,
        daily_calories_consumed: prev.daily_calories_consumed + (meal.calories || 0),
        daily_protein: prev.daily_protein + (meal.protein || 0),
        daily_carbs: prev.daily_carbs + (meal.carbs || 0),
        daily_fat: prev.daily_fat + (meal.fat || 0),
        junk_score: parseFloat(((prev.junk_score * prev.junk_count + (meal.junkScore || 0)) / newCount).toFixed(1)),
        junk_count: newCount,
      };
    });
  };

  return (
    <UserContext.Provider value={{
      userData, setUserData, updateUserData, saveOnboardingData,
      dark, setDark,
      userMetrics, setUserMetrics,
      dailyLogs, setDailyLogs,
      updateWaterIntake, addMealLog
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);
