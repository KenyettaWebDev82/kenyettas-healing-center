import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Grid3X3, List } from 'lucide-react';
import CrystalCard from '@/components/CrystalCard';
import { crystals } from '@/data/crystals';
import { Crystal } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function Crystals() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { toast } = useToast();

  const filterOptions = [
    { value: 'all', label: 'All Crystals' },
    { value: 'root', label: 'Root Chakra' },
    { value: 'sacral', label: 'Sacral Chakra' },
    { value: 'solar', label: 'Solar Plexus' },
    { value: 'heart', label: 'Heart Chakra' },
    { value: 'throat', label: 'Throat Chakra' },
    { value: 'third-eye', label: 'Third Eye' },
    { value: 'crown', label: 'Crown Chakra' }
  ];

  const filteredCrystals = crystals.filter(crystal => {
    if (activeFilter === 'all') return true;
    return crystal.chakras.includes(activeFilter);
  });

  const sortedCrystals = [...filteredCrystals].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleAddToWishlist = (crystal: Crystal) => {
    toast({
      title: "Added to wishlist!",
      description: `${crystal.name} has been added to your wishlist.`
    });
  };

  return (
    <section className="pt-20 py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">Healing Crystal Collection</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our carefully curated collection of natural healing crystals, each selected for their unique 
            properties and ability to balance specific chakras and enhance your spiritual journey.
          </p>
        </div>

        {/* Filter Section */}
        <div className="bg-gray-50 rounded-2xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((filter) => (
                <Button
                  key={filter.value}
                  variant={activeFilter === filter.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.value)}
                  className={activeFilter === filter.value ? "bg-jade text-white" : "hover:border-jade hover:text-jade"}
                >
                  {filter.label}
                </Button>
              ))}
            </div>
            <div className="flex items-center space-x-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popularity">Sort by: Popularity</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="name">Name: A to Z</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex space-x-2">
                <Button 
                  variant={viewMode === 'grid' ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={viewMode === 'grid' ? "bg-jade" : ""}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button 
                  variant={viewMode === 'list' ? "default" : "outline"}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={viewMode === 'list' ? "bg-jade" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Crystal Grid */}
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {sortedCrystals.map((crystal) => (
            <CrystalCard 
              key={crystal.id} 
              crystal={crystal} 
              onAddToWishlist={handleAddToWishlist}
            />
          ))}
        </div>

        {sortedCrystals.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No crystals found for the selected filter.</p>
            <Button 
              onClick={() => setActiveFilter('all')}
              className="mt-4 bg-jade text-white hover:bg-jade/90"
            >
              Show All Crystals
            </Button>
          </div>
        )}

        {/* Load More */}
        {sortedCrystals.length > 0 && (
          <div className="text-center mt-12">
            <Button className="bg-jade text-white px-8 py-3 rounded-xl font-semibold hover:bg-jade/90">
              Load More Crystals
            </Button>
            <p className="text-sm text-gray-500 mt-2">
              Showing {sortedCrystals.length} of {crystals.length} healing crystals
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
