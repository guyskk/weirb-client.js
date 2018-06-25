const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ClientConfig = {
    mode: 'production',
    entry: "./src/index.ts",
    target: 'web',
    output: {
        library: "weirbHrpcClient",
        libraryTarget: "umd",
        path: path.resolve(__dirname, 'dist'),
        filename: "main.js",
    },
    externals: {
        axios: {
            commonjs: 'axios',
            commonjs2: 'axios',
            amd: 'axios',
            root: 'axios'
        },
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, use: "awesome-typescript-loader" },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, use: "source-map-loader" },
        ]
    },
}

const GeneratorConfig = {
    mode: 'production',
    entry: "./src/generator.ts",
    target: 'node',
    output: {
        libraryTarget: "commonjs",
        path: path.resolve(__dirname, 'dist'),
        filename: "generator.js",
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
            { test: /\.tsx?$/, use: "awesome-typescript-loader" },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            { test: /\.js$/, use: "source-map-loader" },
        ]
    },
}

module.exports = [ClientConfig, GeneratorConfig];
