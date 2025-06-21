import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, User, Target, Heart, Activity } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const UserProfileSetup = ({ onComplete }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    weight: '',
    height: '',
    gender: '',
    activityLevel: 'moderate',
    dietaryPreferences: [],
    healthConditions: [],
    allergies: [],
    goals: []
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [isListening, setIsListening] = useState('');

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Keto', 'Paleo', 'Mediterranean', 
    'Gluten-Free', 'Dairy-Free', 'Low-Carb', 'High-Protein'
  ];

  const healthConditions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Thyroid Issues',
    'PCOS', 'Pregnancy', 'Breastfeeding', 'Post-Surgery Recovery'
  ];

  const allergyOptions = [
    'Nuts', 'Shellfish', 'Eggs', 'Dairy', 'Soy', 'Wheat', 'Fish'
  ];

  const goalOptions = [
    'Weight Loss', 'Weight Gain', 'Muscle Building', 'Maintenance',
    'Improved Energy', 'Better Digestion', 'Athletic Performance'
  ];

  const handleVoiceInput = (field) => {
    setIsListening(field);
    // Mock voice recognition
    setTimeout(() => {
      setIsListening('');
      // Simulate voice input based on field
      const mockInputs = {
        name: 'John Doe',
        age: '28',
        weight: '70',
        height: '175'
      };
      if (mockInputs[field]) {
        setFormData(prev => ({ ...prev, [field]: mockInputs[field] }));
      }
    }, 2000);
  };

  const handleCheckboxChange = (category, value) => {
    setFormData(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(item => item !== value)
        : [...prev[category], value]
    }));
  };

  const calculateBMR = () => {
    const { weight, height, age, gender } = formData;
    if (!weight || !height || !age || !gender) return null;
    
    const w = parseFloat(weight);
    const h = parseFloat(height);
    const a = parseFloat(age);
    
    // Mifflin-St Jeor Equation
    const bmr = gender === 'male' 
      ? 10 * w + 6.25 * h - 5 * a + 5
      : 10 * w + 6.25 * h - 5 * a - 161;
    
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    
    return Math.round(bmr * activityMultipliers[formData.activityLevel]);
  };

  const handleComplete = () => {
    const profileData = {
      ...formData,
      bmr: calculateBMR(),
      createdAt: new Date().toISOString()
    };
    
    localStorage.setItem('userProfile', JSON.stringify(profileData));
    onComplete(profileData);
  };

  const steps = [
    {
      title: 'Basic Information',
      icon: <User className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <div className="flex gap-2">
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter your name"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVoiceInput('name')}
                disabled={isListening === 'name'}
              >
                <Mic className={`w-4 h-4 ${isListening === 'name' ? 'animate-pulse text-red-500' : ''}`} />
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age</Label>
              <div className="flex gap-2">
                <Input
                  id="age"
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Age"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVoiceInput('age')}
                  disabled={isListening === 'age'}
                >
                  <Mic className={`w-4 h-4 ${isListening === 'age' ? 'animate-pulse text-red-500' : ''}`} />
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Gender</Label>
              <RadioGroup
                value={formData.gender}
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value }))}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="male" id="male" />
                  <Label htmlFor="male">Male</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="female" id="female" />
                  <Label htmlFor="female">Female</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="weight">Weight (kg)</Label>
              <div className="flex gap-2">
                <Input
                  id="weight"
                  type="number"
                  value={formData.weight}
                  onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder="Weight"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVoiceInput('weight')}
                  disabled={isListening === 'weight'}
                >
                  <Mic className={`w-4 h-4 ${isListening === 'weight' ? 'animate-pulse text-red-500' : ''}`} />
                </Button>
              </div>
            </div>
            
            <div>
              <Label htmlFor="height">Height (cm)</Label>
              <div className="flex gap-2">
                <Input
                  id="height"
                  type="number"
                  value={formData.height}
                  onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
                  placeholder="Height"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVoiceInput('height')}
                  disabled={isListening === 'height'}
                >
                  <Mic className={`w-4 h-4 ${isListening === 'height' ? 'animate-pulse text-red-500' : ''}`} />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Activity Level',
      icon: <Activity className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Label>How active are you?</Label>
          <RadioGroup
            value={formData.activityLevel}
            onValueChange={(value) => setFormData(prev => ({ ...prev, activityLevel: value }))}
          >
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="sedentary" id="sedentary" />
                <Label htmlFor="sedentary" className="cursor-pointer">
                  <span className="font-medium">Sedentary</span> - Little or no exercise
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="light" id="light" />
                <Label htmlFor="light" className="cursor-pointer">
                  <span className="font-medium">Lightly Active</span> - Light exercise 1-3 days/week
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="moderate" id="moderate" />
                <Label htmlFor="moderate" className="cursor-pointer">
                  <span className="font-medium">Moderately Active</span> - Moderate exercise 3-5 days/week
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="active" id="active" />
                <Label htmlFor="active" className="cursor-pointer">
                  <span className="font-medium">Very Active</span> - Hard exercise 6-7 days/week
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="very_active" id="very_active" />
                <Label htmlFor="very_active" className="cursor-pointer">
                  <span className="font-medium">Super Active</span> - Very hard exercise, training 2x/day
                </Label>
              </div>
            </div>
          </RadioGroup>
        </div>
      )
    },
    {
      title: 'Dietary Preferences',
      icon: <Heart className="w-6 h-6" />,
      content: (
        <div className="space-y-6">
          <div>
            <Label className="text-base font-medium">Dietary Preferences</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {dietaryOptions.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`diet-${option}`}
                    checked={formData.dietaryPreferences.includes(option)}
                    onCheckedChange={() => handleCheckboxChange('dietaryPreferences', option)}
                  />
                  <Label htmlFor={`diet-${option}`} className="text-sm cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Health Conditions</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {healthConditions.map((condition) => (
                <div key={condition} className="flex items-center space-x-2">
                  <Checkbox
                    id={`health-${condition}`}
                    checked={formData.healthConditions.includes(condition)}
                    onCheckedChange={() => handleCheckboxChange('healthConditions', condition)}
                  />
                  <Label htmlFor={`health-${condition}`} className="text-sm cursor-pointer">
                    {condition}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium">Allergies</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {allergyOptions.map((allergy) => (
                <div key={allergy} className="flex items-center space-x-2">
                  <Checkbox
                    id={`allergy-${allergy}`}
                    checked={formData.allergies.includes(allergy)}
                    onCheckedChange={() => handleCheckboxChange('allergies', allergy)}
                  />
                  <Label htmlFor={`allergy-${allergy}`} className="text-sm cursor-pointer">
                    {allergy}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Goals',
      icon: <Target className="w-6 h-6" />,
      content: (
        <div className="space-y-4">
          <Label className="text-base font-medium">What are your health goals?</Label>
          <div className="grid grid-cols-2 gap-2">
            {goalOptions.map((goal) => (
              <div key={goal} className="flex items-center space-x-2">
                <Checkbox
                  id={`goal-${goal}`}
                  checked={formData.goals.includes(goal)}
                  onCheckedChange={() => handleCheckboxChange('goals', goal)}
                />
                <Label htmlFor={`goal-${goal}`} className="text-sm cursor-pointer">
                  {goal}
                </Label>
              </div>
            ))}
          </div>
          
          {calculateBMR() && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Your Estimated Daily Calories</h3>
              <p className="text-2xl font-bold text-blue-700">{calculateBMR()} kcal/day</p>
              <p className="text-sm text-blue-600 mt-1">
                Based on your activity level and profile
              </p>
            </div>
          )}
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4">
      <div className="max-w-2xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Set Up Your Profile
          </h1>
          
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    index <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-400'
                  }`}
                >
                  {step.icon}
                </div>
              ))}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
              ></div>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {steps[currentStep].icon}
                {steps[currentStep].title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {steps[currentStep].content}
            </CardContent>
          </Card>

          <div className="flex justify-between mt-8">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
            >
              Previous
            </Button>
            
            {currentStep < steps.length - 1 ? (
              <Button
                onClick={() => setCurrentStep(currentStep + 1)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleComplete}
                className="bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700"
              >
                Complete Setup
              </Button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserProfileSetup;