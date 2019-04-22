'use strict';

const inputEl = document.querySelector('#TVshow');
const buttonEl = document.querySelector('.button');
const ulfavEl = document.querySelector('.favs');
const ulresultsEl = document.querySelector('.results');

let favList = [];

function btnClickHandler(){
  ulresultsEl.innerHTML = '';
  const searchText = inputEl.value;
  fetch (`http://api.tvmaze.com/search/shows?q=${searchText}`)
    .then (response => response.json())
    .then (function (data) {
      for (const object of data) {
        const {show} = object;
        const {name, image} = show;
        const newShow = document.createElement('li');
        newShow.classList.add('show');
        const newP = document.createElement('p');
        newP.classList.add('title');
        const pContent = document.createTextNode(name);
        newP.appendChild(pContent);
        const newImg = document.createElement('img');
        newImg.classList.add('image');
        if (image){
          const {medium: imageMedium} = image;
          newImg.src= imageMedium;
        }else{
          newImg.src= 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
        }
        newShow.appendChild(newImg);
        newShow.appendChild(newP);
        newShow.addEventListener('click', favShow);
        ulresultsEl.appendChild(newShow);
      }
    });
}

buttonEl.addEventListener('click', btnClickHandler);

function favShow (event) {
  const thisShow = event.currentTarget;
  const favShow = thisShow.cloneNode(true);
  console.log(thisShow);
  
  thisShow.classList.add('favshow');
// if (thisShow.classList.contains('favshow')) {
  favList.push(favShow);
//Try to remove favs , classList.toggle('favshow')
//   }else {
//     for( let i = 0; i < favList.length; i++){ 
//       if ( favList[i] === favShow) {
//         console.log('check');
//         favList.splice(i, 1);
//       }
//     }
//   }
  paintFavList ();
  saveFavs();
  console.log(favList);
}

function paintFavList () {
  ulfavEl.innerHTML = '';
  for (const show of favList){
    ulfavEl.appendChild(show);
  }
}

function saveFavs () {
  localStorage.setItem('favShowsList', JSON.stringify(favList));
}

function setfavListFromCache () {
  const savedFavs = JSON.parse(localStorage.getItem('favShowsList'));
  if(savedFavs) {
    favList = savedFavs;
    console.log(savedFavs);
    paintFavList();
  }
}
setfavListFromCache();