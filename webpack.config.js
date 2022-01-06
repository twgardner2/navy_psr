
const path = require('path');
const webpack = require('webpack');

const styleConfig = require('./config/style.config.js');
const psrParserConfig = require('./config/psrParser.config.js');

module.exports = {
    mode: 'development',
    target:'web',
    entry: {
        ...psrParserConfig.entry(),
        // ...styleConfig.entry(),
        },
    output: {
        filename: './dist/[name].js',
        path: path.resolve(__dirname),
    },
    module: {
        rules: [
            ...psrParserConfig.rules(),
            // ...styleConfig.rules(),            
        ],
    },
    resolve:{
        fallback: {
           ...psrParserConfig.fallbacks(), 
        }
    },
    plugins: [
        ...psrParserConfig.plugins(),
        // ...styleConfig.plugins(),
    ],
};
