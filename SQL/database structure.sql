CREATE TABLE movie_user(
    id INT GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(255),
    fullname VARCHAR(255),
    user_password VARCHAR(255),
    birth_date INT,
    PRIMARY KEY (id)
);
CREATE TABLE movie(
    id INT GENERATED ALWAYS AS IDENTITY,
    title VARCHAR(255),
    release_date INT,
    genre INT,
    PRIMARY KEY (id),
    FOREIGN KEY (genre) REFERENCES movie_genre(id)
);
CREATE TABLE movie_genre(
    id INT GENERATED ALWAYS AS IDENTITY,
    genre_name VARCHAR(255) UNIQUE,
    PRIMARY KEY (id)
);
CREATE TABLE favorite(
    id INT GENERATED ALWAYS AS IDENTITY,
    movie_user INT,
    movie INT,
    PRIMARY KEY (id),
    FOREIGN KEY (movie_user) REFERENCES movie_user(id),
    FOREIGN KEY (movie) REFERENCES movie(id),
    UNIQUE (movie_user, movie) --UNIQUE Constraint ensures no duplicate favorites for the same movie by the same user
);
CREATE TABLE review(
    id INT GENERATED ALWAYS AS IDENTITY,
    movie_user INT,
    movie INT,
    rating INT CHECK (rating BETWEEN 0 AND 5), --CHECK Constraint ensures rating can only be between 0 and 5,
    review_text TEXT,
    PRIMARY KEY (id),
    FOREIGN KEY (movie_user) REFERENCES movie_user(id),
    FOREIGN KEY (movie) REFERENCES movie(id)
)