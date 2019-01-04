const pkg = require('./package')

module.exports = {
  // mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1,user-scalable=no' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
 css: [{
  src: '~assets/themes/index.scss',
  lang: 'scss'
 }],
 router: {
   middleware: ['auth']
 },
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [{
      src: '~plugins/config',
      ssr: true
    }, { src: '~plugins/iview', 
      ssr: true },
    {
      src: '~plugins/axios/index',
      ssr: true
    }, {
      src: '~plugins/state-sync/index',
      ssr: false
    }, {
      src: '~components/index',
      ssr: true
    }
  ],
  env: {
    baseUrl: process.env.BASE_URL || 'http://localhost:5000'
  },
  generate: {},


  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    },
  }

}
