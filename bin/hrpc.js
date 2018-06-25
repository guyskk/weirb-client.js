#!/usr/bin/env node
var process = require('process');
var program = require('commander');
var generator = require('../dist/generator');

program
    .version(generator.version)
    .description('Generate Javascript client from Hrpc service meta data.')
    .option('-f, --metafile <n>', 'Service meta file path')
    .option('-o, --output <n>', 'Output file path')
    .parse(process.argv);

if (!program.metafile) {
    console.log('Please provide service meta file path');
    program.help();
}
if (!program.output) {
    console.log('Please provide output file path');
    program.help();
}
console.log('Generate client: ' + program.metafile + ' -> ' + program.output);
generator.generate(program.metafile, program.output)
