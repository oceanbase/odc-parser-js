const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');


module.exports = {
    entry: {
        obmysql: path.resolve(__dirname, '../dist/obmysql/worker/index'),
        mysql: path.resolve(__dirname, '../dist/mysql/worker/index'),
        oracle: path.resolve(__dirname, '../dist/oboracle/worker/index')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        fallback: {
            fs: false,
            module: false
        }
    },
    target: 'webworker',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    // { loader: 'babel-loader' },
                    { loader: 'ts-loader', options: { transpileOnly: true } },
                ],
                exclude: /node_modules/,
            }
        ],
    },
    devServer: {
        hot: true
    },
    mode: 'development',
};
