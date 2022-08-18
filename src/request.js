import Notiflix from 'notiflix';
import axios from 'axios'

const API_KEY = '29352344-4ccf7f6be6a358b259d84351d';

export default async function fetchImages(name, pageNumber) {
    try {
    const response = await axios.get(`https://pixabay.com/api/?key=${API_KEY}&q=${name}&image_type=photo&orientation=horizontal&page=${pageNumber}&per_page=40`);
    return response.data;
    } catch (error) {
    Notiflix.Notify.warning('error');
    }
}