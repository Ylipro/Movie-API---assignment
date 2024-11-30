import express from 'express'
import dotenv from 'dotenv'
import { pgPool } from "./pg_connection.js"

dotenv.config()
const app = express()

const port = process.env.PORT || 3001;

app.set('port', port)

app.use(express.json())

app.listen(app.get('port'), () => {
    console.log(`Server running in port ${port}`)
})
