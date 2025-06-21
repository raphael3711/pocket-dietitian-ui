import React, { useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  Scan, 
  ShoppingCart, 
  Archive, 
  MessageCircle, 
  Users, 
  Settings,
  Camera,
  ChefHat,
  Package
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import ProductScanner from './ProductScanner';
import RecipeGenerator from './RecipeGenerator';
import ShoppingList from './ShoppingList';
import InventoryManager from './InventoryManager';
import AIAssistant from './AIAssistant';
import Community from './Community';

const Dashboard = ({ userSettings }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('home');

  const handleTabChange = (tab, path) => {
    setActiveTab(tab);
    navigate(path);
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/' },
    { id: 'scanner', label: 'Scan', icon: Scan, path: '/scan' },
    { id: 'recipes', label: 'Recipes', icon: ChefHat, path: '/recipes' },
    { id: 'shopping', label: 'Shopping', icon: ShoppingCart, path: '/shopping' },
    { id: 'inventory', label: 'Pantry', icon: Package, path: '/inventory' },
    { id: 'ai', label: 'AI Assistant', icon: MessageCircle, path: '/ai' },
    { id: 'community', label: 'Community', icon: Users, path: '/community' }
  ];

  const HomeContent = () => {
    const profile = userSettings.profile;
    const todayDate = new Date().toLocaleDateString();

    return (
      <div className="space-y-6">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-blue-600 text-white p-6 rounded-lg"
        >
          <h1 className="text-2xl font-bold mb-2">
            Welcome back, {profile?.name || 'User'}! 👋
          </h1>
          <p className="opacity-90">
            Today is {todayDate}. Let's maintain your healthy lifestyle!
          </p>
        </motion.div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-700">Daily Calories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-800">
                  {profile?.bmr || 2000}
                </div>
                <p className="text-sm text-blue-600">Recommended intake</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-700">Scanned Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-800">47</div>
                <p className="text-sm text-green-600">This week</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-700">Recipes Tried</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-800">12</div>
                <p className="text-sm text-purple-600">This month</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 hover:bg-green-50 hover:border-green-300"
                  onClick={() => handleTabChange('scanner', '/scan')}
                >
                  <Camera className="w-8 h-8 text-green-600" />
                  <span className="text-sm">Scan Product</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 hover:bg-blue-50 hover:border-blue-300"
                  onClick={() => handleTabChange('recipes', '/recipes')}
                >
                  <ChefHat className="w-8 h-8 text-blue-600" />
                  <span className="text-sm">Get Recipes</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 hover:bg-purple-50 hover:border-purple-300"
                  onClick={() => handleTabChange('ai', '/ai')}
                >
                  <MessageCircle className="w-8 h-8 text-purple-600" />
                  <span className="text-sm">Ask AI</span>
                </Button>
                
                <Button
                  variant="outline"
                  className="h-24 flex flex-col gap-2 hover:bg-orange-50 hover:border-orange-300"
                  onClick={() => handleTabChange('inventory', '/inventory')}
                >
                  <Package className="w-8 h-8 text-orange-600" />
                  <span className="text-sm">Check Pantry</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Goals Progress */}
        {profile?.goals && profile.goals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {profile.goals.map((goal, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{goal}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.floor(Math.random() * 100)}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">
                          {Math.floor(Math.random() * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">🥗</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">
                Диетолог в кармане
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-sm text-gray-600">
                {userSettings.profile?.name}
              </div>
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {/* Sidebar Navigation */}
          <nav className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4">
                <div className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;
                    
                    return (
                      <Button
                        key={item.id}
                        variant={isActive ? "default" : "ghost"}
                        className={`w-full justify-start gap-3 ${
                          isActive 
                            ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white' 
                            : 'hover:bg-gray-100'
                        }`}
                        onClick={() => handleTabChange(item.id, item.path)}
                      >
                        <Icon className="w-5 h-5" />
                        {item.label}
                      </Button>
                    );
                  })}
                </div>
              </div>
            </div>
          </nav>

          {/* Main Content */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomeContent />} />
              <Route path="/scan" element={<ProductScanner />} />
              <Route path="/recipes" element={<RecipeGenerator />} />
              <Route path="/shopping" element={<ShoppingList />} />
              <Route path="/inventory" element={<InventoryManager />} />
              <Route path="/ai" element={<AIAssistant userSettings={userSettings} />} />
              <Route path="/community" element={<Community />} />
            </Routes>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;