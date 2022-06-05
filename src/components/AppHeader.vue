<template>
  <header class="header">
    <div class="container">
      <div class="header__inner">
        <div class="header__logo">
          <img class="header__logo-img" src="../assets/logo.png" alt="Logo" />
          <span class="header__logo-text">Магазин Книг</span>
        </div>
        <div class="header__group">
          <div
            class="header__cart"
            tabindex="0"
            @click="$emit('showUserCartFunction')"
            @keydown.enter="$emit('showUserCartFunction')"
          >
            <span class="header__cart-text">Корзина</span>
            <icon-cart />
            <div v-if="totalCountBooksInUserCart" class="header__count">
              {{
                totalCountBooksInUserCart < 10
                  ? totalCountBooksInUserCart
                  : '9+'
              }}
            </div>
          </div>
          <div class="header__balance">
            Баланс:
            <span class="header__balance-text">{{ userBalance }} руб</span>
          </div>
          <icon-change-theme
            tabindex="0"
            class="header__change-theme"
            @click="changeTheme"
            @keydown.enter="changeTheme"
          />
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import IconCart from './icon/IconCart.vue';
import IconChangeTheme from './icon/IconChangeTheme.vue';

export default {
  components: { IconChangeTheme, IconCart },

  props: {
    userBalance: {
      type: Number,
      required: true,
    },
    userCart: {
      type: Array,
      required: true,
    },
  },

  emits: ['showUserCartFunction'],

  data() {
    return {
      themeWebsite: 'light',
    };
  },

  computed: {
    totalCountBooksInUserCart() {
      return this.userCart.reduce(
        (accumulator, book) => (accumulator += book.countInUserCart),
        0
      );
    },
  },

  watch: {
    themeWebsite() {
      document.documentElement.setAttribute('theme', this.themeWebsite);
      localStorage.setItem('themeWebsite', this.themeWebsite);
    },
  },

  mounted() {
    if (localStorage.getItem('themeWebsite')) {
      this.themeWebsite = localStorage.getItem('themeWebsite');
    }
  },

  methods: {
    changeTheme() {
      this.themeWebsite = this.themeWebsite == 'dark' ? 'ligth' : 'dark';
    },
  },
};
</script>
