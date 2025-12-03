import { useState, useEffect } from 'react';
import { tmdbApi, TMDBMovie } from '@/lib/tmdb';
import { MediaGrid } from '@/components/MediaGrid';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Film, TrendingUp, Star, Calendar, Clock } from 'lucide-react';

const Movies = () => {
  const [movies, setMovies] = useState<TMDBMovie[]>([]);
  const [category, setCategory] = useState('popular');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setPage(1);
    setMovies([]);
    fetchMovies(1);
  }, [category]);

  const fetchMovies = async (pageNum: number) => {
    setLoading(true);
    try {
      let data;
      switch (category) {
        case 'top_rated':
          data = await tmdbApi.getTopRatedMovies(pageNum);
          break;
        case 'now_playing':
          data = await tmdbApi.getNowPlayingMovies(pageNum);
          break;
        case 'upcoming':
          data = await tmdbApi.getUpcomingMovies(pageNum);
          break;
        default:
          data = await tmdbApi.getPopularMovies(pageNum);
      }
      
      if (pageNum === 1) {
        setMovies(data.results || []);
      } else {
        setMovies(prev => [...prev, ...(data.results || [])]);
      }
      setHasMore(pageNum < (data.total_pages || 1));
    } catch (error) {
      console.error('Failed to fetch movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchMovies(nextPage);
  };

  const categories = [
    { id: 'popular', label: 'Populaires', icon: TrendingUp },
    { id: 'top_rated', label: 'Mieux notés', icon: Star },
    { id: 'now_playing', label: 'En salle', icon: Film },
    { id: 'upcoming', label: 'À venir', icon: Calendar },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="relative container mx-auto px-4 text-center">
          <Film className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Films</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Découvrez les derniers blockbusters, films cultes et pépites du cinéma mondial
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

          {/* Movies Grid */}
          {loading && page === 1 ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              <MediaGrid items={movies} mediaType="movie" />
              
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

export default Movies;
