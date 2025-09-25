import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const omdbUrl = `http://www.omdbapi.com/?apikey=${MOVIE_API_KEY}`;

// This function handles both 'no year' and 'specific year' searches
export const getMovies = async (req, res) => {
    try {
        if (!MOVIE_API_KEY) {
            return res.status(500).json({ error: "Server configuration error: Movie API key is missing." });
        }
        
        const { movieName, page, year } = req.params;
        
        if (!movieName) {
            return res.status(400).json({ error: "Please enter a movie title to search." });
        }

        let searchUrl = `${omdbUrl}&s=${encodeURIComponent(movieName)}&page=${page}`;
        
        if (year) {
            searchUrl += `&y=${year}`;
        }
        
        const response = await axios.get(searchUrl);

        if (response.data.Response === "True" && response.data.Search) {
            // --- NEW LOGIC: De-duplicate the 'Search' array ---
            const uniqueMovies = Array.from(new Map(response.data.Search.map(movie => [movie.imdbID, movie])).values());
            
            // Reconstruct the response object with the clean, unique movie list
            const cleanResponse = {
                ...response.data,
                Search: uniqueMovies
            };
            
            res.status(200).json(cleanResponse);
            // --- END OF NEW LOGIC ---
        } else {
            // Send the original error response if no movies were found
            res.status(404).json({ error: response.data.Error });
        }

    } catch (error)
     {
        console.error("Error fetching movie data:", error.message);
        res.status(500).json({ error: "An error occurred while fetching movie data." });
    }
};

// This function is completely rewritten for efficiency and correctness
export const getMoviesByDecade = async (req, res) => {
    try {
        if (!MOVIE_API_KEY) {
            return res.status(500).json({ error: "Server configuration error: Movie API key is missing." });
        }
        
        const { movieName, year } = req.params;

        if (!movieName) {
            return res.status(400).json({ error: "Please enter a movie title to search." });
        }
        
        const startYear = parseInt(year);
        const promises = [];

        for (let i = 0; i < 10; i++) {
            const currentYear = startYear + i;
            const randomPage = Math.ceil(Math.random() * 5);
            const searchUrl = `${omdbUrl}&s=${encodeURIComponent(movieName)}&y=${currentYear}&page=${randomPage}`;
            
            // This is the key change: we catch errors on individual promises.
            // This prevents a single failed request from crashing the whole operation.
            promises.push(
                axios.get(searchUrl).catch(err => {
                    console.error(`Failed to fetch for year ${currentYear}:`, err.message);
                    return null; // Instead of failing, return null
                })
            );
        }

        const results = await Promise.all(promises);
        
        let allMovies = [];
        results.forEach(response => {
            // Check if the response is not null and the API call was successful
            if (response && response.data && response.data.Response === "True") {
                allMovies.push(...response.data.Search);
            }
        });

        if (allMovies.length === 0) {
            return res.status(404).json({ message: 'No movies found for this decade.' });
        }

        const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.imdbID, movie])).values());

        // Shuffle and return up to 10 random movies
        uniqueMovies.sort(() => 0.5 - Math.random());
        const randomMovies = uniqueMovies.slice(0, 10);
        return res.status(200).json(randomMovies);
        
    } catch (error) {
        console.error("Error in getMoviesByDecade:", error.message);
        res.status(500).json({ error: "An error occurred while fetching movie data for the decade." });
    }
};

export const getMovie = async(req, res) =>{
    try{
        const {imdbId} = req.params; // Corrected parameter name
        const response = await axios.get(`${omdbUrl}&i=${imdbId}`);

        if (response.data.Response === "True") {
            
            res.status(200).json(response.data);
        } else {
            res.status(404).json({ error: response.data.Error || 'Movie not found.' });
        }
    } catch (error) {
        console.error('Error fetching movie details:', error.message);
        res.status(500).json({ error: 'An error occurred while fetching movie details.' });
    }
};

export const getMovieSuggestion = async (req, res) => {
    try {
        const { mood, decade, time, actorOrDirector, keyword } = req.query;

        const genreMap = {
            'Action': '28', 'Comedy': '35', 'Drama': '18', 'Horror': '27',
            'Romance': '10749', 'Sci-Fi': '878', 'Thriller': '53'
        };

        let discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&language=en-US&sort_by=popularity.desc&page=1`;

        // --- NEW LOGIC: Search for Person and Keyword IDs ---
        
        // Step 1: Find the Person ID if a name is provided
        if (actorOrDirector) {
            const personSearchUrl = `https://api.themoviedb.org/3/search/person?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(actorOrDirector)}`;
            const personResponse = await axios.get(personSearchUrl);
            if (personResponse.data.results.length > 0) {
                const personId = personResponse.data.results[0].id;
                discoverUrl += `&with_people=${personId}`;
            }
        }
        
        // Step 2: Find the Keyword ID if a keyword is provided
        if (keyword) {
            const keywordSearchUrl = `https://api.themoviedb.org/3/search/keyword?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(keyword)}`;
            const keywordResponse = await axios.get(keywordSearchUrl);
            if (keywordResponse.data.results.length > 0) {
                const keywordId = keywordResponse.data.results[0].id;
                discoverUrl += `&with_keywords=${keywordId}`;
            }
        }
        
        // --- END OF NEW LOGIC ---

        // Add other filters based on user input
        if (mood && genreMap[mood]) discoverUrl += `&with_genres=${genreMap[mood]}`;
        if (decade) {
            const startYear = parseInt(decade);
            discoverUrl += `&primary_release_date.gte=${startYear}-01-01&primary_release_date.lte=${startYear + 9}-12-31`;
        }
        if (time === 'lt90') discoverUrl += `&with_runtime.lte=90`;
        else if (time === '90-120') discoverUrl += `&with_runtime.gte=90&with_runtime.lte=120`;
        else if (time === 'gt120') discoverUrl += `&with_runtime.gte=120`;
        
        // Fetch a list of movies matching all criteria
        const response = await axios.get(discoverUrl);
        let movies = response.data.results;

        if (!movies || movies.length === 0) {
            return res.status(404).json({ error: "Couldn't find any movies for that combination. Try being less specific!" });
        }

        // Get up to 5 random movies and fetch their full details
        movies.sort(() => 0.5 - Math.random());
        const randomMovies = movies.slice(0, 5);
        
        const movieDetailPromises = randomMovies.map(movie => {
            const detailsUrl = `https://api.themoviedb.org/3/movie/${movie.id}?api_key=${process.env.TMDB_API_KEY}`;
            return axios.get(detailsUrl);
        });

        const movieDetailsResponses = await Promise.all(movieDetailPromises);

        const formattedMovies = movieDetailsResponses.map(detailsResponse => {
            const movieDetails = detailsResponse.data;
            if (!movieDetails.imdb_id) return null;
            return {
                imdbID: movieDetails.imdb_id,
                Title: movieDetails.title,
                Year: movieDetails.release_date ? movieDetails.release_date.substring(0, 4) : 'N/A',
                Poster: movieDetails.poster_path ? `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}` : 'https://placehold.co/400x600/5D688A/FFDBB6?text=No+Poster',
                Runtime: `${movieDetails.runtime} min`,
            };
        }).filter(Boolean);

        res.status(200).json(formattedMovies);
    } catch (error) {
        console.error("Error fetching movie suggestion:", error.message);
        res.status(500).json({ error: "An error occurred while getting a suggestion. The API might be blocked or the search term was not found." });
    }
};

