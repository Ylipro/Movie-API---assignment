import express from 'express'
import dotenv from 'dotenv'
import { pgPool } from "./pg_connection.js"

dotenv.config()
const app = express()
app.use(express.urlencoded({extended: true}));

const port = process.env.PORT || 3001;

app.set('port', port)

app.use(express.json())

app.listen(app.get('port'), () => {
    console.log(`Server running in port ${port}`)
})

//Getting all movies and getting movies by keyword
app.get('/movie', async (req, res) => {

    let keyword = req.query.keyword;

    try {
        
        let result;
        
        if(!keyword){
            result= await pgPool.query('SELECT movie.title, movie.release_date releaseDate, movie_genre.genre_name genre FROM movie INNER JOIN movie_genre ON movie_genre.id=movie.genre');
        }else{
            keyword = keyword.toLowerCase();
            keyword = '%'+keyword+'%';
            result = await pgPool.query(
                'SELECT movie.title, movie.release_date releaseDate, movie_genre.genre_name genre FROM movie INNER JOIN movie_genre ON movie_genre.id=movie.genre WHERE LOWER(movie.title) LIKE $1', [keyword])
        }
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});
//adding new movies with movie name, year and genre id number
app.post('/movie', async (req,res) =>{
    const { name,year,genre } = req.body;
    try {
        await pgPool.query(
            'INSERT INTO movie (title, release_date, genre) VALUES ($1,$2,$3)',[name,year,genre]);
        res.end();
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});
// getting movie by id
app.get('/movie/:id?', async (req,res) =>{
    
    let id = req.params.id;

    try {
        
        let result;
        
        if(!id){
            return res.status(400).json({ error: "Movie ID is required." });
        }else{
            result = await pgPool.query(
                'SELECT movie.id, movie.title, movie.release_date releaseDate, movie_genre.genre_name genre FROM movie INNER JOIN movie_genre ON movie_genre.id=movie.genre WHERE movie.id = $1', [id])
        }
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({error: error.message})
    }
})












//registering user with: username, fullname, password and year of birth
app.post('/user', async (req,res) =>{

    const { username, name, password, bday } = req.body;

    try {
        await pgPool.query(
            'INSERT INTO movie_user (username, fullname, user_password, birth_date) VALUES ($1,$2,$3,$4)', [username, name, password, bday]);
        res.end();
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});



//Getting all genres
app.get('/movie_genre', async (req,res) =>{
 try {
    const result = await pgPool.query('SELECT * FROM movie_genre');
    res.json(result.rows);
 } catch (error) {
    res.status(400).json({error: error.message})
 }
});

//Adding new movie genres
app.post('/movie_genre', async (req,res) =>{

    const {genre} = req.body;

    try {
        await pgPool.query('INSERT INTO movie_genre(genre_name) VALUES ($1)',[genre]);
        res.end();
    } catch (error) {
        res.status(400).json({error: error.message})
    }
});