module.exports = require('yargs')
    .usage('Usage: $0 [options]')
    .describe('v', 'possible values: "error", "warn", "info", "debug"')
    .describe('p', 'path of model files')
    .describe('a', 'hotword that activates listening for other hotwords')
    .describe('t', 'timeout after activation')
    .describe('s', 'model sensitivity')
    .describe('n', 'instance name. used as topic prefix')
    .describe('k', 'allow ssl connections without valid certificate')
    .describe('u', 'mqtt broker url')
    .describe('h', 'show help')
    .alias({
        h: 'help',
        n: 'name',
        u: 'url',
        k: 'insecure',
        v: 'verbosity',
        p: 'model-path',
        a: 'activation-hotword',
        t: 'timeout',
        g: 'audio-gain'
    })
    .default({
        u: 'mqtt://127.0.0.1',
        n: 'snowboy',
        v: 'info',
        t: 5000,
        p: '/opt/snowboy2mqtt',
        g: 2,
        s: '0.5'
    })
    .boolean('k')
    .version()
    .help('help')
    .argv;
