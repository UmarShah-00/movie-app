import Link from "next/link";
import styles from "../styles/MovieCard.module.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string | null;
  vote_average: number;
}

interface Props {
  movie: Movie;
}

const MovieCard: React.FC<Props> = ({ movie }) => {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <Link href={`/movie/${movie.id}`} className={styles.link}>
      <div className={styles.card}>
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} className={styles.poster} />
        ) : (
          <div className={styles.fallback}>
            <span>No Image</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className={styles.overlay} />

        {/* Content */}
        <div className={styles.content}>
          <h3 className={styles.title}>{movie.title}</h3>

          <div className={styles.meta}>
            <span className={styles.rating}>⭐ {movie.vote_average.toFixed(1)}</span>
          </div>

          <span className={styles.view}>View</span>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
