import axios from 'axios';
import dotenv from 'dotenv'
dotenv.config()

const MOVIE_API_KEY = process.env.MOVIE_API_KEY;

const omdbUrl = `http://www.omdbapi.com/?apikey=${MOVIE_API_KEY}`;

export const getMovies = async(req, res) => {
    try {
        if (!MOVIE_API_KEY) {
            console.error("Error: MOVIE_API_KEY is not defined in the environment variables.");
            return res.status(500).json({ error: "Server configuration error: Movie API key is missing." });
        }
        
        const movieName = req.params.movieName;
        const page = req.params.page;
        const year = req.params.year;
        
        if (!movieName) {
            return res.status(400).json({ error: "Please enter a movie title to search." });
        }

        let searchUrl = `${omdbUrl}&s=${encodeURIComponent(movieName)}&page=${page}`;
        
        if (year) {
            searchUrl += `&y=${year}`;
        }
        
        const response = await axios.get(searchUrl);

        if (response.data.Response === "True") {
            res.status(200).json(response.data);
        } else {
            res.status(404).json({ error: response.data.Error });
        }

    } catch (error) {
        console.error("Error fetching movie data:", error.message);
        res.status(500).json({ error: "An error occurred while fetching movie data." });
    }
}
