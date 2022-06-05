import axios from 'axios';

const SERVER_BOOK = import.meta.env.VITE_SERVER_BOOK;
const SERVER_CATEGORIES = import.meta.env.VITE_SERVER_CATEGORIES;

export function getBooksAPI(filters) {
  return axios.post(SERVER_BOOK, {
    filters: { ...filters },
  });
}

export function getCategories() {
  return axios.get(SERVER_CATEGORIES);
}
