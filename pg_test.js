import { pgPool } from "./pg_connection.js";

try{
    const result = await pgPool.query("SELECT title FROM movie WHERE title LIKE 'I%'");
    console.log(result.rows);
}catch(e){
    console.log(e.message);
}

