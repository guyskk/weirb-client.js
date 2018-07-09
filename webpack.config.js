const path = require('path')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin

const plugins = []

if (process.env['WEBPACK_ANALYZ'] === 'true') {
    plugins.push(new BundleAnalyzerPlugin({
        analyzerMode: 'server',
        analyzerHost: '127.0.0.1',
        analyzerPort: 8889,
        reportFilename: 'report.html',
        defaultSizes: 'parsed',
        openAnalyzer: true,
        generateStatsFile: false,
        statsFilename: 'stats.json',
        statsOptions: null,
        logLevel: 'info'
    }))
}

module.exports = {
    mode: 'production',
    entry: ['./src/index.js'],
    target: 'web',
    output: {
        library: 'WeirbClient',
        libraryTarget: 'umd',
        path: path.resolve(__dirname, 'dist'),
        filename: 'weirb-client.js',
    },
    externals: {
        axios: {
            commonjs: 'axios',
            commonjs2: 'axios',
            amd: 'axios',
            root: 'axios'
        },
    },
    plugins: plugins,
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['env', {
                            'modules': false,
                            'targets': {
                                'browsers': '> 1%, last 2 versions'
                            }
                        }]
                    ],
                    'plugins': [
                        [
                            'transform-runtime', {
                                'helpers': false,
                                'polyfill': false,
                                'regenerator': true,
                                'moduleName': 'babel-runtime'
                            }
                        ]
                    ]
                }
            }
        }]
    }
}