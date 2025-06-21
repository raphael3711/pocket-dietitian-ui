import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, Clock, Users, Zap, Plus, X, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { mockGenerateRecipes } from '../services/mockData';
import { useToast } from '../hooks/use-toast';

const RecipeGenerator = () => {
  const [ingredients, setIngredients] = useState(['']);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [preferences, setPreferences] = useState({
    cuisine: '',
    difficulty: '',
    cookTime: '',
    dietary: []
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipes, setGeneratedRecipes] = useState([]);
  const [selectedRecipes, setSelectedRecipes] = useState([]);
  const { toast } = useToast();

  const cuisineTypes = [
    'Mediterranean', 'Asian', 'Italian', 'Mexican', 'Indian', 
    'American', 'French', 'Thai', 'Japanese', 'Greek'
  ];

  const difficultyLevels = [
    'Very Easy', 'Easy', 'Medium', 'Hard', 'Expert'
  ];

  const dietaryOptions = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free', 
    'Keto', 'Low-Carb', 'High-Protein', 'Paleo'
  ];

  const addIngredient = () => {
    if (currentIngredient.trim()) {
      setIngredients(prev => [...prev.filter(i => i), currentIngredient.trim()]);
      setCurrentIngredient('');
    }
  };

  const removeIngredient = (index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const handlePreferenceChange = (category, value) => {
    if (category === 'dietary') {
      setPreferences(prev => ({
        ...prev,
        dietary: prev.dietary.includes(value)
          ? prev.dietary.filter(item => item !== value)
          : [...prev.dietary, value]
      }));
    } else {
      setPreferences(prev => ({
        ...prev,
        [category]: prev[category] === value ? '' : value
      }));
    }
  };

  const generateRecipes = async () => {
    const validIngredients = ingredients.filter(i => i.trim());
    
    if (validIngredients.length === 0) {
      toast({
        title: "No ingredients added",
        description: "Please add at least one ingredient to generate recipes.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const result = await mockGenerateRecipes(validIngredients, preferences);
      setGeneratedRecipes(result.recipes);
      
      toast({
        title: "Recipes Generated!",
        description: `Found ${result.recipes.length} delicious recipes for you.`,
      });
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Could not generate recipes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleRecipeSelection = (recipeId) => {
    setSelectedRecipes(prev =>
      prev.includes(recipeId)
        ? prev.filter(id => id !== recipeId)
        : [...prev, recipeId]
    );
  };

  const addToShoppingList = () => {
    const selectedRecipeObjects = generatedRecipes.filter(recipe => 
      selectedRecipes.includes(recipe.id)
    );
    
    toast({
      title: "Added to Shopping List!",
      description: `Added ingredients for ${selectedRecipeObjects.length} recipes to your shopping list.`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Recipe Generator</h1>
        <p className="text-gray-600">
          Enter your available ingredients and get personalized recipe suggestions
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Input Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Ingredients Input */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Ingredients
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={currentIngredient}
                    onChange={(e) => setCurrentIngredient(e.target.value)}
                    placeholder="Enter ingredient..."
                    onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
                  />
                  <Button onClick={addIngredient} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Ingredients List */}
                <div className="space-y-2">
                  <AnimatePresence>
                    {ingredients.filter(i => i).map((ingredient, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center justify-between p-2 bg-green-50 rounded-lg"
                      >
                        <span className="text-sm font-medium text-green-800">
                          {ingredient}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeIngredient(index)}
                          className="h-6 w-6 p-0 text-green-600 hover:text-red-600"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Preferences */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cuisine Type */}
                <div>
                  <h4 className="font-medium mb-2">Cuisine Type</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {cuisineTypes.map((cuisine) => (
                      <Button
                        key={cuisine}
                        variant={preferences.cuisine === cuisine ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePreferenceChange('cuisine', cuisine)}
                        className="text-xs"
                      >
                        {cuisine}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Difficulty */}
                <div>
                  <h4 className="font-medium mb-2">Difficulty</h4>
                  <div className="flex flex-wrap gap-2">
                    {difficultyLevels.map((level) => (
                      <Button
                        key={level}
                        variant={preferences.difficulty === level ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePreferenceChange('difficulty', level)}
                        className="text-xs"
                      >
                        {level}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Dietary Restrictions */}
                <div>
                  <h4 className="font-medium mb-2">Dietary Restrictions</h4>
                  <div className="space-y-2">
                    {dietaryOptions.map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <Checkbox
                          id={`dietary-${option}`}
                          checked={preferences.dietary.includes(option)}
                          onCheckedChange={() => handlePreferenceChange('dietary', option)}
                        />
                        <label htmlFor={`dietary-${option}`} className="text-sm cursor-pointer">
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Generate Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={generateRecipes}
              disabled={isGenerating}
              className="w-full h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold"
            >
              {isGenerating ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 mr-2"
                  >
                    <Sparkles className="w-5 h-5" />
                  </motion.div>
                  Generating...
                </>
              ) : (
                <>
                  <ChefHat className="w-5 h-5 mr-2" />
                  Generate Recipes
                </>
              )}
            </Button>
          </motion.div>
        </div>

        {/* Results Section */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Generated Recipes
                  {selectedRecipes.length > 0 && (
                    <Badge variant="secondary">
                      {selectedRecipes.length} selected
                    </Badge>
                  )}
                </CardTitle>
                {selectedRecipes.length > 0 && (
                  <Button
                    onClick={addToShoppingList}
                    className="ml-auto"
                    size="sm"
                  >
                    Add to Shopping List
                  </Button>
                )}
              </CardHeader>
              <CardContent>
                {generatedRecipes.length > 0 ? (
                  <div className="space-y-4">
                    {generatedRecipes.map((recipe, index) => (
                      <motion.div
                        key={recipe.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`border rounded-lg p-4 transition-all duration-200 cursor-pointer ${
                          selectedRecipes.includes(recipe.id)
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => toggleRecipeSelection(recipe.id)}
                      >
                        <div className="flex gap-4">
                          <img
                            src={recipe.image}
                            alt={recipe.title}
                            className="w-24 h-24 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {recipe.title}
                              </h3>
                              <Checkbox
                                checked={selectedRecipes.includes(recipe.id)}
                                onChange={() => toggleRecipeSelection(recipe.id)}
                              />
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {recipe.cookTime} min
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="w-4 h-4" />
                                {recipe.servings} servings
                              </div>
                              <Badge variant="outline">{recipe.difficulty}</Badge>
                              <Badge variant="secondary">{recipe.calories} kcal</Badge>
                            </div>
                            
                            <div className="mb-3">
                              <h4 className="font-medium text-sm mb-1">Ingredients:</h4>
                              <div className="flex flex-wrap gap-1">
                                {recipe.ingredients.map((ingredient, idx) => (
                                  <Badge key={idx} variant="outline" className="text-xs">
                                    {ingredient}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm mb-1">Instructions:</h4>
                              <ol className="text-sm text-gray-600 space-y-1">
                                {recipe.instructions.slice(0, 2).map((step, idx) => (
                                  <li key={idx} className="flex gap-2">
                                    <span className="font-medium">{idx + 1}.</span>
                                    <span>{step}</span>
                                  </li>
                                ))}
                                {recipe.instructions.length > 2 && (
                                  <li className="text-blue-600 font-medium">
                                    + {recipe.instructions.length - 2} more steps...
                                  </li>
                                )}
                              </ol>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-gray-400">
                    <div className="text-center">
                      <ChefHat className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>Add ingredients and generate recipes to get started</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RecipeGenerator;