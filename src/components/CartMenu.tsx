
import React, { useState } from 'react';
import { ShoppingCart, X, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const CartMenu: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { cart, removeFromCart, clearCart, cartTotal } = useAuth();
  const { toast } = useToast();

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add some artworks to your cart before checkout",
        variant: "destructive",
      });
      return;
    }
    
    setOpen(false);
    // In a real app, this would navigate to checkout
    toast({
      title: "Checkout initiated",
      description: "Processing your order...",
    });
  };

  const itemCount = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingCart size={20} />
          {itemCount > 0 && (
            <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0">
              {itemCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-3 border-b flex justify-between items-center">
          <h3 className="font-medium">Shopping Cart ({itemCount})</h3>
          {cart.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 px-2 text-muted-foreground"
              onClick={clearCart}
            >
              <Trash2 size={15} className="mr-1" />
              Clear
            </Button>
          )}
        </div>
        
        <div className="max-h-80 overflow-auto">
          {cart.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground">
              <ShoppingCart className="mx-auto mb-2 h-10 w-10 opacity-20" />
              <p>Your cart is empty</p>
              <Button 
                variant="link" 
                size="sm" 
                className="mt-2"
                asChild
                onClick={() => setOpen(false)}
              >
                <Link to="/explore">Explore artworks</Link>
              </Button>
            </div>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={item.id} className="p-3 border-b flex gap-3">
                  <div className="h-16 w-16 rounded-md bg-muted overflow-hidden flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title} 
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.artist}</p>
                    <div className="flex justify-between items-center mt-1">
                      <span className="font-semibold">${item.price}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-6 w-6 p-0" 
                        onClick={() => removeFromCart(item.id)}
                      >
                        <X size={15} />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cart.length > 0 && (
          <div className="p-3 border-t">
            <div className="flex justify-between mb-3">
              <span className="font-medium">Total:</span>
              <span className="font-semibold">${cartTotal.toFixed(2)}</span>
            </div>
            <Button className="w-full" onClick={handleCheckout}>
              Checkout
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CartMenu;
