const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();

const db_Path = path.join(__dirname, "moviesData.db");
let db = null;

const InitializeDBAndServer = async () => {
  try {
    db = await open({
      filename: db_Path,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server is running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`Server Error:${e.message}`);
    process.exit(1);
  }
};
InitializeDBAndServer();

const getMoviesDataElements = (dbObjectMovie) => {
  return {
    movieId: dbObjectMovie.movie_id,
    directorId: dbObjectMovie.director_id,
    movieName: dbObjectMovie.movie_name,
    leadActor: dbObjectMovie.lead_actor,
  };
};

app.get("/movies/", async (request, response) => {
  const getMoviesQuery = `SELECT * FROM movie`;
  const moviesArray = await db.all(getMoviesQuery);
  response.send(
    moviesArray.map((eachObject) => getMoviesDataElements(eachObject))
  );
});
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieQuery = `SELECT * FROM movie WHERE movie_id = ${movieId};`;
  const movie = await db.get(getMovieQuery);
  response.send(getMoviesDataElements(movie));
});
app.post("/movies/", async (request, response) => {
  const movieDetails = request.body;
  const { director_id, movie_name, lead_actor } = getMovieDetails;
  const getPostMovies = `
  INSERT INTO 
     movie (director_id,movie_name,lead_actor) 
  VALUES 
      ('${directorId}','${movieName}','${leadActor}'):`;
  const movies = await db.run(getPostMovies);
  response.send("Movie Successfully Added");
});
