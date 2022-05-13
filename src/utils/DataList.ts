import {
    Awaited,
    Filter, FilterAuthorMultipleWithSource,
    FilterCheckbox,
    FilterRadio,
    FilterSelectMode,
    FilterSelectMultipleWithSource,
    FilterSelectSingleWithSource,
    FilterSelectWithoutSource,
    FilterSelectWithSource,
    FilterTagMultipleWithSource,
    FilterType,
  } from '../types';
  
  function isFilterCheckbox(filter: Filter): filter is FilterCheckbox {
    if (filter.type === FilterType.CHECKBOX) {
      return true;
    }
  
    return false;
  }
  
  function isFilterRadio(filter: Filter): filter is FilterRadio {
    if (filter.type === FilterType.RADIO) {
      return true;
    }
  
    return false;
  }
  
  function isFilterSelectWithoutSource(filter: Filter): filter is FilterSelectWithoutSource {
    if (filter.type === FilterType.SELECT && typeof (filter as FilterSelectWithoutSource).values !== 'undefined') {
      return true;
    }
  
    return false;
  }
  
  function isFilterSelectWithSource(filter: Filter): filter is FilterSelectWithSource {
    if (filter.type === FilterType.SELECT && typeof (filter as FilterSelectWithSource).provider !== 'undefined') {
      return true;
    }
  
    return false;
  }
  
  function isFilterSelectSingle(filter: Filter): filter is FilterSelectSingleWithSource {
    if (filter.type === FilterType.SELECT && (filter as FilterSelectWithSource).mode === FilterSelectMode.SINGLE) {
      return true;
    }
  
    return false;
  }
  
  function isFilterSelectMultiple(filter: Filter): filter is FilterSelectMultipleWithSource {
    if ((filter.type === FilterType.SELECT || filter.type === FilterType.PROVIDERS)
      && (filter as FilterSelectWithSource).mode === FilterSelectMode.MULTIPLE) {
      return true;
    }
  
    return false;
  }
  
  function isFilterTagMultiple(filter: Filter): filter is FilterTagMultipleWithSource {
    if (filter.type === FilterType.TAG && (filter as FilterTagMultipleWithSource).mode === FilterSelectMode.MULTIPLE) {
      return true;
    }
    return false;
  }
  
  function isFilterAuthorMultiple(filter: Filter): filter is FilterAuthorMultipleWithSource {
    // eslint-disable-next-line max-len,vue/max-len
    if (filter.type === FilterType.AUTHOR && (filter as FilterAuthorMultipleWithSource).mode === FilterSelectMode.MULTIPLE) {
      return true;
    }
    return false;
  }
  
  function getFilterValue(filter: Filter): string | string[] {
    if (isFilterCheckbox(filter)) {
      return filter.checkedValues;
    }
  
    if (isFilterRadio(filter)) {
      return filter.checkedValue;
    }
  
    if (isFilterSelectSingle(filter)) {
      return filter.checkedValue;
    }
  
    if (isFilterSelectMultiple(filter)) {
      return filter.checkedValues;
    }

      // @ts-ignore
    if (filter!.type === FilterType.TAG) {
      // @ts-ignore
      return filter.checkedValues;
    }
    
      // @ts-ignore
    if (filter!.type === FilterType.AUTHOR) {
      // @ts-ignore
      return filter.checkedValues;
    }
  
    return '';
  }
  
  function getFilterDefaultValue(filter: Filter): string | string[] {
    if (isFilterCheckbox(filter)) {
      return filter.defaultValues;
    }
  
    if (isFilterRadio(filter)) {
      return filter.defaultValue;
    }
  
    if (isFilterSelectSingle(filter)) {
      return filter.defaultValue;
    }
  
    if (isFilterSelectMultiple(filter)) {
      return filter.defaultValues;
    }
  
    return '';
  }
  
  function setFilterValue(filter: Filter, value: string | string[]) {
    if (isFilterCheckbox(filter)) {
      if (Array.isArray(value)) {
        // eslint-disable-next-line no-param-reassign
        filter.checkedValues = value;
      } else {
        // eslint-disable-next-line no-param-reassign
        filter.checkedValues = value ? [value] : [];
      }
    }
  
    if (isFilterRadio(filter)) {
      if (Array.isArray(value)) {
        // eslint-disable-next-line no-param-reassign, prefer-destructuring
        filter.checkedValue = value[0];
      } else {
        // eslint-disable-next-line no-param-reassign
        filter.checkedValue = value;
      }
    }
  
    if (isFilterSelectSingle(filter)) {
      if (Array.isArray(value)) {
        // eslint-disable-next-line no-param-reassign, prefer-destructuring
        filter.checkedValue = value[0];
      } else {
        // eslint-disable-next-line no-param-reassign
        filter.checkedValue = value;
      }
    }
  
    if (isFilterSelectMultiple(filter)) {
      if (Array.isArray(value)) {
        // eslint-disable-next-line no-param-reassign
        filter.checkedValues = value;
      } else {
        // eslint-disable-next-line no-param-reassign
        filter.checkedValues = value ? [value] : [];
      }
    }
  
    if (isFilterTagMultiple(filter)) {
      if (Array.isArray(value)) {
        // eslint-disable-next-line no-param-reassign
        filter.checkedValues = value;
      } else {
        // eslint-disable-next-line no-param-reassign
        filter.checkedValues = value ? [value] : [];
      }
    }
  
    if (isFilterAuthorMultiple(filter)) {
      if (Array.isArray(value)) {
        // eslint-disable-next-line no-param-reassign
        filter.checkedValues = value;
      } else {
        // eslint-disable-next-line no-param-reassign
        filter.checkedValues = value ? [value] : [];
      }
    }
  
    return filter;
  }
  
  interface CancelableOptions {
    signal: AbortSignal;
  }
  
  const error = new DOMException('Promise manually rejected', 'AbortError');
  
  function CancelablePromise<T extends Promise<any>>(
    promise: T,
    { signal }: CancelableOptions,
  ) {
    if (signal?.aborted) {
      return Promise.reject(error);
    }
  
    return new Promise<Awaited<T>>((resolve, reject) => {
      const abortHandler = () => {
        reject(error);
      };
  
      signal.addEventListener('abort', abortHandler);
  
      promise.then(resolve).catch(reject).finally(() => {
        signal.removeEventListener('abort', abortHandler);
      });
    });
  }
  
  function getValueKey(filter: Filter) {
    if (isFilterRadio(filter)) {
      return 'checkedValue';
    }
  
    if (isFilterCheckbox(filter)) {
      return 'checkedValues';
    }
  
    if (isFilterSelectSingle(filter)) {
      return 'checkedValue';
    }
  
    if (isFilterSelectMultiple(filter)) {
      return 'checkedValues';
    }
  
    if (isFilterTagMultiple(filter)) {
      return 'checkedValues';
    }
  
    if (isFilterAuthorMultiple(filter)) {
      return 'checkedValues';
    }
  
    return '';
  }
  
  function getFiltersEntries(filters: Filter[]) {
    return filters.reduce((acc: Record<string, string | string[]>, filter) => {
      acc[filter.name] = getFilterValue(filter);
      return acc;
    }, {});
  }
  
  function setFiltersFromEntries(filters: Filter[], entries: Record<string, string | string[]>) {
    return filters.map((filter) => {
      const value = entries[filter.name];
      return value ? setFilterValue(filter, value) : filter;
    });
  }
  
  export {
    CancelablePromise,
    getFilterDefaultValue,
    getFilterValue,
    getFiltersEntries,
    getValueKey,
    isFilterCheckbox,
    isFilterRadio,
    isFilterSelectMultiple,
    isFilterSelectSingle,
    isFilterSelectWithSource,
    isFilterSelectWithoutSource,
    isFilterTagMultiple,
    setFilterValue,
    setFiltersFromEntries,
  };
  