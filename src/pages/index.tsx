import type { NextPage } from "next";
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import styles from "../styles/Home.module.css";
import { fetchTrendingMovies } from "../utils/tmdb";
import Footer from "../components/Footer";
const Home: NextPage = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadMovies = (pageNumber: number) => {
    setLoading(true);
    fetchTrendingMovies(pageNumber)
      .then((data) => {
        setMovies((prev) => [...prev, ...(data.results || [])]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadMovies(page);
  }, [page]);

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* NAVBAR */}
      <header className={styles.navbar}>
        <h2 className={styles.logo}>🎬 MovieApp</h2>

        <div className={styles.searchWrapper}>
          <input
            type="text"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.search}
          />
        </div>
      </header>

      {/* HERO SECTION */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1>Discover Trending Movies</h1>
          <p>
            Explore the latest and most popular movies from around the world.
            Watch trailers, check ratings and much more.
          </p>
        </div>

        <div className={styles.heroRight}>
          <img
            src="heros.webp"
            alt="Hero Movie"
          />
        </div>
      </section>

      {/* MOVIES SECTION */}
      <h2 className={styles.sectionTitle}>Trending Movies</h2>

      <main className={styles.main}>
        <div className={styles.grid}>
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </main>

      {/* LOAD MORE */}
      <div className={styles.pagination}>
        <button
          className={styles.loadMore}
          onClick={() => setPage((prev) => prev + 1)}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
