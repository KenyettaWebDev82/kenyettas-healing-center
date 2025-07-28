import { Card, CardContent } from '@/components/ui/card';
import { Chakra } from '@/types';
import { Mountain, Droplet, Sun, Heart, Mic, Eye, Crown } from 'lucide-react';

interface ChakraCardProps {
  chakra: Chakra;
}

const iconMap = {
  'mountain': Mountain,
  'droplet': Droplet,
  'sun': Sun,
  'heart': Heart,
  'mic': Mic,
  'eye': Eye,
  'crown': Crown
};

export default function ChakraCard({ chakra }: ChakraCardProps) {
  const IconComponent = iconMap[chakra.icon as keyof typeof iconMap] || Heart;
  
  return (
    <Card 
      className={`bg-gradient-to-br from-[${chakra.color}]/10 to-[${chakra.color}]/5 rounded-2xl p-6 border-2 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
      style={{
        borderColor: `${chakra.color}33`
      }}
    >
      <CardContent className="p-0">
        <div className="text-center mb-4">
          <div 
            className="w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center"
            style={{ backgroundColor: chakra.color }}
          >
            <IconComponent className="text-white text-xl" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">{chakra.name}</h3>
          <p className="text-sm font-medium" style={{ color: chakra.color }}>
            {chakra.sanskrit}
          </p>
        </div>
        
        <div className="space-y-3 text-sm">
          <div>
            <span className="font-semibold text-gray-700">Location:</span>
            <p className="text-gray-600">{chakra.location}</p>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">Emotional Blockages:</span>
            <p className="text-gray-600">{chakra.emotionalBlockages.slice(0, 2).join(', ')}</p>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">Physical Effects:</span>
            <p className="text-gray-600">{chakra.physicalEffects.slice(0, 2).join(', ')}</p>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">Spiritual Impact:</span>
            <p className="text-gray-600">{chakra.spiritualImpact.slice(0, 2).join(', ')}</p>
          </div>
          
          <div>
            <span className="font-semibold text-gray-700">Frequency:</span>
            <p className="text-gray-600">{chakra.frequency} Hz</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
