import Link from "next/link";
import styles from "../styles/MovieCard.module.css";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}

interface Props {
  movie: Movie;
}

const MovieCard: React.FC<Props> = ({ movie }) => {
  return (
    <Link href={`/movie/${movie.id}`} className={styles.link}>
      <div className={styles.card}>
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : "/no-image.png"
          }
          alt={movie.title}
          className={styles.poster}
        />

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
