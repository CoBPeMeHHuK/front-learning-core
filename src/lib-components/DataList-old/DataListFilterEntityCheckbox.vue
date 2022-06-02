<template>
  <div>
    <TTCheckbox
      v-for="value in entity.values"
      :key="value.value"
      v-model="checkedValues"
      :label="value.title"
      :value="value.value"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType, ComputedOptions } from 'vue';
import { FilterCheckbox, FilterSelectMode } from '../../types';

export default Vue.extend({
  name: 'DataListFilterEntityCheckbox',

  props: {
    entity: {
      type: Object as PropType<FilterCheckbox>,
      required: true,
    },
  },

  computed: {
    mode() {
      return FilterSelectMode.MULTIPLE;
    },

    checkedValues: {
      get(): FilterCheckbox['checkedValues'] {
        // @ts-expect-error
        return this.entity.checkedValues;
      },
      set(checkedValues: FilterCheckbox['checkedValues']) {
        // @ts-expect-error
        this.$emit('input', checkedValues);
      },
    } as ComputedOptions<FilterCheckbox['checkedValues']>,
  },
});
</script>
