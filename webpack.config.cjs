const Dotenv = require('dotenv-webpack');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');


module.exports = (env) = {
    mode: 'development',
    target: 'web',
    entry: {
        main: ['webpack-hot-middleware/client?reload=true&timeout=2000','../src/client/index.jsx']
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/',
        filename: 'bundle.js',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: '../src/client/index.html',
        }),
        new webpack.EnvironmentPlugin([
            'NODE_ENV',
            'SERVER_HOST',
            'SERVER_PORT',
        ]),
        new webpack.HotModuleReplacementPlugin(),
        new Dotenv({
            // path: path.resolve(__dirname, '.env'), // Path to .env file (this is the default)
            path: './.env',
            systemvars: true, // Load system environment variables as well
          }),
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