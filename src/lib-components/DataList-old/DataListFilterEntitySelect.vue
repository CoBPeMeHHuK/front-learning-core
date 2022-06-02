<template>
  <div>
    <TTAutocomplete
      v-model="value"
      :multiple="isMultiple"
      :items="values"
      :loading="isLoading"
      placeholder="Начните вводить..."
      :no-filter="true"
      item-text="title"
      item-value="value"
      medium
      :menu-props="menuProps"
      :search-input.sync="searchInput"
      :data-test-label="`“autocomplete-${filterName}`"
    >
      <template #item="{ item }">
        <div :data-test="`list-${filterName}`">
          {{ item.title }}
        </div>
      </template>
    </TTAutocomplete>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import {
  debounce,
} from '../../helpers';
import {
  DataListFilterEntitySelectData,
  FilterSelectMode, FilterSelectWithSource, FilterValue,
} from '../../types';
import { isFilterSelectMultiple } from '../../utils';

export default Vue.extend({
  name: 'DataListFilterEntitySelect',
  props: {
    entity: {
      type: Object as PropType<FilterSelectWithSource>,
      required: true,
    },
  },

  data(): DataListFilterEntitySelectData {
    return {
      searchInput: '',
      values: [],
      isLoading: false,
    };
  },

  computed: {
    mode(): FilterSelectMode {
      return this.entity.mode;
    },

    provider(): FilterSelectWithSource['provider'] {
      return this.entity.provider;
    },

    isMultiple(): boolean {
      return isFilterSelectMultiple(this.entity);
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
      get() {
        return isFilterSelectMultiple(this.entity) ? this.entity.checkedValues : [this.entity.checkedValue];
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
  methods: {
    async fetch(search: string) {
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
  },
});
</script>
