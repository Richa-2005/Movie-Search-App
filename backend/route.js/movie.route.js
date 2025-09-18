import express from 'express'
import { getMovies, getMoviesByDecade } from '../controller.js/movie.controller.js'

const getRoutes = express.Router()

// Most specific route first: handles decade search
getRoutes.get('/:movieName/:page/decade/:year', getMoviesByDecade)

// Next specific route: handles search with a specific year
getRoutes.get('/:movieName/:page/:year', getMovies)

// Least specific route: handles search with no year
getRoutes.get('/:movieName/:page', getMovies)

export default getRoutes