const db = require('../database');

function getCategories(callbackFn) {
  db.all("SELECT name FROM categories", [], (err, rows) => {
    if (err) {
      return callbackFn(err, null);
    }
    callbackFn(null, rows.map(row => row.name));
  });
};

function getJokesByCategory(category, limit, callbackFn) {
  db.all("SELECT setup, delivery FROM jokes WHERE category = ? LIMIT ?", [category, limit], (err, rows) => {
    if (err) {
      return callbackFn(err, null);
    }
    callbackFn(null, rows);
  });
};

function addNewCategory(category, callbackFn) {
  db.run("INSERT OR REPLACE INTO categories (name) VALUES (?)", [category], (err) => {
    if (err) {
      return callbackFn(err);
    }
    callbackFn(null);
  });
};

function addJoke(category, setup, delivery, callbackFn) {
  db.run("INSERT OR REPLACE INTO jokes (category, setup, delivery) VALUES (?, ?, ?)", [category, setup, delivery], (err) => {
    if (err) {
      return callbackFn(err);
    }
    callbackFn(null);
  });
};

function isCategoryExists(category, callbackFn) {
  db.get("SELECT COUNT(*) as count FROM categories WHERE name = ?", [category], (err, row) => {
    if (err) {
      return callbackFn(err, null);
    }
    callbackFn(null, row.count > 0);
  });
};

module.exports = {
  getCategories,
  getJokesByCategory,
  addJoke,
  addNewCategory,
  isCategoryExists
};
