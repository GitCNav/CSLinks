import { MediaCard } from './MediaCard';
import { TMDBMovie, TMDBTV, TMDBPerson } from '@/lib/tmdb';

interface MediaGridProps {
  items: (TMDBMovie | TMDBTV | TMDBPerson)[];
  mediaType?: 'movie' | 'tv' | 'person';
}

export const MediaGrid = ({ items, mediaType }: MediaGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
      {items.map((item) => {
        const type = mediaType || (item as any).media_type || 'movie';
        const title = 'title' in item ? item.title : 'name' in item ? item.name : '';
        const posterPath = 'poster_path' in item ? item.poster_path : 'profile_path' in item ? item.profile_path : null;
        const releaseDate = 'release_date' in item ? item.release_date : 'first_air_date' in item ? item.first_air_date : undefined;
        const voteAverage = 'vote_average' in item ? item.vote_average : undefined;

        return (
          <MediaCard
            key={item.id}
            id={item.id}
            title={title}
            posterPath={posterPath}
            voteAverage={voteAverage}
            releaseDate={releaseDate}
            mediaType={type}
          />
        );
      })}
    </div>
  );
};
