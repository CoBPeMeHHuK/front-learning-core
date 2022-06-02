import _Vue, { PluginFunction } from 'vue';
import VueCompositionAPI from '@vue/composition-api'

_Vue.use(VueCompositionAPI)

// Import vue components
import * as components from '@/lib-components/index';


// install function executed by Vue.use()
const install: PluginFunction<any> = function installTtUikit(Vue: typeof _Vue) {
  Object.entries(components).forEach(([componentName, component]) => {
    Vue.component(componentName, component);
  });
};

// Create module definition for Vue.use()
export default install;

// To allow individual component use, export components
// each can be registered via Vue.component()
export * from '@/lib-components/index';
export * from '@/lib-components/DataList/composables'
export * from '@/lib-components/DataList/DataList'
export * from '@/lib-components/DataList/MyCompanyProvider/index'
export * from './types/index';
export * from './domains/index';
export * from './utils/index';
export * from './helpers/index';




