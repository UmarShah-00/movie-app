import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "../../styles/MovieDetail.module.css";
import Link from "next/link";
import { fetchMovieDetails, fetchMovieVideos } from "../../utils/tmdb";
import Footer from "../../components/Footer";

const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const MovieDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  const [movie, setMovie] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [trailerKey, setTrailerKey] = useState<string | null>(null);
  const [songKey, setSongKey] = useState<string | null>(null);
  const [providers, setProviders] = useState<any[]>([]);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    Promise.all([fetchMovieDetails(Number(id)), fetchMovieVideos(Number(id))])
      .then(([details, videos]) => {
        setMovie(details);

        // Trailer
        const trailer = videos.results.find(
          (v: any) => v.type === "Trailer" && v.site === "YouTube"
        );
        setTrailerKey(trailer ? trailer.key : null);

        // Song (first available)
        const song = videos.results.find(
          (v: any) =>
            (v.type === "Song" || v.type === "Music Video") &&
            v.site === "YouTube"
        );
        setSongKey(song ? song.key : null);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;

    // Fetch watch providers
    const fetchProviders = async () => {
      try {
        const res = await fetch(
          `${BASE_URL}/movie/${id}/watch/providers?api_key=${API_KEY}`
        );
        const data = await res.json();
        if (data.results?.US?.flatrate) {
          setProviders(data.results.US.flatrate);
        } else {
          setProviders([]);
        }
      } catch (err) {
        console.error("Failed to fetch providers", err);
      }
    };

    fetchProviders();
  }, [id]);

  if (loading)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>Loading...</p>
    );
  if (!movie)
    return (
      <p style={{ textAlign: "center", marginTop: "50px" }}>Movie not found</p>
    );

  return (
    <div className={styles.container}>
      <header className={styles.navbar}>
        <h2 className={styles.logo}>🎬 CineVerse</h2>
      </header>

      <div className={styles.header}>
        <Link href="/" className={styles.backLink}>
          &#8592; Back to Home
        </Link>
      </div>

      <main className={styles.main}>
        <div className={styles.movieWrapper}>
          <div className={styles.poster}>
            <img
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : "/no-image.png"
              }
              alt={movie.title}
            />
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title}</h1>

            <div className={styles.meta}>
              <span className={styles.release}>
                Release: {movie.release_date || "N/A"}
              </span>
              <span
                className={`${styles.rating} ${
                  movie.vote_average >= 8 ? styles.highRating : ""
                }`}
              >
                ⭐ {movie.vote_average || "N/A"}
              </span>
            </div>

            <p className={styles.overview}>
              {movie.overview || "No overview available."}
            </p>

            {/* Trailer Section */}
            <div className={styles.trailer}>
              <h3>Trailer</h3>
              {trailerKey ? (
                <iframe
                  width="100%"
                  height="360"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  title="YouTube trailer"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <p
                  style={{
                    color: "#ff4c4c",
                    fontWeight: "600",
                    marginTop: "10px",
                  }}
                >
                  Trailer not available
                </p>
              )}
            </div>

            {/* Song Section */}
            <div className={styles.songs}>
              <h3>Song (Official YouTube)</h3>
              {songKey ? (
                <iframe
                  src={`https://www.youtube.com/embed/${songKey}`}
                  title="Movie Song"
                  width="100%"
                  height="200"
                  style={{ borderRadius: "10px" }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <p
                  style={{
                    color: "#ff4c4c",
                    fontWeight: "600",
                    marginTop: "10px",
                  }}
                >
                  Song not available
                </p>
              )}
              <p className={styles.disclaimer}>
                Videos embedded from YouTube for promotional purposes only.
              </p>
            </div>

            {/* Watch Providers Section */}
            <div className={styles.providers}>
              <h3>Available On</h3>
              {providers.length > 0 ? (
                <div className={styles.providerList}>
                  {providers.map((p: any) => (
                    <a
                      key={p.provider_id}
                      href={`https://www.themoviedb.org/movie/${movie.id}/watch`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.providerBtn}
                    >
                      {p.provider_name}
                    </a>
                  ))}
                </div>
              ) : (
                <p
                  style={{
                    color: "#ff4c4c",
                    fontWeight: "600",
                    marginTop: "10px",
                  }}
                >
                  Not available on streaming platforms
                </p>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MovieDetail;
