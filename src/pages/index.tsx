import type { NextPage } from "next";
import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import styles from "../styles/Home.module.css";
import Footer from "../components/Footer";
import { fetchMoviesByCategory } from "../utils/tmdb";

const Home: NextPage = () => {
  const [search, setSearch] = useState("");
  const [movies, setMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("all");

  // Load movies from API
  const loadMovies = async (pageNumber: number, cat: string) => {
    setLoading(true);
    try {
      const data = await fetchMoviesByCategory(cat, pageNumber);
      if (pageNumber === 1) setMovies(data.results || []);
      else setMovies((prev) => [...prev, ...(data.results || [])]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // On first page load, get saved category from localStorage
  useEffect(() => {
    const savedCategory = localStorage.getItem("selectedCategory") || "all";
    setCategory(savedCategory);
    loadMovies(1, savedCategory);
  }, []);

  // When category changes
  useEffect(() => {
    loadMovies(1, category);
    setPage(1);
    localStorage.setItem("selectedCategory", category); // save selected category
  }, [category]);

  // Load more
  useEffect(() => {
    if (page > 1) loadMovies(page, category);
  }, [page]);

  // Filter by search input
  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* Navbar */}
      <header className={styles.navbar}>
        <h2 className={styles.logo}>🎬 CineVerse</h2>
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

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroLeft}>
          <h1>Explore Movies by Category</h1>
          <p>Hollywood, Bollywood, Punjabi movies and more. Watch trailers & ratings.</p>
        </div>
        <div className={styles.heroRight}>
          <img src="/heros.webp" alt="Hero Movie" className={styles.heroImage} />
        </div>
      </section>

      {/* Movies Header + Dropdown */}
      <div className={styles.moviesHeader}>
        <h2 className={styles.sectionTitle}>
          {category === "all"
            ? "All Movies"
            : category.charAt(0).toUpperCase() + category.slice(1) + " Movies"}
        </h2>

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className={styles.dropdown}
        >
          <option value="all">All Categories</option>
          <option value="hollywood">Hollywood</option>
          <option value="bollywood">Bollywood</option>
          <option value="punjabi">Punjabi</option>
        </select>
      </div>

      {/* Movies Grid */}
      <main className={styles.main}>
        <div className={styles.grid}>
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </main>

      {/* Load More */}
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
