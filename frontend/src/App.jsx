import React, { useState } from 'react';

// 1. Define the valid ranges based on your dataset
const RANGES = {
  anxiety_level: { min: 0, max: 21 },
  self_esteem: { min: 0, max: 30 },
  mental_health_history: { min: 0, max: 1 },
  depression: { min: 0, max: 27 },
  headache: { min: 0, max: 5 },
  blood_pressure: { min: 1, max: 3 },
  sleep_quality: { min: 0, max: 5 },
  breathing_problem: { min: 0, max: 5 },
  noise_level: { min: 0, max: 5 },
  living_conditions: { min: 0, max: 5 },
  safety: { min: 0, max: 5 },
  basic_needs: { min: 0, max: 5 },
  academic_performance: { min: 0, max: 5 },
  study_load: { min: 0, max: 5 },
  teacher_student_relationship: { min: 0, max: 5 },
  future_career_concerns: { min: 0, max: 5 },
  social_support: { min: 0, max: 3 },
  peer_pressure: { min: 0, max: 5 },
  extracurricular_activities: { min: 0, max: 5 },
  bullying: { min: 0, max: 5 }
};

const App = () => {
  const [formData, setFormData] = useState({
    anxiety_level: 10, self_esteem: 15, mental_health_history: 0, depression: 10,
    headache: 2, blood_pressure: 2, sleep_quality: 3, breathing_problem: 2,
    noise_level: 2, living_conditions: 3, safety: 3, basic_needs: 3,
    academic_performance: 3, study_load: 3, teacher_student_relationship: 3,
    future_career_concerns: 3, social_support: 2, peer_pressure: 3,
    extracurricular_activities: 3, bullying: 2
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState([]); // To track which fields are invalid

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: Number(value) });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    
    // --- VALIDATION LOGIC ---
    const errors = [];
    Object.keys(RANGES).forEach(key => {
      const val = formData[key];
      const { min, max } = RANGES[key];
      if (val < min || val > max) {
        errors.push(`${key.replace(/_/g, ' ')} must be between ${min} and ${max}`);
      }
    });

    if (errors.length > 0) {
      setFormErrors(errors);
      setPrediction(null); // Clear previous prediction
      window.scrollTo(0, 0); // Scroll up to see errors
      return;
    }

    setFormErrors([]); // Clear errors if validation passes
    setLoading(true);
    
    try {
      const featureArray = [
        formData.anxiety_level, formData.self_esteem, formData.mental_health_history,
        formData.depression, formData.headache, formData.blood_pressure,
        formData.sleep_quality, formData.breathing_problem, formData.noise_level,
        formData.living_conditions, formData.safety, formData.basic_needs,
        formData.academic_performance, formData.study_load, formData.teacher_student_relationship,
        formData.future_career_concerns, formData.social_support, formData.peer_pressure,
        formData.extracurricular_activities, formData.bullying
      ];
      
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ features: featureArray }),
      });
      const data = await response.json();
      setPrediction(data.stress_level);
    } catch (error) {
      alert("Error: Is your Flask backend running?");
    }
    setLoading(false);
  };

  const getResultColor = () => {
    if (prediction === 0) return "text-green-800 bg-green-100 border-green-500";
    if (prediction === 1) return "text-yellow-800 bg-yellow-100 border-yellow-500";
    if (prediction === 2) return "text-red-800 bg-red-100 border-red-500";
    return "";
  };

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 font-sans">
      <div className="max-w-6xl mx-auto bg-white shadow-2xl rounded-[2rem] overflow-hidden border border-slate-200">
        
        <div className="bg-indigo-700 p-10 text-white text-center">
          <h1 className="text-5xl font-black tracking-tight mb-2 uppercase">Stress Predictor</h1>
          <p className="text-indigo-200 text-lg font-bold tracking-widest">INPUT VALIDATION ENABLED</p>
        </div>

        {/* --- ERROR DISPLAY --- */}
        {formErrors.length > 0 && (
          <div className="m-8 p-6 bg-red-50 border-l-8 border-red-500 rounded-r-xl">
            <h3 className="text-red-700 font-bold mb-2 text-xl">⚠️ Please fix the following errors:</h3>
            <ul className="list-disc ml-6 text-red-600 font-medium">
              {formErrors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handlePredict} className="p-8 lg:p-12 space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Section title="Psychological" icon="🧠">
              <Input label="Anxiety (0-21)" name="anxiety_level" val={formData.anxiety_level} onChange={handleChange} isInvalid={formData.anxiety_level < 0 || formData.anxiety_level > 21} />
              <Input label="Self Esteem (0-30)" name="self_esteem" val={formData.self_esteem} onChange={handleChange} isInvalid={formData.self_esteem < 0 || formData.self_esteem > 30} />
              <Input label="Depression (0-27)" name="depression" val={formData.depression} onChange={handleChange} isInvalid={formData.depression < 0 || formData.depression > 27} />
              <Input label="MH History (0/1)" name="mental_health_history" val={formData.mental_health_history} onChange={handleChange} isInvalid={formData.mental_health_history < 0 || formData.mental_health_history > 1} />
            </Section>

            <Section title="Physical" icon="💪">
              <Input label="Sleep Quality (0-5)" name="sleep_quality" val={formData.sleep_quality} onChange={handleChange} isInvalid={formData.sleep_quality < 0 || formData.sleep_quality > 5} />
              <Input label="Headache (0-5)" name="headache" val={formData.headache} onChange={handleChange} isInvalid={formData.headache < 0 || formData.headache > 5} />
              <Input label="BP Level (1-3)" name="blood_pressure" val={formData.blood_pressure} onChange={handleChange} isInvalid={formData.blood_pressure < 1 || formData.blood_pressure > 3} />
              <Input label="Breathing (0-5)" name="breathing_problem" val={formData.breathing_problem} onChange={handleChange} isInvalid={formData.breathing_problem < 0 || formData.breathing_problem > 5} />
            </Section>

            <Section title="Academic" icon="🎓">
              <Input label="Performance (0-5)" name="academic_performance" val={formData.academic_performance} onChange={handleChange} isInvalid={formData.academic_performance < 0 || formData.academic_performance > 5} />
              <Input label="Study Load (0-5)" name="study_load" val={formData.study_load} onChange={handleChange} isInvalid={formData.study_load < 0 || formData.study_load > 5} />
              <Input label="Teacher Rel (0-5)" name="teacher_student_relationship" val={formData.teacher_student_relationship} onChange={handleChange} isInvalid={formData.teacher_student_relationship < 0 || formData.teacher_student_relationship > 5} />
              <Input label="Career Concern (0-5)" name="future_career_concerns" val={formData.future_career_concerns} onChange={handleChange} isInvalid={formData.future_career_concerns < 0 || formData.future_career_concerns > 5} />
            </Section>

            <Section title="Social/Env" icon="🏠">
              <Input label="Social Support (0-3)" name="social_support" val={formData.social_support} onChange={handleChange} isInvalid={formData.social_support < 0 || formData.social_support > 3} />
              <Input label="Peer Pressure (0-5)" name="peer_pressure" val={formData.peer_pressure} onChange={handleChange} isInvalid={formData.peer_pressure < 0 || formData.peer_pressure > 5} />
              <Input label="Extracurricular (0-5)" name="extracurricular_activities" val={formData.extracurricular_activities} onChange={handleChange} isInvalid={formData.extracurricular_activities < 0 || formData.extracurricular_activities > 5} />
              <Input label="Bullying (0-5)" name="bullying" val={formData.bullying} onChange={handleChange} isInvalid={formData.bullying < 0 || formData.bullying > 5} />
            </Section>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl grid grid-cols-1 md:grid-cols-4 gap-6 border border-slate-200">
            <Input label="Noise Level (0-5)" name="noise_level" val={formData.noise_level} onChange={handleChange} isInvalid={formData.noise_level < 0 || formData.noise_level > 5} />
            <Input label="Living Cond (0-5)" name="living_conditions" val={formData.living_conditions} onChange={handleChange} isInvalid={formData.living_conditions < 0 || formData.living_conditions > 5} />
            <Input label="Safety (0-5)" name="safety" val={formData.safety} onChange={handleChange} isInvalid={formData.safety < 0 || formData.safety > 5} />
            <Input label="Basic Needs (0-5)" name="basic_needs" val={formData.basic_needs} onChange={handleChange} isInvalid={formData.basic_needs < 0 || formData.basic_needs > 5} />
          </div>

          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-2xl hover:bg-indigo-700 transition shadow-2xl transform active:scale-95"
          >
            {loading ? "CHECKING..." : "GENERATE REPORT"}
          </button>
        </form>

        {prediction !== null && (
          <div className={`mx-8 mb-12 p-10 rounded-[2rem] border-4 text-center animate-in fade-in zoom-in duration-500 ${getResultColor()}`}>
            <h2 className="text-5xl font-black mb-4 tracking-tighter">
              {prediction === 0 && "LEVEL 0: LOW STRESS 😊"}
              {prediction === 1 && "LEVEL 1: MEDIUM STRESS ⚠️"}
              {prediction === 2 && "LEVEL 2: HIGH STRESS 🆘"}
            </h2>
            <p className="text-2xl font-medium max-w-2xl mx-auto">
              {prediction === 0 && "Your results indicate a healthy stress-to-lifestyle balance. Keep it up!"}
              {prediction === 1 && "You are showing signs of moderate stress. Consider taking a break."}
              {prediction === 2 && "Warning: High burnout levels detected. Please prioritize rest."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <div className="space-y-4">
    <h3 className="text-xl font-bold text-slate-700 flex items-center gap-2 border-b-2 border-slate-100 pb-2">
      <span>{icon}</span> {title}
    </h3>
    {children}
  </div>
);

const Input = ({ label, name, val, onChange, isInvalid }) => (
  <div className="flex flex-col">
    <label className={`text-[10px] font-black uppercase mb-1 ml-1 ${isInvalid ? 'text-red-500' : 'text-slate-400'}`}>{label}</label>
    <input 
      type="number" name={name} value={val} onChange={onChange}
      className={`bg-white border-2 p-3 rounded-xl outline-none font-bold text-slate-700 transition shadow-sm ${isInvalid ? 'border-red-500 bg-red-50 animate-pulse' : 'border-slate-100 focus:border-indigo-500'}`}
    />
  </div>
);

export default App;