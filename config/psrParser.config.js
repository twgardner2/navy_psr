const webpack=require('webpack');
const path=require('path');

const pdfjsConfig = require('./pdfjs.config.js');
const appConfig = require('./app.config.js');

module.exports.entry = ()=>({
    ...appConfig.entry(),
});

module.exports.fallbacks = ()=>({
    'util': require.resolve('util/'),
    'stream': require.resolve('stream-browserify'),
    "constants": require.resolve("constants-browserify"),
    "assert": require.resolve("assert/"),
    "path": require.resolve("path-browserify"),
    'fs': require.resolve('browserify-fs'),
    'buffer': require.resolve('buffer/'),
});

module.exports.plugins = ()=>([
    new webpack.ProvidePlugin({
        process: require.resolve('process/browser'),
        Buffer: ['buffer', 'Buffer']
    }),
    ...pdfjsConfig.plugins(),
]);

module.exports.rules = ()=>([
    ...pdfjsConfig.rules(),
    {
        test: /\.js$/,
        exclude: /node_modules/,
        use:{ 
            loader: 'babel-loader',
            options: {
                presets: [
                    ['@babel/preset-env',
                {
                    "targets":"> 1%, not dead",
                }]
                ],
            },
        }
    }
]);
