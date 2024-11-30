import dotenv from 'dotenv'
import pg from 'pg'
dotenv.config()

const pgPool = new pg.Pool({
    user:process.env.PGUSER,
    password:process.env.PGPASSWORD,
    host:process.env.PGHOST,
    port:process.env.PGPORT,
    database:process.env.PGDATABASE
})

export {pgPool}