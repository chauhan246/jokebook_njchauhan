const jokeModel = require('../model/jokeModel');

// Get all categories
function getCategories(req, res) {
  jokeModel.getCategories((err, categories) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ categories });
  });
};

// Get jokes by category with specified limit
function getJokesByCategory(req, res) {
  const category = req.params.category;
  const limit = req.query.limit ? parseInt(req.query.limit) : 10;

  jokeModel.isCategoryExists(category, (err, categoryExists) => {
    if (err || !categoryExists) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    jokeModel.getJokesByCategory(category, limit, (err, jokes) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ jokes });
    });
  });
};

// Get or filter one random joke
function getRandomJoke(req, res) {
  const category = req.query.category;
  jokeModel.getJokesByCategory(category, "25", (err, jokes) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    let randNum = Math.floor(Math.random() * (jokes.length));
    let randJoke = jokes[randNum];
    res.json({ randJoke });
  });
}

// Add New Joke
async function addJoke(req, res) {
  const { category, setup, delivery } = req.body;

  if (!category || !setup || !delivery) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  // Create a new category if not present
  await jokeModel.isCategoryExists(category, (err, categoryExists) => {
    if (err || !categoryExists) {
      jokeModel.addNewCategory(category, (err) => {
        if (err) {
          res.status(500).json({ error: "Unable to insert new category: " + category });
          return;
        }
      })
    }

    jokeModel.addJoke(category, setup, delivery, (err) => {
      if (err) {
        res.status(400).json({ error: err.message });
        return;
      }
      res.json({ message: "Joke added successfully" });
    });
  });
};

module.exports = {
  getCategories,
  getJokesByCategory,
  getRandomJoke,
  addJoke
};