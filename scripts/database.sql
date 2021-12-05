CREATE DATABASE mainData;

CREATE TABLE ingredients(
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    ingredientType TEXT NULL
);