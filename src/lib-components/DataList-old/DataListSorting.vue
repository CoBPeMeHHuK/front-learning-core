<template>
  <div class="ttl-data-list__sorting">
    <slot
      name="default"
      v-bind="slotProps"
    >
      <VSelect
        :items="sortings"
        @change="onSortingChange"
      />
    </slot>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, PropType } from '@vue/composition-api';
import { noop } from '../../helpers';

export default defineComponent({
  name: 'DataListSorting',

  props: {
    sortings: {
      type: Array as PropType<Array<{ text: string, value: string }>>,
      default: () => ([]),
    },
  },

  setup() {
    const sortBy = inject<string>('sortBy');
    const orderBy = inject<string>('orderBy');

    const setSortBy = inject<(sort: string) => void>('setSortBy', noop);
    const setOrderBy = inject<(order: string) => void>('setOrderBy', noop);

    return {
      sortBy,
      orderBy,
      setSortBy,
      setOrderBy,
    };
  },

  computed: {
    slotProps(): any {
      return {
        sortBy: this.sortBy,
        orderBy: this.orderBy,
        setSortBy: this.setSortBy,
        setOrderBy: this.setOrderBy,
      };
    },
  },

  methods: {
    onSortingChange(value: string) {
      const [sortBy, orderBy] = value.split(':');

      this.setSortBy(sortBy);
      this.setOrderBy(orderBy);
    },
  },
});
</script>

<style lang="scss" scoped>
  .ttl-data-list__sorting {
    display: block;
  }
</style>
