// Global Constants
const apiKey = "628cef3f5279ee9c6a1a09173da5a3ba";
const movieContainer = document.querySelector("#movies-grid");
const currentMoviesContainer = document.querySelector("#movies-data");

let searchTerm = "cat"

// Object that keeps track of the state of the website
const state = {
    apiPage: 1,
   //searchTerm: "dog",
  }

const searchPage = 1
let previousResults = currentMoviesContainer; 

const startPage = document.getElementsByClassName("movie-card");


// Page Elements
const loadButton = document.getElementById("load-more-movies-btn");

const searchButton = document.getElementById("search-button");

const input = document.getElementById("search-input");

const clearButton = document.getElementById("clear-search")

/**
 * Update the DOM to display results from the Giphy API query.
 *
 * @param {Object} results - An array of results containing each item
 *                           returned by the response from the Giphy API.
 *
 */
function displayMovies(moviesArray) {
    const dataBox = document.querySelector("#movies-data")
    moviesArray.forEach(movie => {
        dataBox.appendChild(generateMovieCard(movie))
    });
}

// function savePrevious(){
//     previousResults = document.getElementsByClassName("movie-card");
// }

function validImage(path){
    if(path.includes("null")){
        return "https://image.tmdb.org/t/p/w342/odGrK2wAxKbIIiKwOzrUOgOyozm.jpg";
    }
    else{
        return path;
    }
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
    image.setAttribute('data-id', movieObject.id);
    image.src =  validImage('https://image.tmdb.org/t/p/w342' + movieObject.poster_path);

    // create movie title element
    let title = document.createElement('p');
    title.classList.add('movie-title');
    title.textContent = movieObject.original_title;


    let movie = document.createElement('section');
    movie.classList.add('movie-card');
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
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchTerm}&page=${searchPage}&api_key=${apiKey}`);
    const jsonResponse = await response.json();
    return jsonResponse.results;
}


async function handleLoadMore(event){
   //event.preventDefault();
   const moreMovies = await getNowPlaying();
   console.log(moreMovies);
   displayMovies(moreMovies);
}


async function handleSearch(event) {
    // YOUR CODE HERE
    event.preventDefault();
    searchTerm = input.value;
    console.log(searchTerm)
    const searchResults = await getMovieSearch();
    console.log(searchResults);
    document.querySelectorAll('.movie-card').forEach(e => e.remove());
    displayMovies(searchResults);
  }

async function handleCloseSearch(event){
    document.querySelectorAll('.movie-card').forEach(e => e.remove());
    state.apiPage = 1;
    document.getElementById("search-input").value = ''
    displayMovies(await getNowPlaying());
}



window.onload = async function () {
    displayMovies(await getNowPlaying());
    searchButton.addEventListener('click', handleSearch);
    loadButton.addEventListener('click', handleLoadMore);
    clearButton.addEventListener('click', handleCloseSearch);



}






