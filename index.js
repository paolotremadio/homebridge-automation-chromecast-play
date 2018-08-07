const fs = require('fs');
const debug = require('debug')('homebridge-automation-chromecast-play');
const pkginfo = require('./package');

const CustomCharacteristics = require('./custom-characteristics');
const ChromecastPlay = require('./chromecast-play');

let Service;
let Characteristic;

class AutomationChromecastPlay {
  constructor(log, config) {
    this.log = log;

    const {
      chromecastDeviceName,
      mediaFile,
      name,
    } = config;

    this.name = name;

    this.chromecastDeviceName = chromecastDeviceName;
    this.currentMediaName = 'none';
    this.currentMediaAuthor = 'none';
    this.currentMediaStatus = 'none';

    this.loadMedia(mediaFile);

    this.createServices();
  }

  createServices() {
    this.switchService = new Service.Switch(this.name);

    this.switchService
      .getCharacteristic(Characteristic.On)
      .on('get', callback => callback(null, false))
      .on('set', this.setSwitch.bind(this));

    this.switchService
      .addCharacteristic(CustomCharacteristics.MediaName)
      .on('get', callback => callback(null, this.currentMediaName));

    this.switchService
      .addCharacteristic(CustomCharacteristics.MediaAuthor)
      .on('get', callback => callback(null, this.currentMediaAuthor));

    this.switchService
      .addCharacteristic(CustomCharacteristics.MediaStatus)
      .on('get', callback => callback(null, this.currentMediaStatus));

    this.accessoryInformationService = new Service.AccessoryInformation()
      .setCharacteristic(Characteristic.Name, this.name)
      .setCharacteristic(Characteristic.Manufacturer, pkginfo.author.name || pkginfo.author)
      .setCharacteristic(Characteristic.Model, 'Chromecast')
      .setCharacteristic(Characteristic.SerialNumber, 'n/a')
      .setCharacteristic(Characteristic.FirmwareRevision, pkginfo.version)
      .setCharacteristic(Characteristic.HardwareRevision, pkginfo.version);
  }

  refreshValues() {
    this.switchService
      .getCharacteristic(CustomCharacteristics.MediaName)
      .updateValue(this.currentMediaName);

    this.switchService
      .getCharacteristic(CustomCharacteristics.MediaAuthor)
      .updateValue(this.currentMediaAuthor);

    this.switchService
      .getCharacteristic(CustomCharacteristics.MediaStatus)
      .updateValue(this.currentMediaStatus);
  }

  getServices() {
    return [
      this.switchService,
      this.accessoryInformationService,
    ];
  }

  setSwitch(on, callback) {
    if (on) {
      this.playRandomMedia();

      // Turn off the switch after one second
      setTimeout(() => {
        this.switchService
          .setCharacteristic(Characteristic.On, false);
      }, 1000);

      callback();
    } else {
      callback();
    }
  }

  loadMedia(path) {
    const jsonFile = fs.readFileSync(path, 'utf8');
    this.media = JSON.parse(jsonFile);

    debug(`Loaded ${this.media.length} media`);
  }

  pickRandomMedia() {
    const { media } = this;

    return media[Math.floor(Math.random() * media.length)];
  }

  playRandomMedia() {
    const mediaConfig = this.pickRandomMedia();

    const mediaName = mediaConfig.name;
    const mediaAuthor = mediaConfig.author.name || 'unknown';

    const mediaStatusUpdate = (status) => {
      this.log(status);
      this.currentMediaStatus = status;
      this.refreshValues();
    };

    this.log(`Playing  media "${mediaName}" by ${mediaAuthor}`);

    new ChromecastPlay(
      mediaStatusUpdate,
      this.chromecastDeviceName,
      mediaConfig.url,
    );

    this.currentMediaName = mediaName;
    this.currentMediaAuthor = mediaAuthor;

    this.refreshValues();
  }
}

module.exports = (homebridge) => {
  Service = homebridge.hap.Service; // eslint-disable-line
  Characteristic = homebridge.hap.Characteristic; // eslint-disable-line

  homebridge.registerAccessory('homebridge-automation-chromecast-play', 'AutomationChromecastPlay', AutomationChromecastPlay);
};
