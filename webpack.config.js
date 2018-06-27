const path = require('path');

module.exports = {
    mode: 'production',
    entry: ["babel-polyfill", "./src/index.js"],
    target: 'web',
    output: {
        library: "WeirbClient",
        libraryTarget: "umd",
        path: path.resolve(__dirname, 'dist'),
        filename: "WeirbClient.js",
    },
    externals: {
        axios: {
            commonjs: 'axios',
            commonjs2: 'axios',
            amd: 'axios',
            root: 'axios'
        },
    },
    devtool: "source-map",
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        ["env", {
                            "targets": {
                                "browsers": "> 1%, last 2 versions"
                            }
                        }]
                    ]
                }
            }
        }]
    }
}