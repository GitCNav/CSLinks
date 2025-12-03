import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { tmdbApi } from '@/lib/tmdb';
import { Navbar } from '@/components/Navbar';
import { MediaGrid } from '@/components/MediaGrid';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Star, Clock, Calendar, Heart, Bookmark, Share2, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      try {
        const data = await tmdbApi.getMovieDetails(parseInt(id));
        setMovie(data);
      } catch (error) {
        console.error('Failed to fetch movie:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

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

  if (!movie) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-muted-foreground">Film non trouvé</p>
        </div>
      </div>
    );
  }

  const directors = movie.credits?.crew?.filter((c: any) => c.job === 'Director') || [];
  const cast = movie.credits?.cast?.slice(0, 12) || [];
  const trailer = movie.videos?.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-[60vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${tmdbApi.getImageUrl(movie.backdrop_path, 'original')})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/60" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative container mx-auto px-4 py-12">
          <Link to="/movies" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
            <ChevronLeft className="w-4 h-4" />
            Retour
          </Link>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex-shrink-0"
            >
              <img
                src={tmdbApi.getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-64 rounded-xl shadow-2xl"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="flex-1"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-xl text-muted-foreground italic mb-4">{movie.tagline}</p>
              )}

              <div className="flex flex-wrap items-center gap-4 mb-6">
                {movie.vote_average > 0 && (
                  <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-500 px-3 py-1 rounded-full">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}
                {movie.release_date && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                )}
                {movie.runtime > 0 && (
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{Math.floor(movie.runtime / 60)}h {movie.runtime % 60}min</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres?.map((genre: any) => (
                  <Badge key={genre.id} variant="secondary">{genre.name}</Badge>
                ))}
              </div>

              <p className="text-muted-foreground mb-6 max-w-2xl">{movie.overview}</p>

              {directors.length > 0 && (
                <p className="text-sm text-muted-foreground mb-6">
                  <span className="font-medium text-foreground">Réalisateur:</span>{' '}
                  {directors.map((d: any) => d.name).join(', ')}
                </p>
              )}

              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="gap-2">
                  <Play className="w-5 h-5 fill-current" />
                  Regarder
                </Button>
                {trailer && (
                  <Button size="lg" variant="outline" asChild>
                    <a href={`https://www.youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer">
                      Bande-annonce
                    </a>
                  </Button>
                )}
                <Button size="lg" variant="ghost">
                  <Heart className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="ghost">
                  <Bookmark className="w-5 h-5" />
                </Button>
                <Button size="lg" variant="ghost">
                  <Share2 className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Cast */}
      {cast.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Distribution</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {cast.map((person: any) => (
                <Link key={person.id} to={`/person/${person.id}`} className="group">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden bg-secondary mb-2">
                    {person.profile_path ? (
                      <img
                        src={tmdbApi.getImageUrl(person.profile_path, 'w300')}
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image
                      </div>
                    )}
                  </div>
                  <p className="font-medium text-sm group-hover:text-primary transition-colors">{person.name}</p>
                  <p className="text-xs text-muted-foreground">{person.character}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recommendations */}
      {movie.recommendations?.results?.length > 0 && (
        <section className="py-12 bg-secondary/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">Recommandations</h2>
            <MediaGrid items={movie.recommendations.results.slice(0, 12)} mediaType="movie" />
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetail;
