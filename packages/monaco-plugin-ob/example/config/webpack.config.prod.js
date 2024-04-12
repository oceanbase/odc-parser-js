const path = require('path');
const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
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
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    output: {
        path: path.resolve(__dirname, '../dist')
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
        new BundleAnalyzerPlugin(),
        new CopyPlugin({
            patterns: [
              { from: process.cwd() + '/worker-dist/', to: 'ob-workers' },
            ],
          }),
    ],
    mode: 'production',
};
