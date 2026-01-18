const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

// Fetch movies by category
export async function fetchMoviesByCategory(
  category: string,
  page: number = 1,
) {
  let language = "";

  switch (category) {
    case "hollywood":
      language = "en";
      break;
    case "bollywood":
      language = "hi";
      break;
    case "punjabi":
      language = "pa";
      break;
    default:
      language = ""; // All languages
      break;
  }

  let url = `${BASE_URL}/discover/movie?api_key=${API_KEY}&page=${page}&sort_by=popularity.desc`;
  if (language) url += `&with_original_language=${language}`;

  const res = await fetch(url);
  return res.json();
}

// Fetch movie details
export async function fetchMovieDetails(id: number) {
  const res = await fetch(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);
  return res.json();
}

// Fetch videos (trailers, songs)
export async function fetchMovieVideos(id: number) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}/videos?api_key=${API_KEY}&language=en-US`,
  );
  return res.json();
}
