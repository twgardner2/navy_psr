const fs=require('fs');
const path=require('path');
const _basePath=path.resolve('./node_modules/pdf2json/base');

const _pdfjsFiles = [
    'shared/util.js',
    'shared/colorspace.js',
    'shared/pattern.js',
    'shared/function.js',
    'shared/annotation.js',

    'core/core.js',
    'core/obj.js',
    'core/charsets.js',
    'core/crypto.js',
    'core/evaluator.js',
    'core/fonts.js',
    'core/font_renderer.js',
    'core/glyphlist.js',
    'core/image.js',
    'core/metrics.js',
    'core/parser.js',
    'core/stream.js',
    'core/worker.js',
    'core/jpx.js',
    'core/jbig2.js',
    'core/bidi.js',
    'core/jpg.js',
    'core/chunked_stream.js',
    'core/pdf_manager.js',
    'core/cmap.js',
    'core/cidmaps.js',

    'display/canvas.js',
    'display/font_loader.js',
    'display/metadata.js',
    'display/api.js'
];

const buildpdfjs = function(){
    let _fileContent = '';
    _pdfjsFiles.forEach( (fieldName, idx, arr) => _fileContent += fs.readFileSync(`${_basePath}/${fieldName}`, 'utf-8') );
    return _fileContent;
}



module.exports=function(input){
    let replacement=buildpdfjs();
    let output=input
        .replace(`'use strict';`,'')
        .replace(`_pdfjsFiles.forEach( (fieldName, idx, arr) => _fileContent += fs.readFileSync(_basePath + fieldName, 'utf8') );`, '')
        .replace(`eval(_fileContent);`, replacement)
        .replace(`var nodeUtil`, 'nodeUtil')
        .replace('globalScope.PDFJS.disableWorker', '(true)');
    return output;
}