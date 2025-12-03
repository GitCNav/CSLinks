import { useState, useEffect } from 'react';
import { tmdbApi, TMDBTV } from '@/lib/tmdb';
import { MediaGrid } from '@/components/MediaGrid';
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Play, Sparkles } from 'lucide-react';

const Anime = () => {
  const [anime, setAnime] = useState<TMDBTV[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchAnime(1);
  }, []);

  const fetchAnime = async (pageNum: number) => {
    setLoading(true);
    try {
      const data = await tmdbApi.getAnime(pageNum);
      
      if (pageNum === 1) {
        setAnime(data.results || []);
      } else {
        setAnime(prev => [...prev, ...(data.results || [])]);
      }
      setHasMore(pageNum < (data.total_pages || 1));
    } catch (error) {
      console.error('Failed to fetch anime:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchAnime(nextPage);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-background" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-pink-500/30 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl" />
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-pink-500" />
            <Play className="w-16 h-16 text-primary" />
            <Sparkles className="w-8 h-8 text-purple-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-pink-500 via-primary to-purple-500 bg-clip-text text-transparent">
              Anime
            </span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Plongez dans l'univers fascinant de l'animation japonaise
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          {/* Anime Grid */}
          {loading && page === 1 ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          ) : (
            <>
              <MediaGrid items={anime} mediaType="tv" />
              
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

export default Anime;
