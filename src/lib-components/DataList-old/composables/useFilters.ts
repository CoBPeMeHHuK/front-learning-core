import {
  readonly, reactive, computed,
} from '@vue/composition-api';
import { cloneDeep } from '../../../helpers';
import { getFiltersEntries, setFiltersFromEntries as setFilters, setFilterValue } from '../../../utils';
import { Filter } from '../../../types';

interface UseFilterProps {
  initialFilters: Filter[];
}

const useFilters = ({ initialFilters }: UseFilterProps) => {
  const filters = reactive(cloneDeep(initialFilters));

  const filterEntries = computed(() => getFiltersEntries(filters));

  const setFilter = (name: string, value: string | string[]) => {
    const index = filters.findIndex((filter: any) => filter.name === name);
    setFilterValue(filters[index], value);
  };

  const setFiltersFromEntries = (entries: Record<string, string | string[]>) => setFilters(filters, entries);

  return {
    filters: readonly(filters) as Filter[],
    filterEntries,
    setFilter,
    setFiltersFromEntries,
  };
};

export type { UseFilterProps };
export { useFilters };
