'use strict';

const inputEl = document.querySelector('#TVshow');
const buttonEl = document.querySelector('.button');
const ulfavEl = document.querySelector('.favs');
const ulresultsEl = document.querySelector('.results');
const deleteAllBtnEl = document.querySelector('.button__delete--all');

let favList = [];

setfavListFromCache();

//VACIA LISTA DE RESULTADOS, HACE PETICIÓN A API Y PINTA RESULTADOS CON LISTENER
function btnClickHandler () {
  ulresultsEl.innerHTML = '';
  const searchText = inputEl.value;
  fetch (`http://api.tvmaze.com/search/shows?q=${searchText}`)
    .then (response => response.json())
    .then (function (data) {
      for (const object of data) {
        const {show} = object;
        const {id, name, image} = show;
        const newShow = document.createElement('li');
        newShow.classList.add('show');
        newShow.setAttribute('data-id', id);
        const newP = document.createElement('p');
        const pContent = document.createTextNode(name);
        newP.classList.add('title');
        newP.appendChild(pContent);
        const newImg = document.createElement('img');
        newImg.classList.add('image');
        imageOrPlaceholder(image, newImg);
        addFavClassIfInFavList(newShow, id);
        newShow.appendChild(newImg);
        newShow.appendChild(newP);
        newShow.addEventListener('click', favShow);
        ulresultsEl.appendChild(newShow);
      }
    });
}

buttonEl.addEventListener('click', btnClickHandler);

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

//AÑADE EFECTO FAV A SHOW DE LOS RESULTADOS, LO AÑADE A LISTA FAVS Y SI YA ESTA EN LISTA FAVS LO QUITA DE LA LISTA.
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

//PINTA LA LISTA DE FAVORITOS CON BOTONES DE DELETE CON LISTENER
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
    element.addEventListener('click', deleteWithFavBtn);
  }
}

//GUARDA LISTA DE FAVS EN CACHE
function saveFavs () {
  localStorage.setItem('favShowsList', JSON.stringify(favList));
}

//COMPRUEBA SI HAY FAVS GUARDADOS EN CACHE Y LOS PINTA
function setfavListFromCache () {
  const savedFavs = JSON.parse(localStorage.getItem('favShowsList'));
  if(savedFavs) {
    favList = savedFavs;
    paintFavList();
  }
}

//BORRAR DESDE EL BOTÓN DE DELETE DE CADA FAVORITO
function deleteWithFavBtn (event) {
  const thisShow = event.currentTarget.parentElement;
  const thisShowId = thisShow.getAttribute('data-id');
  deleteFavShow(thisShowId);
  paintFavList();
  saveFavs();
}

function deleteFavShow (id) {
  for( let i = 0; i < favList.length; i++){
    if (favList[i].id === id) {
      favList.splice(i, 1);
    }
  }
}

function searchEnter (event) {
  if (event.key === 'Enter') {
    btnClickHandler();
  }
}

inputEl.addEventListener('keyup', searchEnter);

function deleteAllFavs () {
  favList = [];
  paintFavList();
  saveFavs();
}

deleteAllBtnEl.addEventListener('click', deleteAllFavs);