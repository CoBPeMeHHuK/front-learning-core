import Names from '@/plugins/vue-router/routeNames';

declare module 'vue/types/vue' {
  interface Vue {
    readonly Names: typeof Names;
  }
}
