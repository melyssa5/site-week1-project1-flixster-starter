// Global Constants
const apiKey = "628cef3f5279ee9c6a1a09173da5a3ba";
const movieContainer = document.querySelector("#movies-grid");
const currentMoviesContainer = document.querySelector("#movies-data");


let searchTerm = ""

// Object that keeps track of the state of the website
let apiPage = 0;


let previousResults = currentMoviesContainer; 

const startPage = document.getElementsByClassName("movie-card");


// Page Elements
const loadButton = document.getElementById("load-more-movies-btn");

const searchButton = document.getElementById("search-button");

const input = document.getElementById("search-input");

const clearButton = document.getElementById("clear-search")

const header = document.getElementsByTagName("h2")[0];
console.log(header)


function validImage(path){
    if(path.includes("null") || path.includes("undefined")){
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
    image.addEventListener('click', handleImageClick);
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


function generatePopUp(popupInfo){
    let desc = document.createElement('p');
    desc.classList.add("movie-description");
    let descContent = document.createTextNode(popupInfo.overview);
    desc.append(descContent);

    let image = document.createElement('img');
    image.classList.add('movie-backdrop');
    image.src =  validImage('https://image.tmdb.org/t/p/w342' + popupInfo.backdrop_path);

    let details = document.createElement('span');
    details.classList.add("movie-details");
   
    let close = document.createElement('button');
    close.setAttribute('id', 'close-button');
    close.value = 'close';

    let runtime = document.createTextNode(popupInfo.runtime);
    let release = document.createTextNode(popupInfo.release_date);
    let title = document.createTextNode(popupInfo.original_title);
    let star = document.createTextNode('⭐️');
    let rating = document.createTextNode(popupInfo.vote_average);
    let linebreak = document.createTextNode(' |  ')


    details.append(runtime)
    details.append(' minutes | ')
    details.append(release);
    details.append(linebreak)
    details.append(title);
    details.append(linebreak)
    details.append(star);
    details.append(rating);

    let moviePopup = document.createElement('div');
    moviePopup.classList.add('popup-inner');
    moviePopup.appendChild(image);
    moviePopup.appendChild(details);
    moviePopup.appendChild(desc);
    moviePopup.append(close);

    document.getElementById('outer-popup').appendChild(moviePopup)
    return moviePopup
}



async function getNowPlaying() {
    apiPage += 1;
    const response = await fetch(`https://api.themoviedb.org/3/movie/now_playing?page=${apiPage}&api_key=${apiKey}`);
    const jsonResponse = await response.json();
    header.innerText = "Now Playing"
    const array = jsonResponse.results;
    array.forEach(movie => {
                movieContainer.appendChild(generateMovieCard(movie))
            });

}



async function getMovieSearch(){
    apiPage += 1;
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?query=${searchTerm}&page=${apiPage}&api_key=${apiKey}`);
    const jsonResponse = await response.json();
    const array = jsonResponse.results;
    header.innerText = "Search Results"
    //movieContainer.innerHTML = '';
    array.forEach(movie => {
        movieContainer.appendChild(generateMovieCard(movie))
    });
}

async function getMoreInfo(movieID){
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieID}?api_key=${apiKey}`);
    const jsonResponse = await response.json();
    return jsonResponse;
}


async function handleLoadMore(event){
   //event.preventDefault();
   if (header.innerText=="Now Playing"){
    await getNowPlaying();
   }
   else if (header.innerText=="Search Results"){
    await getMovieSearch();
   }
}



async function handleImageClick(event){
    // create pop up element
    let popup = document.createElement('div');
    popup.classList.add("popup-outer");
    popup.setAttribute('id', 'outer-popup')
    document.body.append(popup)
    console.log(popup)

    popup.classList.add('open');
    let id = this.dataset.id;
    let result = generatePopUp(await getMoreInfo(id)); 
    let um = popup.append(result)
   
}


async function handleSearch(event) {
    // YOUR CODE HERE
    apiPage = 0;
    event.preventDefault();
    searchTerm = input.value;
    console.log(searchTerm)
    movieContainer.innerHTML = '';
    const searchResults = await getMovieSearch();
    console.log(searchResults);
  }

async function handleCloseSearch(event){
    movieContainer.innerHTML = '';
    apiPage = 0;
    document.getElementById("search-input").value = ''
    await getNowPlaying();
}



window.onload = async function () {
    await getNowPlaying();
    searchButton.addEventListener('click', handleSearch);
    loadButton.addEventListener('click', handleLoadMore);
    clearButton.addEventListener('click', handleCloseSearch);
    
}






