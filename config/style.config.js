
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports.entry = ()=>({
    style: './src/scss/styles.scss',
});

module.exports.rules= ()=>([{
        test: /\.(sass|scss)$/,
        use: [
            MiniCssExtractPlugin.loader,
            'css-loader',
            'sass-loader',
        ],
    }]
);

module.exports.plugins= ()=>([
    new MiniCssExtractPlugin({
        filename: './dist/[name].min.css',
    })
]);