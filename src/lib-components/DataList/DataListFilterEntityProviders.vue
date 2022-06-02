<template>
  <div>
    <ContentProviderAutocomplete
      v-model="value"
      :providers="values"
      :return-object="false"
      small
      :data-test-label="`autocomplete-${filterName} content-providers`"
      @search="handleSearchString($event)"
    />
    <DataListMyCompanyProviderFilter
      v-if="isMyCompanyContentProvider"
      v-model="value"
      :items="values"
    />
  </div>
</template>

<script lang="ts">
import ContentProviderAutocomplete
  from '../ui/ContentProviderAutocomplete/ProviderAutocomplete.vue';
import { isFilterSelectMultiple } from '../../utils';
import { debounce, isEqual } from '../../helpers';

import Vue, { PropType } from 'vue';
import {
  FilterSelectMode,
  FilterEntityProvidersType,
  FilterSelectMultipleWithSource,
  FilterSelectWithSource, FilterValue,
} from '../../types';

import { DATA_LIST_MY_COMPANY_PROVIDER } from './MyCompanyProvider';
import DataListMyCompanyProviderFilter from './MyCompanyProvider/DataListMyCompanyProviderFilter.vue';

interface DataListFilterEntitySelectData {
  searchInput: string;
  values: FilterValue[];
  isLoading: boolean;
}

export default Vue.extend({
  name: 'DataListFilterEntityProviders',
  components: {
    ContentProviderAutocomplete,
    DataListMyCompanyProviderFilter,
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
    isMyCompanyContentProvider(): boolean {
      return this.entity.componentType === FilterEntityProvidersType.MY_COMPANY;
    },

    value: {
      get() {
        // @ts-ignore
        return isFilterSelectMultiple(this.entity) ? this.entity.checkedValues : [this.entity.checkedValue];
      },
      set(value: string[] = []) {
        this.$emit('input', this.formatProvidersByMyCompany(value) ?? []);
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

    formatProvidersByMyCompany(newValue: string[]) {
      if (!this.isMyCompanyContentProvider) return newValue;
      const oldValue = this.value;

      if (!isEqual(oldValue, newValue)) {
        const isMyCompanyProviderWillChecked = newValue.includes(DATA_LIST_MY_COMPANY_PROVIDER.value);
        const isMyCompanyProviderWasChecked = oldValue?.includes(DATA_LIST_MY_COMPANY_PROVIDER.value);
        if (!isMyCompanyProviderWasChecked && isMyCompanyProviderWillChecked) {
          return [DATA_LIST_MY_COMPANY_PROVIDER.value];
        }
        if (isMyCompanyProviderWasChecked && newValue.length > 1) {
          return newValue.filter((val) => val !== DATA_LIST_MY_COMPANY_PROVIDER.value);
        }
      }
      return newValue;
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
