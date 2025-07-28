import { Card, CardContent } from '@/components/ui/card';
import ChakraCard from '@/components/ChakraCard';
import { chakras } from '@/data/chakras';

export default function Chakras() {
  return (
    <section className="pt-20 py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">The Seven Chakras</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Understanding your energy centers and how blockages affect your emotional, spiritual, and physical well-being
          </p>
        </div>

        {/* Chakra Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {chakras.map((chakra) => (
            <ChakraCard key={chakra.id} chakra={chakra} />
          ))}
        </div>

        {/* Chakra Frequencies */}
        <Card className="bg-gradient-to-r from-jade/10 to-emerald/10 border-jade/20">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">Chakra Healing Frequencies</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {chakras.map((chakra) => (
                <div key={chakra.id} className="text-center">
                  <div 
                    className="w-12 h-12 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: chakra.color }}
                  />
                  <p className="text-sm font-semibold">{chakra.frequency} Hz</p>
                  <p className="text-xs text-gray-600">{chakra.name}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
