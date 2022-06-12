let path = require('path')
const webpack = require('webpack')
const ThemeColorReplacer = require('webpack-theme-color-replacer')
const { getThemeColors, modifyVars } = require('./src/utils/themeUtil')
const { resolveCss } = require('./src/utils/theme-color-replacer-extend')
const CompressionWebpackPlugin = require('compression-webpack-plugin')
const buildDate = JSON.stringify(new Date().toLocaleString())
const productionGzipExtensions = ['js', 'css', 'less']
const isProd = process.env.NODE_ENV === 'production'

function resolve(dir) {
    return path.join(__dirname, dir)
}

const { VueCDN, AxiosCDN, VueRouterCDN, VuexCDN } = require('./src/plugins/cdn');

const assetsCDN = {
    // webpack build externals
    externals: {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        vuex: 'Vuex',
        axios: 'axios',
        nprogress: 'NProgress',
        clipboard: 'ClipboardJS',
        '@antv/data-set': 'DataSet',
        'js-cookie': 'Cookies',
        AMap: 'AMap'
    },
    css: [],
    js: [
        '//cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.min.js',
        '//cdn.jsdelivr.net/npm/vue-router@3.3.4/dist/vue-router.min.js',
        '//cdn.jsdelivr.net/npm/vuex@3.6.0/dist/vuex.min.js',
        '//cdn.jsdelivr.net/npm/axios@0.19.2/dist/axios.min.js',
        '//cdn.jsdelivr.net/npm/nprogress@0.2.0/nprogress.min.js',
        '//cdn.jsdelivr.net/npm/clipboard@2.0.6/dist/clipboard.min.js',
        '//cdn.jsdelivr.net/npm/@antv/data-set@0.11.4/build/data-set.min.js',
        '//cdn.jsdelivr.net/npm/js-cookie@2.2.1/src/js.cookie.min.js',
        VueCDN, AxiosCDN, VueRouterCDN, VuexCDN
    ]
}

module.exports = {
    devServer: {
        port: 8998,
        open: true,
        overlay: {
            warnings: false,
            errors: true
        },
        before: !isProd ? require('./mock/mock-server.js') : '',
        disableHostCheck: true
    },
    pluginOptions: {
        'style-resources-loader': {
            preProcessor: 'less',
            patterns: [path.resolve(__dirname, "./src/theme/theme.less")],
        }
    },
    configureWebpack: config => {
        config.entry.app = ["babel-polyfill", "whatwg-fetch", "./src/main.js"];
        config.performance = {
            hints: false
        }
        config.plugins.push(
                new ThemeColorReplacer({
                    fileName: 'css/theme-colors-[contenthash:8].css',
                    matchColors: getThemeColors(),
                    injectCss: true,
                    resolveCss
                })
            )
            // Ignore all locale files of moment.js
        config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/))
        config.plugins.push(new webpack.DefinePlugin({
                BUILD_DATE: buildDate
            }))
            // 生产环境下将资源压缩成gzip格式
        if (isProd) {
            // add `CompressionWebpack` plugin to webpack plugins
            config.plugins.push(new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'), //匹配文件名
                threshold: 10240, //对10K以上的数据进行压缩
                minRatio: 0.8,
                deleteOriginalAssets: false, //是否删除源文件
            }), new webpack.optimize.LimitChunkCountPlugin({
                maxChunks: 5,
                minChunkSize: 100
            }))
        }
        // if prod, add externals
        // 如果是内网，打包的时候把这段注释掉，引入的是外部资源
        // if (isProd) {
        //     config.externals = assetsCDN.externals
        // }
    },

    chainWebpack: config => {
        // 生产环境下关闭css压缩的 colormin 项，因为此项优化与主题色替换功能冲突
        if (isProd) {
            config.plugin('optimize-css')
                .tap(args => {
                    args[0].cssnanoOptions.preset[1].colormin = false
                    return args
                })
        }
        // 生产环境下使用CDN
        // if (isProd) {
        //     config.plugin('html')
        //         .tap(args => {
        //             args[0].cdn = assetsCDN
        //             return args
        //         })
        // }
        config.resolve.alias
            .set('@$', resolve('src'))
            .set('@services', resolve('src/services'))
            .set('@assets', resolve('src/assets'))
            .set('@comp', resolve('src/components'))
            .set('@pages', resolve('src/pages'))
            .set('@layouts', resolve('src/layouts'))
            .set('@static', resolve('src/static'))
            // 设置svg
        config.module
            .rule('svg')
            .exclude.add(resolve('src/icons'))
            .end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end();
        // 配置 webpack 识别 markdown 为普通的文件
        config.module
            .rule('markdown', 'vue-style-loader')
            .test(/\.md$/)
            .use()
            .loader('file-loader')
            .end();

        // 新增
        config.module
            .rule("typescript")
            .test(/\.ts$/)
            .use("ts-loader")
            .loader("ts-loader")
            .end();
    },
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: modifyVars(),
                    javascriptEnabled: true
                }
            }
        }
    },
    publicPath: isProd ? '/' : '/',
    outputDir: 'dist',
    productionSourceMap: false,
    runtimeCompiler: true
}