import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  Camera, 
  Upload, 
  Plus, 
  Trash2, 
  Calendar, 
  AlertTriangle,
  CheckCircle,
  Search,
  Filter
} from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { MOCK_INVENTORY, mockScanReceipt } from '../services/mockData';
import { useToast } from '../hooks/use-toast';

const InventoryManager = () => {
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [filteredInventory, setFilteredInventory] = useState(MOCK_INVENTORY);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [isScanning, setIsScanning] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    quantity: 1,
    unit: 'pieces',
    expiry: '',
    category: 'Produce'
  });
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const categories = ['all', 'Dairy', 'Produce', 'Protein', 'Grains', 'Pantry', 'Frozen'];
  const units = ['pieces', 'grams', 'kg', 'liters', 'ml', 'cups', 'bags', 'bottles'];

  // Filter inventory based on search and category
  React.useEffect(() => {
    let filtered = inventory;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }
    
    setFilteredInventory(filtered);
  }, [inventory, searchTerm, filterCategory]);

  const handleReceiptScan = async (file) => {
    setIsScanning(true);
    
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = await mockScanReceipt(e.target.result);
        
        // Add scanned items to inventory
        const newItems = result.items.map(item => ({
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          name: item.name,
          quantity: item.quantity,
          unit: 'pieces',
          expiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
          category: 'Produce' // Default category
        }));
        
        setInventory(prev => [...prev, ...newItems]);
        
        toast({
          title: "Receipt Scanned Successfully!",
          description: `Added ${newItems.length} items to your pantry.`,
        });
        
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Could not scan the receipt. Please try again.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const addManualItem = () => {
    if (newItem.name.trim()) {
      const item = {
        id: Date.now().toString(),
        ...newItem,
        name: newItem.name.trim()
      };
      
      setInventory(prev => [...prev, item]);
      setNewItem({
        name: '',
        quantity: 1,
        unit: 'pieces',
        expiry: '',
        category: 'Produce'
      });
      
      toast({
        title: "Item Added",
        description: `${item.name} added to your pantry.`,
      });
    }
  };

  const removeItem = (itemId) => {
    setInventory(prev => prev.filter(item => item.id !== itemId));
    toast({
      title: "Item Removed",
      description: "Item removed from your pantry.",
    });
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setInventory(prev => prev.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const getExpiryStatus = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysUntilExpiry < 0) {
      return { status: 'expired', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    } else if (daysUntilExpiry <= 3) {
      return { status: 'expiring', color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle };
    } else {
      return { status: 'fresh', color: 'bg-green-100 text-green-800', icon: CheckCircle };
    }
  };

  const getExpiringItems = () => {
    return inventory.filter(item => {
      const daysUntilExpiry = Math.ceil((new Date(item.expiry) - new Date()) / (1000 * 60 * 60 * 24));
      return daysUntilExpiry <= 3 && daysUntilExpiry >= 0;
    });
  };

  const getLowStockItems = () => {
    return inventory.filter(item => item.quantity <= 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Pantry Manager</h1>
        <p className="text-gray-600">
          Track your food inventory and get expiration alerts
        </p>
      </motion.div>

      {/* Alerts */}
      {(getExpiringItems().length > 0 || getLowStockItems().length > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-2 gap-4"
        >
          {getExpiringItems().length > 0 && (
            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <h3 className="font-semibold text-yellow-800">Items Expiring Soon</h3>
                </div>
                <div className="space-y-1">
                  {getExpiringItems().slice(0, 3).map(item => (
                    <p key={item.id} className="text-sm text-yellow-700">
                      {item.name} - expires {new Date(item.expiry).toLocaleDateString()}
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {getLowStockItems().length > 0 && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-800">Low Stock Items</h3>
                </div>
                <div className="space-y-1">
                  {getLowStockItems().slice(0, 3).map(item => (
                    <p key={item.id} className="text-sm text-orange-700">
                      {item.name} - only {item.quantity} {item.unit} left
                    </p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      )}

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Add Items Section */}
        <div className="lg:col-span-1 space-y-6">
          {/* Receipt Scanner */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5" />
                  Scan Receipt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files[0] && handleReceiptScan(e.target.files[0])}
                  className="hidden"
                />
                
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  className="w-full h-16 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                >
                  {isScanning ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 mr-2"
                      >
                        <Upload className="w-5 h-5" />
                      </motion.div>
                      Scanning...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5 mr-2" />
                      Upload Receipt
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Manual Add */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Add Manually
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={newItem.name}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Item name..."
                />
                
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                    placeholder="Quantity"
                    min="1"
                  />
                  <select
                    value={newItem.unit}
                    onChange={(e) => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded-md"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
                
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  {categories.filter(cat => cat !== 'all').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
                
                <Input
                  type="date"
                  value={newItem.expiry}
                  onChange={(e) => setNewItem(prev => ({ ...prev, expiry: e.target.value }))}
                  placeholder="Expiry date"
                />
                
                <Button onClick={addManualItem} className="w-full">
                  Add Item
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Inventory List */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Your Pantry
                    <Badge variant="secondary">{inventory.length} items</Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <Search className="w-4 h-4 text-gray-400" />
                      <Input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search items..."
                        className="w-48"
                      />
                    </div>
                    
                    <select
                      value={filterCategory}
                      onChange={(e) => setFilterCategory(e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </option>
                      ))}
                    </select>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <AnimatePresence>
                    {filteredInventory.map((item, index) => {
                      const expiryInfo = getExpiryStatus(item.expiry);
                      const ExpiryIcon = expiryInfo.icon;
                      
                      return (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{item.name}</h3>
                              <Badge variant="outline">{item.category}</Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>{item.quantity} {item.unit}</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-3 h-3" />
                                {new Date(item.expiry).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                          
                          <Badge className={expiryInfo.color}>
                            <ExpiryIcon className="w-3 h-3 mr-1" />
                            {expiryInfo.status}
                          </Badge>
                          
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                          
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                  
                  {filteredInventory.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <Package className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>No items found</p>
                      {searchTerm || filterCategory !== 'all' ? (
                        <p className="text-sm">Try adjusting your search or filter</p>
                      ) : (
                        <p className="text-sm">Add items to your pantry to get started</p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;