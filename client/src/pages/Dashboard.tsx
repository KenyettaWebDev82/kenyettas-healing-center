import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import MoodTracker from '@/components/MoodTracker';
import { Link } from 'wouter';
import { 
  getMoodEntries, 
  getMeditationSessions, 
  getLatestChakraTest, 
  auth, 
  onAuthStateChange 
} from '@/lib/firebase';
import { MoodEntry, MeditationSession, ChakraTestResult } from '@/types';
import { chakras } from '@/data/chakras';
import { 
  Flame, 
  Smile, 
  Flower2, 
  Clock, 
  Pill,
  Heart,
  Gem,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>([]);
  const [latestTest, setLatestTest] = useState<ChakraTestResult | null>(null);
  const [timeRange, setTimeRange] = useState('30');
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (user) => {
      setUser(user);
      if (user) {
        await loadUserData(user.uid);
      } else {
        setIsLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const loadUserData = async (userId: string) => {
    try {
      setIsLoading(true);
      const [moods, sessions, testResult] = await Promise.all([
        getMoodEntries(userId, parseInt(timeRange)),
        getMeditationSessions(userId),
        getLatestChakraTest(userId)
      ]);
      
      setMoodEntries(moods);
      setMeditationSessions(sessions);
      setLatestTest(testResult);
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Could not load your dashboard data. Please try refreshing.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMoodSaved = () => {
    if (user) {
      loadUserData(user.uid);
    }
  };

  if (!user) {
    return (
      <section className="pt-20 py-20 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-8">
            <Flower2 className="w-16 h-16 mx-auto text-jade mb-4" />
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Welcome to Your Healing Dashboard</h2>
            <p className="text-xl text-gray-600 mb-8">
              Sign in to track your mood, meditation progress, and spiritual growth journey.
            </p>
            <Button className="bg-jade text-white hover:bg-jade/90 px-8 py-3 text-lg">
              Sign In to Continue
            </Button>
          </div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="pt-20 py-20 bg-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-jade mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your healing journey data...</p>
          </div>
        </div>
      </section>
    );
  }

  // Calculate statistics
  const averageMood = moodEntries.length > 0 
    ? Math.round((moodEntries.reduce((sum, entry) => sum + entry.mood, 0) / moodEntries.length) * 10) / 10
    : 0;

  const meditationStreak = calculateMeditationStreak(meditationSessions);
  const totalMeditationTime = meditationSessions.reduce((total, session) => total + (session.duration || 0), 0);
  const balancedChakras = latestTest ? 
    Object.values(latestTest.results).filter(result => !result.blocked).length : 0;

  const moodTrend = calculateMoodTrend(moodEntries);

  return (
    <section className="pt-20 py-20 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Your Healing Journey</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Track your progress, monitor mood improvements, and celebrate your spiritual growth over time.
          </p>
        </div>

        {/* User Profile Card */}
        <Card className="bg-gradient-to-r from-jade to-emerald-600 text-white mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-4 mb-4 md:mb-0">
                <img 
                  src={user.photoURL || '/placeholder-avatar.png'} 
                  alt={user.displayName}
                  className="w-16 h-16 rounded-full border-2 border-white/20"
                />
                <div>
                  <h3 className="text-2xl font-bold">Welcome back, {user.displayName?.split(' ')[0]}</h3>
                  <p className="text-jade-100">
                    Member since {new Date(user.metadata?.creationTime || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold">{totalMeditationTime}</p>
                <p className="text-jade-100">Pill minutes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          
          {/* Mood Tracking Chart */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg border-gray-100">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="text-xl font-bold text-gray-800">Mood Progression</CardTitle>
                  <Select value={timeRange} onValueChange={(value) => {
                    setTimeRange(value);
                    if (user) loadUserData(user.uid);
                  }}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Last 7 days</SelectItem>
                      <SelectItem value="30">Last 30 days</SelectItem>
                      <SelectItem value="90">Last 3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                {moodEntries.length > 0 ? (
                  <div className="h-64 bg-gray-50 rounded-xl flex items-end justify-between p-4 space-x-2">
                    {/* Simple bar chart visualization */}
                    {moodEntries.slice(-14).map((entry, index) => (
                      <div key={index} className="flex flex-col items-center space-y-1">
                        <div 
                          className="bg-jade rounded-t min-w-[12px] transition-all duration-300 hover:bg-jade/80"
                          style={{ 
                            height: `${(entry.mood / 10) * 200}px`,
                            width: `${100 / Math.min(moodEntries.length, 14)}%`
                          }}
                        />
                        <span className="text-xs text-gray-500 transform -rotate-45 origin-center">
                          {new Date(entry.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <Smile className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No mood data yet</p>
                      <p className="text-sm text-gray-400">Start tracking your daily mood below</p>
                    </div>
                  </div>
                )}
                
                {/* Chart Legend */}
                {moodEntries.length > 0 && (
                  <div className="flex items-center justify-center mt-4 space-x-6 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-jade rounded-full"></div>
                      <span className="text-gray-600">Mood Score</span>
                    </div>
                    <div className={`font-semibold ${moodTrend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {moodTrend >= 0 ? '↗' : '↘'} {Math.abs(moodTrend).toFixed(1)} points this period
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Today's Check-in */}
          <div>
            <MoodTracker userId={user.uid} onMoodSaved={handleMoodSaved} />
          </div>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          
          {/* Pill Streak */}
          <Card className="shadow-lg border-gray-100 hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-jade/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Flame className="text-jade text-xl" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">{meditationStreak} Days</h4>
              <p className="text-gray-600 text-sm">Pill Streak</p>
            </CardContent>
          </Card>
          
          {/* Average Mood */}
          <Card className="shadow-lg border-gray-100 hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Smile className="text-yellow-600 text-xl" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">{averageMood || '—'}</h4>
              <p className="text-gray-600 text-sm">Average Mood</p>
            </CardContent>
          </Card>
          
          {/* Chakras Balanced */}
          <Card className="shadow-lg border-gray-100 hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Flower2 className="text-purple-600 text-xl" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">{balancedChakras}/7</h4>
              <p className="text-gray-600 text-sm">Chakras Balanced</p>
            </CardContent>
          </Card>
          
          {/* Total Sessions */}
          <Card className="shadow-lg border-gray-100 hover:shadow-xl transition-shadow">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="text-blue-600 text-xl" />
              </div>
              <h4 className="text-2xl font-bold text-gray-800">{meditationSessions.length}</h4>
              <p className="text-gray-600 text-sm">Total Sessions</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="shadow-lg border-gray-100">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-800">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {meditationSessions.length > 0 || moodEntries.length > 0 ? (
              <div className="space-y-4">
                {/* Recent meditation sessions */}
                {meditationSessions.slice(0, 3).map((session, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-jade/5 rounded-xl">
                    <div className="w-10 h-10 bg-jade rounded-full flex items-center justify-center">
                      <Pill className="text-white text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">
                        Completed {session.type || 'meditation session'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {session.duration} minutes • {new Date(session.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-jade font-semibold">+{Math.floor((session.duration || 0) / 5)} points</div>
                  </div>
                ))}
                
                {/* Recent mood entries */}
                {moodEntries.slice(0, 2).map((entry, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                      <Heart className="text-white text-sm" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">Mood check-in recorded</p>
                      <p className="text-sm text-gray-500">
                        Feeling: {getMoodLabel(entry.mood)} ({entry.mood}/10) • {new Date(entry.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No activity yet</p>
                <p className="text-sm text-gray-400 mb-4">
                  Start your healing journey by taking a chakra test or meditation session
                </p>
                <div className="space-x-4">
                  <Link href="/test">
                    <Button className="bg-jade text-white hover:bg-jade/90">
                      Take Chakra Test
                    </Button>
                  </Link>
                  <Link href="/meditation">
                    <Button variant="outline" className="border-jade/20 text-jade hover:bg-jade/5">
                      Start Pill
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

// Helper functions
function calculateMeditationStreak(sessions: MeditationSession[]): number {
  if (sessions.length === 0) return 0;
  
  const sortedSessions = sessions.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  
  for (const session of sortedSessions) {
    const sessionDate = new Date(session.date);
    sessionDate.setHours(0, 0, 0, 0);
    
    const daysDiff = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysDiff === streak) {
      streak++;
    } else if (daysDiff === streak + 1) {
      // Allow for yesterday if today hasn't been completed yet
      streak++;
    } else {
      break;
    }
    
    currentDate = new Date(sessionDate);
    currentDate.setDate(currentDate.getDate() - 1);
  }
  
  return streak;
}

function calculateMoodTrend(entries: MoodEntry[]): number {
  if (entries.length < 2) return 0;
  
  const sortedEntries = entries.sort((a, b) => 
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
  
  const firstHalf = sortedEntries.slice(0, Math.floor(sortedEntries.length / 2));
  const secondHalf = sortedEntries.slice(Math.floor(sortedEntries.length / 2));
  
  const firstAvg = firstHalf.reduce((sum, entry) => sum + entry.mood, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((sum, entry) => sum + entry.mood, 0) / secondHalf.length;
  
  return secondAvg - firstAvg;
}

function getMoodLabel(mood: number): string {
  if (mood <= 2) return 'Poor';
  if (mood <= 4) return 'Low';
  if (mood <= 6) return 'Okay';
  if (mood <= 8) return 'Good';
  return 'Excellent';
}
