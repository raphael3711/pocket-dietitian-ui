import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Mic } from 'lucide-react';
import { SUPPORTED_LANGUAGES, COLOR_THEMES } from '../services/mockData';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const LanguageThemeSetup = ({ onComplete }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedTheme, setSelectedTheme] = useState(COLOR_THEMES[0]);
  const [isListening, setIsListening] = useState(false);

  const handleVoiceLanguageSelection = () => {
    setIsListening(true);
    // Mock voice recognition
    setTimeout(() => {
      setIsListening(false);
      // Simulate voice selection
      const randomLang = SUPPORTED_LANGUAGES[Math.floor(Math.random() * SUPPORTED_LANGUAGES.length)];
      setSelectedLanguage(randomLang.code);
    }, 2000);
  };

  const handleContinue = () => {
    // Save preferences to localStorage
    localStorage.setItem('selectedLanguage', selectedLanguage);
    localStorage.setItem('selectedTheme', JSON.stringify(selectedTheme));
    onComplete({ language: selectedLanguage, theme: selectedTheme });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Customize Your Experience
          </h1>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Language Selection */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  🌍 Select Your Language
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVoiceLanguageSelection}
                    disabled={isListening}
                    className="ml-auto"
                  >
                    <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse text-red-500' : ''}`} />
                    {isListening ? 'Listening...' : 'Voice'}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 max-h-80 overflow-y-auto">
                  {SUPPORTED_LANGUAGES.map((language) => (
                    <motion.button
                      key={language.code}
                      onClick={() => setSelectedLanguage(language.code)}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                        selectedLanguage === language.code
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{language.flag}</span>
                        <span className="text-sm font-medium">{language.name}</span>
                        {selectedLanguage === language.code && (
                          <Check className="w-4 h-4 text-blue-500 ml-auto" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Theme Selection */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>🎨 Choose Your Theme</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {COLOR_THEMES.map((theme, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setSelectedTheme(theme)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        selectedTheme.value === theme.value
                          ? 'border-blue-500 ring-2 ring-blue-200'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        backgroundColor: theme.value,
                        color: theme.text
                      }}
                    >
                      <div className="text-center">
                        <div className="text-sm font-medium mb-1">{theme.name}</div>
                        <div className="text-xs opacity-75">{theme.value}</div>
                        {selectedTheme.value === theme.value && (
                          <Check className="w-4 h-4 mx-auto mt-1" />
                        )}
                      </div>
                    </motion.button>
                  ))}
                </div>
                
                {/* Theme Preview */}
                <div className="mt-6 p-4 rounded-lg border" style={{
                  backgroundColor: selectedTheme.value,
                  color: selectedTheme.text
                }}>
                  <h3 className="font-semibold mb-2">Preview</h3>
                  <p className="text-sm">This is how your app will look with the selected theme.</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <motion.div
            className="flex justify-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <Button
              onClick={handleContinue}
              className="px-8 py-3 text-lg bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Continue Setup
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LanguageThemeSetup;