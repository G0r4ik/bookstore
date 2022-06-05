<template>
  <div class="filter">
    <div class="container">
      <div class="filter__inner">
        <div class="filter__search search">
          <icon-search />
          <input
            v-model="filters.search"
            type="search"
            class="search__input"
            placeholder="Поиск по книге"
          />
        </div>
        <div class="filter__group">
          <div
            class="filter__price"
            tabindex="0"
            @click="addSortPriceFilter()"
            @keydown.enter="addSortPriceFilter()"
          >
            <span class="filter__price-text">Сортировать по цене</span>
            <icon-arrow
              :style="`transform: rotate(${
                filters.sortPrice == 'ASC' ? 0 : 180
              }deg)`"
            />
          </div>
          <div class="filter__category">
            <div
              class="filter__select"
              tabindex="0"
              @click="showList = !showList"
              @keydown.enter="showList = !showList"
              @mouseleave="showList = false"
            >
              <span class="filter__select-text">
                Категория:
                <span class="filter__select-text-c">
                  {{ currentCategoryName }}
                </span>
              </span>
              <ul
                class="filter__category-list"
                :class="{ 'filter__category-list_visibly': showList }"
              >
                <li
                  class="filter__category-item"
                  tabindex="0"
                  :class="{
                    'filter__category-item_active': !filters.categoryId,
                  }"
                  @click="addCategoryIdFilter()"
                  @keydown.enter="addCategoryIdFilter()"
                >
                  Все
                </li>
                <li
                  v-for="category in categories"
                  :key="category.id"
                  class="filter__category-item"
                  tabindex="0"
                  :class="{
                    'filter__category-item_active':
                      category.id == filters.categoryId,
                  }"
                  @click="addCategoryIdFilter(category.id)"
                  @keydown.enter="addCategoryIdFilter(category.id)"
                >
                  {{ category.name }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import IconSearch from './icon/IconSearch.vue';
import IconArrow from './icon/IconArrow.vue';

import { getCategories } from '../helpers/api';

export default {
  components: { IconSearch, IconArrow },

  emits: ['getBooks'],

  data() {
    return {
      categories: [],
      showList: false,
      filters: {
        search: '',
        sortPrice: 'ASC',
        categoryId: null,
      },
    };
  },

  computed: {
    currentCategoryName() {
      return (
        this.categories.find((c) => c.id == this.filters.categoryId)?.name ||
        'Все'
      );
    },
  },

  watch: {
    filters: {
      handler(v) {
        this.$emit('getBooks', this.filters);
        let { search, sortPrice, categoryId } = v;
        search = search ? `search=${search}` : '';
        sortPrice = sortPrice ? `sortPrice=${sortPrice}` : '';
        categoryId = categoryId ? `categoryId=${categoryId}` : '';

        let opt = [sortPrice, categoryId, search]
          .filter((el) => el !== '')
          .join('&');

        window.history.pushState(
          null,
          document.title,
          `${window.location.pathname}?${opt}`
        );
      },
      deep: true,
    },
  },

  created() {
    getCategories().then((categories) => (this.categories = categories.data));

    const windowData = Object.fromEntries(
      new URL(window.location).searchParams.entries()
    );

    this.filters = { ...windowData };
    if (!this.filters.sortPrice) this.filters.sortPrice = 'ASC';
  },

  methods: {
    addCategoryIdFilter(idCategory) {
      if (!idCategory) this.filters.categoryId = null;
      this.filters.categoryId = idCategory;
    },

    addSortPriceFilter() {
      if (!this.$canClick) return;
      this.filters.sortPrice =
        this.filters.sortPrice == 'DESC' ? 'ASC' : 'DESC';
      this.$waitAfterClick(250);
    },
  },
};
</script>
