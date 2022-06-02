import { CreateElement, VNode } from 'vue';
import {
  defineComponent, Ref, ref, watch, PropType, provide,
} from '@vue/composition-api';
import { debounce, shouldBeNode } from '../../helpers';
import { CancelablePromise } from '../../utils';

import {
  useSearch,
  useFilters,
  usePagination,
  useSorting, defaultSorting,
} from './composables';

import {
  BaseEntity, OrderDirection, Filter, FetchProps, Sorting, Pagination,
} from '../../types';

interface DataListProps<T extends BaseEntity> {
  entities: T[];
  fetch: (props: FetchProps<T>) => Promise<{ collection: T[], pagination: Pagination }>;
  initialSearchQueryString: string;
  initialSorting?: {
    sortBy: keyof T;
    orderBy: OrderDirection;
  },
  initialCurrentPage: number,
  initialLimit: number,
  total: number,
  initialFilters: Filter[];
  incrementalPagination: boolean;
}

export default defineComponent({
  name: 'DataList',

  props: {
    fetch: {
      type: Function,
      required: true,
    },

    initialSearchQuery: {
      type: String,
      default: null,
    },

    initialSorting: {
      type: Object as PropType<Sorting<BaseEntity>>,
      default: () => ({ ...defaultSorting }),
    },

    initialCurrentPage: {
      type: Number,
      default: 1,
    },

    initialLimit: {
      type: Number,
      default: 3,
    },

    initialFilters: {
      type: Array as PropType<Filter[]>,
      default: () => [],
    },

    incrementalPagination: {
      type: Boolean,
      default: false,
    },
  },

  setup(props: DataListProps<BaseEntity>) {
    const {
      fetch,
      initialSearchQueryString,
      initialSorting = {},
      initialCurrentPage,
      initialLimit,
      initialFilters,
      incrementalPagination,
    } = props;

    const entities = ref<BaseEntity[]>([]) as unknown as Ref<BaseEntity[]>;

    const isLoading = ref<boolean>(false);
    const isInitialLoading = ref<boolean>(true);
    const isEmptyList = ref<boolean>(false);
    const isRequestFailed = ref<boolean>(false);
    const preventUpdate = ref<boolean>(false);

    /**
       * Контроллер для прекращения ещё не завершенных промисов
       */
    let abortController = new AbortController();

    const abort = () => {
      abortController.abort();
      abortController = new AbortController();
    };

    const {
      page,
      limit,
      totalCount,
      setPage,
      setTotal,
      setLimit,
      nextPage,
      prevPage,
      pageCount,
    } = usePagination({ initialCurrentPage, initialLimit });

    const {
      searchQueryString,
      isSearchQueryStringEmpty,
      setSearchQueryString,
    } = useSearch({ initialSearchQueryString });

    const {
      sortBy,
      orderBy,
      setSortBy,
      setOrderBy,
    } = useSorting<BaseEntity>({ initialSorting });

    const {
      filters, filterEntries, setFilter, setFiltersFromEntries,
    } = useFilters({ initialFilters });

    const fetchEntities = async ({
      incrementEntities = false,
    }: { incrementEntities?: boolean } = {}) => {
      isRequestFailed.value = false;
      isLoading.value = true;

      /**
       * Отменяем отложенный вызов, который должен сработать после пользовательского ввода
       */
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      debouncedFetchEntities.cancel();

      /**
       * Отменяем предыдущие промисы
       */
      if (!abortController.signal.aborted) abort();

      try {
        const { collection, pagination } = await CancelablePromise(fetch({
          queryString: !isSearchQueryStringEmpty.value ? searchQueryString.value : null,
          sorting: {
            // @ts-ignore
            sortBy: sortBy.value,
            orderBy: orderBy.value,
          },
          pagination: {
            page: page.value,
            limit: limit.value,
          },
          filters: filterEntries.value,
        }), { signal: abortController.signal });

        isEmptyList.value = collection.length === 0;

        entities.value = incrementEntities
          ? entities.value.concat(collection)
          : collection;

        setTotal(pagination.total ?? entities.value.length);

        isLoading.value = false;
        isInitialLoading.value = false;
      } catch (e) {
        isRequestFailed.value = true;
        console.error(e);
      }
    };

    const debouncedFetchEntities = debounce(fetchEntities, 350);

    watch([searchQueryString], () => {
      if (!isSearchQueryStringEmpty) return;
      preventUpdate.value = true;
      setPage(1);
      debouncedFetchEntities({ incrementEntities: false });
    }, { immediate: true });

    watch([limit, sortBy, orderBy, filterEntries], () => {
      preventUpdate.value = true;
      setPage(1);
      fetchEntities({ incrementEntities: false });
    }, { immediate: true, deep: true });

    watch([page], () => {
      if (preventUpdate.value) {
        preventUpdate.value = false;
        return;
      }

      fetchEntities({ incrementEntities: incrementalPagination });
    }, { immediate: true });

    // SearchParamsProvide
    provide('searchQueryString', searchQueryString);
    provide('setSearchQueryString', setSearchQueryString);
    provide('isSearchQueryStringEmpty', isSearchQueryStringEmpty);
    provide('isEmptyList', isEmptyList);

    // SortingParamsProvide
    provide('sortBy', sortBy);
    provide('orderBy', orderBy);
    provide('setSortBy', setSortBy);
    provide('setOrderBy', setOrderBy);

    // PaginationParamsProvide
    provide('page', page);
    provide('setPage', setPage);
    provide('limit', limit);
    provide('totalCount', totalCount);
    provide('pageCount', pageCount);

    provide('filters', filters);
    provide('setFilter', setFilter);

    return {
      entities,
      searchQueryString,
      setSearchQueryString,
      isSearchQueryStringEmpty,
      isLoading,
      isInitialLoading,
      isEmptyList: isEmptyList,
      fetchEntities,
      debouncedFetchEntities,
      sortBy,
      orderBy,
      setSortBy,
      setOrderBy,
      page,
      limit,
      totalCount,
      nextPage,
      prevPage,
      pageCount,
      setLimit,
      setPage,
      filters,
      filterEntries,
      setFilter,
      setFiltersFromEntries,
    };
  },

  render(h: CreateElement): VNode {
    const defaultSlotContent = h();

    if (!this.$scopedSlots.default) {
      return defaultSlotContent;
    }

    const slotContent = this.$scopedSlots.default({
      entities: this.entities,
      searchQueryString: this.searchQueryString,
      setSearchQueryString: this.setSearchQueryString,
      isSearchQueryStringEmpty: this.isSearchQueryStringEmpty,
      isLoading: this.isLoading,
      isInitialLoading: this.isInitialLoading,
      isEmptyList: this.isEmptyList,
      fetchEntities: this.fetchEntities,
      debouncedFetchEntities: this.debouncedFetchEntities,
      sortBy: this.sortBy,
      orderBy: this.orderBy,
      setSortBy: this.setSortBy,
      setOrderBy: this.setOrderBy,
      page: this.page,
      limit: this.limit,
      totalCount: this.totalCount,
      nextPage: this.nextPage,
      prevPage: this.prevPage,
      setLimit: this.setLimit,
      pageCount: this.pageCount,
      setPage: this.setPage,
      filters: this.filters,
      setFilter: this.setFilter,
      filterEntries: this.filterEntries,
      setFiltersFromEntries: this.setFiltersFromEntries,
    });

    return shouldBeNode(slotContent, true) ?? defaultSlotContent;
  },
});
