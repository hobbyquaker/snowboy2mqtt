#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const record = require('node-record-lpcm16');
const {Detector, Models} = require('snowboy');

const log = require('yalm');
const Mqtt = require('mqtt');
const config = require('./config.js');
const pkg = require('./package.json');

process.title = pkg.name;

log.setLevel(config.verbosity);

log.info(pkg.name + ' ' + pkg.version + ' starting');

let mqttConnected;

const logUrl = config.url.replace(/:[^@/]+@/, '@');

log.info('mqtt trying to connect', logUrl);
const mqtt = Mqtt.connect(config.url, {
    will: {topic: config.name + '/connected', payload: '0', retain: true},
    rejectUnauthorized: !config.insecure
});

function mqttPub(topic, payload, options) {
    if (typeof payload !== 'string') {
        payload = JSON.stringify(payload);
    }
    log.info('mqtt >', topic, payload);
    mqtt.publish(topic, payload, options);
}

mqtt.on('connect', () => {
    mqttConnected = true;

    log.info('mqtt connected', logUrl);
    mqttPub(config.name + '/connected', '2', {retain: true});

    log.info('mqtt subscribe', config.name + '/set/#');
    mqtt.subscribe(config.name + '/set/#');
});

mqtt.on('close', () => {
    if (mqttConnected) {
        mqttConnected = false;
        log.info('mqtt closed', logUrl);
    }
});

mqtt.on('error', err => {
    log.error('mqtt', err);
});

if (config.activationHotword) {
    config.activationHotword = config.activationHotword.toLowerCase();
}

let active = false;
let activeTimeout;

function activate() {
    clearTimeout(activeTimeout);
    if (!active) {
        active = true;
        mqttPub(config.name + '/active', active, {retain: true});
    }
    activeTimeout = setTimeout(() => {
        active = false;
        mqttPub(config.name + '/active', active, {retain: true});
    }, config.timeout);
}

const models = new Models();

const dir = fs.readdirSync(config.modelPath);

dir.forEach(file => {
    let match;
    if (match = file.match(/(.*)\.[pu]mdl$/)) { // eslint-disable-line no-cond-assign
        let [file, name] = match;
        name = name.toLowerCase();
        log.info('adding hotword', file);
        models.add({
            file: path.join(config.modelPath, file),
            sensitivity: config.sensitivity,
            hotwords: name
        });
    }
});

const detector = new Detector({
    resource: path.join(__dirname, '/node_modules/snowboy/resources/common.res'),
    models,
    audioGain: config.audioGain,
    applyFrontend: true
});

detector.on('silence', () => {
    log.debug('silence');
});

detector.on('sound', () => {
    log.debug('sound');
});

detector.on('error', error => {
    log.error(error);
    process.exit(1);
});

detector.on('hotword', (_, hotword) => {
    log.info('hotword detected:', hotword);

    if (hotword === config.activationHotword) {
        activate();
    } else if (active) {
        activate();
        mqttPub(config.name, hotword);
    } else if (!config.activationHotword) {
        mqttPub(config.name, hotword);
    }
});

const mic = record.start({
    threshold: 0,
    verbose: false
});

mic.pipe(detector);
