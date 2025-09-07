import express from 'express'
import {getMovieByName} from '../controller.js/movie.controller.js'

const getRoutes = express.Router()

getRoutes.get('/:movieName/:page',getMovieByName)

export default getRoutes