# snowboy2mqtt

[![mqtt-smarthome](https://img.shields.io/badge/mqtt-smarthome-blue.svg)](https://github.com/mqtt-smarthome/mqtt-smarthome)
[![npm version](https://badge.fury.io/js/snowboy2mqtt.svg)](https://www.npmjs.com/package/snowboy2mqtt)
[![dependencies Status](https://david-dm.org/hobbyquaker/snowboy2mqtt/status.svg)](https://david-dm.org/hobbyquaker/snowboy2mqtt)
[![build status](https://travis-ci.org/hobbyquaker/snowboy2mqtt.svg?branch=master)](https://travis-ci.org/hobbyquaker/snowboy2mqtt)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![apache 2 license](https://img.shields.io/badge/license-Apache%202-blue.svg)](LICENSE)


> Publish MQTT Messages on [Snowboy](https://snowboy.kitt.ai/) Hotword Detection


## Install

**Prerquisites:** Debian, Raspbian, Armbian, Ubuntu; Node.js >= 8

`$ apt install sox libsox-fmt-all libatlas-base-dev build-essential`

`$ npm install -g snowboy2mqtt`

Create a model folder, e.g. `/opt/snowboy` and put the [Snowboy .umdl/.pmdl file(s)](https://snowboy.kitt.ai/dashboard) 
in it.

I suggest to use [pm2](http://pm2.keymetrics.io/) to manage the snowboy2mqtt process (start on system boot, manage log 
files, ...)


## Command Line Options

`$ snowboy2mqtt --help`

```
Usage: snowboy2mqtt [options]

Options:
  -v, --verbosity           possible values: "error", "warn", "info", "debug"
                                                               [default: "info"]
  -p, --model-path          path of model files   [default: "/opt/snowboy2mqtt"]
  -a, --activation-hotword  hotword that activates listening for other hotwords
  -t, --timeout             timeout after activation             [default: 5000]
  -g, --audio-gain                                                  [default: 2]
  -s                        model sensitivity                   [default: "0.5"]
  -n, --name                instance name. used as topic prefix
                                                            [default: "snowboy"]
  -k, --insecure            allow ssl connections without valid certificate
                                                                       [boolean]
  -u, --url                 mqtt broker url        [default: "mqtt://127.0.0.1"]
  -h, --help                Show help                                  [boolean]
  --version                 Show version number                        [boolean]
```


#### MQTT Authentication and TLS
You can put credentials for authentication in the url supplied to the `--url` option: `mqtt://user:password@broker`. If 
you want to use TLS for the connection to the broker use `mqtts://` as URL scheme, e.g. `mqtts://broker:8883`.


#### Activation Hotword

It's possible to define a Hotword that activates detection of other Hotwords for a configured period of time. So if you 
set e.g. `--activation-hotword computer` and `--timeout 5000` only 5 seconds after someone said _Computer_ the 
publishing of other Hotwords gets activated. Every detected Hotword prolongs the timeout to 5 seconds again. The 
current activation status is published retained on the topic `<name>/active`.


## License

snowboy2mqtt © 2018 Sebastian Raff, licensed under [Apache License 2.0](LICENSE)
