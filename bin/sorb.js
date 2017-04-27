/**
 * Created by sea35 on 2017/1/12.
 */
const script = process.argv[2];
const chalk = require('chalk');
var cp = require('child_process');


function start() {
    const p = cp.fork(__dirname + '/sorb', process.argv.slice(2));
    p.on('message', function(data) {
        if (data === 'restart') {
            p.kill('SIGINT');
            start();
        }
    });
}

// Main
if (!process.send) {
    start();
}
else {
    var program = require('commander');

    program
        .version(require('../package').version, '-v, --version')
        .option('-p, --port <n>', 'server port. Default: 8100')
        .parse(process.argv);
    require('../lib')({
        port: program.port || '8100',
    });
}
