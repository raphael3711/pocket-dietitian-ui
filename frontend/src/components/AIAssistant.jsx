import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Send, 
  Mic, 
  Bot, 
  User, 
  Sparkles,
  Clock,
  Heart,
  Target
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MOCK_CHAT_HISTORY, mockChatResponse } from '../services/mockData';
import { useToast } from '../hooks/use-toast';

const AIAssistant = ({ userSettings }) => {
  const [messages, setMessages] = useState(MOCK_CHAT_HISTORY);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!currentMessage.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: currentMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setCurrentMessage('');
    setIsTyping(true);

    try {
      const response = await mockChatResponse(currentMessage);
      
      const aiMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        message: response.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      toast({
        title: "Message Failed",
        description: "Could not send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    
    // Mock voice recognition
    setTimeout(() => {
      setIsListening(false);
      const voiceInputs = [
        "What should I eat for breakfast?",
        "How many calories should I consume daily?",
        "Can you suggest a healthy dinner recipe?",
        "What foods are good for weight loss?",
        "How can I increase my protein intake?"
      ];
      
      const randomInput = voiceInputs[Math.floor(Math.random() * voiceInputs.length)];
      setCurrentMessage(randomInput);
      
      toast({
        title: "Voice Recognized",
        description: "Voice input captured successfully!",
      });
    }, 2000);
  };

  const quickQuestions = [
    "What should I eat for breakfast?",
    "How many calories do I need?",
    "Suggest a healthy snack",
    "What's a good post-workout meal?",
    "How can I meal prep effectively?"
  ];

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getUserStats = () => {
    const profile = userSettings?.profile;
    if (!profile) return null;

    return {
      bmr: profile.bmr,
      goals: profile.goals,
      dietaryPreferences: profile.dietaryPreferences,
      healthConditions: profile.healthConditions
    };
  };

  const stats = getUserStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Nutritionist</h1>
        <p className="text-gray-600">
          Chat with your personal AI nutritionist for personalized advice
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* User Profile Summary */}
        <div className="lg:col-span-1 space-y-4">
          {stats && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Your Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.bmr && (
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-700">{stats.bmr}</div>
                      <div className="text-sm text-blue-600">Daily Calories</div>
                    </div>
                  )}
                  
                  {stats.goals && stats.goals.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Goals
                      </h4>
                      <div className="space-y-1">
                        {stats.goals.slice(0, 3).map((goal, index) => (
                          <Badge key={index} variant="outline" className="block text-xs">
                            {goal}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {stats.dietaryPreferences && stats.dietaryPreferences.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-1">
                        <Heart className="w-4 h-4" />
                        Diet Preferences
                      </h4>
                      <div className="space-y-1">
                        {stats.dietaryPreferences.slice(0, 3).map((pref, index) => (
                          <Badge key={index} variant="secondary" className="block text-xs">
                            {pref}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Quick Questions */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Quick Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {quickQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="w-full text-left h-auto p-2 text-xs"
                      onClick={() => setCurrentMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="flex-shrink-0 border-b">
                <CardTitle className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  AI Nutritionist
                  <Badge variant="secondary" className="ml-auto">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                    Online
                  </Badge>
                </CardTitle>
              </CardHeader>
              
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-0">
                <div className="p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message, index) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                          message.type === 'user' 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gradient-to-br from-purple-500 to-pink-600 text-white'
                        }`}>
                          {message.type === 'user' ? (
                            <User className="w-4 h-4" />
                          ) : (
                            <Bot className="w-4 h-4" />
                          )}
                        </div>
                        
                        <div className={`flex-1 max-w-xs lg:max-w-sm ${message.type === 'user' ? 'text-right' : ''}`}>
                          <div className={`inline-block p-3 rounded-lg ${
                            message.type === 'user'
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                          </div>
                          <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                            <Clock className="w-3 h-3" />
                            {formatTime(message.timestamp)}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </CardContent>
              
              {/* Input */}
              <div className="border-t p-4 flex-shrink-0">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVoiceInput}
                    disabled={isListening}
                    className="flex-shrink-0"
                  >
                    <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse text-red-500' : ''}`} />
                  </Button>
                  
                  <Input
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    placeholder="Ask me anything about nutrition..."
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    disabled={isTyping}
                  />
                  
                  <Button
                    onClick={sendMessage}
                    disabled={!currentMessage.trim() || isTyping}
                    className="flex-shrink-0 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;