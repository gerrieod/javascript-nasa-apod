const resultsNav = document.getElementById('restultsNav');
const favoritesNav = document.getElementById('favoriteNav');
const imagesContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');


// Nasa api
const count = 3;
const apiKey = "DEMO_KEY";
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&count=${count}`;

let resultsArray = [];
let favorites = {};

function showContent(page) {
    window.scrollTo({top: 0, behavior: 'instant'});
    // switch navigation
    if( page === 'favorites') {
        favoritesNav.classList.remove('hidden');
        resultsNav.classList.add('hidden');
    } else {
        favoritesNav.classList.add('hidden');
        resultsNav.classList.remove('hidden');
    }
    loader.classList.add('hidden');
}

function createDomNodes(page) {
    // check for favorites or new results 
    const collection = page === 'results' ? resultsArray : Object.values(favorites);

    console.log(collection);
    collection.forEach((result) => {
        // card container
        const card = document.createElement('div');
        card.classList.add('card');
        // link wrap images
        const link = document.createElement('a');
        link.href = result.hdurl;
        link.title = 'View full image'
        link.target = '_blank';
        // image 
        const image = document.createElement('img');
        image.src = result.url;
        image.alt = 'NASA Picture of the day';
        image.loading = 'lazy';
        image.classList.add('card-img-top');
        // card body
        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');
        // card title
        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.textContent = result.title;
        // save text
        const saveText = document.createElement('p');
        saveText.classList.add('clickable');

        if(page === 'results'){
            saveText.textContent = 'Add to favorites';
            saveText.setAttribute('onclick', `saveFavorite('${result.url}')`);
        } else {
            saveText.textContent = "Remove favorite";
            saveText.setAttribute('onclick', `removeFavorite('${result.url}')`)
        }
        
        // Card text
        const cardText = document.createElement('p');
        cardText.textContent = result.explanation;
        // footer
        const footer = document.createElement('small');
        footer.classList.add('text-muted');
        // date
        const date = document.createElement('strong');
        date.textContent = result.date;
        // copyright
        const copyrightResult = result.copyright === undefined ? '' : result.copyright;
        const copyright = document.createElement('span');
        copyright.textContent = ` ${copyrightResult}`;

        // Append 
        footer.append(date, copyright);
        cardBody.append(cardTitle, saveText, cardText, footer);
        link.appendChild(image);
        card.append(link, cardBody);
        imagesContainer.appendChild(card);
    });
}

// update dom with cards
function updateDOM(page) {
    
    // get favorites from local storage
    var storedFavorites = localStorage.getItem('nasaFavorites');
    if(storedFavorites){
        favorites = JSON.parse(storedFavorites);
    }
    imagesContainer.textContent = '';
    createDomNodes(page);
    showContent(page);
}

// get 10 images from nasa api
async function getNasaPictures() {
    // show loader 
    loader.classList.remove('hidden');
    try {
         const response = await fetch(apiUrl);
         resultsArray = await response.json();
         updateDOM('results');
    } catch (error) {
        // catch error here
    }
}

// add result to favorite
function saveFavorite(itemUrl) {
//    loop through results array to select favorites
    resultsArray.forEach((item) => {
        if(item.url.includes(itemUrl) && !favorites[itemUrl]){
            favorites[itemUrl] = item;
            // show save confirmation
            saveConfirmed.hidden = false;

            setTimeout(() => {
                saveConfirmed.hidden = true;
            }, 2000);

            // set favorites
            localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        }
    });
}

// remove favorite from localstorage 
function removeFavorite(itemUrl) {
    if(favorites[itemUrl] ){
        delete favorites[itemUrl];
        localStorage.setItem('nasaFavorites', JSON.stringify(favorites));
        updateDOM('favorites');
    }
}

// onload get nasa pictures
getNasaPictures();