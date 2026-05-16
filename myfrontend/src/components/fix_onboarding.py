import sys
import re

file_path = r'c:\Users\Piyush Sharma\Dev\hackathon\Nutri_AI_POC\myfrontend\src\components\Onboarding.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

old_handle_finish = '''  const handleFinish = async () => {
    setErrorMsg("");
    const age = formData.dobYear ? new Date().getFullYear() - parseInt(formData.dobYear) : '';
    if (onComplete) onComplete({
      // computed / display fields
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      age,
      try{
        const response = await axios.post("http://10.135.4.38:8000/api/onboarding/", {
          firstName: formData.firstName,
          lastName: formData.lastName,
          dobDay: formData.dobDay,
          dobMonth: formData.dobMonth,
          dobYear: formData.dobYear,
          phone: formData.activityLevel,
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
      );
        console.log("Success:", response.data);
        onComplete(formData, true);
      });
  }catch (error) {
    setErrorMsg("Something went wrong. Please try again later");
  }

};'''

new_handle_finish = '''  const handleFinish = async () => {
    setErrorMsg("");
    
    try {
      const response = await axios.post("http://10.135.4.38:8000/api/onboarding/", {
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
      
      console.log("Success:", response.data);
      
      if (onComplete) {
        onComplete({
          ...formData,
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          age: formData.dobYear ? new Date().getFullYear() - parseInt(formData.dobYear) : ''
        }, true);
      }
    } catch (error) {
      console.error("Error submitting onboarding data:", error);
      setErrorMsg("Something went wrong. Please try again later");
    }
  };'''

def normalize(s):
    return s.replace('\r\n', '\n')

content_normalized = normalize(content)
old_handle_finish_normalized = normalize(old_handle_finish)

if old_handle_finish_normalized in content_normalized:
    content_normalized = content_normalized.replace(old_handle_finish_normalized, new_handle_finish)
else:
    print('Failed to find handleFinish block.')

content_normalized = content_normalized.replace(
    normalize('const [photoPreview, setPhotoPreview] = useState(initialData?.photo || null);\n  const fileRef = useRef();'),
    'const [photoPreview, setPhotoPreview] = useState(initialData?.photo || null);\n  const [errorMsg, setErrorMsg] = useState("");\n  const fileRef = useRef();'
)

content_normalized = content_normalized.replace(
    normalize('<div className="flex items-center justify-center mt-12 pt-8 border-t border-[#E2E8F0] dark:border-slate-800 fade-in">\n                  <button className="w-full inline-flex items-center justify-center h-[60px]'),
    '<div className="flex flex-col items-center justify-center mt-12 pt-8 border-t border-[#E2E8F0] dark:border-slate-800 fade-in">\n                  {errorMsg && (\n                    <div className="mb-4 text-red-500 text-sm font-medium">\n                      {errorMsg}\n                    </div>\n                  )}\n                  <button className="w-full inline-flex items-center justify-center h-[60px]'
)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content_normalized)
print('Done!')
