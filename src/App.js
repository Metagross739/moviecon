import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovie } from "./useMovie";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const {movies, isLoading, error, apikey} = useMovie(query);
  const [watched, setWatched] = useLocalStorageState([], 'watched');
  // const [watched, setWatched] = useState([]);

  //brigning the data back fron localStorage and, dispalying in WatchedList

  function handleSelectedId(id) {
    setSelectedId(cur_id => cur_id === id ? null : id);
  }
  function handleClosedMovie() {
    setSelectedId(null);
  }
  function handleWatchedMovie(movie) {
    setWatched(prevMovie => [...prevMovie, movie])
  }
  function handleDeleteWatchedMovie(movieId) {
    setWatched(preMovie => preMovie.filter(movie => movie.imdbID !== movieId));
  }
  return (
    <>
      <NavBar>
        <MovieSearch query={query} setQuery={setQuery} />
        <MovieResults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading ? <Loading /> : <MovieList movie={movies} onSelected={handleSelectedId} />}
          {!isLoading && !error && <MovieList movie={movies} onSelected={handleSelectedId} />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ? <MovieDetails movieId={selectedId} onClosedMovie={handleClosedMovie} apikey={apikey} handleAddToList={handleWatchedMovie} watched={watched} /> :
            <>
              <WatchedSummary watched={watched} />
              <WatchedMovieList watched={watched} watchedMovie={handleDeleteWatchedMovie} />
            </>}

        </Box>
      </Main>
    </>
  );
}

function Loading() {
  const LoadStyle = {
    'textAlign': 'center',
    'margin': '20px',
    'padding': '20px',
    'fontSize': '20px'
  }
  return <div style={LoadStyle}>
    <span>Loading⏳</span>
  </div>
}

//Error component.

function ErrorMessage({ message }) {
  const ErrorStyle = {
    'textAlign': 'center',
    'margin': '20px',
    'padding': '20px',
    'fontSize': '20px'
  }
  return <p style={ErrorStyle}>
    <span>⛔</span>{message}
  </p>
}

function MovieDetails({ movieId, onClosedMovie, apikey, handleAddToList, watched }) {
  const [movie, setMovieData] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const isWatched = watched.map(movie => movie.imdbID).includes(movieId);

  const watchedUserRating = watched.find(movie => movie.imdbID === movieId)?.userRating

  const countRef = useRef(0);
  useEffect(() => {
    if(userRating) countRef.current = countRef.current + 1;
  }, [userRating])

  useKey('Escape', onClosedMovie);

  //object destructuring
  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function handleWatchedFilm() {
    const newWatchedMovie = {
      imdbID: movieId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(" ").at(0)),
      userRating,
      countRatingDecisions: countRef.current
    };

    handleAddToList(newWatchedMovie);
    onClosedMovie();

  }
  useEffect(() => {
    async function getMovieData() {
      setLoading(true);
      const movieData = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&i=${movieId}`);
      const response = await movieData.json();
      setMovieData(response);
      setLoading(false);
    }
    getMovieData();
  }, [movieId]);

  useEffect(() => {
    if(!title) return;
    document.title = `Movie | ${title}`;
    return function () {
      document.title=`MovieCon`;
      console.log(`Movie name is ${title}`);
    }
  },[title]);

  //passing, key event value and onCloseFunction as an argument.

  // useEffect(()=>{
  //   localStorage.setItem("watched", JSON.stringify(watched));
  // },[watched]);
  return (

    <div className="details">
      {isLoading ? <Loading /> :
        <>
          <header>
            <button className="btn-back" onClick={onClosedMovie}> &larr;</button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>{released}&bull;{runtime}</p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating maxRating={10} size="24px" onSetRating={setUserRating} />
                  {userRating > 0 && <button className="btn-add" onClick={handleWatchedFilm}>+Add to List</button>}
                </>
              ) : (
                <>
                  <p>You already rated this movie {watchedUserRating}⭐</p>
                </>
              )}

            </div>
            <p><em>{plot}</em></p>
            <p>{actors}</p>
            <p>{director}</p>
          </section>
        </>}
    </div>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>MovieCon</h1>
    </div>
  );
}

function MovieSearch({ query, setQuery }) {
  const inputEl = useRef(null);

  //resing, the key event logic
  useKey("Enter",function callback(e){
      inputEl.current.focus();
      setQuery("");
    
  } );

  //with using useEfect().

  // useEffect(() => {
  //   function callback(e){
  //     if(e.code === "Enter"){
  //       inputEl.current.focus();
  //       setQuery("");
  //     }
  //   }
  //   document.addEventListener("keydown", callback);

  //   return () => {
  //     document.removeEventListener("keydown", callback);
  //   }  
  // },[])

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function MovieResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {

  return (
    <main className="main">
      {children}
    </main>
  );
}

function Box({ children }) {

  const [isOpen, setIsOpen1] = useState(true);

  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

function MovieList({ movie, onSelected }) {

  return (
    <ul className="list list-movies">
      {movie?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelected={onSelected} />
      ))}
    </ul>
  );
}

function Movie({ movie, onSelected}) {
  return (
    <li onClick={() => onSelected(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}


function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(1)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMovieList({ watched, watchedMovie }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie movie={movie} key={movie.imdbID} watchedMovie={watchedMovie} />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, watchedMovie }) {
  console.log(movie);
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        <button className="btn-delete" onClick={()=> watchedMovie(movie.imdbID)}>❌</button>
      </div>
    </li>
  );
}