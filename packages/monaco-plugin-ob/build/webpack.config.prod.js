const path = require('path');



module.exports = {
    entry: {
        mysql: path.resolve(__dirname, '../dist/obmysql/worker/index'),
        oracle: path.resolve(__dirname, '../dist/oboracle/worker/index')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        fallback: {
            fs: false,
            module: false
        }
    },
    output: {
        path: path.resolve(__dirname, '../worker-dist')
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
            }
        ],
    },
    mode: 'production',
};
