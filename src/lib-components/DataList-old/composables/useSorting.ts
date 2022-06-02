import { ref } from '@vue/composition-api';
import { BaseEntity, Sorting } from '../../../types';

interface UseSortingProps<T extends BaseEntity> {
  initialSorting: Sorting<T>;
}

const defaultSorting: Sorting<BaseEntity> = {};

const useSorting = <T extends BaseEntity>({ initialSorting }: UseSortingProps<T>) => {
  const { sortBy: defaultSortBy, orderBy: defaultOrderBy } = { ...defaultSorting, ...initialSorting };

  const sortBy = ref(defaultSortBy);
  const orderBy = ref(defaultOrderBy);

  const setSortBy = (__sortBy: Sorting<T>['sortBy']) => {
    // @ts-expect-error bug with UnwrapRef<keyof T>
    sortBy.value = __sortBy;
  };

  const setOrderBy = (__orderBy: Sorting<T>['orderBy']) => {
    orderBy.value = __orderBy;
  };

  return {
    sortBy,
    orderBy,
    setSortBy,
    setOrderBy,
  };
};

export type { UseSortingProps };
export { useSorting, defaultSorting };
