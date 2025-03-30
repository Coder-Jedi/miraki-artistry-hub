
import React from 'react';
import Layout from '@/components/Layout';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingBag, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile: React.FC = () => {
  const { user, isAuthenticated, logout, cart } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not authenticated
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  if (!user) return null;
  
  return (
    <Layout>
      <section className="page-section py-16 md:py-24">
        <div className="container max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <Avatar className="h-24 w-24 mb-4">
                      {user.avatar ? (
                        <AvatarImage src={user.avatar} alt={user.name} />
                      ) : (
                        <AvatarFallback className="text-2xl bg-mirakiBlue-200 text-mirakiBlue-700">
                          {user.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                    
                    <div className="w-full mt-6 space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start" 
                        onClick={() => navigate('/favorites')}
                      >
                        <Heart size={16} className="mr-2" />
                        My Favorites
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/orders')}
                      >
                        <ShoppingBag size={16} className="mr-2" />
                        Order History
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => navigate('/settings')}
                      >
                        <Settings size={16} className="mr-2" />
                        Settings
                      </Button>
                      
                      <Separator className="my-2" />
                      
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                        onClick={() => logout()}
                      >
                        <LogOut size={16} className="mr-2" />
                        Logout
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="lg:col-span-2">
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="cart">Cart ({cart.length})</TabsTrigger>
                  <TabsTrigger value="orders">Orders</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview">
                  <Card>
                    <CardHeader>
                      <CardTitle>Account Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-medium">Account Details</h3>
                          <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Name</p>
                              <p>{user.name}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Email</p>
                              <p>{user.email}</p>
                            </div>
                          </div>
                        </div>
                        
                        <Separator />
                        
                        <div>
                          <h3 className="text-lg font-medium">Activity</h3>
                          <p className="mt-2 text-muted-foreground">Your recent activity will be displayed here.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="cart">
                  <Card>
                    <CardHeader>
                      <CardTitle>Shopping Cart</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {cart.length === 0 ? (
                        <div className="text-center p-6">
                          <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                          <h3 className="mt-2 text-lg font-medium">Your cart is empty</h3>
                          <p className="mt-1 text-muted-foreground">
                            Add some artwork to your cart to see it here.
                          </p>
                          <Button 
                            className="mt-4" 
                            onClick={() => navigate('/explore')}
                          >
                            Explore Artwork
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {cart.map((item) => (
                            <div key={item.id} className="flex gap-4 py-3 border-b">
                              <div className="h-20 w-20 rounded overflow-hidden bg-muted flex-shrink-0">
                                <img 
                                  src={item.image} 
                                  alt={item.title} 
                                  className="h-full w-full object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-medium">{item.title}</h4>
                                <p className="text-sm text-muted-foreground">{item.artist}</p>
                                <div className="flex justify-between mt-2">
                                  <span className="font-semibold">${item.price.toFixed(2)}</span>
                                  <span>Qty: {item.quantity}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          <div className="pt-4 flex justify-between">
                            <span className="font-semibold text-lg">Total:</span>
                            <span className="font-bold text-lg">
                              ${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}
                            </span>
                          </div>
                          
                          <div className="flex justify-end">
                            <Button onClick={() => navigate('/checkout')}>
                              Proceed to Checkout
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
                
                <TabsContent value="orders">
                  <Card>
                    <CardHeader>
                      <CardTitle>Order History</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-6">
                        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground opacity-20" />
                        <h3 className="mt-2 text-lg font-medium">No orders yet</h3>
                        <p className="mt-1 text-muted-foreground">
                          Your purchase history will appear here once you've made your first order.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Profile;
