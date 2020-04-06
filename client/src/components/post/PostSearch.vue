<template>
  <div class="post-search">
    <div class="field is-grouped is-grouped-centered">
      <div class="control" v-if="isModOrAbove">
        <span class="select is-small">
          <select v-model="options.verified">
            <option value="" selected>All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
        </span>
      </div>

      <div class="control is-expanded">
        <input v-model="options.search" type="text" class="input is-small" placeholder="Search (omit to load all)">
      </div>

    </div>

    <div class="field is-grouped is-grouped-centered is-grouped-multiline">
      <div class="control" v-if="categories">
        <span class="select is-small">
          <select v-model="options.categoryId">
            <option value="" selected>Category</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">
              {{ category.name }}
            </option>
          </select>
        </span>
      </div>

      <div class="control">
        <span class="select is-small">
          <select v-model="options.orderBy">
            <option value="" selected>Sort by</option>
            <option value="createdAt">Date Created</option>
            <!-- <option value="updatedAt">Date Updated</option> -->
          </select>
        </span>
      </div>

      <div class="control">
        <span class="select is-small">
          <select v-model="options.order">
            <option value="" selected>Order</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </span>
      </div>

      <div class="control">
        <button @click="submit" class="button is-primary is-small">Search</button>
      </div>

      <div class="control">
        <button @click="close" class="button is-danger is-small">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { categoryService } from '@/services/dataService.js';
import Vue from 'vue';

export default {
  name: 'PostSearch',

  data() {
    return {
      options: {
        verified: '',
        orderBy: '',
        order: '',
        search: '',
        categoryId: '',
      },
      categories: null,
    }
  },

  created() {
    this.loadCategories();
  },

  computed: {
    ...mapGetters(['isModOrAbove'])
  },

  methods: {
    async loadCategories() {
      let result = await categoryService.getAll();
      if (!result.success) this.$toasted.error("Could not load category list");
      this.categories = result.data;
    },

    submit() {
      let opts = {...this.options};
      // remove empty properties
      for (let key in opts) {
        if (!opts[key]) Vue.delete(opts, key);
      }
      // convert to boolean
      if (opts.verified) opts.verified = (opts.verified === "verified");
      // emit event
      this.$emit('search', opts);
    },

    close() {
      this.$emit('close');
    }
  }
}
</script>