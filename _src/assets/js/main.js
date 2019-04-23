'use strict';

const inputEl = document.querySelector('#TVshow');
const buttonEl = document.querySelector('.button');
const ulfavEl = document.querySelector('.favs');
const ulresultsEl = document.querySelector('.results');

let favList = [];

setfavListFromCache();

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
  thisShow.classList.toggle('favshow');
  const favTitle = thisShow.querySelector('p').innerHTML;
  const favImg = thisShow.querySelector('img').src;
  const favShow = {
    title: favTitle,
    img: favImg,
  };
  if (thisShow.classList.contains('favshow')) {
    favList.push(favShow);
  }
  paintFavList ();
  saveFavs();
}

function paintFavList () {
  ulfavEl.innerHTML = '';
  for (const show of favList){
    const {title,img} = show;
    const showLi = `
    <li class="show">
        <img src= ${img} alt=${title} class="image">
        <p class="title">${title}</p>
        <button class="delete">X</button>
    </li>`;
    ulfavEl.innerHTML+=showLi;
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



//PRUEBAS
//console.log('favShow', favShow);
//   for( let i = 0; i < favList.length; i++){
//     if (favList[i].name === favShow.name && favList[i].img === favShow.img) {
//     console.log('check');
//     const isFav= true;
//     }
//   }
//   if (isFav) {
//     // for( let i = 0; i < favList.length; i++){
//     //     if (favList[i].name === favShow.name && favList[i].img === favShow.img) {
//     //     console.log('check');
//     //     favList.splice(i, 1);
//            }
//     // }
//
//   }else{
//     favList.push(favShow);
// for( let i = 0; i < favList.length; i++){
//   if (favList[i].name === favShow.name && favList[i].img === favShow.img) {
//     console.log('check');
//     favList.splice(i, 1);
//   }else{
//     console.log('check');
//     favList.push(favShow);
//   }
// }
//}
//}