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
        
        const { movieName, page, year } = req.params;

        if (!movieName) {
            return res.status(400).json({ error: "Please enter a movie title to search." });
        }

        // The OMDB API doesn't support decade ranges, so we must query each year.
        // NOTE: True pagination is impossible. Each 'Show More' click will fetch a NEW random set of movies from the decade.
        // The 'page' param from the frontend is ignored here for that reason.
        
        const startYear = parseInt(year);
        const promises = [];

        // Create 10 API call promises, one for each year in the decade
        for (let i = 0; i < 10; i++) {
            const currentYear = startYear + i;
            // We use a random page number between 1 and 5 to get more variety in results
            const randomPage = Math.ceil(Math.random() * 5);
            const searchUrl = `${omdbUrl}&s=${encodeURIComponent(movieName)}&y=${currentYear}&page=${randomPage}`;
            promises.push(axios.get(searchUrl));
        }

        // Execute all 10 promises in parallel for speed
        const results = await Promise.all(promises);
        
        let allMovies = [];
        results.forEach(response => {
            if (response.data.Response === "True") {
                allMovies.push(...response.data.Search);
            }
        });

        // De-duplicate movies based on IMDb ID
        const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.imdbID, movie])).values());

        if (uniqueMovies.length > 0) {
            // Shuffle the array to ensure randomness
            for (let i = uniqueMovies.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [uniqueMovies[i], uniqueMovies[j]] = [uniqueMovies[j], uniqueMovies[i]];
            }
            // Return up to 10 random movies from the gathered list
            const randomMovies = uniqueMovies.slice(0, 10);
            return res.status(200).json(randomMovies);
        } else {
            return res.status(404).json({ message: 'No movies found for this decade.' });
        }
        
    } catch (error) {
        console.error("Error fetching movie data:", error.message);
        res.status(500).json({ error: "An error occurred while fetching movie data." });
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
