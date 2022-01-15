const path=require('path');
const webpack=require('webpack');
const rootDir=path.resolve('./node_modules/pdf2json/base');
const fs=require('fs');


module.exports.rules= ()=>([
    {
        test: path.resolve('./node_modules/pdf2json/lib/pdf.js'),
        use: [{
            loader: path.resolve(__dirname,'loaders/buildpdfjs.js'),
        }
        ]
    }
]);

module.exports.plugins= ()=>([
    new webpack.ProvidePlugin({
        'globalScope.PDFJS.disableWorker': true
    })
]);
