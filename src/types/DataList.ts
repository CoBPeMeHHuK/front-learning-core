export interface BaseEntity {
    id: string;
  }
  
  export enum OrderDirection {
    ASC = 'asc',
    DESC = 'desc',
  }
  
  export enum FilterType {
    CHECKBOX = 'checkbox',
    RADIO = 'radio',
    SELECT = 'select',
    PROVIDERS = 'providers',
    TAG = 'tag',
    AUTHOR = 'author',
  }
  
  export enum FilterSelectMode {
    SINGLE = 'single',
    MULTIPLE = 'multiple',
  }
  
  interface BaseFilter {
    title?: string;
    name: string;
    type: FilterType;
  }
  
  export interface FilterValue {
    title: string;
    value: string;
  }
  
  export interface FilterRadio extends BaseFilter {
    values: FilterValue[];
    checkedValue: string;
    defaultValue: string;
  }
  
  export interface FilterCheckbox extends BaseFilter {
    values: FilterValue[];
    checkedValues: string[];
    defaultValues: string[];
  }
  
  export interface FilterCategory extends BaseFilter {
    values: FilterValue[];
    checkedValues: string[];
    defaultValues: string[];
  }
  
  export interface FilterAuthor extends BaseFilter {
    mode: FilterSelectMode.MULTIPLE;
    values: FilterValue[];
    checkedValues: string[];
    defaultValues: string[];
  }
  
  interface BaseFilterSelect extends BaseFilter {
    mode: FilterSelectMode;
  }
  
  export interface FilterSelectSingle extends BaseFilterSelect {
    mode: FilterSelectMode.SINGLE;
    checkedValue: string;
    defaultValue: string;
  }
  
  export interface FilterSelectMultiple extends BaseFilterSelect {
    mode: FilterSelectMode.MULTIPLE;
    checkedValues: string[];
    defaultValues: string[];
  }
  
  export interface FilterSelectWithoutSource extends FilterSelectMultiple {
    values: FilterValue[];
  }
  
  export interface FilterSelectSingleWithSource extends FilterSelectSingle {
    provider: (search: string) => Promise<FilterValue[]>;
  }
  
  export interface FilterSelectMultipleWithSource extends FilterSelectMultiple {
    provider: (search: string) => Promise<FilterValue[]>;
  }
  
  export interface FilterTagMultipleWithSource extends BaseFilter, IProvider {
    mode: FilterSelectMode.MULTIPLE;
    checkedValues: string[];
    defaultValues: string[];
    provider: () => Promise<FilterValue[]>;
  }
  
  export interface FilterAuthorMultipleWithSource extends BaseFilter, IProvider {
    mode: FilterSelectMode.MULTIPLE;
    checkedValues: string[];
    defaultValues: string[];
    provider: (search: string) => Promise<FilterValue[]>;
  }
  
  // eslint-disable-next-line max-len,vue/max-len
  export type FilterSelectWithSource = FilterSelectSingleWithSource | FilterSelectMultipleWithSource;
  
  export interface IProvider {
    provider: (...args: any) => Promise<FilterValue[]>
  }
  
  export type FilterSelect = FilterSelectWithoutSource | FilterSelectWithSource;
  
  export type Filter = FilterSelect | FilterCheckbox | FilterRadio | FilterTagMultipleWithSource;
  
  export interface FetchProps<T extends BaseEntity> {
    queryString: string | null;
    filters?: Record<string, string | string[]>;
    sorting?: Sorting<T>;
    pagination?: Pick<Pagination, 'page' | 'limit'>;
  }
  
  export interface Sorting<T> {
    sortBy?: keyof T;
    orderBy?: OrderDirection;
  }
  
  export interface Pagination {
    page: number;
    limit: number;
    total: number;
  }
  
  export type Awaited<T> = T extends PromiseLike<infer U> ? U : T;

  export interface DataListFilterEntitySelectData {
    searchInput: string;
    values: FilterValue[];
    isLoading: boolean;
  }
  