<template>
  <ContentProviderAutocomplete
    v-model="value"
    :providers="values"
    :return-object="false"
    small
    :data-test-label="`autocomplete-${filterName} content-providers`"
    @search="handleSearchString($event)"
  />
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ContentProviderAutocomplete }
  from '../';
import {
  DataListFilterEntitySelectData,
  FilterSelectMode,
  FilterSelectMultipleWithSource,
  FilterSelectWithSource, FilterValue,
} from '../../types';
import { isFilterSelectMultiple } from '../../utils';
import { debounce } from '../../helpers';

export default Vue.extend({
  name: 'DataListFilterEntityProviders',
  components: {
    ContentProviderAutocomplete,
  },
  props: {
    entity: {
      type: Object as PropType<FilterSelectMultipleWithSource>,
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
        // @ts-ignore
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
    handleSearchString(search: string) {
      this.searchInput = search;
    },

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
