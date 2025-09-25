import express from 'express'
import { getMovies, getMoviesByDecade, getMovie,getMovieSuggestion } from '../controller.js/movie.controller.js'

const getRoutes = express.Router()

getRoutes.get('/suggest', getMovieSuggestion);

getRoutes.get('/details/:imdbId', getMovie);

getRoutes.get('/:movieName/:page/decade/:year', getMoviesByDecade)

getRoutes.get('/:movieName/:page/:year', getMovies)

getRoutes.get('/:movieName/:page', getMovies)

export default getRoutes
