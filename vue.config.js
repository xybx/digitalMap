/**
 * @description vue.config.js全局配置
 */
const path = require('path')
const {
    // baseURL,
    publicPath,
    assetsDir,
    outputDir,
    lintOnSave,
    transpileDependencies,
    title,
    abbreviation,
    devPort,
    providePlugin,
    build7z,
    buildGzip,
    imageCompression,
} = require('./src/config')
// const rely = require('vue-plugin-rely')
const { webpackBarName, webpackBanner } = require('./vab.config')
const { version, author } = require('./package.json')
const Webpack = require('webpack')
const WebpackBar = require('webpackbar')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const dayjs = require('dayjs')
const dateTime = dayjs().format('YYYY-M-D HH:mm:ss')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const productionGzipExtensions = ['html', 'js', 'css', 'svg']
process.env.VUE_APP_TITLE = title
process.env.VUE_APP_AUTHOR = author
process.env.VUE_APP_UPDATE_TIME = dateTime
process.env.VUE_APP_VERSION = version
// process.env.VUE_APP_RELY = rely
const resolve = (dir) => {
    return path.join(__dirname, dir)
}

module.exports = {
    publicPath,
    assetsDir,
    outputDir,
    lintOnSave,
    transpileDependencies,
    devServer: {
        hot: true,
        port: devPort,
        open: false,
        noInfo: false,
        overlay: {
            warnings: true,
            errors: true,
        },
    },
    configureWebpack() {
        return {
            resolve: {
                alias: {
                    '@': resolve('src'),
                    '*': resolve(''),
                },
            },
            plugins: [
                new Webpack.ProvidePlugin(providePlugin),
                new WebpackBar({
                    name: webpackBarName,
                }),
            ],
          optimization: {
            minimizer: [
              new TerserPlugin({
                minify: TerserPlugin.uglifyJsMinify,
                parallel: true,
                terserOptions:{
                  compress:{
                    warnings: false,
                    drop_console: true,
                    drop_debugger: true,
                    pure_funcs: ["console.log"]
                  }
                }
              })
            ],
          },
        }
    },
    chainWebpack(config) {
        config.resolve.symlinks(true)
        config.module.rule('swf').test(/\.swf$/).use('url-loader').loader('url-loader').options({limit:10000})
            // config.module.rule('svg').exclude.add(resolve('src/icon'))
            // config.module
            //     .rule('vabIcon')
            //     .test(/\.svg$/)
            //     .include.add(resolve('src/icon'))
            //     .end()
            //     .use('svg-sprite-loader')
            //     .loader('svg-sprite-loader')
            //     .options({ symbolId: 'vab-icon-[name]' })
        config.when(process.env.NODE_ENV === 'development', (config) => {
            config.devtool('source-map')
        })
        config.when(process.env.NODE_ENV === 'production', (config) => {
            config.performance.set('hints', false)
            config.devtool('none')
            config.optimization.splitChunks({
                chunks: 'all',
                cacheGroups: {
                    libs: {
                        name: 'admin-pro-libs',
                        test: /[\\/]node_modules[\\/]/,
                        priority: 10,
                        chunks: 'initial',
                    },
                    elementUI: {
                        name: 'admin-pro-element-ui',
                        priority: 20,
                        test: /[\\/]node_modules[\\/]_?element-ui(.*)/,
                    },
                },
            })
            config.plugin('webpack-report').use(BundleAnalyzerPlugin,[{analyzerMode:'static'}])
            config
                .plugin('banner')
                .use(Webpack.BannerPlugin, [`${webpackBanner}${dateTime}`])
            if (imageCompression)
                config.module
                .rule('images')
                .use('image-webpack-loader')
                .loader('image-webpack-loader')
                .options({
                    bypassOnDebug: true,
                })
                .end()
            if (buildGzip)
                config.plugin('compression').use(CompressionWebpackPlugin, [{
                    filename: '[path][base].gz[query]',
                    algorithm: 'gzip',
                    test: new RegExp(
                        '\\.(' + productionGzipExtensions.join('|') + ')$'
                    ),
                    threshold: 8192,
                    minRatio: 0.8,
                }, ])
            if (build7z)
                config.plugin('fileManager').use(FileManagerPlugin, [{
                    events: {
                        onEnd: {
                            archive: [{
                                source: `./${outputDir}`,
                                destination: `./${outputDir}/${abbreviation}_${dayjs().unix()}.7z`,
                            }, ],
                        },
                    },
                }, ])
        })
    },
    runtimeCompiler: true,
    productionSourceMap: false,
    css: {
        requireModuleExtension: true,
        sourceMap: true,
        loaderOptions: {
            scss: {
                additionalData(content, loaderContext) {
                    const { resourcePath, rootContext } = loaderContext
                    const relativePath = path.relative(rootContext, resourcePath)
                    if (
                        relativePath.replace(/\\/g, '/') !==
                        'src/vab/styles/variables/variables.scss'
                    )
                        return '@import "~@/vab/styles/variables/variables.scss";' + content
                    return content
                },
            },
            postcss: {
              plugins: [
                require('postcss-px-to-viewport')({
                  unitToConvert: 'px', // 需要转换的单位，默认为"px"
                  viewportWidth: 1920, // 视窗的宽度，对应pc设计稿的宽度，一般是1920
                  // viewportHeight: 1080,// 视窗的高度，对应的是我们设计稿的高度
                  unitPrecision: 3, // 单位转换后保留的精度
                  propList: [
                    // 能转化为vw的属性列表
                    '*'
                  ],
                  viewportUnit: 'vw', // 希望使用的视口单位
                  fontViewportUnit: 'vw', // 字体使用的视口单位
                  selectorBlackList: [], // 需要忽略的CSS选择器，不会转为视口单位，使用原有的px等单位。
                  minPixelValue: 1, // 设置最小的转换数值，如果为1的话，只有大于1的值会被转换
                  mediaQuery: false, // 媒体查询里的单位是否需要转换单位
                  replace: true, // 是否直接更换属性值，而不添加备用属性
                  exclude: /(\/|\\)(node_modules)(\/|\\)/ // 忽略某些文件夹下的文件或特定文件，例如 'node_modules' 下的文件
                })
              ]
          },
        },
        extract: process.env.NODE_ENV === 'production' ? {
            ignoreOrder: true,
        } : false,
    },
}
