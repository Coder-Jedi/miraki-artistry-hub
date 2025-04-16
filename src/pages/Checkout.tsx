import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard, Check, MapPin, Trash2, ArrowLeft, ChevronRight, Clock, Shield } from 'lucide-react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { formatPrice } from '@/utils/priceFormatter';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import QuantityControls from '@/components/QuantityControls';
import { ArtworkCategory } from '@/types';

type CheckoutStep = 'cart' | 'shipping' | 'payment' | 'confirmation';

interface CheckoutFormData {
  // Shipping information
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  
  // Payment information
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, removeFromCart, clearCart } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });
  
  // Tax calculation (assume 18% GST)
  const taxRate = 0.18;
  const subtotal = cartTotal;
  const taxAmount = subtotal * taxRate;
  const shippingCost = subtotal > 25000 ? 0 : 500; // Free shipping above ₹25,000
  const grandTotal = subtotal + taxAmount + shippingCost;
  
  // Form validation state
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});

  // Navigate back to previous checkout step
  const goBack = () => {
    if (currentStep === 'shipping') setCurrentStep('cart');
    else if (currentStep === 'payment') setCurrentStep('shipping');
    else if (currentStep === 'confirmation') setCurrentStep('payment');
    else navigate('/explore');
  };
  
  // Proceed to next checkout step
  const goForward = () => {
    if (currentStep === 'cart') {
      if (cart.length === 0) {
        toast({
          title: "Empty Cart",
          description: "Your cart is empty. Add some artworks before proceeding.",
          variant: "destructive",
        });
        return;
      }
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      if (validateShippingForm()) {
        setCurrentStep('payment');
      }
    } else if (currentStep === 'payment') {
      if (validatePaymentForm()) {
        processPayment();
      }
    } else if (currentStep === 'confirmation') {
      navigate('/');
      toast({
        title: "Thank You!",
        description: "Your order has been placed successfully. Keep exploring more artworks.",
      });
    }
  };

  // Validate shipping form
  const validateShippingForm = () => {
    const errors: Partial<Record<keyof CheckoutFormData, string>> = {};
    
    if (!formData.fullName) errors.fullName = "Full name is required";
    if (!formData.email) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.phone) errors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) errors.phone = "Phone number must be 10 digits";
    if (!formData.address) errors.address = "Address is required";
    if (!formData.city) errors.city = "City is required";
    if (!formData.state) errors.state = "State is required";
    if (!formData.zipCode) errors.zipCode = "ZIP code is required";
    else if (!/^\d{6}$/.test(formData.zipCode)) errors.zipCode = "ZIP code must be 6 digits";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Validate payment form
  const validatePaymentForm = () => {
    const errors: Partial<Record<keyof CheckoutFormData, string>> = {};
    
    if (paymentMethod === 'card') {
      if (!formData.cardName) errors.cardName = "Name on card is required";
      if (!formData.cardNumber) errors.cardNumber = "Card number is required";
      else if (!/^\d{16}$/.test(formData.cardNumber)) errors.cardNumber = "Card number must be 16 digits";
      if (!formData.expiryDate) errors.expiryDate = "Expiry date is required";
      else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) errors.expiryDate = "Expiry date format: MM/YY";
      if (!formData.cvv) errors.cvv = "CVV is required";
      else if (!/^\d{3}$/.test(formData.cvv)) errors.cvv = "CVV must be 3 digits";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Process payment
  const processPayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setCurrentStep('confirmation');
      // In a real application, this is where you would:
      // 1. Send payment info to payment processor
      // 2. Create order in database
      // 3. Send confirmation email
      // After successful payment, clear the cart
      clearCart();
    }, 2000);
  };
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (formErrors[name as keyof CheckoutFormData]) {
      setFormErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };
  
  // Ensure user is redirected to cart if they go directly to confirmation
  useEffect(() => {
    if (currentStep === 'confirmation' && cart.length > 0) {
      setCurrentStep('cart');
    }
  }, []);

  // Render cart step
  const renderCartStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-mirakiBlue-900 dark:text-white">Your Cart</h2>
      
      {cart.length === 0 ? (
        <div className="text-center py-12">
          <ShoppingCart className="mx-auto h-16 w-16 text-mirakiGray-300 mb-4" />
          <h3 className="text-xl font-medium text-mirakiBlue-800 dark:text-mirakiGray-200 mb-2">
            Your cart is empty
          </h3>
          <p className="text-mirakiBlue-600 dark:text-mirakiGray-400 mb-6">
            Explore our collection and add some artworks to your cart.
          </p>
          <Button onClick={() => navigate('/explore')}>
            Explore Artworks
          </Button>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="h-24 w-24 rounded overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-medium">{item.title}</h3>
                      <p className="text-sm text-mirakiBlue-600 dark:text-mirakiGray-300">by {item.artist}</p>
                      <div className="mt-2 flex items-center justify-between">
                        <span className="font-medium">{formatPrice(item.price)}</span>
                        <div className="flex items-center gap-4">
                          <QuantityControls
                            artwork={{
                              ...item,
                              forSale: true,
                              year: new Date().getFullYear(),
                              medium: 'Unknown',
                              location: {
                                lat: 0,
                                lng: 0,
                                address: ''
                              },
                              category: 'All' as ArtworkCategory,
                              description: '',
                              likes: 0
                            }}
                            quantity={item.quantity}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(item.id)}
                            className="h-8 w-8"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <Button 
            onClick={() => clearCart()} 
            variant="outline" 
            className="text-red-500 border-red-200 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-900/20"
          >
            <Trash2 size={16} className="mr-2" />
            Clear Cart
          </Button>
          
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-mirakiBlue-800 dark:text-mirakiGray-300">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-mirakiBlue-800 dark:text-mirakiGray-300">
              <span>GST (18%)</span>
              <span>{formatPrice(taxAmount)}</span>
            </div>
            <div className="flex justify-between text-mirakiBlue-800 dark:text-mirakiGray-300">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
          
          <div className="pt-6">
            <Button onClick={goForward} className="w-full">
              Proceed to Shipping
              <ChevronRight size={16} className="ml-2" />
            </Button>
          </div>
        </>
      )}
    </div>
  );

  // Render shipping step
  const renderShippingStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-mirakiBlue-900 dark:text-white">Shipping Information</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className={formErrors.fullName ? "border-red-500" : ""}
          />
          {formErrors.fullName && (
            <p className="text-red-500 text-xs mt-1">{formErrors.fullName}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            className={formErrors.email ? "border-red-500" : ""}
          />
          {formErrors.email && (
            <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className={formErrors.phone ? "border-red-500" : ""}
          />
          {formErrors.phone && (
            <p className="text-red-500 text-xs mt-1">{formErrors.phone}</p>
          )}
        </div>
        
        <div className="md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className={formErrors.address ? "border-red-500" : ""}
          />
          {formErrors.address && (
            <p className="text-red-500 text-xs mt-1">{formErrors.address}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className={formErrors.city ? "border-red-500" : ""}
          />
          {formErrors.city && (
            <p className="text-red-500 text-xs mt-1">{formErrors.city}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className={formErrors.state ? "border-red-500" : ""}
          />
          {formErrors.state && (
            <p className="text-red-500 text-xs mt-1">{formErrors.state}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="zipCode">Postal Code</Label>
          <Input
            id="zipCode"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            className={formErrors.zipCode ? "border-red-500" : ""}
          />
          {formErrors.zipCode && (
            <p className="text-red-500 text-xs mt-1">{formErrors.zipCode}</p>
          )}
        </div>
      </div>
      
      <div className="pt-6 flex gap-4">
        <Button variant="outline" onClick={goBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Cart
        </Button>
        <Button onClick={goForward} className="ml-auto">
          Continue to Payment
          <ChevronRight size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );

  // Render payment step
  const renderPaymentStep = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-mirakiBlue-900 dark:text-white">Payment Method</h2>
      
      <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'upi' | 'cod')}>
        <div className="space-y-4">
          <div className="flex items-center space-x-2 cursor-pointer">
            <RadioGroupItem value="card" id="payment-card" />
            <Label htmlFor="payment-card" className="cursor-pointer flex items-center">
              <CreditCard size={18} className="mr-2" />
              Credit / Debit Card
            </Label>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <RadioGroupItem value="upi" id="payment-upi" />
            <Label htmlFor="payment-upi" className="cursor-pointer">UPI Payment</Label>
          </div>
          <div className="flex items-center space-x-2 cursor-pointer">
            <RadioGroupItem value="cod" id="payment-cod" />
            <Label htmlFor="payment-cod" className="cursor-pointer">Cash on Delivery</Label>
          </div>
        </div>
      </RadioGroup>
      
      {paymentMethod === 'card' && (
        <div className="mt-4 border rounded-lg p-4">
          <h3 className="font-medium mb-4">Card Information</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="cardName">Name on Card</Label>
              <Input
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleInputChange}
                className={formErrors.cardName ? "border-red-500" : ""}
              />
              {formErrors.cardName && (
                <p className="text-red-500 text-xs mt-1">{formErrors.cardName}</p>
              )}
            </div>
            
            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={handleInputChange}
                placeholder="XXXX XXXX XXXX XXXX"
                className={formErrors.cardNumber ? "border-red-500" : ""}
              />
              {formErrors.cardNumber && (
                <p className="text-red-500 text-xs mt-1">{formErrors.cardNumber}</p>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date</Label>
                <Input
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleInputChange}
                  placeholder="MM/YY"
                  className={formErrors.expiryDate ? "border-red-500" : ""}
                />
                {formErrors.expiryDate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.expiryDate}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  name="cvv"
                  type="password"
                  value={formData.cvv}
                  onChange={handleInputChange}
                  placeholder="XXX"
                  maxLength={3}
                  className={formErrors.cvv ? "border-red-500" : ""}
                />
                {formErrors.cvv && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.cvv}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-mirakiBlue-600 dark:text-mirakiGray-300 mt-2">
              <Shield size={16} />
              <span>Your payment information is secure and encrypted</span>
            </div>
          </div>
        </div>
      )}
      
      {paymentMethod === 'upi' && (
        <div className="mt-4 border rounded-lg p-4">
          <h3 className="font-medium mb-4">UPI Information</h3>
          <div>
            <Label htmlFor="upiId">UPI ID</Label>
            <Input
              id="upiId"
              name="upiId"
              placeholder="yourname@upi"
            />
            <p className="text-sm text-mirakiBlue-600 dark:text-mirakiGray-300 mt-2">
              You will receive a payment request on your UPI app
            </p>
          </div>
        </div>
      )}
      
      {paymentMethod === 'cod' && (
        <div className="mt-4 border rounded-lg p-4">
          <h3 className="font-medium mb-2">Cash on Delivery</h3>
          <p className="text-sm text-mirakiBlue-600 dark:text-mirakiGray-300">
            Pay with cash when your artwork is delivered. Please ensure someone is available to receive the delivery and make the payment.
          </p>
        </div>
      )}
      
      <div className="mt-6 space-y-2 border-t pt-4">
        <div className="flex justify-between text-mirakiBlue-800 dark:text-mirakiGray-300">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-mirakiBlue-800 dark:text-mirakiGray-300">
          <span>GST (18%)</span>
          <span>{formatPrice(taxAmount)}</span>
        </div>
        <div className="flex justify-between text-mirakiBlue-800 dark:text-mirakiGray-300">
          <span>Shipping</span>
          <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{formatPrice(grandTotal)}</span>
        </div>
      </div>
      
      <div className="pt-6 flex gap-4">
        <Button variant="outline" onClick={goBack}>
          <ArrowLeft size={16} className="mr-2" />
          Back to Shipping
        </Button>
        <Button 
          onClick={goForward} 
          className="ml-auto"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Clock size={16} className="mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Complete Order
              <ChevronRight size={16} className="ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  // Render confirmation step
  const renderConfirmationStep = () => (
    <div className="text-center py-8">
      <div className="h-16 w-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
        <Check size={32} className="text-green-600 dark:text-green-400" />
      </div>
      
      <h2 className="text-2xl font-bold text-mirakiBlue-900 dark:text-white mb-4">
        Order Confirmed!
      </h2>
      
      <p className="text-mirakiBlue-800 dark:text-mirakiGray-300 mb-6 max-w-md mx-auto">
        Thank you for your purchase! Your order has been received and is being processed. You will receive a confirmation email shortly.
      </p>
      
      <div className="bg-mirakiBlue-50 dark:bg-mirakiBlue-900/50 rounded-lg p-6 max-w-md mx-auto mb-8">
        <h3 className="font-medium mb-4">Order Summary</h3>
        <div className="space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-mirakiBlue-600 dark:text-mirakiGray-400">Order Number</span>
            <span className="font-medium">MRK-{Math.floor(Math.random() * 10000)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-mirakiBlue-600 dark:text-mirakiGray-400">Date</span>
            <span className="font-medium">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-mirakiBlue-600 dark:text-mirakiGray-400">Payment Method</span>
            <span className="font-medium">{
              paymentMethod === 'card' ? 'Credit/Debit Card' : 
              paymentMethod === 'upi' ? 'UPI' : 
              'Cash on Delivery'
            }</span>
          </div>
          <div className="flex justify-between">
            <span className="text-mirakiBlue-600 dark:text-mirakiGray-400">Total</span>
            <span className="font-medium">{formatPrice(grandTotal)}</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <Button onClick={() => navigate('/explore')} className="bg-mirakiGold hover:bg-mirakiGold-600 text-mirakiBlue-900">
          Explore More Artworks
        </Button>
      </div>
    </div>
  );

  // Progress indicator
  const renderProgressIndicator = () => {
    const steps = [
      { id: 'cart', label: 'Cart', icon: ShoppingCart },
      { id: 'shipping', label: 'Shipping', icon: MapPin },
      { id: 'payment', label: 'Payment', icon: CreditCard },
      { id: 'confirmation', label: 'Confirmation', icon: Check },
    ];
    
    return (
      <div className="hidden md:flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div 
              className={`flex flex-col items-center ${
                step.id === currentStep || steps.findIndex(s => s.id === currentStep) > index
                  ? 'text-mirakiGold'
                  : 'text-mirakiGray-400'
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step.id === currentStep
                  ? 'bg-mirakiGold text-mirakiBlue-900'
                  : steps.findIndex(s => s.id === currentStep) > index
                    ? 'bg-mirakiGold/20 text-mirakiGold'
                    : 'bg-mirakiGray-200 dark:bg-mirakiBlue-800 text-mirakiGray-500'
              }`}>
                <step.icon size={20} />
              </div>
              <span className="text-xs mt-2">{step.label}</span>
            </div>
            
            {index < steps.length - 1 && (
              <div className={`w-20 h-1 mx-2 ${
                steps.findIndex(s => s.id === currentStep) > index
                  ? 'bg-mirakiGold'
                  : 'bg-mirakiGray-200 dark:bg-mirakiBlue-800'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <div className="container-fluid max-w-5xl mx-auto py-24">
        {renderProgressIndicator()}
        
        <div className="bg-white dark:bg-mirakiBlue-800 rounded-xl shadow-md p-6 md:p-8">
          {currentStep === 'cart' && renderCartStep()}
          {currentStep === 'shipping' && renderShippingStep()}
          {currentStep === 'payment' && renderPaymentStep()}
          {currentStep === 'confirmation' && renderConfirmationStep()}
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
