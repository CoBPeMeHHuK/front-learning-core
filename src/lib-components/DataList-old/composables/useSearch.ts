import {
  ref, computed,
} from '@vue/composition-api';
import { isNull } from '../../../helpers';

interface UseSearchProps {
  initialSearchQueryString?: string | null;
}

const useSearch = ({ initialSearchQueryString = null }: UseSearchProps) => {
  const searchQueryString = ref(initialSearchQueryString);
  const isSearchQueryStringEmpty = computed(
    () => isNull(searchQueryString.value) || searchQueryString.value === '',
  );

  const setSearchQueryString = (queryString: string) => {
    searchQueryString.value = queryString;
  };

  return {
    searchQueryString,
    isSearchQueryStringEmpty,
    setSearchQueryString,
  };
};

export type { UseSearchProps };
export { useSearch };
