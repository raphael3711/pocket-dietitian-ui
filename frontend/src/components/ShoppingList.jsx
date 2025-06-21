import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  Plus, 
  Minus, 
  Check, 
  MapPin, 
  CreditCard, 
  Truck,
  Store,
  Search
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { MOCK_SHOPPING_LIST } from '../services/mockData';
import { useToast } from '../hooks/use-toast';

const ShoppingList = () => {
  const [shoppingItems, setShoppingItems] = useState(MOCK_SHOPPING_LIST);
  const [checkedItems, setCheckedItems] = useState([]);
  const [newItem, setNewItem] = useState({ name: '', category: 'Produce', needed: 1 });
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedStore, setSelectedStore] = useState(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const { toast } = useToast();

  const categories = ['Produce', 'Dairy', 'Meat', 'Pantry', 'Bakery', 'Frozen', 'Other'];
  
  const nearbyStores = [
    { id: 1, name: 'Fresh Market', distance: '0.5 miles', rating: 4.8, logo: '🏪' },
    { id: 2, name: 'Green Grocers', distance: '0.8 miles', rating: 4.6, logo: '🛒' },
    { id: 3, name: 'Organic Plus', distance: '1.2 miles', rating: 4.7, logo: '🥬' },
    { id: 4, name: 'Super Mart', distance: '1.5 miles', rating: 4.4, logo: '🏬' }
  ];

  const addItem = () => {
    if (newItem.name.trim()) {
      const item = {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        category: newItem.category,
        needed: newItem.needed,
        unit: 'pieces'
      };
      
      setShoppingItems(prev => [...prev, item]);
      setNewItem({ name: '', category: 'Produce', needed: 1 });
      
      toast({
        title: "Item Added",
        description: `${item.name} added to your shopping list.`,
      });
    }
  };

  const removeItem = (itemId) => {
    setShoppingItems(prev => prev.filter(item => item.id !== itemId));
    setCheckedItems(prev => prev.filter(id => id !== itemId));
  };

  const updateQuantity = (itemId, change) => {
    setShoppingItems(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, needed: Math.max(1, item.needed + change) }
        : item
    ));
  };

  const toggleItemCheck = (itemId) => {
    setCheckedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleStoreSelection = (store) => {
    setSelectedStore(store);
    toast({
      title: "Store Selected",
      description: `Selected ${store.name} for delivery.`,
    });
  };

  const calculateTotal = () => {
    // Mock price calculation
    return shoppingItems.reduce((total, item) => {
      const mockPrice = Math.random() * 10 + 2; // Random price between $2-12
      return total + (mockPrice * item.needed);
    }, 0).toFixed(2);
  };

  const handleOrderDelivery = async () => {
    if (!selectedStore) {
      toast({
        title: "Select a Store",
        description: "Please select a store for delivery.",
        variant: "destructive",
      });
      return;
    }

    if (!deliveryAddress.trim()) {
      toast({
        title: "Enter Delivery Address",
        description: "Please enter your delivery address.",
        variant: "destructive",
      });
      return;
    }

    setIsOrdering(true);
    
    // Simulate order processing
    setTimeout(() => {
      setIsOrdering(false);
      toast({
        title: "Order Placed Successfully!",
        description: `Your order from ${selectedStore.name} will be delivered in 30-45 minutes.`,
      });
    }, 2000);
  };

  const groupedItems = shoppingItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping List</h1>
        <p className="text-gray-600">
          Manage your shopping list and order groceries for delivery
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Shopping List */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add New Item */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Item
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={newItem.name}
                    onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter item name..."
                    onKeyPress={(e) => e.key === 'Enter' && addItem()}
                    className="flex-1"
                  />
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewItem(prev => ({ ...prev, needed: Math.max(1, prev.needed - 1) }))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <span className="w-8 text-center">{newItem.needed}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setNewItem(prev => ({ ...prev, needed: prev.needed + 1 }))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <Button onClick={addItem}>Add</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Shopping Items by Category */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-5 h-5" />
                    Shopping Items
                  </div>
                  <Badge variant="secondary">
                    {shoppingItems.length} items
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(groupedItems).map(([category, items]) => (
                    <div key={category}>
                      <h3 className="font-semibold text-lg mb-3 text-gray-800 border-b pb-1">
                        {category}
                      </h3>
                      <div className="space-y-2">
                        <AnimatePresence>
                          {items.map((item, index) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ delay: index * 0.05 }}
                              className={`flex items-center gap-3 p-3 rounded-lg border transition-all duration-200 ${
                                checkedItems.includes(item.id)
                                  ? 'bg-green-50 border-green-200'
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <Checkbox
                                checked={checkedItems.includes(item.id)}
                                onCheckedChange={() => toggleItemCheck(item.id)}
                              />
                              
                              <div className="flex-1">
                                <span className={`font-medium ${
                                  checkedItems.includes(item.id) 
                                    ? 'line-through text-gray-500' 
                                    : 'text-gray-900'
                                }`}>
                                  {item.name}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, -1)}
                                  disabled={item.needed <= 1}
                                >
                                  <Minus className="w-3 h-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">
                                  {item.needed}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => updateQuantity(item.id, 1)}
                                >
                                  <Plus className="w-3 h-3" />
                                </Button>
                              </div>
                              
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item.id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                ×
                              </Button>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Delivery & Checkout */}
        <div className="space-y-6">
          {/* Store Selection */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Store className="w-5 h-5" />
                  Select Store
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {nearbyStores.map((store) => (
                    <motion.div
                      key={store.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedStore?.id === store.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleStoreSelection(store)}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{store.logo}</span>
                        <div className="flex-1">
                          <h4 className="font-medium">{store.name}</h4>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-3 h-3" />
                            <span>{store.distance}</span>
                            <span>•</span>
                            <span>⭐ {store.rating}</span>
                          </div>
                        </div>
                        {selectedStore?.id === store.id && (
                          <Check className="w-5 h-5 text-blue-500" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Delivery Address */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Delivery Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Input
                  value={deliveryAddress}
                  onChange={(e) => setDeliveryAddress(e.target.value)}
                  placeholder="Enter your delivery address..."
                  className="mb-3"
                />
                <Button variant="outline" size="sm" className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Use Current Location
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>${calculateTotal()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee:</span>
                    <span>$3.99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax:</span>
                    <span>${(parseFloat(calculateTotal()) * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total:</span>
                      <span>${(parseFloat(calculateTotal()) + 3.99 + parseFloat(calculateTotal()) * 0.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleOrderDelivery}
                  disabled={isOrdering || shoppingItems.length === 0}
                  className="w-full h-12 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-semibold"
                >
                  {isOrdering ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 mr-2"
                      >
                        <Truck className="w-5 h-5" />
                      </motion.div>
                      Processing Order...
                    </>
                  ) : (
                    <>
                      <Truck className="w-5 h-5 mr-2" />
                      Order for Delivery
                    </>
                  )}
                </Button>

                <div className="text-xs text-gray-500 text-center">
                  Estimated delivery: 30-45 minutes
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingList;