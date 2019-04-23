'use strict';

const inputEl = document.querySelector('#TVshow');
const buttonEl = document.querySelector('.button');
const ulfavEl = document.querySelector('.favs');
const ulresultsEl = document.querySelector('.results');

let favList = [];

setfavListFromCache();

//VACIA LISTA DE RESULTADOS, HACE PETICIÓN A API Y PINTA RESULTADOS CON LISTENER
function btnClickHandler(){
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
        for( let i = 0; i < favList.length; i++){
          if (parseInt(favList[i].id) === id) {
            newShow.classList.add('favshow');
          }
        }
        newShow.appendChild(newImg);
        newShow.appendChild(newP);
        newShow.addEventListener('click', favShow);
        ulresultsEl.appendChild(newShow);
      }
    });
}

buttonEl.addEventListener('click', btnClickHandler);

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
  if (thisShow.classList.contains('favshow')) {
    favList.push(favShow);
  }else{
    for( let i = 0; i < favList.length; i++){
      console.log('for');
      if (favList[i].id === favId) {
        favList.splice(i, 1);
      }
    }
  }
  paintFavList ();
  saveFavs();
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
  for (const button of btnDelete){
    button.addEventListener('click', deleteFavBtn);
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
function deleteFavBtn (event) {
  const thisShow = event.currentTarget.parentElement;
  const thisShowId = thisShow.getAttribute('data-id');
  console.log(thisShow, 'delete', thisShowId);
  for( let i = 0; i < favList.length; i++){
    if (favList[i].id === thisShowId) {
      console.log('check');
      favList.splice(i, 1);
    }
  }
  paintFavList();
  saveFavs();
}

//PODER BUSCAR CON ENTER
function handlerEnter (event) {
  event.preventDefault();
  console.log(event);
  if (event.key === 'Enter') {
    event.preventDefault();
    btnClickHandler();
    console.log('enter');
  }
}

inputEl.addEventListener('keyup', handlerEnter);