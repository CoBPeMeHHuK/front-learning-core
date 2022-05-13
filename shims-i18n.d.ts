import VueI18n, {
  Path, Values, Locale,
} from 'vue-i18n';

 /**
 * Overloads VueI18n interface to avoid needing to cast return value to string.
 * @see https://github.com/kazupon/vue-i18n/issues/410
 * Можно будет удалить после перехода на vue3 и i18n v9
 */
 declare module 'vue-i18n/types' {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  export default class VueI18n {
    t(key: Path, locale: Locale, values?: Values): string;

    t(key: Path, values?: Values): string;
  }
 }

 declare module 'vue/types/vue' {
  interface Vue {
    $t: typeof VueI18n.prototype.t;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface VueConstructor<V extends Vue = Vue> {
    i18n: typeof VueI18n.prototype;
  }
 }

export default VueI18n;
