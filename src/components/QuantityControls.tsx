
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Artwork } from '@/types';

interface QuantityControlsProps {
  artwork: Artwork;
  quantity: number;
  onQuantityChange?: (newQuantity: number) => void;
  className?: string;
}

const QuantityControls: React.FC<QuantityControlsProps> = ({ 
  artwork, 
  quantity,
  onQuantityChange,
  className = ""
}) => {
  const { addToCart, removeFromCart } = useAuth();

  const handleIncrease = () => {
    addToCart(artwork);
    onQuantityChange?.(quantity + 1);
  };

  const handleDecrease = () => {
    if (quantity > 0) {
      removeFromCart(artwork.id);
      onQuantityChange?.(quantity - 1);
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleDecrease}
        disabled={quantity === 0}
      >
        <Minus className="h-4 w-4" />
      </Button>
      
      <span className="min-w-[2rem] text-center font-medium">
        {quantity}
      </span>
      
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8"
        onClick={handleIncrease}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default QuantityControls;
