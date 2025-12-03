import { Link } from 'react-router-dom';
import { Star, Play } from 'lucide-react';
import { tmdbApi } from '@/lib/tmdb';
import { motion } from 'framer-motion';

interface MediaCardProps {
  id: number;
  title: string;
  posterPath: string | null;
  voteAverage?: number;
  releaseDate?: string;
  mediaType: 'movie' | 'tv' | 'person';
}

export const MediaCard = ({ id, title, posterPath, voteAverage, releaseDate, mediaType }: MediaCardProps) => {
  const linkPath = mediaType === 'person' ? `/person/${id}` : `/${mediaType}/${id}`;
  const year = releaseDate?.split('-')[0];

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={linkPath} className="group block">
        <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-secondary">
          {posterPath ? (
            <img
              src={tmdbApi.getImageUrl(posterPath, 'w500')}
              alt={title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="w-12 h-12 text-muted-foreground" />
            </div>
          )}
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-primary/90 flex items-center justify-center">
                <Play className="w-6 h-6 text-primary-foreground fill-current ml-1" />
              </div>
            </div>
          </div>

          {/* Rating Badge */}
          {voteAverage !== undefined && voteAverage > 0 && (
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 rounded-lg flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-current" />
              <span className="text-xs font-medium text-white">
                {voteAverage.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <div className="mt-3">
          <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          {year && (
            <p className="text-xs text-muted-foreground mt-1">{year}</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};
