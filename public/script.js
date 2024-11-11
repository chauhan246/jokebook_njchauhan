// All local existing categories
let existingCategories = new Array();

// Initial Load
document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    fetchRandomJoke();
});

// Get local jokes
id('get-jokes-btn').addEventListener('click', fetchJokes);

// Search local and other joke api endpoint
id('search-jokes-btn').addEventListener('click', fetchJokes);

// Add new jokes
id('add-new-joke').addEventListener('submit', addNewJoke);

// For adding new joke
function addNewJoke(event) {
    event.preventDefault();
    const category = id('new-joke-category-selection').value;
    const setup = id('setup').value;
    const delivery = id('delivery').value;

    fetch('/jokebook/joke/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category, setup, delivery })
    })
        .then(response => response.json())
        .then(data => {
            // For displaying the success message
            const newJokeStatus = id('new-joke-status');
            newJokeStatus.textContent = data.message;
            newJokeStatus.style.display = 'inline-block';
            setTimeout(() => {
                newJokeStatus.style.display = 'none';
            }, 2000)

            // Update Jokes list to have the new one
            const categorySelection = id('category-selection');
            categorySelection.value = category;
            const getJokeBtn = id('get-jokes-btn');
            getJokeBtn.click();

            // Reset form
            id('new-joke-category-selection').value = '';
            id('setup').value = '';
            id('delivery').value = '';

        })
        .catch(error => console.error('Error:', error));
}

// Add 3 appropriate jokes from an external JOKE api
function addNewJokesFromJOKEAPI(category, setup, delivery) {
    fetch('/jokebook/joke/new', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ category, setup, delivery })
    })
        .then(response => response.json())
        .catch(error => console.error('Error:', error));
}

// Check category options to avoid duplicate categories
function categoryOptionExists(categoryElement, category) {
    let categoryExists = false;
    for (let i = 0; i < categoryElement.options.length; i++) {
        if (categoryElement.options[i].value === category) {
            categoryExists = true;
            break;
        }
    }
    return categoryExists
}

// Get All local categories
function fetchCategories() {
    fetch('/jokebook/categories')
        .then(response => response.json())
        .then(data => {
            const categorySelection = id('category-selection');
            data?.categories.forEach(category => {
                existingCategories.push(category);
                if (!categoryOptionExists(categorySelection, category)) {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    categorySelection.appendChild(option);
                }
            });

            const newCategorySelection = id('new-joke-category-selection');
            data?.categories.forEach(category => {
                if (!categoryOptionExists(newCategorySelection, category)) {
                    const option = document.createElement('option');
                    option.value = category;
                    option.textContent = category;
                    newCategorySelection.appendChild(option);
                }

            });
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
}

// Get all local jokes
async function fetchJokes(event) {
    const jokeBtnId = event.currentTarget.id;
    let category;
    if (jokeBtnId === "get-jokes-btn") {
        category = id('category-selection').value;
    } else {
        category = id('search-category').value;
    }
    if (!category) {
        alert('Please select or search for a joke category');
        return;
    }

    // Get 3 appropriate jokes from an external JOKE api, added appropriate joke flag: blacklistFlags=nsfw
    if (!existingCategories.includes(category)) {
        await fetch(`https://v2.jokeapi.dev/joke/${category}?amount=3&type=twopart&blacklistFlags=nsfw`)
            .then(response => response.json())
            .then(data => {
                for (let newJoke of data?.jokes) {
                    addNewJokesFromJOKEAPI(newJoke?.category, newJoke?.setup, newJoke?.delivery)
                }
            })
            .catch(error => {
                console.error('Error fetching jokes from https://v2.jokeapi.dev:', error);
            });
        existingCategories.push(category);
        fetchCategories();
    }

    fetch(`/jokebook/joke/${category}?limit=15`)
        .then(response => response.json())
        .then(data => {
            const jokeList = id('jokes-list');
            jokeList.innerHTML = '';

            if (data?.jokes && data?.jokes?.length > 0) {
                data.jokes.forEach(joke => {
                    const liElement = document.createElement('li');
                    liElement.textContent = `${joke.setup} - ${joke.delivery}`;
                    jokeList.appendChild(liElement);
                });
            } else {
                jokeList.innerHTML = '<li>No jokes found for this category.</li>';
            }
        })
        .catch(error => {
            console.error('Error fetching jokes:', error);
        });
}

// Get one random joke from the local database
async function fetchRandomJoke() {
    let categories;
    await fetch('/jokebook/categories')
        .then(response => response.json())
        .then(data => {
            categories = data?.categories;
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });

    let randNum = Math.floor(Math.random() * (categories.length));

    fetch(`/jokebook/random/joke?category=${categories[randNum]}`)
        .then(response => response.json())
        .then(data => {
            const randomJokeSetup = id('random-joke-setup');
            randomJokeSetup.textContent = data?.randJoke?.setup;
            const randomJokeDelivery = id('random-joke-delivery');
            setTimeout(() => {
                randomJokeDelivery.textContent = data?.randJoke?.delivery;
            }, 2000)
        })
        .catch(error => {
            console.error('Error fetching categories:', error);
        });
}

/*
* Handy Shortcut Functions
*/

function id(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}
