import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { Crystal } from '@/types';
import { Link } from 'wouter';

interface CrystalCardProps {
  crystal: Crystal;
  onAddToWishlist?: (crystal: Crystal) => void;
}

const chakraColorMap: { [key: string]: string } = {
  'root': 'bg-chakra-root',
  'sacral': 'bg-chakra-sacral',
  'solar': 'bg-chakra-solar',
  'heart': 'bg-chakra-heart',
  'throat': 'bg-chakra-throat',
  'third-eye': 'bg-chakra-third-eye',
  'crown': 'bg-chakra-crown'
};

export default function CrystalCard({ crystal, onAddToWishlist }: CrystalCardProps) {
  return (
    <Card className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden">
      <img 
        src={crystal.image} 
        alt={`${crystal.name} healing crystal`}
        className="w-full h-48 object-cover"
      />
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-800">{crystal.name}</h3>
          <span className="text-lg font-bold text-jade">${crystal.price}</span>
        </div>
        
        <div className="flex space-x-1 mb-3">
          {crystal.chakras.map((chakra) => (
            <span 
              key={chakra}
              className={`inline-block w-3 h-3 rounded-full ${chakraColorMap[chakra]}`}
              title={`${chakra} chakra`}
            />
          ))}
        </div>
        
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {crystal.description}
        </p>
        
        <div className="flex space-x-2">
          <Link href={`/crystals/${crystal.id}`} className="flex-1">
            <Button className="w-full bg-jade text-white hover:bg-jade/90">
              View Details
            </Button>
          </Link>
          <Button 
            variant="outline"
            size="icon"
            onClick={() => onAddToWishlist?.(crystal)}
            className="border-gray-200 hover:bg-gray-100"
          >
            <Heart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
