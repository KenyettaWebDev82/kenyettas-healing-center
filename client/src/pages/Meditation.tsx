import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import AudioPlayer from '@/components/AudioPlayer';
import { Link } from 'wouter';
import { chakras } from '@/data/chakras';
import { crystals } from '@/data/crystals';
import { getLatestChakraTest, addMeditationSession, auth, onAuthStateChange } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Gem, Calendar, AlertTriangle } from 'lucide-react';

export default function Meditation() {
  const [user, setUser] = useState<any>(null);
  const [blockedChakras, setBlockedChakras] = useState<string[]>([]);
  const [recommendedCrystals, setRecommendedCrystals] = useState<string[]>([]);
  const [selectedMeditation, setSelectedMeditation] = useState('root');
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        await loadUserTestResults(user.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserTestResults = async (userId: string) => {
    try {
      const testResult = await getLatestChakraTest(userId);
      if (testResult?.results) {
        const blocked = Object.entries(testResult.results)
          .filter(([_, result]) => result.blocked)
          .map(([chakra, _]) => chakra);
        
        setBlockedChakras(blocked);
        
        // Get recommended crystals for blocked chakras
        const recommended = crystals
          .filter(crystal => crystal.chakras.some(chakra => blocked.includes(chakra)))
          .slice(0, 3)
          .map(crystal => crystal.name);
        
        setRecommendedCrystals(recommended);
        
        // Set first blocked chakra as default meditation
        if (blocked.length > 0) {
          setSelectedMeditation(blocked[0]);
        }
      }
    } catch (error) {
      console.error('Error loading test results:', error);
    }
  };

  const handleMeditationComplete = async () => {
    if (user) {
      try {
        await addMeditationSession(user.uid, {
          type: `${selectedMeditation} chakra healing`,
          duration: 15,
          chakraFocus: selectedMeditation,
          crystalsUsed: recommendedCrystals,
          completed: true
        });
        
        toast({
          title: "Meditation completed!",
          description: "Your session has been recorded in your progress."
        });
      } catch (error) {
        toast({
          title: "Could not save session",
          description: "Your meditation was completed successfully.",
          variant: "destructive"
        });
      }
    }
  };

  const selectedChakra = chakras.find(c => c.id === selectedMeditation);
  const meditationCrystals = crystals.filter(crystal => 
    crystal.chakras.includes(selectedMeditation)
  );

  return (
    <section className="pt-20 py-20 bg-gradient-to-br from-jade/5 to-emerald/10 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Guided Chakra Meditation</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Immerse yourself in healing frequencies and crystal energy. Our personalized meditations are designed 
            based on your chakra assessment results for maximum healing potential.
          </p>
        </div>

        {/* Meditation Player */}
        <Card className="bg-white/80 backdrop-blur-sm border-jade/20 shadow-2xl mb-12">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                  alt="Peaceful meditation scene with spiritual energy and chakra alignment" 
                  className="w-full rounded-2xl shadow-lg"
                />
              </div>
              
              <div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">
                  {selectedChakra?.name} Healing Session
                </h3>
                <p className="text-gray-600 mb-6">
                  A 15-minute guided meditation at {selectedChakra?.frequency} Hz frequency to help {selectedChakra?.description.toLowerCase()}. 
                  Use with {meditationCrystals[0]?.name || 'your chosen crystal'} for enhanced results.
                </p>
                
                <AudioPlayer
                  title={`${selectedChakra?.name} Meditation`}
                  subtitle={`${selectedChakra?.frequency} Hz Healing Frequency`}
                  duration="15:00"
                  onComplete={handleMeditationComplete}
                />
                
                {/* Crystal Instructions */}
                <Card className={`mt-6 bg-gradient-to-r from-[${selectedChakra?.color}]/10 to-[${selectedChakra?.color}]/5 border border-[${selectedChakra?.color}]/20`}>
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      <Gem className="inline w-5 h-5 mr-2" style={{ color: selectedChakra?.color }} />
                      Crystal Meditation Instructions
                    </h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p>• Hold your chosen crystal in your left hand (receiving hand)</p>
                      <p>• Place a second crystal at the {selectedChakra?.location.toLowerCase()} if lying down</p>
                      <p>• Visualize {selectedChakra?.color === '#DC2626' ? 'red' : selectedChakra?.color === '#EA580C' ? 'orange' : selectedChakra?.color === '#FBBF24' ? 'golden' : selectedChakra?.color === '#10B981' ? 'green' : selectedChakra?.color === '#3B82F6' ? 'blue' : selectedChakra?.color === '#6366F1' ? 'indigo' : 'violet'} healing light flowing through your {selectedChakra?.name.toLowerCase()}</p>
                      <p>• Focus on feeling {selectedChakra?.id === 'root' ? 'grounded and secure' : selectedChakra?.id === 'sacral' ? 'creative and passionate' : selectedChakra?.id === 'solar' ? 'confident and empowered' : selectedChakra?.id === 'heart' ? 'love and compassion' : selectedChakra?.id === 'throat' ? 'authentic expression' : selectedChakra?.id === 'third-eye' ? 'intuitive clarity' : 'spiritual connection'} with each breath</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Chakra Selection */}
        <Card className="bg-white/60 backdrop-blur-sm border-jade/20 mb-8">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Choose Your Meditation Focus</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
              {chakras.map((chakra) => (
                <Button
                  key={chakra.id}
                  variant={selectedMeditation === chakra.id ? "default" : "outline"}
                  className={`p-3 h-auto flex flex-col items-center space-y-2 ${
                    selectedMeditation === chakra.id 
                      ? 'border-2' 
                      : blockedChakras.includes(chakra.id)
                        ? 'border-red-300 bg-red-50'
                        : ''
                  }`}
                  style={{
                    borderColor: selectedMeditation === chakra.id ? chakra.color : undefined,
                    backgroundColor: selectedMeditation === chakra.id ? `${chakra.color}15` : undefined
                  }}
                  onClick={() => setSelectedMeditation(chakra.id)}
                >
                  <div 
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: chakra.color }}
                  />
                  <span className="text-xs font-medium text-center">{chakra.name}</span>
                  {blockedChakras.includes(chakra.id) && (
                    <AlertTriangle className="w-3 h-3 text-red-500" />
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Personalized Recommendations */}
        {user && (
          <Card className="bg-white/60 backdrop-blur-sm border-jade/20">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Your Personalized Meditation Plan</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Blocked Chakras Alert */}
                <Card className="bg-red-50 border border-red-200">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-red-800 mb-3">
                      <AlertTriangle className="inline w-5 h-5 mr-2" />
                      Focus Areas
                    </h4>
                    <div className="space-y-2 text-sm">
                      {blockedChakras.length > 0 ? (
                        blockedChakras.map(chakraId => {
                          const chakra = chakras.find(c => c.id === chakraId);
                          return (
                            <div key={chakraId} className="flex items-center justify-between">
                              <span className="text-gray-700">{chakra?.name}</span>
                              <span className="text-red-600 font-medium">Needs attention</span>
                            </div>
                          );
                        })
                      ) : (
                        <p className="text-green-700">All chakras are balanced! 🎉</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Recommended Crystals */}
                <Card className="bg-jade/5 border border-jade/20">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-jade mb-3">
                      <Gem className="inline w-5 h-5 mr-2" />
                      Recommended Crystals
                    </h4>
                    <div className="space-y-2 text-sm">
                      {recommendedCrystals.length > 0 ? (
                        recommendedCrystals.map((crystalName, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-jade rounded-full" />
                            <span className="text-gray-700">{crystalName}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-700">Complete your chakra test for personalized recommendations</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Meditation Schedule */}
                <Card className="bg-blue-50 border border-blue-200">
                  <CardContent className="p-6">
                    <h4 className="font-semibold text-blue-800 mb-3">
                      <Calendar className="inline w-5 h-5 mr-2" />
                      Suggested Practice
                    </h4>
                    <div className="space-y-2 text-sm text-gray-700">
                      <p>• Daily 15-minute sessions</p>
                      <p>• Focus on {blockedChakras.length > 0 ? 'blocked chakras' : 'maintaining balance'}</p>
                      <p>• Morning grounding practice</p>
                      <p>• Track mood improvements</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <div className="text-center mt-8 space-x-4">
                <Link href="/test">
                  <Button className="bg-jade text-white px-6 py-3 rounded-lg font-semibold hover:bg-jade/90">
                    {blockedChakras.length > 0 ? 'Retake Chakra Test' : 'Take Chakra Test'}
                  </Button>
                </Link>
                <Link href="/crystals">
                  <Button variant="outline" className="text-jade px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 border-jade/20">
                    Shop Recommended Crystals
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {!user && (
          <Card className="bg-white/60 backdrop-blur-sm border-jade/20">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Get Personalized Recommendations</h3>
              <p className="text-gray-600 mb-6">
                Sign in and take our chakra assessment to receive personalized meditation and crystal recommendations.
              </p>
              <div className="space-x-4">
                <Link href="/test">
                  <Button className="bg-jade text-white px-6 py-3 rounded-lg font-semibold hover:bg-jade/90">
                    Take Chakra Assessment
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
