import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Flower2 } from 'lucide-react';
import { auth, signInWithGoogle, signOutUser, onAuthStateChange, handleRedirect } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export default function Navbar() {
  const [location] = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Handle redirect on page load
    handleRedirect().catch(console.error);
    
    // Listen for auth state changes
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast({
        title: "Sign In Error",
        description: "There was an error signing in. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out."
      });
    } catch (error) {
      toast({
        title: "Sign Out Error",
        description: "There was an error signing out. Please try again.",
        variant: "destructive"
      });
    }
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/chakras', label: 'Chakras' },
    { href: '/test', label: 'Chakra Test' },
    { href: '/crystals', label: 'Crystals' },
    { href: '/meditation', label: 'Meditation' },
    { href: '/dashboard', label: 'Dashboard' }
  ];

  const isActive = (href: string) => {
    if (href === '/' && location === '/') return true;
    if (href !== '/' && location.startsWith(href)) return true;
    return false;
  };

  return (
    <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-md border-b border-jade/20 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-gradient-to-br from-jade to-emerald-600 rounded-full flex items-center justify-center">
              <Flower2 className="text-white text-lg" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Kenyetta's</h1>
              <p className="text-sm text-jade font-medium">Healing Center</p>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`px-3 py-2 font-medium transition-colors ${
                  isActive(item.href) 
                    ? 'text-jade font-semibold' 
                    : 'text-gray-700 hover:text-jade'
                }`}>
                  {item.label}
                </a>
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="hidden md:flex items-center space-x-3">
                <img 
                  src={user.photoURL || '/placeholder-avatar.png'} 
                  alt={user.displayName}
                  className="w-8 h-8 rounded-full"
                />
                <span className="text-sm text-gray-700">Hi, {user.displayName?.split(' ')[0]}</span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleSignOut}
                  className="border-jade/20 text-jade hover:bg-jade/5"
                >
                  Sign Out
                </Button>
              </div>
            ) : (
              <Button 
                onClick={handleSignIn}
                className="hidden md:block bg-jade text-white hover:bg-jade/90"
              >
                Sign In
              </Button>
            )}
            
            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="mt-8 space-y-4">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <a 
                        className={`block py-2 border-b border-gray-100 transition-colors ${
                          isActive(item.href) ? 'text-jade font-semibold' : 'text-gray-700'
                        }`}
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </a>
                    </Link>
                  ))}
                  
                  {/* Mobile Auth */}
                  <div className="pt-4">
                    {user ? (
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={user.photoURL || '/placeholder-avatar.png'} 
                            alt={user.displayName}
                            className="w-8 h-8 rounded-full"
                          />
                          <span className="text-sm text-gray-700">{user.displayName}</span>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full border-jade/20 text-jade hover:bg-jade/5"
                          onClick={() => {
                            handleSignOut();
                            setIsOpen(false);
                          }}
                        >
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        className="w-full bg-jade text-white hover:bg-jade/90"
                        onClick={() => {
                          handleSignIn();
                          setIsOpen(false);
                        }}
                      >
                        Sign In
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
