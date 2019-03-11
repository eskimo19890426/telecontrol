module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: '通透光电-辐射监测系统',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: '辐射检测系统'
      }
    ],
    link: [{
      rel: 'icon',
      type: 'image/x-icon',
      href: '/favicon.ico'
    }]
  },
  /*
   ** Customize the progress bar color
   */
  loading: {
    color: '#6d6b8d'
  },
  /*
   ** Build configuration
   */
  build: {
    // analyze: true,
    // // or
    // analyze: {
    //   analyzerMode: 'static'
    // },
    /*
     ** Run ESLint on save
     */
    extend(config, ctx) {
      if (ctx.dev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
    babel: {},
    publicPath: '/'
    // publicPath: '/'
  },
  generate: {},
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:3000'
  },
  /**
   * global css
   */
  css: [{
    src: '~assets/themes/index.scss',
    lang: 'scss'
  }],
  router: {
    middleware: ['auth']
  },
  /**
   * 插件
   */
  plugins: [{
    src: '~plugins/config',
    ssr: true
  }, {
    src: '~components/index',
    ssr: true
  }, {
    src: '~plugins/state-sync/index',
    ssr: false
  }, {
    src: '~plugins/iview/index',
    ssr: true
  }, {
    src: '~plugins/axios/index',
    ssr: true
  }, {
    src: '~plugins/viscroll/index',
    ssr: false
  }, {
    src: '~plugins/treejs/index',
    ssr: false
  }]
}
