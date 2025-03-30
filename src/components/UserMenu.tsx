
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, LogOut, Heart, Settings } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface UserMenuProps {
  user: {
    name: string;
    email: string;
    avatar?: string;
  } | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  if (!user) return null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative p-0">
          <Avatar className="h-8 w-8">
            {user.avatar ? (
              <AvatarImage src={user.avatar} alt={user.name} />
            ) : (
              <AvatarFallback className="bg-mirakiBlue-200 text-mirakiBlue-700">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-0" align="end">
        <div className="p-3 border-b">
          <p className="font-medium text-sm">{user.name}</p>
          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
        </div>
        <div className="p-1">
          <Link to="/profile" onClick={() => setOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <User size={16} className="mr-2" />
              Profile
            </Button>
          </Link>
          <Link to="/favorites" onClick={() => setOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Heart size={16} className="mr-2" />
              Favorites
            </Button>
          </Link>
          <Link to="/settings" onClick={() => setOpen(false)}>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Settings size={16} className="mr-2" />
              Settings
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" />
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserMenu;
