<template>
  <div>
    {{ entity.name }} {{ entity.type }} {{ mode }}
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { FilterRadio, FilterSelectMode } from '../../types';

export default Vue.extend({
  name: 'DataListFilterEntityRadio',

  props: {
    entity: {
      type: Object as PropType<FilterRadio>,
      required: true,
    },
  },

  computed: {
    mode() {
      return FilterSelectMode.SINGLE;
    },
  },
});
</script>
