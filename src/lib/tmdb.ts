const TMDB_API_KEY = 'd430c6c589f4549e780b7e1786f0ac9c';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p';

export const tmdbApi = {
  getImageUrl: (path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500') => {
    if (!path) return '/placeholder.svg';
    return `${TMDB_IMAGE_BASE}/${size}${path}`;
  },

  searchMulti: async (query: string) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=1`
    );
    return res.json();
  },

  searchMovies: async (query: string) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=1`
    );
    return res.json();
  },

  searchTV: async (query: string) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/search/tv?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=1`
    );
    return res.json();
  },

  searchPerson: async (query: string) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/search/person?api_key=${TMDB_API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=1`
    );
    return res.json();
  },

  getTrending: async (mediaType: 'all' | 'movie' | 'tv' | 'person' = 'all', timeWindow: 'day' | 'week' = 'week') => {
    const res = await fetch(
      `${TMDB_BASE_URL}/trending/${mediaType}/${timeWindow}?api_key=${TMDB_API_KEY}&language=fr-FR`
    );
    return res.json();
  },

  getPopularMovies: async (page = 1) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=${page}`
    );
    return res.json();
  },

  getTopRatedMovies: async (page = 1) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/top_rated?api_key=${TMDB_API_KEY}&language=fr-FR&page=${page}`
    );
    return res.json();
  },

  getNowPlayingMovies: async (page = 1) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/now_playing?api_key=${TMDB_API_KEY}&language=fr-FR&page=${page}`
    );
    return res.json();
  },

  getUpcomingMovies: async (page = 1) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=${TMDB_API_KEY}&language=fr-FR&page=${page}`
    );
    return res.json();
  },

  getPopularTV: async (page = 1) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/tv/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=${page}`
    );
    return res.json();
  },

  getTopRatedTV: async (page = 1) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/tv/top_rated?api_key=${TMDB_API_KEY}&language=fr-FR&page=${page}`
    );
    return res.json();
  },

  getAiringTodayTV: async (page = 1) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/tv/airing_today?api_key=${TMDB_API_KEY}&language=fr-FR&page=${page}`
    );
    return res.json();
  },

  getOnTheAirTV: async (page = 1) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/tv/on_the_air?api_key=${TMDB_API_KEY}&language=fr-FR&page=${page}`
    );
    return res.json();
  },

  getMovieDetails: async (id: number) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits,videos,recommendations,similar`
    );
    return res.json();
  },

  getTVDetails: async (id: number) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/tv/${id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=credits,videos,recommendations,similar`
    );
    return res.json();
  },

  getTVSeasonDetails: async (tvId: number, seasonNumber: number) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${TMDB_API_KEY}&language=fr-FR`
    );
    return res.json();
  },

  getPersonDetails: async (id: number) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/person/${id}?api_key=${TMDB_API_KEY}&language=fr-FR&append_to_response=combined_credits,images`
    );
    return res.json();
  },

  getPopularPeople: async (page = 1) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/person/popular?api_key=${TMDB_API_KEY}&language=fr-FR&page=${page}`
    );
    return res.json();
  },

  getMovieGenres: async () => {
    const res = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${TMDB_API_KEY}&language=fr-FR`
    );
    return res.json();
  },

  getTVGenres: async () => {
    const res = await fetch(
      `${TMDB_BASE_URL}/genre/tv/list?api_key=${TMDB_API_KEY}&language=fr-FR`
    );
    return res.json();
  },

  discoverMovies: async (params: Record<string, string | number> = {}) => {
    const searchParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'fr-FR',
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    });
    const res = await fetch(`${TMDB_BASE_URL}/discover/movie?${searchParams}`);
    return res.json();
  },

  discoverTV: async (params: Record<string, string | number> = {}) => {
    const searchParams = new URLSearchParams({
      api_key: TMDB_API_KEY,
      language: 'fr-FR',
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
    });
    const res = await fetch(`${TMDB_BASE_URL}/discover/tv?${searchParams}`);
    return res.json();
  },

  // Anime (animation genre for TV)
  getAnime: async (page = 1) => {
    const res = await fetch(
      `${TMDB_BASE_URL}/discover/tv?api_key=${TMDB_API_KEY}&language=fr-FR&with_genres=16&with_origin_country=JP&sort_by=popularity.desc&page=${page}`
    );
    return res.json();
  },
};

export type TMDBMovie = {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  media_type?: 'movie';
};

export type TMDBTV = {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  media_type?: 'tv';
};

export type TMDBPerson = {
  id: number;
  name: string;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  media_type?: 'person';
};

export type TMDBSearchResult = TMDBMovie | TMDBTV | TMDBPerson;
