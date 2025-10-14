const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: path.resolve(__dirname, '../src/index.tsx'),
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        fallback: {
            fs: false,
            module: false
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    // { loader: 'babel-loader' },
                    { loader: 'ts-loader', options: { transpileOnly: true } },
                ],
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebPackPlugin({
            template:path.resolve(__dirname, '../src/index.html')
        }),
        new webpack.DefinePlugin({
            NODE_ENV: JSON.stringify(process.env.NODE_ENV)
        }),
        // new CopyPlugin({
        //     patterns: [
        //       { from: process.cwd() + '/worker-dist/', to: 'ob-workers' },
        //     ],
        //   }),
    ],
    devServer: {
        hot: true,
        proxy: [
            {
                context: ['/ob-workers'],
                target: 'http://localhost:9090',
                pathRewrite: {
                    '^/ob-workers': ''
                }
            }
        ]
    },
    mode: 'development',
};
