const MOVIE_API_KEY = process.env.MOVIE_API_KEY;
const omdbUrl = `http://www.omdbapi.com/?apikey=${MOVIE_API_KEY}`

export const getMovieByName = async(req,res) => {
    try {
        const movieName = req.params.movieName;
        
        if (!movieName) {
            return res.status(400).json({ error: "Please enter a movie title to search." });
        }

        const searchUrl = `${omdbUrl}&s=${encodeURIComponent(movieName)}`;
        const response = await axios.get(searchUrl);

        if (response.data.Response === "True") {
            res.status(200).json(response.data.Search);
        } else {
            res.status(404).json({ error: response.data.Error });
        }

    } catch (error) {
        console.error("Error fetching movie data:", error);
        res.status(500).json({ error: "An error occurred while fetching movie data." });
    }
}
