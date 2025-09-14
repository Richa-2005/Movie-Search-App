import express from 'express'
import { getMovies } from '../controller.js/movie.controller.js'

const getRoutes = express.Router()

// Route for searching with both title, page, and year
getRoutes.get('/:movieName/:page/:year', getMovies)

// Route for searching with just title and page (no year)
getRoutes.get('/:movieName/:page', getMovies)

export default getRoutes
