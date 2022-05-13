import dayjs from '@/plugins/dayjs';

declare module 'vue/types/vue' {
  interface Vue {
    $dayjs: typeof dayjs;
  }
}
