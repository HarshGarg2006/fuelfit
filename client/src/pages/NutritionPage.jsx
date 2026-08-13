import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiActivity, FiZap, FiTarget, FiAward, FiCheck, FiArrowRight, FiInfo } from 'react-icons/fi';

export default function NutritionPage() {
  // Calculator States
  const [gender, setGender] = useState('male');
  const [age, setAge] = useState(22);
  const [weight, setWeight] = useState(70); // in kg
  const [height, setHeight] = useState(175); // in cm
  const [activity, setActivity] = useState('moderate');
  const [goal, setGoal] = useState('muscle-gain');
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState(null);

  const calculateMacros = (e) => {
    e.preventDefault();

    // Harris-Benedict BMR Calculation
    let bmr = 0;
    if (gender === 'male') {
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    // Activity Multiplier
    const multipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9,
    };

    let tdee = bmr * (multipliers[activity] || 1.55);

    // Goal Adjustments
    let targetCalories = tdee;
    let proteinGrams = weight * 2.0; // 2g per kg

    if (goal === 'muscle-gain') {
      targetCalories = tdee + 350; // Surplus
      proteinGrams = weight * 2.2;
    } else if (goal === 'fat-loss') {
      targetCalories = tdee - 450; // Deficit
      proteinGrams = weight * 2.4; // Higher protein to preserve muscle
    } else if (goal === 'strength') {
      targetCalories = tdee + 200;
      proteinGrams = weight * 2.2;
    }

    const proteinCalories = proteinGrams * 4;
    const fatGrams = (targetCalories * 0.25) / 9;
    const fatCalories = fatGrams * 9;
    const carbCalories = Math.max(0, targetCalories - proteinCalories - fatCalories);
    const carbGrams = carbCalories / 4;

    setResults({
      tdee: Math.round(tdee),
      calories: Math.round(targetCalories),
      protein: Math.round(proteinGrams),
      carbs: Math.round(carbGrams),
      fats: Math.round(fatGrams),
    });

    setCalculated(true);
  };

  const supplementStacks = [
    {
      goalName: 'Lean Muscle Building Stack',
      icon: '💪',
      badge: 'Most Popular',
      color: 'border-neon-red/30 bg-neon-red/5',
      products: [
        { name: 'FuelFit 100% Whey Isolate', role: 'Post-Workout Rapid Recovery (27g Protein)', link: '/products?category=whey-protein' },
        { name: 'Micronized Creatine Monohydrate', role: 'ATP Cellular Energy & Muscle Volume (3g daily)', link: '/products?category=creatine' },
        { name: 'Multivitamins & Omega-3', role: 'Joint Support & Micronutrient Absorption', link: '/products?category=vitamins' }
      ]
    },
    {
      goalName: 'Fat Shred & Definition Stack',
      icon: '🔥',
      badge: 'High Metabolism',
      color: 'border-neon-orange/30 bg-neon-orange/5',
      products: [
        { name: 'Thermogenic Fat Burner', role: 'Appetite Control & Accelerated Calorie Burn', link: '/products?category=fat-burner' },
        { name: 'Hydrolyzed Whey Protein Isolate', role: 'Zero Carb / Zero Sugar Lean Muscle Preservation', link: '/products?category=whey-protein' },
        { name: 'BCAA & Electrolytes', role: 'Intra-Workout Hydration & Anti-Catabolic Shield', link: '/products?category=accessories' }
      ]
    },
    {
      goalName: 'Maximum Strength & Performance',
      icon: '⚡',
      badge: 'Explosive Power',
      color: 'border-neon-blue/30 bg-neon-blue/5',
      products: [
        { name: 'High-Stim Explosive Pre-Workout', role: 'L-Citrulline + Beta Alanine for Maximum Pumps', link: '/products?category=pre-workout' },
        { name: 'Mass & Strength Gainer', role: 'Caloric Surplus with Complex Carbohydrates', link: '/products?category=mass-gainer' },
        { name: 'Creatine Creapure®', role: 'Peak Power Output & Heavy Lifting Stamina', link: '/products?category=creatine' }
      ]
    }
  ];

  return (
    <div className="py-8 fade-in">
      <div className="page-container">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="badge badge-orange mb-3">🔥 FUEL SCIENCE & DIET MATRIX</span>
          <h1 className="font-heading text-4xl sm:text-5xl font-extrabold mb-4">
            Nutrition & Macro <span className="gradient-text">Calculator</span>
          </h1>
          <p className="text-dark-200 text-base leading-relaxed">
            Calculate your precise Daily Caloric Needs, Protein Requirements, and customized Supplement Stacks designed for maximum athletic performance.
          </p>
        </div>

        {/* Macro Calculator Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
          <div className="lg:col-span-6 glass-card p-6 md:p-8">
            <h2 className="font-heading text-xl font-bold mb-6 flex items-center gap-2">
              <FiActivity className="text-neon-red" /> Enter Your Body Metrics
            </h2>

            <form onSubmit={calculateMacros} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-dark-100 mb-1.5 uppercase tracking-wider">Gender</label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${gender === 'male' ? 'bg-neon-red text-white shadow-lg shadow-neon-red/30' : 'bg-dark-700 text-dark-200 hover:text-white'}`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${gender === 'female' ? 'bg-neon-red text-white shadow-lg shadow-neon-red/30' : 'bg-dark-700 text-dark-200 hover:text-white'}`}
                    >
                      Female
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-dark-100 mb-1.5 uppercase tracking-wider">Age (Years)</label>
                  <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    min="14"
                    max="80"
                    required
                    className="input-field !py-2.5 text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-dark-100 mb-1.5 uppercase tracking-wider">Weight (kg)</label>
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(Number(e.target.value))}
                    min="35"
                    max="200"
                    required
                    className="input-field !py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-dark-100 mb-1.5 uppercase tracking-wider">Height (cm)</label>
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(Number(e.target.value))}
                    min="120"
                    max="230"
                    required
                    className="input-field !py-2.5 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-100 mb-1.5 uppercase tracking-wider">Activity Level</label>
                <select
                  value={activity}
                  onChange={(e) => setActivity(e.target.value)}
                  className="input-field !py-2.5 text-sm cursor-pointer"
                >
                  <option value="sedentary">Sedentary (Desk job, minimal exercise)</option>
                  <option value="light">Light Activity (1-3 gym workouts/week)</option>
                  <option value="moderate">Moderate Activity (3-5 intense workouts/week)</option>
                  <option value="active">High Activity (6-7 workouts/week, heavy lifting)</option>
                  <option value="very_active">Athlete / 2x Workouts Daily</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-dark-100 mb-1.5 uppercase tracking-wider">Primary Fitness Goal</label>
                <select
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="input-field !py-2.5 text-sm cursor-pointer"
                >
                  <option value="muscle-gain">Lean Muscle Hypertrophy (+350 kcal)</option>
                  <option value="fat-loss">Fat Loss & Definition (-450 kcal)</option>
                  <option value="strength">Strength & Power Output (+200 kcal)</option>
                  <option value="maintenance">Maintenance & Longevity (TDEE)</option>
                </select>
              </div>

              <button type="submit" className="btn-primary w-full !py-3.5 mt-2 font-bold tracking-wide">
                Calculate My Nutrition Matrix →
              </button>
            </form>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-6 flex flex-col justify-between glass-card p-6 md:p-8">
            <div>
              <h2 className="font-heading text-xl font-bold mb-4 flex items-center gap-2">
                <FiZap className="text-neon-orange" /> Your Daily Nutritional Blueprint
              </h2>

              {calculated && results ? (
                <div className="space-y-6 fade-in">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-neon-red/10 to-neon-orange/10 border border-neon-red/20 text-center">
                    <p className="text-xs uppercase tracking-widest text-dark-200 mb-1">Target Daily Caloric Intake</p>
                    <div className="font-heading text-4xl font-extrabold gradient-text">
                      {results.calories} <span className="text-lg text-white font-normal">kcal/day</span>
                    </div>
                    <p className="text-xs text-dark-200 mt-1">Maintenance TDEE: {results.tdee} kcal</p>
                  </div>

                  {/* Macros Breakdown Grid */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-dark-700 border border-white/5 text-center">
                      <p className="text-[11px] uppercase tracking-wider text-neon-red font-bold">Protein</p>
                      <p className="font-heading text-2xl font-bold text-white mt-1">{results.protein}g</p>
                      <p className="text-[11px] text-dark-200 mt-0.5">{Math.round((results.protein * 4 / results.calories) * 100)}% calories</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-dark-700 border border-white/5 text-center">
                      <p className="text-[11px] uppercase tracking-wider text-neon-blue font-bold">Carbs</p>
                      <p className="font-heading text-2xl font-bold text-white mt-1">{results.carbs}g</p>
                      <p className="text-[11px] text-dark-200 mt-0.5">{Math.round((results.carbs * 4 / results.calories) * 100)}% calories</p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-dark-700 border border-white/5 text-center">
                      <p className="text-[11px] uppercase tracking-wider text-neon-orange font-bold">Healthy Fats</p>
                      <p className="font-heading text-2xl font-bold text-white mt-1">{results.fats}g</p>
                      <p className="text-[11px] text-dark-200 mt-0.5">{Math.round((results.fats * 9 / results.calories) * 100)}% calories</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-xs text-dark-100 leading-relaxed flex items-start gap-3">
                    <FiInfo className="text-neon-green shrink-0 mt-0.5" size={16} />
                    <span>
                      <strong>FuelFit Nutrition Advisory:</strong> To hit <strong>{results.protein}g protein</strong> effortlessly without excess digestive stress, take 1-2 scoops of FuelFit Whey Isolate daily alongside whole food protein sources (Eggs, Chicken, Paneer, Tofu).
                    </span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 text-dark-200 space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-3xl">
                    📊
                  </div>
                  <p className="font-semibold text-white">No Metrics Calculated Yet</p>
                  <p className="text-xs max-w-sm mx-auto">
                    Fill in your age, bodyweight, and workout target on the left to get your customized science-backed macro roadmap.
                  </p>
                </div>
              )}
            </div>

            {calculated && (
              <Link to="/products?category=whey-protein" className="btn-secondary !py-3 text-center text-sm mt-6 font-semibold flex items-center justify-center gap-2">
                Browse Recommended Supplements for Your Goal <FiArrowRight />
              </Link>
            )}
          </div>
        </div>

        {/* Supplement Stacks by Goal */}
        <div className="mb-16">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h2 className="section-title !mb-2">Recommended <span className="gradient-text">Supplement Stacks</span></h2>
            <p className="text-dark-200 text-sm">Formulated for synergy, bio-availability, and peak athletic output.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {supplementStacks.map((stack, i) => (
              <div key={i} className={`glass-card p-6 border rounded-2xl flex flex-col justify-between transition-all hover:scale-[1.02] ${stack.color}`}>
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-3xl">{stack.icon}</span>
                    <span className="badge badge-red text-xs">{stack.badge}</span>
                  </div>
                  <h3 className="font-heading text-lg font-bold text-white mb-4">{stack.goalName}</h3>

                  <div className="space-y-3 mb-6">
                    {stack.products.map((p, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-dark-800/80 border border-white/5">
                        <Link to={p.link} className="font-semibold text-xs text-white hover:text-neon-red flex items-center justify-between">
                          {p.name} <FiArrowRight size={12} />
                        </Link>
                        <p className="text-[11px] text-dark-200 mt-1">{p.role}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <Link to="/products" className="btn-primary !py-2.5 text-center text-xs font-bold tracking-wide">
                  Explore Full Stack Catalog →
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 100% Authenticity Guarantee Banner */}
        <div className="glass-card p-8 text-center rounded-2xl border-neon-green/30 bg-neon-green/5">
          <div className="max-w-xl mx-auto">
            <span className="badge badge-green mb-3">🛡️ ZERO COMPROMISE AUTHENTICITY</span>
            <h3 className="font-heading text-2xl font-bold mb-2">Every Scoop Is Tested & Lab Verified</h3>
            <p className="text-dark-200 text-xs leading-relaxed mb-6">
              FuelFit products are imported directly from certified brand distributors. Each container has an authenticity scratch hologram code that links to the official NABL certificate.
            </p>
            <Link to="/request" className="btn-secondary !py-2.5 !px-6 text-xs">
              Need a Custom Diet / Stack Consultation? Request Here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
