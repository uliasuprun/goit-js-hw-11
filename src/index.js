import axios from 'axios';
import Notiflix from 'notiflix';
import * as refs from './refs'
import fetchImages from './request'
import renderCardForImages from './render'
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

function byScroll() {
  const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

  return window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}
let pageNumber = 1;
let name;
refs.form.addEventListener('submit', createGalery)

async function createGalery (event){
    event.preventDefault();
    pageNumber = 1;
    refs.galleryEl.innerHTML = ""
    refs.footer.innerHTML = ""
    name = event.target.searchQuery.value;
    const searchResult = await fetchImages(name, pageNumber);
    if(searchResult.hits.length === 0){
      refs.tittle.textContent = '';
      Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
    } else {
      refs.tittle.textContent = '';
      Notiflix.Notify.success(`Hooray! We found ${searchResult.totalHits} images.`);
      await createImagesCard(searchResult.hits);
      byScroll()
      const lightbox = new SimpleLightbox('.gallery a');
      if (searchResult.totalHits < 40){
        refs.loadBtn.classList.add('is-hidden')
        refs.footer.insertAdjacentHTML('beforeend', `<h2 class="result-message">We're sorry, but you've reached the end of search results.</h2>`);
      } else {
        refs.loadBtn.classList.remove('is-hidden')
      } 
    }
    refs.form.reset()
  }

  refs.loadBtn.addEventListener('click', loadNextGalery)
  
  async function loadNextGalery(){
    pageNumber += 1;
    const nextResult = await fetchImages(name, pageNumber);
    createImagesCard(nextResult.hits);
    byScroll()
    const lightbox = new SimpleLightbox('.gallery a');
    lightbox.refresh()
    if (nextResult.hits.length < 40){
      refs.loadBtn.classList.add('is-hidden')
      refs.footer.insertAdjacentHTML('beforeend', `<h2 class="result-message">We're sorry, but you've reached the end of search results.</h2>`);
    }
}

function createImagesCard(array){
  const cards = array.reduce((acc, image) => acc + renderCardForImages(image), "");
  return refs.galleryEl.insertAdjacentHTML('beforeend', cards);
}

