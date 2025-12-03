import { useState, useEffect } from 'react';
import { tmdbApi, TMDBTV } from '@/lib/tmdb';
import { MediaGrid } from '@/components/MediaGrid';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tv, TrendingUp, Star, Calendar, Radio } from 'lucide-react';

const TVPage = () => {
  const [shows, setShows] = useState<TMDBTV[]>([]);
  const [category, setCategory] = useState('popular');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(1);
    setShows([]);
    fetchShows(1);
  }, [category]);

  const fetchShows = async (pageNum: number) => {
    setLoading(true);
    try {
      let data;
      switch (category) {
        case 'top_rated':
          data = await tmdbApi.getTopRatedTV(pageNum);
          break;
        case 'airing_today':
          data = await tmdbApi.getAiringTodayTV(pageNum);
          break;
        case 'on_the_air':
          data = await tmdbApi.getOnTheAirTV(pageNum);
          break;
        default:
          data = await tmdbApi.getPopularTV(pageNum);
      }
      
      if (pageNum === 1) {
        setShows(data.results || []);
      } else {
        setShows(prev => [...prev, ...(data.results || [])]);
      }
      setHasMore(pageNum < (data.total_pages || 1));
    } catch (error) {
      console.error('Failed to fetch TV shows:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchShows(nextPage);
  };

  const categories = [
    { id: 'popular', label: 'Populaires', icon: TrendingUp },
    { id: 'top_rated', label: 'Mieux notées', icon: Star },
    { id: 'airing_today', label: "Aujourd'hui", icon: Calendar },
    { id: 'on_the_air', label: 'En cours', icon: Radio },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-background to-background" />
        <div className="relative container mx-auto px-4 text-center">
          <Tv className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Séries TV</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explorez les meilleures séries du moment et les classiques incontournables
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={category === cat.id ? 'default' : 'outline'}
                onClick={() => setCategory(cat.id)}
                className="gap-2"
              >
                <cat.icon className="w-4 h-4" />
                {cat.label}
              </Button>
            ))}
          </div>

          {/* Shows Grid */}
          {loading && page === 1 ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              <MediaGrid items={shows} mediaType="tv" />
              
              {hasMore && (
                <div className="flex justify-center mt-12">
                  <Button
                    onClick={loadMore}
                    disabled={loading}
                    size="lg"
                    variant="outline"
                  >
                    {loading ? 'Chargement...' : 'Charger plus'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default TVPage;
