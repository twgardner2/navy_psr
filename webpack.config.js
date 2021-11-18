
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


module.exports = {
    mode: 'development',
    entry: {
        app: './src/js/scripts.js',
        style: './src/scss/styles.scss'
    },
    output: {
        filename: './dist/[name].js',
        path: path.resolve(__dirname),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    },
                },  
            },
            {
                test: /\.(sass|scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: './dist/[name].min.css',
        }),
    ],
};
