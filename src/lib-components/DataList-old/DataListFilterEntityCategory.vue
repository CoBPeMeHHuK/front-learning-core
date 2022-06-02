<template>
  <article class="category-aside-picker">
    <div>
      <TTTextField
        v-model="search"
        :placeholder="$t('CategoryAsidePicker.search.placeholder')"
        append-icon="$search"
        small
        class="mt-3 mb-4"
      />
      <div
        v-for="category in itemsVisible"
        :key="category.value"
        class="category-item d-block px-1"
      >
        <TTChip
          :class="{selected : value.includes(category.value)}"
          @click="toggle(category.value)"
        >
          <TTAvatar
            x-small
            :src="categoryIconSrc(category)"
          />
          <span class="text-overflow-ellipsis ml-1">
            {{ category.title }}
          </span>

          <!-- TODO: Реализовать количество по категории, можно через пропс TTChip counter -->
          <span
            v-if="false"
            class="tt-text-body-2 tt-light-mono-46--text ml-1"
          >
            666
          </span>
        </TTChip>
      </div>
    </div>
    <footer
      v-if="!expanded && itemsVisibleCount <= itemsVisible.length"
      class="mt-4"
    >
      <VDivider />
      <button
        class="tt-text-caption tt-light-blue--text mt-2"
        @click="expanded = !expanded"
      >
        + {{ $t("CategoryAsidePicker.expand") }}
      </button>
    </footer>
  </article>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { getImageUrl } from '../../helpers/gogha/getImageUrl';
import { FilterCategory, FilterValue, IProvider } from '../../types';

export default Vue.extend({
  name: 'DataListFilterEntityCategory',
  props: {
    entity: {
      type: Object as PropType<FilterCategory & IProvider>,
      required: true,
    },
    itemsVisibleCount: {
      type: Number as PropType<number>,
      default: 6,
    },
  },
  data() {
    return {
      search: '',
      expanded: false,
      items: [] as FilterValue[],
    };
  },
  computed: {
    itemsVisible(): FilterValue[] {
      const query = this.search.toLowerCase();
      const items = this.items.filter((category) => category.title.toLowerCase().includes(query));

      return this.expanded
        ? items
        : items.slice(0, this.itemsVisibleCount);
    },
    value: {
      get(): string[] {
        return this.entity.checkedValues;
      },
      set(value: string[] = []) {
        this.$emit('input', value);
      },
    },
    provider(): IProvider['provider'] {
      return this.entity.provider;
    },
    filterName(): string {
      return this.entity.name;
    },
  },
  mounted() {
    this.fetch();
  },
  methods: {
    toggle(id: string) {
      this.value = this.value?.includes(id)
        ? this.value?.filter((i) => i !== id)
        : this.value?.concat([id]);
    },
    categoryIconSrc(category: FilterValue): string {
      return getImageUrl({
        uuid: category.value,
        type: 'catalogue',
        name: 'category',
        size: '46x46',
      });
    },
    async fetch() {
      this.items = await this.provider();
    },
  },
});
</script>

<style lang="scss" scoped>
@import '../../styles/tt.colors.scss';
.category-aside-picker {
  .category-item {
    .v-chip.selected {
        border-color: $tt-light-mono-8!important;
        background-color: $tt-light-mono-8 !important;
    }
  }
  .category-item + .category-item {
    margin-top: 8px;
  }
}

/* TODO: Убрать, если TTChip научится сокращать текст сам */
.text-overflow-ellipsis {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
</style>
