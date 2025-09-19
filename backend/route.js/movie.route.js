import express from 'express'
import { getMovies, getMoviesByDecade, getMovie } from '../controller.js/movie.controller.js'

const getRoutes = express.Router()

// --- FIX: Moved the specific details route to the top ---
// This will now be matched correctly before the general search routes.
getRoutes.get('/details/:imdbId', getMovie);

// Most specific search route
getRoutes.get('/:movieName/:page/decade/:year', getMoviesByDecade)

// Next specific search route
getRoutes.get('/:movieName/:page/:year', getMovies)

// Least specific search route (catches requests with no year)
getRoutes.get('/:movieName/:page', getMovies)

export default getRoutes
