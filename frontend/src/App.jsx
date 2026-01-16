import React, { useState, useCallback, useMemo, memo } from 'react';

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

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    // Allow empty string or convert to number, handling leading zeros
    setFormData(prev => ({
      ...prev,
      [name]: value === '' ? '' : Number(value)
    }));
  }, []);

  const handlePredict = async (e) => {
    e.preventDefault();
    
    // --- VALIDATION LOGIC ---
    const errors = [];
    Object.keys(RANGES).forEach(key => {
      const val = formData[key];
      const { min, max } = RANGES[key];
      
      // Check if field is empty or undefined
      if (val === '' || val === null || val === undefined) {
        errors.push(`⚠️ ${key.replace(/_/g, ' ')} cannot be empty! Please enter a value.`);
      } else if (val < min || val > max) {
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
      
      const response = await fetch('https://Arnab2546A.pythonanywhere.com/predict', {
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

  const getResultColor = useMemo(() => {
    if (prediction === 0) return "text-green-800 bg-green-100 border-green-500";
    if (prediction === 1) return "text-yellow-800 bg-yellow-100 border-yellow-500";
    if (prediction === 2) return "text-red-800 bg-red-100 border-red-500";
    return "";
  }, [prediction]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-950 to-slate-950 py-12 px-4 font-sans relative overflow-hidden">
      {/* Animated Gaming Background Elements - Optimized for mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-20 left-10 w-96 h-96 bg-cyan-500/10 rounded-full md:blur-3xl blur-2xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-blue-500/10 rounded-full md:blur-3xl blur-2xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      {/* Mobile-optimized background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none md:hidden">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500/5 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-500/5 rounded-full blur-xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Hero Header */}
        <div className="text-center mb-6 md:mb-10 animate-fade-in px-2">
          <div className="relative inline-block">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-wide leading-tight text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400">
              <span className="block sm:inline">BURNOUT</span>
              <span className="hidden sm:inline"> </span>
              <span className="block sm:inline">CALCULATOR</span>
            </h1>
            <div className="absolute inset-0 md:blur-2xl blur-lg bg-gradient-to-r from-emerald-400/20 via-teal-400/20 to-cyan-400/20 md:animate-pulse -z-10"></div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-950/95 to-black/95 md:backdrop-blur-2xl backdrop-blur-sm md:shadow-[0_0_60px_rgba(0,0,0,0.8)] shadow-[0_0_30px_rgba(0,0,0,0.6)] rounded-3xl overflow-hidden border-4 border-cyan-500/30 md:hover:border-cyan-400/50 md:hover:shadow-[0_0_80px_rgba(6,182,212,0.4)] transition-all duration-300 animate-slide-up">

        {/* --- ERROR DISPLAY --- */}
        {formErrors.length > 0 && (
          <div className="m-4 md:m-8 p-4 md:p-6 bg-gradient-to-r from-red-950/80 to-orange-950/80 border-l-4 border-red-600 rounded-2xl md:shadow-[0_0_40px_rgba(220,38,38,0.4)] shadow-[0_0_20px_rgba(220,38,38,0.3)] md:backdrop-blur-sm backdrop-blur-none animate-shake">
            <div className="flex items-start gap-2 md:gap-3">
              <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-red-600 rounded-full flex items-center justify-center md:animate-bounce md:shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                <span className="text-white text-2xl md:text-3xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h3 className="text-red-300 font-black mb-2 md:mb-3 text-xl md:text-2xl tracking-wide drop-shadow-lg">🚨 FIX THESE ERRORS!</h3>
                <ul className="space-y-1 md:space-y-2">
                  {formErrors.map((err, index) => (
                    <li key={index} className="flex items-start gap-2 text-red-200 font-bold text-sm md:text-base">
                      <span className="text-red-400 mt-1">▶</span>
                      <span>{err}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handlePredict} className="p-4 sm:p-6 md:p-8 lg:p-12 space-y-6 md:space-y-8 lg:space-y-10">
          {/* Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
            <Section title="PSYCHOLOGICAL" icon="🧠" color="from-cyan-500 to-blue-600" delay="0">
              <Input label="Anxiety (0-21)" name="anxiety_level" val={formData.anxiety_level} onChange={handleChange} isInvalid={formData.anxiety_level < 0 || formData.anxiety_level > 21} />
              <Input label="Self Esteem (0-30)" name="self_esteem" val={formData.self_esteem} onChange={handleChange} isInvalid={formData.self_esteem < 0 || formData.self_esteem > 30} />
              <Input label="Depression (0-27)" name="depression" val={formData.depression} onChange={handleChange} isInvalid={formData.depression < 0 || formData.depression > 27} />
              <Input label="MH History (0/1)" name="mental_health_history" val={formData.mental_health_history} onChange={handleChange} isInvalid={formData.mental_health_history < 0 || formData.mental_health_history > 1} />
            </Section>

            <Section title="PHYSICAL" icon="💪" color="from-blue-500 to-indigo-600" delay="100">
              <Input label="Sleep Quality (0-5)" name="sleep_quality" val={formData.sleep_quality} onChange={handleChange} isInvalid={formData.sleep_quality < 0 || formData.sleep_quality > 5} />
              <Input label="Headache (0-5)" name="headache" val={formData.headache} onChange={handleChange} isInvalid={formData.headache < 0 || formData.headache > 5} />
              <Input label="BP Level (1-3)" name="blood_pressure" val={formData.blood_pressure} onChange={handleChange} isInvalid={formData.blood_pressure < 1 || formData.blood_pressure > 3} />
              <Input label="Breathing (0-5)" name="breathing_problem" val={formData.breathing_problem} onChange={handleChange} isInvalid={formData.breathing_problem < 0 || formData.breathing_problem > 5} />
            </Section>

            <Section title="ACADEMIC" icon="🎓" color="from-indigo-500 to-purple-600" delay="200">
              <Input label="Performance (0-5)" name="academic_performance" val={formData.academic_performance} onChange={handleChange} isInvalid={formData.academic_performance < 0 || formData.academic_performance > 5} />
              <Input label="Study Load (0-5)" name="study_load" val={formData.study_load} onChange={handleChange} isInvalid={formData.study_load < 0 || formData.study_load > 5} />
              <Input label="Teacher Rel (0-5)" name="teacher_student_relationship" val={formData.teacher_student_relationship} onChange={handleChange} isInvalid={formData.teacher_student_relationship < 0 || formData.teacher_student_relationship > 5} />
              <Input label="Career Concern (0-5)" name="future_career_concerns" val={formData.future_career_concerns} onChange={handleChange} isInvalid={formData.future_career_concerns < 0 || formData.future_career_concerns > 5} />
            </Section>

            <Section title="SOCIAL/ENV" icon="🏠" color="from-purple-500 to-pink-600" delay="300">
              <Input label="Social Support (0-3)" name="social_support" val={formData.social_support} onChange={handleChange} isInvalid={formData.social_support < 0 || formData.social_support > 3} />
              <Input label="Peer Pressure (0-5)" name="peer_pressure" val={formData.peer_pressure} onChange={handleChange} isInvalid={formData.peer_pressure < 0 || formData.peer_pressure > 5} />
              <Input label="Extracurricular (0-5)" name="extracurricular_activities" val={formData.extracurricular_activities} onChange={handleChange} isInvalid={formData.extracurricular_activities < 0 || formData.extracurricular_activities > 5} />
              <Input label="Bullying (0-5)" name="bullying" val={formData.bullying} onChange={handleChange} isInvalid={formData.bullying < 0 || formData.bullying > 5} />
            </Section>
          </div>

          {/* Environmental Section */}
          <div className="bg-gradient-to-br from-gray-950/80 to-black/80 p-6 sm:p-8 rounded-3xl border-4 border-cyan-500/30 md:shadow-[0_0_40px_rgba(6,182,212,0.3)] shadow-[0_0_20px_rgba(6,182,212,0.2)] md:backdrop-blur-sm md:hover:border-cyan-400/40 md:hover:shadow-[0_0_60px_rgba(6,182,212,0.4)] transition-all duration-300 md:hover:scale-[1.02] animate-slide-up" style={{animationDelay: '400ms'}}>
            <div className="mb-6 flex flex-col sm:flex-row items-center justify-center text-center gap-3">
              <span className="text-3xl sm:text-4xl md:text-5xl animate-float">🌍</span>
              <h3 className="text-xl sm:text-2xl md:text-2xl font-black uppercase tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] bg-gradient-to-r from-cyan-400 to-blue-400 text-transparent bg-clip-text">
                <span className="leading-tight">ENVIRONMENTAL</span>
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 lg:gap-6">
              <Input label="Noise Level (0-5)" name="noise_level" val={formData.noise_level} onChange={handleChange} isInvalid={formData.noise_level < 0 || formData.noise_level > 5} />
              <Input label="Living Conditions (0-5)" name="living_conditions" val={formData.living_conditions} onChange={handleChange} isInvalid={formData.living_conditions < 0 || formData.living_conditions > 5} />
              <Input label="Safety (0-5)" name="safety" val={formData.safety} onChange={handleChange} isInvalid={formData.safety < 0 || formData.safety > 5} />
              <Input label="Basic Needs (0-5)" name="basic_needs" val={formData.basic_needs} onChange={handleChange} isInvalid={formData.basic_needs < 0 || formData.basic_needs > 5} />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button 
              type="submit" 
              disabled={loading}
              className="max-w-xs bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 text-white px-8 md:px-10 py-4 md:py-5 rounded-full font-bold text-lg md:text-xl md:shadow-[0_0_30px_rgba(6,182,212,0.4)] shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all duration-200 transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group border-2 border-cyan-400/30 md:hover:border-emerald-400"
            >
            <span className="relative z-10 tracking-wide md:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 md:h-6 md:w-6" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>ANALYZING...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="text-2xl">🚀</span>
                  <span>START SCAN</span>
                </span>
              )}
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </form>

        {prediction !== null && (
          <div className={`mx-4 md:mx-8 mb-8 p-6 md:p-8 rounded-2xl border-2 text-center md:shadow-[0_0_40px_rgba(0,0,0,0.4)] shadow-[0_0_20px_rgba(0,0,0,0.3)] transition-all duration-300 md:transform md:hover:scale-[1.02] animate-result-appear ${getResultColor}`}>
            <div className="space-y-3 md:space-y-4">
              <div className="text-5xl md:text-6xl mb-3 animate-bounce-in">
                {prediction === 0 && "✅"}
                {prediction === 1 && "⚠️"}
                {prediction === 2 && "🚨"}
              </div>
              <div className="relative">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black mb-3 tracking-tight uppercase drop-shadow-2xl leading-tight">
                  {prediction === 0 && "LOW STRESS"}
                  {prediction === 1 && "MODERATE STRESS"}
                  {prediction === 2 && "HIGH STRESS"}
                </h2>
                <div className="absolute -inset-1 bg-current blur-2xl opacity-20 animate-pulse"></div>
              </div>
              <p className="text-sm md:text-base font-bold leading-relaxed px-2">
                {prediction === 0 && "Your results indicate a healthy stress-to-lifestyle balance. Keep it up!"}
                {prediction === 1 && "You are showing signs of moderate stress. Consider taking a break."}
                {prediction === 2 && "Warning: High burnout levels detected. Please prioritize rest."}
              </p>
              <div className="pt-3 md:pt-4 flex items-center justify-center gap-2 text-xs md:text-sm font-black uppercase tracking-wide">
                <span className="w-2 h-2 bg-current rounded-full animate-ping"></span>
                <span>STATUS LEVEL: {prediction}</span>
                <span className="w-2 h-2 bg-current rounded-full animate-ping" style={{animationDelay: '300ms'}}></span>
              </div>
            </div>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

const Section = memo(({ title, icon, color, delay, children }) => (
  <div className="bg-gradient-to-br from-gray-950/95 to-black/95 rounded-2xl p-5 md:p-6 md:shadow-[0_0_40px_rgba(0,0,0,0.8)] shadow-[0_0_20px_rgba(0,0,0,0.6)] border-3 border-cyan-500/20 md:hover:border-cyan-400/40 md:hover:shadow-[0_0_60px_rgba(6,182,212,0.3)] transition-all duration-300 md:hover:scale-[1.05] animate-slide-up" style={{animationDelay: `${delay}ms`}}>
    <div className="mb-4 flex flex-col items-center justify-center text-center">
      <div className="flex items-center justify-center gap-3 mb-3">
        <span className="text-3xl sm:text-4xl md:text-5xl animate-float">{icon}</span>
      </div>
      <h3 className={`text-xl sm:text-2xl md:text-2xl font-black uppercase tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] bg-gradient-to-r ${color} text-transparent bg-clip-text`}>
        <span className="leading-tight">{title}</span>
      </h3>
    </div>
    <div className="space-y-3 md:space-y-4">
      {children}
    </div>
  </div>
));

const Input = memo(({ label, name, val, onChange, isInvalid }) => (
  <div className="flex flex-col group">
    <label className={`text-xs sm:text-sm font-black uppercase mb-2 ml-1 tracking-wider transition-colors ${
      isInvalid ? 'text-red-400 md:animate-pulse' : 'text-gray-400 group-focus-within:text-cyan-400'
    }`}>
      {label}
    </label>
    <input 
      type="number" 
      name={name} 
      value={val} 
      onChange={onChange}
      className={`bg-gradient-to-br from-gray-950 to-black border-3 p-4 rounded-xl outline-none font-bold text-lg md:text-xl text-white transition-all duration-200 ${
        isInvalid 
          ? 'border-red-500 bg-red-950/30 md:shadow-[0_0_30px_rgba(220,38,38,0.6)] shadow-[0_0_15px_rgba(220,38,38,0.4)] md:animate-pulse' 
          : 'border-cyan-500/30 focus:border-cyan-400 md:focus:shadow-[0_0_30px_rgba(6,182,212,0.4)] focus:shadow-[0_0_15px_rgba(6,182,212,0.3)] md:hover:border-cyan-400/50 md:hover:bg-gray-900'
      }`}
    />
  </div>
));

export default App;