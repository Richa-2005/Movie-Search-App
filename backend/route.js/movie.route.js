import express from 'express'
import {getMovieByName} from '../controller.js/movie.controller.js'

const getRoutes = express.Router()

getRoutes.get('/:movieName',getMovieByName)

export default getRoutes