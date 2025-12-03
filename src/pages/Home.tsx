import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { tmdbApi, TMDBMovie, TMDBTV } from '@/lib/tmdb';
import { ThreeDMarquee } from '@/components/ui/3d-marquee';
import { MediaGrid } from '@/components/MediaGrid';
import { Button } from '@/components/ui/button';
import { ChevronRight, Play, Star, TrendingUp, Film, Tv } from 'lucide-react';
import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';

const Home = () => {
  const [trending, setTrending] = useState<(TMDBMovie | TMDBTV)[]>([]);
  const [popularMovies, setPopularMovies] = useState<TMDBMovie[]>([]);
  const [popularTV, setPopularTV] = useState<TMDBTV[]>([]);
  const [anime, setAnime] = useState<TMDBTV[]>([]);
  const [marqueeImages, setMarqueeImages] = useState<string[]>([]);
  const [featuredItem, setFeaturedItem] = useState<TMDBMovie | TMDBTV | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [trendingRes, moviesRes, tvRes, animeRes] = await Promise.all([
          tmdbApi.getTrending('all', 'week'),
          tmdbApi.getPopularMovies(),
          tmdbApi.getPopularTV(),
          tmdbApi.getAnime(),
        ]);

        const trendingItems = trendingRes.results || [];
        setTrending(trendingItems.slice(0, 12));
        setPopularMovies(moviesRes.results || []);
        setPopularTV(tvRes.results || []);
        setAnime(animeRes.results || []);

        // Set featured item
        const featured = trendingItems.find((item: any) => item.backdrop_path);
        setFeaturedItem(featured || trendingItems[0]);

        // Collect images for marquee
        const images = trendingItems
          .filter((item: any) => item.poster_path)
          .slice(0, 24)
          .map((item: any) => tmdbApi.getImageUrl(item.poster_path, 'w500'));
        setMarqueeImages(images);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  const featuredTitle = featuredItem && ('title' in featuredItem ? featuredItem.title : featuredItem.name);
  const featuredOverview = featuredItem?.overview;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Featured Content */}
      {featuredItem && (
        <section className="relative h-[70vh] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${tmdbApi.getImageUrl(featuredItem.backdrop_path, 'original')})`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>

          <div className="relative container mx-auto px-4 h-full flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{featuredTitle}</h1>
              <div className="flex items-center gap-4 mb-4">
                {featuredItem.vote_average > 0 && (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{featuredItem.vote_average.toFixed(1)}</span>
                  </div>
                )}
                <span className="px-2 py-1 bg-primary/20 text-primary rounded text-sm">
                  {'title' in featuredItem ? 'Film' : 'Série'}
                </span>
              </div>
              <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
                {featuredOverview}
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="gap-2">
                  <Play className="w-5 h-5 fill-current" />
                  Regarder
                </Button>
                <Button size="lg" variant="outline">
                  Plus d'infos
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* 3D Marquee Section */}
      {marqueeImages.length > 0 && (
        <section className="py-16 overflow-hidden">
          <div className="container mx-auto px-4 mb-8">
            <h2 className="text-3xl font-bold text-center">
              Découvrez notre{' '}
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Catalogue
              </span>
            </h2>
            <p className="text-muted-foreground text-center mt-2">
              Des milliers de films, séries et animes vous attendent
            </p>
          </div>
          <ThreeDMarquee images={marqueeImages} />
        </section>
      )}

      {/* Trending Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Tendances</h2>
            </div>
            <Link to="/trending">
              <Button variant="ghost" className="gap-2">
                Voir tout <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <MediaGrid items={trending} />
        </div>
      </section>

      {/* Popular Movies */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Film className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Films Populaires</h2>
            </div>
            <Link to="/movies">
              <Button variant="ghost" className="gap-2">
                Voir tout <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <MediaGrid items={popularMovies.slice(0, 12)} mediaType="movie" />
        </div>
      </section>

      {/* Popular TV Shows */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Tv className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Séries Populaires</h2>
            </div>
            <Link to="/tv">
              <Button variant="ghost" className="gap-2">
                Voir tout <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <MediaGrid items={popularTV.slice(0, 12)} mediaType="tv" />
        </div>
      </section>

      {/* Anime Section */}
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <Play className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Anime</h2>
            </div>
            <Link to="/anime">
              <Button variant="ghost" className="gap-2">
                Voir tout <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
          <MediaGrid items={anime.slice(0, 12)} mediaType="tv" />
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 AnimeFlow. Tous droits réservés.</p>
          <p className="text-sm mt-2">Données fournies par TMDB</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
