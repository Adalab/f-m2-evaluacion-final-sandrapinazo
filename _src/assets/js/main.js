'use strict';

const inputEl = document.querySelector('#TVshow');
const buttonEl = document.querySelector('.button');
const ulfavEl = document.querySelector('.favs');
const ulresultsEl = document.querySelector('.results');
const deleteAllBtnEl = document.querySelector('.button__delete--all');
const resultsNumber = document.querySelector('.result-number');

let favList = [];
const configNumbers = [5, 8, 10];

setfavListFromCache();
noFavsHandler();

function handlerBtnClick () {
  ulresultsEl.innerHTML = '';
  const searchText = inputEl.value;
  fetch (`http://api.tvmaze.com/search/shows?q=${searchText}`)
    .then (response => response.json())
    .then (function (data) {
      for (const object of data) {
        console.log(data);
        const {show} = object;
        const {id, name, image, premiered} = show;
        const newShow = document.createElement('li');
        newShow.classList.add('show');
        newShow.setAttribute('data-id', id);
        const newP = document.createElement('p');
        const pContent = document.createTextNode(name);
        newP.classList.add('title');
        newP.appendChild(pContent);
        const newPremiere = document.createElement('p');
        const premiereContent = document.createTextNode(premiered);
        newPremiere.appendChild(premiereContent);
        const newImg = document.createElement('img');
        newImg.classList.add('image');
        imageOrPlaceholder(image, newImg);
        addFavClassIfInFavList(newShow, id);
        newShow.appendChild(newImg);
        newShow.appendChild(newP);
        newShow.appendChild(newPremiere);
        newShow.addEventListener('click', favShow);
        ulresultsEl.appendChild(newShow);
      }
      const results = data.length;
      resultsNumber.innerHTML = results;
    });
}

buttonEl.addEventListener('click', handlerBtnClick);

//el numero de resultados es X y es mayor o menor que N
function handlerResults (event) {
  for (const n of configNumbers) {
    const results = event.currentTarget.innerHTML;
    console.log(n, results);
    if (results < n) {
      console.log(`El número de resultados es ${results} y es menor que ${n}.`);
    } else if (results > n){
      console.log(`El número de resultados es ${results} y es mayor que ${n}`);
    } else {
      console.log(`El numero de resultados es ${results} y es igual que ${n}`);
    }
  }
}

resultsNumber.addEventListener('click', handlerResults);

function imageOrPlaceholder (image, newImg) {
  if (image) {
    const {medium: imageMedium} = image;
    newImg.src= imageMedium;
  }else{
    newImg.src= 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
  }
}

function addFavClassIfInFavList (show, id) {
  for ( let i = 0; i < favList.length; i++){
    if (parseInt(favList[i].id) === id) {
      show.classList.add('favshow');
    }
  }
}

function favShow (event) {
  const thisShow = event.currentTarget;
  thisShow.classList.toggle('favshow');
  const favTitle = thisShow.querySelector('p').innerHTML;
  const favImg = thisShow.querySelector('img').src;
  const favId = thisShow.getAttribute('data-id');
  const favShow = {
    id: favId,
    title: favTitle,
    img: favImg,
  };
  toggleShowFromFavList(thisShow, favShow, favId);
  paintFavList();
  saveFavs();
  noFavsHandler();
}

function toggleShowFromFavList (thisShow, favShow, favId) {
  if (thisShow.classList.contains('favshow')) {
    favList.push(favShow);
  }else{
    for( let i = 0; i < favList.length; i++){
      if (favList[i].id === favId) {
        favList.splice(i, 1);
      }
    }
  }
}

function paintFavList () {
  ulfavEl.innerHTML = '';
  for (const show of favList){
    const {id,title,img} = show;
    const showLi = `
    <li class="show" data-id="${id}">
        <img src= ${img} alt=${title} class="image">
        <p class="title">${title}</p>
        <button class="delete" type="button">X</button>
    </li>`;
    ulfavEl.innerHTML+=showLi;
  }
  const btnDelete = ulfavEl.querySelectorAll('.delete');
  listenersForAllElements(btnDelete);
}

function listenersForAllElements (array) {
  for (const element of array){
    element.addEventListener('click', handlerDeleteWithFavBtn);
  }
}

function saveFavs () {
  localStorage.setItem('favShowsList', JSON.stringify(favList));
}
function setfavListFromCache () {
  const savedFavs = JSON.parse(localStorage.getItem('favShowsList'));
  if(savedFavs) {
    favList = savedFavs;
    paintFavList();
  }
}

function handlerDeleteWithFavBtn (event) {
  const thisShow = event.currentTarget.parentElement;
  const thisShowId = thisShow.getAttribute('data-id');
  deleteFavShow(thisShowId);
  paintFavList();
  saveFavs();
  noFavsHandler();
}

function deleteFavShow (id) {
  for( let i = 0; i < favList.length; i++){
    if (favList[i].id === id) {
      favList.splice(i, 1);
    }
  }
}

function handlerEnter (event) {
  if (event.key === 'Enter') {
    handlerBtnClick();
  }
}

inputEl.addEventListener('keyup', handlerEnter);

function handlerdeleteAllFavs () {
  favList = [];
  paintFavList();
  saveFavs();
  noFavsHandler();
}

deleteAllBtnEl.addEventListener('click', handlerdeleteAllFavs);

function noFavsHandler () {
  if (favList.length === 0) {
    ulfavEl.innerHTML = '<p class="no-favs">No hay favoritos.</p>';
    localStorage.removeItem('favShowsList');
  }
}