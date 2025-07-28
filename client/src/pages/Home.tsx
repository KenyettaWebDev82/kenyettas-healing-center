import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import MoodTracker from '@/components/MoodTracker';
import { auth, onAuthStateChange } from '@/lib/firebase';

export default function Home() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <section className="pt-20 min-h-screen relative overflow-hidden">
      <div className="sacred-pattern absolute inset-0 opacity-30"></div>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          {/* Main Hero */}
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-script font-bold text-gray-800 mb-4">
              Welcome to Your
              <span className="chakra-gradient bg-clip-text text-transparent ml-4">
                Healing Journey
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Discover the ancient wisdom of chakras and healing crystals. Align your energy, 
              elevate your vibration, and transform your life through guided meditation and crystal healing.
            </p>
          </div>

          {/* Daily Check-in Widget */}
          <div className="flex justify-center mb-12">
            {user ? (
              <MoodTracker userId={user.uid} />
            ) : (
              <div className="max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-jade/20">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  Sign in to track your healing progress
                </h3>
                <p className="text-gray-600 text-sm">
                  Join our community and start monitoring your daily energy and mood improvements through your spiritual journey.
                </p>
              </div>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/test">
              <Button className="bg-jade text-white px-8 py-4 rounded-xl font-semibold hover:bg-jade/90 transition-all transform hover:scale-105 shadow-lg">
                Take Chakra Assessment
              </Button>
            </Link>
            <Link href="/crystals">
              <Button variant="outline" className="text-jade px-8 py-4 rounded-xl font-semibold hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg border-jade/20">
                Explore Healing Crystals
              </Button>
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="text-center">
          <img 
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
            alt="Meditation space with chakra stones and healing crystals" 
            className="rounded-3xl shadow-2xl mx-auto max-w-4xl w-full h-auto animate-float"
          />
        </div>
      </div>
    </section>
  );
}
