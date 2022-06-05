<template>
  <div>
    <teleport to="body">
      <transition name="showUserCart">
        <cart-user
          v-if="showUserCart"
          :user-cart="userCart"
          :user-balance="userBalance"
          :successful-purchase="successfulPurchase"
          @show-user-cart-function="showUserCartFunction"
          @buy-books="buyBooks"
          @delete-from-user-cart="deleteFromUserCart"
          @increase-count-book="increaseCountBook"
          @reduce-count-book="reduceCountBook"
        />
      </transition>
    </teleport>
    <app-header
      :user-balance="userBalance"
      :user-cart="userCart"
      @show-user-cart-function="showUserCartFunction"
    />
    <filter-book @get-books="getBooks" />
    <cards-book
      :books="books"
      @add-to-user-cart="addToUserCart"
      @show-user-cart-function="showUserCartFunction"
    />
  </div>
</template>

<script>
import AppHeader from './components/AppHeader.vue';
import CardsBook from './components/CardsBook.vue';
import FilterBook from './components/FilterBook.vue';
import CartUser from './components/CartUser.vue';

import { getBooksAPI } from './helpers/api';
import { cartFocusTrap } from './helpers/cartFocusTrap';

export default {
  components: { AppHeader, CartUser, FilterBook, CardsBook },

  data() {
    return {
      userBalance: +import.meta.env.VITE_USER_BALANCE,
      userCart: [],
      books: [],

      showUserCart: false,
      successfulPurchase: false,
    };
  },

  watch: {
    userBalance() {
      localStorage.setItem('userBalance', this.userBalance);
    },
    userCart: {
      handler() {
        localStorage.setItem('userCartItems', JSON.stringify(this.userCart));
      },
      deep: true,
    },
  },

  mounted() {
    document.addEventListener('keydown', (e) => {
      if (e.keyCode == 27) this.showUserCartFunction();
    });

    if (localStorage.getItem('userBalance')) {
      this.userBalance = +localStorage.getItem('userBalance');
    }

    if (localStorage.getItem('userCartItems')) {
      this.userCart = JSON.parse(localStorage.getItem('userCartItems'));
    }
  },

  methods: {
    async getBooks(filters) {
      const books = await getBooksAPI(filters);
      this.books = books.data;

      // может так получится что одинаковые авторы и название книги
      Object.values(this.books).forEach((book) => {
        book.id = `${book.name}-${book.authorName}`;
      });

      this.connectionCardBookAndServeBook(filters);
    },

    async connectionCardBookAndServeBook() {
      console.log('Синхронизация');
      let books = await getBooksAPI();
      books = books.data;

      Object.values(books).forEach((book) => {
        book.id = `${book.name}-${book.authorName}`;
      });

      let copy = [];

      books.forEach((bookServe) => {
        this.userCart.forEach((bookInCart) => {
          if (bookServe.id == bookInCart.id) {
            bookServe.countInUserCart = bookInCart.countInUserCart;

            copy.push({ ...bookServe });
          }
        });
      });
      this.userCart = [];
      this.userCart = [...copy];

      for (let i = 0; i < this.userCart.length; i++) {
        let bookInCart = this.userCart[i];
        for (let j = 0; j < this.books.length; j++) {
          let bookServe = this.books[j];
          if (bookServe.id == bookInCart.id) {
            this.books[j].countInUserCart = this.userCart[i].countInUserCart;
            this.books[j] = this.userCart[i];
          }
        }
      }
    },

    addToUserCart(book) {
      if (!this.$canClick) return;

      book.countInUserCart = 1;
      this.userCart.push(book);

      this.$waitAfterClick(100);
    },

    showUserCartFunction() {
      if (!this.$canClick) return;

      this.connectionCardBookAndServeBook();

      this.successfulPurchase = false;
      this.showUserCart = !this.showUserCart;

      if (this.showUserCart && this.userCart.length) {
        setTimeout(() => {
          window.addEventListener('keydown', cartFocusTrap);
          document.querySelector('.cart__cross-delete').focus();
        }, 210);
      } else if (this.showUserCart) {
        setTimeout(() => {
          window.addEventListener('keydown', cartFocusTrap);
          document.querySelector('.cart__empty-btn').focus();
        }, 210);
      } else {
        window.removeEventListener('keydown', cartFocusTrap);
      }

      this.$waitAfterClick(150);
    },

    buyBooks(totalAmount) {
      if (this.insufficient) return;
      this.userBalance -= totalAmount;
      this.userCart.forEach((book) => (book.countInUserCart = 0));
      this.userCart = [];
      this.successfulPurchase = true;
    },

    deleteFromUserCart(id) {
      this.userCart = this.userCart.filter((book) => {
        if (book.id === id) book.countInUserCart = 0;
        return book.id !== id;
      });
    },

    increaseCountBook(book) {
      book.countInUserCart++;
    },

    reduceCountBook(book) {
      if (book.countInUserCart > 1) book.countInUserCart--;
    },
  },
};
</script>
