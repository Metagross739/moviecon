import { useState ,useEffect } from "react";

const apikey = 'fac32ac5';

export function useMovie(query){
    const [movies, setMovies] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {

        const controller = new AbortController();
        const fetchData = async function () {
          try {
            setLoading(true);
            setError('');
            const response = await fetch(`https://www.omdbapi.com/?apikey=${apikey}&s=${query}`, {signal: controller.signal});
            if (!response.ok) throw new Error('Unable to fetch movie');
            const data = await response.json();
            if (data.Response === 'False') {
              if (!movies) {
                throw new Error(data.Error);
              }
            };
            console.log(data);
            setMovies(data.Search || []);
            setError("");
          } catch (error) {
            if (query.length < 3) {
              setError('Please Enter the movie name');
            } else if(error.name !== "AbortError") {
              setError(error.message);
            }
          } finally {
            setLoading(false);
          }
    
        }
        // handleClosedMovie();
        fetchData();
        return () => {
      
          controller.abort();
        }
      }, [query]);

      return {movies, isLoading, error, apikey};
}