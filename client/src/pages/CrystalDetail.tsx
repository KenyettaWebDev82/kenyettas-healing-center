import { useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';
import { crystals } from '@/data/crystals';
import { chakras } from '@/data/chakras';
import { useToast } from '@/hooks/use-toast';

export default function CrystalDetail() {
  const [, params] = useRoute('/crystals/:id');
  const { toast } = useToast();
  
  const crystal = crystals.find(c => c.id === params?.id);

  if (!crystal) {
    return (
      <div className="pt-20 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Crystal Not Found</h2>
          <p className="text-gray-600 mb-4">The crystal you're looking for doesn't exist.</p>
          <Link href="/crystals">
            <Button className="bg-jade text-white hover:bg-jade/90">
              Back to Crystals
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const associatedChakras = chakras.filter(chakra => crystal.chakras.includes(chakra.id));

  const handleAddToCart = () => {
    toast({
      title: "Added to cart!",
      description: `${crystal.name} has been added to your cart.`
    });
  };

  const handleAddToWishlist = () => {
    toast({
      title: "Added to wishlist!",
      description: `${crystal.name} has been added to your wishlist.`
    });
  };

  return (
    <section className="pt-20 py-20 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link href="/crystals" className="inline-flex items-center space-x-2 text-jade hover:text-jade/80 mb-8">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Crystals</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Crystal Image */}
          <div>
            <img 
              src={crystal.image} 
              alt={`${crystal.name} healing crystal`}
              className="w-full rounded-2xl shadow-2xl"
            />
          </div>
          
          {/* Crystal Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{crystal.name}</h1>
            <p className="text-3xl font-bold text-jade mb-6">${crystal.price}</p>
            
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">About This Crystal</h3>
                <p className="text-gray-600">{crystal.description}</p>
              </div>

              {/* Chakra Association */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Chakra Association</h3>
                <div className="space-y-2">
                  {associatedChakras.map((chakra) => (
                    <div key={chakra.id} className="flex items-center space-x-3">
                      <div 
                        className="w-6 h-6 rounded-full"
                        style={{ backgroundColor: chakra.color }}
                      />
                      <span className="text-gray-700">{chakra.name} ({chakra.sanskrit})</span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Healing Properties */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Healing Properties</h3>
                <ul className="text-gray-600 space-y-1">
                  {crystal.healingProperties.map((property, index) => (
                    <li key={index}>• {property}</li>
                  ))}
                </ul>
              </div>
              
              {/* Meditation Instructions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">How to Use in Meditation</h3>
                <p className="text-gray-600">{crystal.meditationInstructions}</p>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-8 space-y-4">
              <Button 
                onClick={handleAddToCart}
                className="w-full bg-jade text-white py-3 rounded-lg font-semibold hover:bg-jade/90 text-lg"
              >
                Add to Cart - ${crystal.price}
              </Button>
              <Button 
                onClick={handleAddToWishlist}
                variant="outline"
                className="w-full border-jade/20 text-jade py-3 rounded-lg font-semibold hover:bg-jade/5 text-lg"
              >
                <Heart className="w-5 h-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>
          </div>
        </div>

        {/* Related Crystals Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-800 mb-8 text-center">
            Other Crystals for {associatedChakras[0]?.name || 'Similar Energy'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {crystals
              .filter(c => c.id !== crystal.id && c.chakras.some(chakra => crystal.chakras.includes(chakra)))
              .slice(0, 4)
              .map((relatedCrystal) => (
                <Card key={relatedCrystal.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <img 
                      src={relatedCrystal.image} 
                      alt={relatedCrystal.name}
                      className="w-full h-32 object-cover rounded-lg mb-3"
                    />
                    <h4 className="font-semibold text-gray-800 mb-1">{relatedCrystal.name}</h4>
                    <p className="text-jade font-bold">${relatedCrystal.price}</p>
                    <Link href={`/crystals/${relatedCrystal.id}`}>
                      <Button size="sm" className="w-full mt-3 bg-jade text-white hover:bg-jade/90">
                        View Details
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
