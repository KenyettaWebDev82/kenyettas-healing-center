import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'wouter';
import { chakraTestQuestions } from '@/data/questions';
import { chakras } from '@/data/chakras';
import { saveChakraTestResults, auth, onAuthStateChange } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { ChakraTestResult } from '@/types';

export default function ChakraTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [testResults, setTestResults] = useState<ChakraTestResult | null>(null);
  const [testStarted, setTestStarted] = useState(false);
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const startTest = () => {
    setTestStarted(true);
    setCurrentQuestion(0);
    setAnswers({});
    setTestResults(null);
  };

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [currentQuestion]: value };
    setAnswers(newAnswers);

    if (currentQuestion < chakraTestQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = async (finalAnswers: { [key: number]: number }) => {
    const chakraScores: { [key: string]: number[] } = {};
    
    // Group answers by chakra
    chakraTestQuestions.forEach((question, index) => {
      const chakra = question.chakra;
      const score = finalAnswers[index] || 1;
      
      if (!chakraScores[chakra]) {
        chakraScores[chakra] = [];
      }
      chakraScores[chakra].push(score);
    });

    // Calculate average scores and percentages
    const results: ChakraTestResult['results'] = {};
    
    Object.keys(chakraScores).forEach(chakra => {
      const scores = chakraScores[chakra];
      const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const percentage = (average / 5) * 100;
      
      results[chakra] = {
        score: average,
        percentage: Math.round(percentage),
        blocked: percentage < 60 // Consider blocked if less than 60%
      };
    });

    const testResult: ChakraTestResult = {
      userId: user?.uid || 'anonymous',
      results,
      timestamp: new Date(),
      date: new Date().toISOString().split('T')[0]
    };

    setTestResults(testResult);

    // Save to Firebase if user is logged in
    if (user) {
      try {
        await saveChakraTestResults(user.uid, results);
        toast({
          title: "Test results saved!",
          description: "Your chakra assessment has been recorded."
        });
      } catch (error) {
        toast({
          title: "Could not save results",
          description: "Your results are still available on this page.",
          variant: "destructive"
        });
      }
    }
  };

  const retakeTest = () => {
    setTestStarted(false);
    setTestResults(null);
    setCurrentQuestion(0);
    setAnswers({});
  };

  const progress = testStarted ? ((currentQuestion + 1) / chakraTestQuestions.length) * 100 : 0;

  if (testResults) {
    return (
      <section className="pt-20 py-20 bg-gradient-to-br from-cream to-jade/5 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white/80 backdrop-blur-sm border-jade/20 shadow-2xl">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Your Chakra Assessment Results</h3>
                <p className="text-gray-600">Based on your responses, here are your energy center insights:</p>
              </div>

              <div className="space-y-4 mb-8">
                {chakras.map((chakra) => {
                  const result = testResults.results[chakra.id];
                  if (!result) return null;

                  return (
                    <div 
                      key={chakra.id}
                      className={`flex items-center justify-between p-4 rounded-lg border-l-4 ${
                        result.blocked ? 'bg-red-50 border-red-400' : 'bg-green-50 border-green-400'
                      }`}
                    >
                      <div>
                        <h4 className="font-semibold text-gray-800">{chakra.name}</h4>
                        <p className="text-sm text-gray-600">
                          {result.blocked ? 'Needs attention' : 'Well balanced'}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="w-20 bg-gray-200 rounded-full h-2 mb-1">
                          <div 
                            className="h-2 rounded-full"
                            style={{ 
                              width: `${result.percentage}%`,
                              backgroundColor: chakra.color
                            }}
                          />
                        </div>
                        <span className="text-xs text-gray-500">{result.percentage}% balanced</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="text-center space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/meditation">
                    <Button className="bg-jade text-white px-6 py-3 rounded-lg font-semibold hover:bg-jade/90">
                      Get Personalized Meditation
                    </Button>
                  </Link>
                  <Link href="/crystals">
                    <Button variant="outline" className="text-jade px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 border-jade/20">
                      Find Healing Crystals
                    </Button>
                  </Link>
                </div>
                <div className="mt-4">
                  <Button 
                    variant="link"
                    onClick={retakeTest}
                    className="text-jade font-medium hover:underline"
                  >
                    Retake Assessment
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  if (testStarted) {
    const question = chakraTestQuestions[currentQuestion];
    
    return (
      <section className="pt-20 py-20 bg-gradient-to-br from-cream to-jade/5 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="bg-white/80 backdrop-blur-sm border-jade/20 shadow-2xl">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-gray-500">
                    Question {currentQuestion + 1} of {chakraTestQuestions.length}
                  </span>
                  <Progress value={progress} className="w-48" />
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-6">
                  {question.text}
                </h4>
                
                <div className="space-y-3">
                  {question.answers.map((answer, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full text-left p-4 h-auto border-2 border-gray-200 hover:border-jade hover:bg-jade/5 justify-start"
                      onClick={() => handleAnswer(answer.value)}
                    >
                      {answer.text}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section className="pt-20 py-20 bg-gradient-to-br from-cream to-jade/5 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Chakra Assessment</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Discover which chakras may be blocked and receive personalized recommendations for healing and balance
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-jade/20 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="mb-8">
              <img 
                src="https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400" 
                alt="Sacred chakra mandala symbol for spiritual assessment" 
                className="w-32 h-32 mx-auto rounded-full shadow-lg object-cover"
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-4">Begin Your Chakra Journey</h3>
            <p className="text-gray-600 mb-8 max-w-lg mx-auto">
              This comprehensive assessment will help identify energy imbalances in your chakra system. 
              Answer honestly for the most accurate results.
            </p>
            <Button 
              onClick={startTest}
              className="bg-jade text-white px-8 py-4 rounded-xl font-semibold hover:bg-jade/90 transition-all transform hover:scale-105 shadow-lg"
            >
              Start Assessment
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
