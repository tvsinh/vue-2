const path = require('path')

const TARGET = process.env.TARGET || 'all' // 'student' | 'admin' | 'all'
const isProd = process.env.NODE_ENV === 'production'

// Public path theo từng môi trường (đặt trong .env.* phía dưới)
const PUBLIC_PATH = (isProd && process.env.VUE_APP_PUBLIC_PATH) ? process.env.VUE_APP_PUBLIC_PATH : '/'

// Tạo pages theo TARGET
function makePages(target) {
  const pages = {}
  if (target === 'all' || target === 'student') {
    pages.student = {
      entry: 'src/student-app/main.js',
      template: 'src/student-app/index.html',
      filename: 'student.html',
      chunks: ['chunk-vendors', 'chunk-common', 'student'],
    }
  }
  if (target === 'all' || target === 'admin') {
    pages.admin = {
      entry: 'src/admin-app/main.js',
      template: 'src/admin-app/index.html',
      filename: 'admin.html',
      chunks: ['chunk-vendors', 'chunk-common', 'admin'],
    }
  }
  return pages
}

// Thư mục output tách biệt để deploy riêng domain
// eslint-disable-next-line no-nested-ternary
const outputDir = TARGET === 'student' ? 'dist-student'
  : TARGET === 'admin' ? 'dist-admin' : 'dist-all'

// Tạo historyApiFallback rewrites theo TARGET
function makeHistoryApiFallbackRewrites(target) {
  if (target === 'student') {
    // Khi chạy app student (dev), mọi thứ trỏ về student.html
    return [{ from: /./, to: '/student.html' }]
  }
  if (target === 'admin') {
    // Khi chạy app admin (dev), mọi thứ trỏ về admin.html
    return [{ from: /./, to: '/admin.html' }]
  }
  // Khi chạy all (dev), rewrite theo prefix
  return [
    { from: /^\/admin/, to: '/admin.html' },
    { from: /./, to: '/student.html' }, // student is default
  ]
}

module.exports = {
  publicPath: PUBLIC_PATH,
  outputDir,
  pages: makePages(TARGET),
  lintOnSave: false,
  css: {
    loaderOptions: {
      sass: {
        sassOptions: {
          includePaths: ['./node_modules', './src/assets'],
        },
      },
    },
  },

  // Webpack optimize: mỗi app dùng bundle riêng (tránh share runtime giữa 2 domain)
  configureWebpack: {
    optimization: {
      // Khi build 'all' → tạo runtime riêng theo từng entry để không “share” giữa apps
      runtimeChunk: TARGET === 'all'
        ? { name: entrypoint => `runtime~${entrypoint.name}` }
        : false,
      splitChunks: { chunks: 'all' }, // vẫn cho phép tách vendor trong từng app
    },
    output: {
      filename: isProd
        ? 'js/[name].[contenthash:8].js'
        : 'js/[name].js', // <- dev không dùng contenthash
      chunkFilename: isProd
        ? 'js/[name].[contenthash:8].chunk.js'
        : 'js/[name].chunk.js', // <- dev không dùng contenthash
    },
    resolve: {
      alias: {
        '@themeConfig': path.resolve(__dirname, 'themeConfig.js'),
        '@core': path.resolve(__dirname, 'src/@core'),
        '@validations': path.resolve(__dirname, 'src/@core/utils/validations/validations.js'),
        '@axios': path.resolve(__dirname, 'src/libs/axios'),
      },
    },
  },

  chainWebpack: config => {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        // eslint-disable-next-line no-param-reassign
        options.transformAssetUrls = {
          img: 'src',
          image: 'xlink:href',
          'b-avatar': 'src',
          'b-img': 'src',
          'b-img-lazy': ['src', 'blank-src'],
          'b-card': 'img-src',
          'b-card-img': 'src',
          'b-card-img-lazy': ['src', 'blank-src'],
          'b-carousel-slide': 'img-src',
          'b-embed': 'src',
        }
        return options
      })
  },
  transpileDependencies: ['vue-echarts', 'resize-detector'],

  devServer: {
    port: 8080,
    contentBase: path.resolve(__dirname, 'public'),
    watchContentBase: true,
    historyApiFallback: {
      disableDotRule: true,
      rewrites: makeHistoryApiFallbackRewrites(TARGET),
    },
  },
}