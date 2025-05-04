import React from 'react';
import { Button } from './ui/button';
import { Minus, Plus } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Artwork } from '@/types';

interface QuantityControlsProps {
  artwork: Artwork;
  quantity: number;
  size?: 'sm' | 'md';
}

const QuantityControls: React.FC<QuantityControlsProps> = ({
  artwork,
  quantity,
  size = 'md'
}) => {
  const { updateCartItemQuantity } = useAuth();
  
  const handleDecrement = () => {
    // Ensure we're using the artwork ID consistently
    updateCartItemQuantity(artwork._id, Math.max(0, quantity - 1));
  };

  const handleIncrement = () => {
    // Ensure we're using the artwork ID consistently
    updateCartItemQuantity(artwork._id, quantity + 1);
  };

  const buttonSize = size === 'sm' ? 'h-6 w-6' : 'h-8 w-8';
  const textSize = size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <div className={`flex items-center ${size === 'sm' ? 'gap-1' : 'gap-2'}`}>
      <Button
        variant="outline"
        size="icon"
        className={buttonSize}
        onClick={handleDecrement}
        disabled={quantity <= 0}
        aria-label="Decrease quantity"
      >
        <Minus size={size === 'sm' ? 12 : 16} />
      </Button>
      
      <span className={`${textSize} font-medium w-5 text-center`}>{quantity}</span>
      
      <Button
        variant="outline"
        size="icon"
        className={buttonSize}
        onClick={handleIncrement}
        aria-label="Increase quantity"
      >
        <Plus size={size === 'sm' ? 12 : 16} />
      </Button>
    </div>
  );
};

export default QuantityControls;
