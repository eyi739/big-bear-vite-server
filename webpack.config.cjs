const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: 'development',
    target: 'web',
    entry: './src/client/index.jsx',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            tempate: './src/client/index.html',
        }),
        new webpack.EnvironmentPlugin([
            'NODE_ENV',
            'SERVER_HOST',
            'SERVER_PORT',
        ])
    ],
    module: {
        rules: [
            {
                test: /\.(js | jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', {'runtime' :  'automatic'}]
                        ]
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.jsx']
    }
};