import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import LanguageThemeSetup from "./components/LanguageThemeSetup";
import UserProfileSetup from "./components/UserProfileSetup";
import Dashboard from "./components/Dashboard";
import { Toaster } from "./components/ui/toaster";

function App() {
  const [currentStep, setCurrentStep] = useState('splash');
  const [userSettings, setUserSettings] = useState({
    language: 'en',
    theme: { name: 'Pure White', value: '#FFFFFF', text: '#000000' },
    profile: null
  });

  useEffect(() => {
    // Check if user has already completed setup
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const savedTheme = localStorage.getItem('selectedTheme');
    const savedProfile = localStorage.getItem('userProfile');

    if (savedLanguage && savedTheme && savedProfile) {
      setUserSettings({
        language: savedLanguage,
        theme: JSON.parse(savedTheme),
        profile: JSON.parse(savedProfile)
      });
      setCurrentStep('dashboard');
    }
  }, []);

  const handleSplashComplete = () => {
    setCurrentStep('language-theme');
  };

  const handleLanguageThemeComplete = (settings) => {
    setUserSettings(prev => ({
      ...prev,
      language: settings.language,
      theme: settings.theme
    }));
    setCurrentStep('profile-setup');
  };

  const handleProfileComplete = (profile) => {
    setUserSettings(prev => ({
      ...prev,
      profile: profile
    }));
    setCurrentStep('dashboard');
  };

  // Apply theme to document root
  useEffect(() => {
    if (userSettings.theme) {
      document.documentElement.style.setProperty('--theme-bg', userSettings.theme.value);
      document.documentElement.style.setProperty('--theme-text', userSettings.theme.text);
    }
  }, [userSettings.theme]);

  return (
    <div className="App">
      <BrowserRouter>
        {currentStep === 'splash' && (
          <SplashScreen onComplete={handleSplashComplete} />
        )}
        
        {currentStep === 'language-theme' && (
          <LanguageThemeSetup onComplete={handleLanguageThemeComplete} />
        )}
        
        {currentStep === 'profile-setup' && (
          <UserProfileSetup onComplete={handleProfileComplete} />
        )}
        
        {currentStep === 'dashboard' && (
          <Routes>
            <Route path="/*" element={<Dashboard userSettings={userSettings} />} />
          </Routes>
        )}
        
        <Toaster />
      </BrowserRouter>
    </div>
  );
}

export default App;