const path = require('path');

const options = {
  transpileDependencies: ['vuetify', 'axios'],

  css: {
    loaderOptions: {
      scss: {
        additionalData: '@import "./src/styles/abstracts.scss";',
      },
    },
  },

  configureWebpack: {
    plugins: [],
    resolve: {
      alias: {
        '@widgets': path.resolve(__dirname, 'titify/src/ui/widgets'),
        '@uikit': path.resolve(__dirname, 'titify/src/ui/uikit'),
        '@views': path.resolve(__dirname, 'titify/src/ui/views'),
        '@testing': path.resolve(__dirname, 'tests'),
      },
    },
  },

  devServer: {
    // Note: THIS IS NOT RECOMMENDED as apps that do not check the host are
    // vulnerable to DNS rebinding attacks.
    disableHostCheck: true,

    // Note: Enable gzip compression for everything served
    compress: true,
  },

  chainWebpack: (config) => {
    const splitChunks = config.optimization.get('splitChunks');
    Object.assign(splitChunks.cacheGroups, {
      vuetify: {
        name: 'chunk-vendors-vuetify',
        test: /[\\/]node_modules[\\/]vuetify[\\/]/,
        chunks: 'initial',
      },
    });

    config.optimization.splitChunks(splitChunks);
  },

  pluginOptions: {
    i18n: {
      locale: process.env.VUE_APP_I18N_LOCALE || 'ru',
      fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || 'ru',
      localeDir: 'locales',
      enableInSFC: false,
    },
  },
};

module.exports = options;
