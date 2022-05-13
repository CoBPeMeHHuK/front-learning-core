<template>
  <div>
    <TTAutocomplete
      v-model="value"
      multiple
      :items="values"
      :loading="isLoading"
      :placeholder="$t('DataListFilterEntityAuthor.search.placeholder')"
      :no-filter="true"
      item-text="title"
      item-value="value"
      small
      :menu-props="menuProps"
      :search-input.sync="searchInput"
      :data-test-label="`“autocomplete-${filterName}`"
    >
      <template #item="{ item }">
        <div class="d-flex flex-row flex-grow-1 justify-space-between align-center">
          <div class="d-flex flex-row justify-space-between align-center mr-2">
            <TTCheckbox
              class="ma-0"
              :input-value="value.includes(item.value)"
            />
            <span class="tt-text-body-2 tt-light-mono-100--text text-line-clamp-1 ml-2">
              {{ item.title }}
            </span>
          </div>
          <UserAvatar
            :user="authorAvatar(item)"
            x-small
          />
        </div>
      </template>
    </TTAutocomplete>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { UserAvatar } from '../';

import {
  FilterAuthor, FilterAuthorMultipleWithSource, FilterSelectMode, FilterValue, IProvider,
} from '../../types';

import { debounce } from '../../helpers';

export default Vue.extend({
  name: 'DataListFilterEntityAuthor',
  components: {
    UserAvatar,
  },
  props: {
    entity: {
      type: Object as PropType<FilterAuthor & IProvider>,
      required: true,
    },
  },
  data() {
    return {
      searchInput: '',
      values: [] as FilterValue[],
      isLoading: false,
    };
  },
  computed: {
    mode(): FilterSelectMode {
      return this.entity.mode;
    },

    provider(): FilterAuthorMultipleWithSource['provider'] {
      return this.entity.provider;
    },

    filterName(): string {
      return this.entity.name;
    },

    menuProps() {
      return {
        closeOnClick: false,
        closeOnContentClick: false,
        disableKeys: true,
        openOnClick: false,
        maxHeight: 304,
        offsetY: true,
        offsetOverflow: true,
        transition: false,
      };
    },

    value: {
      get(): string[] {
        return this.entity.checkedValues;
      },
      set(value: string[] = []) {
        this.$emit('input', value ?? []);
      },
    },

  },
  watch: {
    searchInput(search: string) {
      // @ts-ignore
      this.debouncedFetch(search);
    },
  },
  created() {
    // @ts-expect-error
    this.debouncedFetch = debounce(this.fetch, 250);
  },
  mounted() {
    this.fetch();
  },
  methods: {
    async fetch(search: string = '') {
      this.isLoading = true;
      let values: FilterValue[] = [];

      try {
        values = await this.provider(search);
      } catch (e) {
        // this.$di.snack.error({ content: e });
      } finally {
        this.isLoading = false;
      }

      this.values = values;
    },
    authorAvatar(entity: FilterValue) {
      const [firstName = '', lastName = ''] = entity.title.split(' ');
      return {
        id: entity.value,
        firstName,
        lastName,
      };
    },
  },
});
</script>
