const sqlite3 = require('sqlite3').verbose();
// We can add path to persist data
const db = new sqlite3.Database(':memory:');

let categories = ['funnyJoke', 'lameJoke'];
let funnyJokeList = [
  {
    'setup': 'Why did the student eat his homework?',
    'delivery': 'Because the teacher told him it was a piece of cake!'
  }, {
    'setup': 'What kind of tree fits in your hand?',
    'delivery': 'A palm tree'
  },
  {
    'setup': 'What is worse than raining cats and dogs?',
    'delivery': 'Hailing taxis'
  }
];
let lameJokeList = [
  {
    'setup': 'Which bear is the most condescending?',
    'delivery': 'Pan-DUH'
  },
  {
    'setup': 'What would the Terminator be called in his retirement?',
    'delivery': 'The Exterminator'
  }
];

// Create new tables, add categories, and jokes
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS categories (name TEXT PRIMARY KEY)");
  db.run("CREATE TABLE IF NOT EXISTS jokes (category TEXT, setup TEXT PRIMARY KEY, delivery TEXT)");

  for (let category of categories) {
    db.run("INSERT OR REPLACE INTO categories (name) VALUES (?)", [category]);
  }

  for (let funnyJoke of funnyJokeList) {
    db.run(`INSERT OR REPLACE INTO jokes (category, setup, delivery) VALUES ('funnyJoke', ?, ?)`, [funnyJoke?.setup, funnyJoke?.delivery]);
  }

  for (let lameJoke of lameJokeList) {
    db.run(`INSERT OR REPLACE INTO jokes (category, setup, delivery) VALUES ('lameJoke', ?, ?)`, [lameJoke?.setup, lameJoke?.delivery]);
  }
});

module.exports = db;
