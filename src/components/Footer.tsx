const Footer = () => {
  return (
    <footer style={{
      background: "#1c1c1c",
      color: "#aaa",
      padding: "30px 20px",
      textAlign: "center",
      marginTop: "50px",
      fontSize: "0.9rem"
    }}>
      <p>🎬 CineVerse &copy; {new Date().getFullYear()}</p>
      <p>Explore trending movies, watch trailers, and check ratings</p>
      <p>
        <a href="https://www.themoviedb.org/" target="_blank" rel="noreferrer" style={{color: "#ff4c4c", textDecoration: "none"}}>TMDB API</a> powered
      </p>
    </footer>
  );
};

export default Footer;
