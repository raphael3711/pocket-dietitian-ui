import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Upload, Zap, Scan, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { mockScanProduct } from '../services/mockData';
import { useToast } from '../hooks/use-toast';

const ProductScanner = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedProduct, setScannedProduct] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const fileInputRef = useRef(null);
  const { toast } = useToast();

  const handleCameraCapture = async () => {
    setIsScanning(true);
    
    try {
      // Simulate camera capture
      const result = await mockScanProduct('camera-capture');
      
      setScannedProduct(result.product);
      setScanHistory(prev => [result.product, ...prev.slice(0, 9)]);
      
      toast({
        title: "Product Scanned Successfully!",
        description: `Found: ${result.product.name}`,
      });
    } catch (error) {
      toast({
        title: "Scan Failed",
        description: "Could not identify the product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsScanning(true);
    
    try {
      // Create a preview of the uploaded image
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = await mockScanProduct(e.target.result);
        
        setScannedProduct(result.product);
        setScanHistory(prev => [result.product, ...prev.slice(0, 9)]);
        
        toast({
          title: "Image Analyzed Successfully!",
          description: `Found: ${result.product.name}`,
        });
        
        setIsScanning(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Analysis Failed",
        description: "Could not analyze the image. Please try again.",
        variant: "destructive",
      });
      setIsScanning(false);
    }
  };

  const getFreshnessColor = (freshness) => {
    switch (freshness) {
      case 'fresh': return 'bg-green-100 text-green-800';
      case 'aging': return 'bg-yellow-100 text-yellow-800';
      case 'spoiled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFreshnessIcon = (freshness) => {
    switch (freshness) {
      case 'fresh': return <CheckCircle className="w-4 h-4" />;
      case 'aging': return <AlertCircle className="w-4 h-4" />;
      case 'spoiled': return <AlertCircle className="w-4 h-4" />;
      default: return <Scan className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Product Scanner</h1>
        <p className="text-gray-600">
          Scan products to get nutritional information and freshness analysis
        </p>
      </motion.div>

      {/* Scanning Interface */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Scanner Controls */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5" />
                Scan Product
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Camera Capture */}
              <Button
                onClick={handleCameraCapture}
                disabled={isScanning}
                className="w-full h-20 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white text-lg font-semibold"
              >
                <Camera className="w-8 h-8 mr-3" />
                {isScanning ? 'Scanning...' : 'Use Camera'}
              </Button>

              {/* File Upload */}
              <div className="relative">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isScanning}
                  variant="outline"
                  className="w-full h-16 border-2 border-dashed border-gray-300 hover:border-gray-400"
                >
                  <Upload className="w-6 h-6 mr-2" />
                  Upload Image
                </Button>
              </div>

              {/* Scanning Animation */}
              <AnimatePresence>
                {isScanning && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="flex items-center justify-center p-8"
                  >
                    <div className="flex flex-col items-center gap-4">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
                      />
                      <div className="text-center">
                        <p className="font-semibold text-green-600">Analyzing product...</p>
                        <p className="text-sm text-gray-500">Please wait</p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Display */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Scan Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scannedProduct ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  {/* Product Image */}
                  <div className="flex justify-center">
                    <img
                      src={scannedProduct.image}
                      alt={scannedProduct.name}
                      className="w-24 h-24 object-cover rounded-lg border"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {scannedProduct.name}
                    </h3>
                    <Badge className={`${getFreshnessColor(scannedProduct.freshness)} mb-3`}>
                      {getFreshnessIcon(scannedProduct.freshness)}
                      <span className="ml-1 capitalize">{scannedProduct.freshness}</span>
                    </Badge>
                  </div>

                  {/* Nutritional Information */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold mb-3">Nutritional Information (per 100g)</h4>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex justify-between">
                        <span>Calories:</span>
                        <span className="font-medium">{scannedProduct.calories} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Protein:</span>
                        <span className="font-medium">{scannedProduct.protein}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Carbs:</span>
                        <span className="font-medium">{scannedProduct.carbs}g</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Fat:</span>
                        <span className="font-medium">{scannedProduct.fat}g</span>
                      </div>
                      {scannedProduct.fiber > 0 && (
                        <div className="flex justify-between">
                          <span>Fiber:</span>
                          <span className="font-medium">{scannedProduct.fiber}g</span>
                        </div>
                      )}
                      {scannedProduct.sugar > 0 && (
                        <div className="flex justify-between">
                          <span>Sugar:</span>
                          <span className="font-medium">{scannedProduct.sugar}g</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expiry Date */}
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600">
                      Expires: {new Date(scannedProduct.expiryDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button className="flex-1" variant="outline">
                      Add to Pantry
                    </Button>
                    <Button className="flex-1" variant="outline">
                      Get Recipes
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-400">
                  <div className="text-center">
                    <Scan className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Scan a product to see nutritional information</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Scan History */}
      {scanHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Recent Scans</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {scanHistory.map((product, index) => (
                  <motion.div
                    key={`${product.id}-${index}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg border transition-colors"
                    onClick={() => setScannedProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-16 object-cover rounded mb-2"
                    />
                    <p className="text-xs font-medium text-gray-900 truncate">
                      {product.name}
                    </p>
                    <Badge 
                      className={`${getFreshnessColor(product.freshness)} text-xs mt-1`}
                      size="sm"
                    >
                      {product.freshness}
                    </Badge>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default ProductScanner;