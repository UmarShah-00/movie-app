export interface Movie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  overview: string;
  vote_average: number;
}

export const movies: Movie[] = [
  {
    id: 1,
    title: "Inception",
    release_date: "2010-07-16",
    poster_path: "https://image.tmdb.org/t/p/original/jYxQqa3ZaXhhG89YEUZkxUfKFdm.jpg",
    overview: "A thief who steals corporate secrets through dream-sharing technology...",
    vote_average: 8.8,
  },
  {
    id: 2,
    title: "Interstellar",
    release_date: "2014-11-07",
    poster_path: "https://image.tmdb.org/t/p/original/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    overview: "A team of explorers travel through a wormhole in space in an attempt to ensure humanity's survival...",
    vote_average: 8.6,
  },
  {
    id: 3,
    title: "The Dark Knight",
    release_date: "2008-07-18",
    poster_path: "https://image.tmdb.org/t/p/original/ogyw5LTmL53dVxsppcy8Dlm30Fu.jpg",
    overview: "When the menace known as the Joker wreaks havoc and chaos on Gotham...",
    vote_average: 9.0,
  },
  {
    id: 4,
    title: "Avatar",
    release_date: "2009-12-18",
    poster_path: "https://image.tmdb.org/t/p/original/xEAhV18F5Ej78qL0EneyPqa2a20.jpg",
    overview: "A paraplegic Marine dispatched to the moon Pandora on a unique mission...",
    vote_average: 7.5,
  },
  {
    id: 5,
    title: "Titanic",
    release_date: "1997-12-19",
    poster_path: "https://image.tmdb.org/t/p/original/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg",
    overview: "A seventeen-year-old aristocrat falls in love with a kind but poor artist aboard the luxurious...",
    vote_average: 7.8,
  },
];

