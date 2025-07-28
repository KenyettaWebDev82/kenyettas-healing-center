import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { addMoodEntry } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

interface MoodTrackerProps {
  userId?: string;
  onMoodSaved?: () => void;
}

const moodEmojis = ['😢', '😟', '😕', '😐', '🙂', '😊', '😄', '😁', '🤩', '🥰'];
const moodColors = [
  'bg-red-100 hover:bg-red-200',
  'bg-red-100 hover:bg-red-200', 
  'bg-orange-100 hover:bg-orange-200',
  'bg-yellow-100 hover:bg-yellow-200',
  'bg-yellow-100 hover:bg-yellow-200',
  'bg-green-100 hover:bg-green-200',
  'bg-green-100 hover:bg-green-200',
  'bg-blue-100 hover:bg-blue-200',
  'bg-purple-100 hover:bg-purple-200',
  'bg-purple-100 hover:bg-purple-200'
];

export default function MoodTracker({ userId, onMoodSaved }: MoodTrackerProps) {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveMood = async () => {
    if (!selectedMood || !userId) {
      toast({
        title: "Please select a mood",
        description: "Choose how you're feeling before saving.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      await addMoodEntry(userId, selectedMood, note);
      toast({
        title: "Mood saved!",
        description: "Your daily check-in has been recorded."
      });
      setSelectedMood(null);
      setNote('');
      onMoodSaved?.();
    } catch (error) {
      toast({
        title: "Error saving mood",
        description: "Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-800">How are you feeling today?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-5 gap-2">
          {moodEmojis.map((emoji, index) => (
            <Button
              key={index}
              variant="ghost"
              className={`h-10 text-lg ${moodColors[index]} ${
                selectedMood === index + 1 ? 'ring-2 ring-jade' : ''
              }`}
              onClick={() => setSelectedMood(index + 1)}
            >
              {emoji}
            </Button>
          ))}
        </div>
        
        <div className="text-center text-xs text-gray-500">
          {selectedMood && (
            <span>You selected: {selectedMood}/10 - {moodEmojis[selectedMood - 1]}</span>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Quick note (optional)
          </label>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="How was your meditation today?"
            rows={3}
            className="resize-none"
          />
        </div>

        <Button 
          onClick={handleSaveMood}
          disabled={!selectedMood || isLoading}
          className="w-full bg-jade text-white hover:bg-jade/90"
        >
          {isLoading ? 'Saving...' : 'Save Check-in'}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          Track your daily energy to see your healing progress
        </div>
      </CardContent>
    </Card>
  );
}
