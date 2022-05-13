<template>
  <div>
    <h3
      class="tt-text-title-2 mt-9 mb-4"
      :data-test="`header-${filterName}`"
    >
      {{ entity.title }}
    </h3>
    <Component
      :is="getComponent(entity)"
      v-model="checked"
      :entity="entity"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { Filter, FilterType, FilterValue } from '../../types';

import DataListFilterEntityRadio from './DataListFilterEntityRadio.vue';
import DataListFilterEntityCheckbox from './DataListFilterEntityCheckbox.vue';
import DataListFilterEntitySelect from './DataListFilterEntitySelect.vue';
import DataListFilterEntityProviders from './DataListFilterEntityProviders.vue';
import DataListFilterEntityCategory from './DataListFilterEntityCategory.vue';
import DataListFilterEntityAuthor from './DataListFilterEntityAuthor.vue';
import { getFilterValue } from '../../utils';

export default Vue.extend({
  name: 'DataListFilterEntity',
  props: {
    entity: {
      type: Object as PropType<Filter>,
      required: true,
    },
  },
  computed: {
    checked: {
      get() {
        return getFilterValue(this.entity);
      },
      set(filterValue: FilterValue | FilterValue[]) {
        this.$emit('change', this.entity.name, filterValue);
      },
    },
    filterName(): string {
      return this.entity.name;
    },
  },
  methods: {
    getComponent({ type }: Filter) {
      switch (type) {
        case FilterType.RADIO:
          return DataListFilterEntityRadio;
        case FilterType.CHECKBOX:
          return DataListFilterEntityCheckbox;
        case FilterType.SELECT:
          return DataListFilterEntitySelect;
        case FilterType.PROVIDERS:
          return DataListFilterEntityProviders;
        case FilterType.TAG:
          return DataListFilterEntityCategory;
        case FilterType.AUTHOR:
          return DataListFilterEntityAuthor;
        default:
          return null;
      }
    },
  },
});
</script>
