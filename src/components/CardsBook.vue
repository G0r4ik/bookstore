<template>
  <div class="books">
    <div class="container container_books">
      <div class="books__inner">
        <div v-for="book in books" :key="book.id" class="books__item">
          <img
            class="books__img"
            width="190"
            height="250"
            :src="`${book.coverUrl}`"
            :alt="`Cover ${book.name}`"
          />
          <div class="books__text">
            <div class="books__price">{{ book.price }} руб</div>
            <div class="books__name">{{ book.name }}</div>
            <div class="books__author-name">{{ book.authorName }}</div>
            <button
              v-if="!book.countInUserCart"
              class="books__btn-to-cart"
              @click="$emit('addToUserCart', book)"
            >
              В корзину
            </button>
            <button
              v-else
              class="books__btn-to-cart books__btn-to-cart_buy"
              @click="$emit('showUserCartFunction')"
            >
              Оформить
            </button>
          </div>
        </div>
      </div>
      <div v-if="showTextNoBooks && !books.length" class="books__empty">
        Нет книг
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    books: {
      type: Array,
      required: true,
    },
  },

  emits: ['addToUserCart', 'showUserCartFunction'],

  data() {
    return {
      showTextNoBooks: false,
    };
  },

  updated() {
    if (this.books) this.showTextNoBooks = true;
  },
};
</script>
