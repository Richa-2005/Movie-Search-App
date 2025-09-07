import express from 'express'
import cors from 'cors'
import getRoutes from './route.js/movie.route.js'

const app = express()


app.use(express.json())
app.use(cors());

app.use('/movies',getRoutes)
app.get('/', (req, res) => {
    res.send('Welcome to the Movie API!');
});
const PORT = 3500
app.listen(PORT , ()=>{
    console.log(`The server is listening on the port ${PORT}`)
})