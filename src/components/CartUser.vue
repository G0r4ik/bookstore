<template>
  <div tabindex="0" class="cart" @click="$emit('showUserCartFunction')">
    <div class="cart__inner" @click.stop>
      <div v-if="userCart.length" class="cart__main">
        <div
          tabindex="0"
          class="cart__cross-close"
          @click="$emit('showUserCartFunction')"
          @keydown.enter="$emit('showUserCartFunction')"
        >
          <icon-cross tabindex="0" />
        </div>
        <div class="cart__title">Ваша корзина</div>
        <ul class="cart__list">
          <transition-group name="deletingItemInUserCart">
            <li v-for="book in userCart" :key="book.id" class="cart__item">
              <img
                class="cart__item-img"
                :src="book.coverUrl"
                :alt="`Сover ${book.name}`"
              />
              <div class="cart__item-text">
                <div class="cart__name-book">{{ book.name }}</div>
                <div class="cart__author-name">{{ book.authorName }}</div>
                <div class="cart__count">
                  <button
                    class="cart__count-edit-btn cart__count-edit-btn_minus"
                    @click="$emit('reduceCountBook', book)"
                    @keydown.enter="$emit('reduceCountBook', book)"
                  >
                    <icon-minus />
                  </button>
                  <div class="cart__count-text">
                    {{ book.countInUserCart }} шт
                  </div>
                  <button
                    class="cart__count-edit-btn cart__count-edit-btn_plus"
                    @click="$emit('increaseCountBook', book)"
                    @keydown.enter="$emit('increaseCountBook', book)"
                  >
                    <icon-plus />
                  </button>
                </div>
                <div class="cart__price">
                  {{ book.price * book.countInUserCart }} руб
                </div>
                <button
                  class="cart__cross-delete"
                  @click="$emit('deleteFromUserCart', book.id)"
                  @keydown.enter="$emit('deleteFromUserCart', book.id)"
                >
                  удалить
                </button>
              </div>
            </li>
          </transition-group>
        </ul>
        <div class="cart__buy-book">
          <div v-if="insufficient" class="cart__insufficient">
            Недостаточно средств
          </div>
          <div class="cart__total-sum">{{ totalAmount }} руб</div>
          <button
            tabindex="0"
            class="cart__button-buy"
            :disabled="insufficient"
            @click="$emit('buyBooks', totalAmount)"
            @keydown.enter="$emit('buyBooks', totalAmount)"
          >
            Купить
          </button>
        </div>
      </div>
      <div v-if="!userCart.length && !successfulPurchase" class="cart__empty">
        Тут пусто 😔

        <button class="cart__empty-btn" @click="$emit('showUserCartFunction')">
          Найти что-нибудь
        </button>
      </div>
      <div v-if="successfulPurchase" class="cart__successful">
        <div
          tabindex="0"
          class="cart__successful-cross"
          @click="$emit('showUserCartFunction')"
          @keydown.enter="$emit('showUserCartFunction')"
        >
          <icon-cross />
        </div>
        <span class="cart__successful-text">Покупка прошла успешно 😌</span>
      </div>
    </div>
  </div>
</template>

<script>
import IconCross from './icon/IconCross.vue';
import IconPlus from './icon/IconPlus.vue';
import IconMinus from './icon/IconMinus.vue';

export default {
  components: { IconCross, IconPlus, IconMinus },

  props: {
    userCart: {
      type: Array,
      required: true,
    },
    successfulPurchase: Boolean,
    userBalance: {
      type: Number,
      required: true,
    },
  },

  emits: [
    'showUserCartFunction',
    'buyBooks',
    'deleteFromUserCart',
    'increaseCountBook',
    'reduceCountBook',
  ],

  computed: {
    totalAmount() {
      return this.userCart.reduce(
        (accumulator, val) => (accumulator += val.price * val.countInUserCart),
        0
      );
    },
    insufficient() {
      return this.userBalance < this.totalAmount;
    },
  },
};
</script>
