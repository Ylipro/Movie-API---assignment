import express from 'express'
import dotenv from 'dotenv'
import { pgPool } from "./pg_connection.js"

dotenv.config()
const app = express()
app.use(express.urlencoded({ extended: true }));

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

        if (!keyword) {
            result = await pgPool.query('SELECT movie.title, movie.release_date releaseDate, movie_genre.genre_name genre FROM movie INNER JOIN movie_genre ON movie_genre.id=movie.genre');
        } else {
            keyword = keyword.toLowerCase();
            keyword = '%' + keyword + '%';
            result = await pgPool.query(
                'SELECT movie.title, movie.release_date releaseDate, movie_genre.genre_name genre FROM movie INNER JOIN movie_genre ON movie_genre.id=movie.genre WHERE LOWER(movie.title) LIKE $1', [keyword])
        }
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});
//adding new movies with movie name, year and genre id number
app.post('/movie', async (req, res) => {
    const { name, year, genre } = req.body;
    try {
        await pgPool.query(
            'INSERT INTO movie (title, release_date, genre) VALUES ($1,$2,$3)', [name, year, genre]);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});
// getting movie by id
app.get('/movie/:id', async (req, res) => {

    let id = req.params.id;

    try {

        let result;

        if (!id) {
            return res.status(400).json({ error: "Movie ID is required." });
        } else {
            result = await pgPool.query(
                'SELECT movie.id, movie.title, movie.release_date releaseDate, movie_genre.genre_name genre FROM movie INNER JOIN movie_genre ON movie_genre.id=movie.genre WHERE movie.id = $1', [id])
        }
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})
//removing movie by id
app.delete('/movie/:id', async (req, res) => {
    const id = req.params.id;
    try {
        if (!id) {
            return res.status(400).json({ error: "Movie ID is required." });
        }
        const result = await pgPool.query('DELETE FROM movie WHERE id = $1 RETURNING *', [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ error: `No movie found with ID: ${id}` });
        }

        res.json({ message: `Movie with ID ${id} deleted successfully.`, movie: result.rows[0] });
    } catch (error) {
        res.status(400).json({ error: error.message })
    }

});

//registering user with: username, fullname, password and year of birth
app.post('/user', async (req, res) => {

    const { username, name, password, bday } = req.body;

    try {
        await pgPool.query(
            'INSERT INTO movie_user (username, fullname, user_password, birth_date) VALUES ($1,$2,$3,$4)', [username, name, password, bday]);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});



//Getting all genres
app.get('/movie_genre', async (req, res) => {
    try {
        const result = await pgPool.query('SELECT * FROM movie_genre');
        res.json(result.rows);
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

//Adding new movie genres
app.post('/movie_genre', async (req, res) => {

    const { genre } = req.body;

    try {
        await pgPool.query('INSERT INTO movie_genre(genre_name) VALUES ($1)', [genre]);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

//Adding movie review with userid, movieid,stars0-5 and text
app.post('/review', async (req, res) => {

    const { userid, movieid, stars, text } = req.body;

    try {
        await pgPool.query('INSERT INTO review (movie_user,movie,rating,review_text) VALUES ($1,$2,$3,$4)', [userid, movieid, stars, text]);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});


//Adding favorite movies for user
app.post('/favorite', async (req, res) => {

    const { userid, movieid } = req.body;

    try {
        await pgPool.query('INSERT INTO favorite (movie_user,movie) VALUES ($1,$2)', [userid, movieid]);
        res.end();
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
});

//getting favorite movies by username
app.get('/favorite/:movie_user', async (req, res) => {
    const username = req.params.movie_user;

    try {
        if (!username) {
            return res.status(400).json({ error: "Username is required." });
        }
        const result = await pgPool.query(
            'SELECT movie.id, movie.title FROM movie INNER JOIN favorite ON movie.id=favorite.movie INNER JOIN movie_user ON favorite.movie_user=movie_user.id WHERE movie_user.username = $1', [username]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: `No favorite movies found for username: ${username}` });
        }

        res.json({ username, favoriteMovies: result.rows });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }

});