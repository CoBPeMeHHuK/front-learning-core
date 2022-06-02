<template>
  <div>
    <TTCheckbox
      v-model="internalValue"
      :value="myCompanyProviderValue"
      :label="$t('ContentProviderAsidePicker.currentProvider')"
      data-test-label="filter-provider-checkbox"
      data-test-value="internal-providers"
      @change="internalProviderHandler"
    />
    <TTCheckbox
      :label="$t('ContentProviderAsidePicker.externalProviders')"
      data-test-label="filter-provider-checkbox"
      data-test-value="external-providers"
      class="mt-3"
      :input-value="isExternalProvidersSelected"
      @click="externalProvidersClickHandler"
    />
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
import { FilterValue } from '../../../types';
import { DATA_LIST_MY_COMPANY_PROVIDER } from './constants';

export default Vue.extend({
  name: 'DataListMyCompanyProviderFilter',
  props: {
    value: {
      type: Array as PropType<string[]>,
      default: [] as string[],
    },
    items: {
      type: Array as PropType<FilterValue[]>,
      default: [] as FilterValue[],
    },
  },
  computed: {
    myCompanyProviderValue(): string {
      return DATA_LIST_MY_COMPANY_PROVIDER.value;
    },
    externalProvidersIds(): string[] {
      return this.items.filter((provider) => provider.value !== this.myCompanyProviderValue)
        .map((p) => p.value);
    },
    /**
   * Проверка выбраны ли все внешние провайдеры
   * @returns {boolean}
   */
    isExternalProvidersSelected(): boolean {
      if (!this.externalProvidersIds.length || !this.internalValue) return false;

      let isIncluded = true;
      this.externalProvidersIds.forEach((external) => {
        if (isIncluded) isIncluded = this.internalValue.includes(external);
      });

      return isIncluded;
    },

    internalValue: {
      get(): string[] {
        return this.value;
      },
      set(ids: string[]) {
        this.$emit('input', ids === null ? [] : ids);
      },
    },
  },
  methods: {
    /**
    * Обработчик нажатия на чекбокс внешних провайдеров:
    * Если выбрана ранее моя компания -> Снимается выбор "Моя комания"
    * Если выбраны все или частично внешние провайдеры - они снимаются
    */
    externalProvidersClickHandler() {
      const isMyCompanyProviderChecked = this.internalValue.includes(this.myCompanyProviderValue);

      if (!this.isExternalProvidersSelected) {
        this.internalValue = isMyCompanyProviderChecked
          ? [...this.externalProvidersIds]
          : this.externalProvidersIds;
      } else {
        this.internalValue = isMyCompanyProviderChecked ? [this.myCompanyProviderValue] : [];
      }
    },

    /**
    * Обработчик нажатия на чекбокс провайдера моей компании:
    * Если выбрана ранее моя компания, она снимается.
    * Снимается выбор со всех внешних провайдеров и выделяется "Моя компания"
    */
    internalProviderHandler(value: string[]) {
      const isMyCompanyProviderChecked = value.includes(this.myCompanyProviderValue);
      this.internalValue = isMyCompanyProviderChecked ? [this.myCompanyProviderValue] : value;
    },
  },
});
</script>
