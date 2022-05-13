import bottle from '@/plugins/di';

interface ISnack {
  error: (message: string) => void,
  success: (message: string) => void,
}

declare module 'bottlejs' {
  interface IContainer {
    snack: ISnack;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $di: typeof bottle.container;
  }
}
