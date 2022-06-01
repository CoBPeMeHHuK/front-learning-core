<template>
  <TTAutocomplete
    v-model="selectedProviders"
    :items="items"
    multiple
    class="content-provider-autocomplete"
    :placeholder="$t('ContentProviderAutocomplete.placeholder')"
    :no-data-text="$t('ContentProviderAutocomplete.noProviderFound')"
    :return-object="returnObject"
    :item-text="itemText"
    :item-value="itemValue"
    :loading="isLoading"
    :menu-props="menuProps"
    :no-filter="false"
    :data-test-label="dataTestLabel"
    append-icon="$search"
    no-rotate
    :x-large="xLarge"
    :large="large"
    :small="small"
    :x-small="small"
    @update:search-input="onSearchInputChangeHandler"
  >
    <template #item="{ item }">
      <div
        class="d-flex align-center flex-fill py-3"
        data-test="content-providers-item"
        :data-test-value="`${item.title}`"
      >
        <TTCheckbox
          :input-value="getCheckboxState(item[itemValue])"
          class="pa-0 ma-0"
        />
        <span class="tt-text-body-2 tt-light-mono-100--text text-line-clamp-1 word-break-word ml-2">
          {{ item.title }}
        </span>
        <VSpacer />
        <ProviderAvatar
          :id="item[itemValue]"
          x-small
          class="ml-3"
        />
      </div>
    </template>
  </TTAutocomplete>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { ProviderAvatar } from '../../';

export interface ProviderValue {
  title: string;
  value: string;
}

const menuProps = {
  closeOnClick: false,
  closeOnContentClick: false,
  disableKeys: true,
  openOnClick: false,
  maxHeight: 200,
  offsetY: true,
  offsetOverflow: true,
  transition: false,
};

export default Vue.extend({
  name: 'ContentProviderAutocomplete',

  components: {
    ProviderAvatar,
  },

  props: {
    value: {
      type: Array as PropType<ProviderValue[]>,
      default: () => [],
    },
    providers: {
      type: Array as PropType<ProviderValue[]>,
      default: () => ([]),
    },
    returnObject: {
      type: Boolean,
      default: true,
    },
    itemText: {
      type: String,
      default: 'title',
    },
    itemValue: {
      type: String as PropType<keyof ProviderValue>,
      default: 'value' as const,
    },
    dataTestLabel: {
      type: String,
      default: 'content-providers',
    },

    xLarge: {
      type: Boolean,
      default: false,
    },
    large: {
      type: Boolean,
      default: false,
    },
    small: {
      type: Boolean,
      default: false,
    },
    xSmall: {
      type: Boolean,
      default: false,
    },
  },

  data() {
    return {
      search: '',
      isLoading: false,
    };
  },

  computed: {
    items(): ProviderValue[] {
      return ([] as ProviderValue[]).concat(this.providers, this.value ?? []);
    },
    menuProps() {
      return menuProps;
    },
    selectedProviders: {
      get() {
        return this.value;
      },
      set(v: ProviderValue[] | string[]) {
        const payload = v ?? []; // Из TTAutocomplete может вернуться null по кнопке очистки
        this.$emit('input', payload);
      },
    },
  },

  watch: {
    search(newSearch: string) {
      this.$emit('search', newSearch);
    },
  },

  methods: {
    onSearchInputChangeHandler(search: string) {
      this.search = search;
    },

    getCheckboxState(value: keyof ProviderValue) {
      return this.selectedProviders.some(
        (provider: ProviderValue | string) => {
          if (this.returnObject) {
            return (provider as ProviderValue)[this.itemValue] === value;
          }

          return (provider as string) === value;
        },
      );
    },
  },
});
</script>

<style lang="scss" scoped>
.content-provider-autocomplete {
  &.tt-autocomplete {
    &.content-provider-autocomplete {
      .v-select__selections {
        display: flex !important;
        flex-wrap: nowrap;
      }
    }
  }
}
</style>

<style lang="scss">
// WARNING: будет влиять на другие автокомплиты/селекты в проекте
.v-menu__content {
  max-width: min-content !important;

  .word-break-word {
    word-break: break-word;
  }
}
</style>
