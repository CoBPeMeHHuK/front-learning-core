import {
  ref, computed,
} from '@vue/composition-api';

interface UsePagination {
  initialCurrentPage: number,
  initialLimit: number,
}

const usePagination = ({ initialCurrentPage, initialLimit }: UsePagination) => {
  const currentPage = ref(initialCurrentPage);
  const total = ref(0);

  const setPage = (newPage: number) => {
    currentPage.value = newPage;
  };

  const limit = ref(initialLimit);
  const setLimit = (newLimit: number) => { limit.value = newLimit; };
  const setTotal = (newTotal: number) => { total.value = newTotal; };

  const pageCount = computed(() => Math.ceil(total.value / limit.value));

  const nextPage = () => setPage(Math.min(currentPage.value + 1, pageCount.value));
  const prevPage = () => setPage(Math.max(currentPage.value - 1, 1));

  return {
    page: currentPage,
    limit: limit,
    totalCount: total,
    setTotal,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    pageCount,
  };
};

export type { UsePagination };
export { usePagination };
