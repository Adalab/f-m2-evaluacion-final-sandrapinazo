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
        const newShow = document.createElement('div');
        newShow.classList.add('show');
        const newP = document.createElement('p');
        const pContent = document.createTextNode(name);
        newP.appendChild(pContent);
        const newImg = document.createElement('img');
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
  const thisShow= event.currentTarget;
  thisShow.classList.toggle('favshow');
  if (thisShow.classList.contains('favshow')) {
    favList.push(thisShow);
  }else {
    for( var i = 0; i < favList.length; i++){ 
      if ( favList[i] === thisShow) {
        favList.splice(i, 1); 
      }
    }
  }
  console.log(favList);
}

function paintFavList () {
    
}

