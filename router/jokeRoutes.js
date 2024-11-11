const express = require('express');
const router = express.Router();
const jokeController = require('../controller/jokeController');

router.get('/categories', jokeController.getCategories);

router.get('/joke/:category', jokeController.getJokesByCategory);

router.get('/random/joke', jokeController.getRandomJoke);

router.post('/joke/new', jokeController.addJoke);

module.exports = router;
