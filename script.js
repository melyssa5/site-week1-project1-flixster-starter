// Global Constants
const apiKey = "628cef3f5279ee9c6a1a09173da5a3ba";
const movieContainer = document.querySelector("#movies-grid");

// Object that keeps track of the state of the website
const state = {
    apiPage: 1,
    searchTerm: "cat",
  }

const searchPage = 1


// Page Elements
const loadButton = document.getElementById("load-more-movies-btn");








/**
 * Update the DOM to display results from the Giphy API query.
 *
 * @param {Object} results - An array of results containing each item
 *                           returned by the response from the Giphy API.
 *
 */
function displayMovies(moviesArray) {
    moviesArray.forEach(movie => {
        movieContainer.appendChild(generateMovieCard(movie))
    });
}

function generateMovieCard(movieObject) {
    // create start
    let star = document.createElement('span');
    star.classList.add('star')
    let starContent = document.createTextNode('⭐️');
    star.append(starContent);
    document.body.appendChild(star);

    // create movie votes element
    let rating = document.createElement('span');
    rating.classList.add('movie-votes');
    let ratingContent = document.createTextNode(movieObject.vote_average);
    rating.appendChild(ratingContent);

    // create average container
    let averageContainer = document.createElement('div');
    averageContainer.classList.add('average');
    averageContainer.appendChild(star)
    averageContainer.appendChild(rating);

    // create movie image element
    let image = document.createElement('img');
    image.classList.add('movie-poster');
    image.src = 'https://image.tmdb.org/t/p/w342' + movieObject.poster_path;

    // create movie title element
    let title = document.createElement('p');
    title.classList.add('movie-title');
    title.textContent = movieObject.original_title;


    let movie = document.createElement('section');
    movie.classList.add('movie');
    movie.setAttribute('id', 'movie-card')
    movie.appendChild(image);
    movie.appendChild(averageContainer);
    movie.appendChild(title);
    return movie;
}


async function getNowPlaying() {
    const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?page=${state.apiPage}&api_key=${apiKey}`);
    const jsonResponse = await response.json();
    state.apiPage += 1;
    return jsonResponse.results;
}

async function getMovieSearch(){
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${state.searchTerm}&page=${searchPage}&api_key=${apiKey}`);
    const jsonResponse = await response.json();
    return jsonResponse.results;
}



async function handleLoadMore(){
   displayMovies(await getNowPlaying())
}


window.onload = async function () {
    console.log(await getMovieSearch());
    displayMovies(await getNowPlaying());
}






