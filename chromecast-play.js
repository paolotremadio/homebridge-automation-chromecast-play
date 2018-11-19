const { Client, DefaultMediaReceiver } = require('castv2-client');
const mdns = require('mdns');
const mime = require('mime-types');
const debug = require('debug')('pt-chromecast-play');

class ChromecastPlay {
  constructor(logger, chromecastDeviceName, fileToPlay, mimeType = null, streamType = null) {
    this.chromecastDeviceName = chromecastDeviceName;

    this.fileToPlay = fileToPlay;
    this.mimeType = mimeType || mime.lookup(fileToPlay);
    if (!this.mimeType) {
      throw new Error('Mime type not supported');
    }

    this.streamType = streamType.toUpperCase() || 'BUFFERED';

    this.log = logger;
    this.chromecastClient = null;

    this.scanForChromecast();
  }

  scanForChromecast() {
    const mdnsSequence = [
      mdns.rst.DNSServiceResolve(),
      'DNSServiceGetAddrInfo' in mdns.dns_sd ? mdns.rst.DNSServiceGetAddrInfo() : mdns.rst.getaddrinfo({ families: [0] }),
      mdns.rst.makeAddressesUnique(),
    ];

    const browser = mdns.createBrowser(mdns.tcp('googlecast'), { resolverSequence: mdnsSequence });

    debug(`Scanning for Chromecast device named "${this.chromecastDeviceName}"`);

    browser.on('serviceUp', (device) => {
      const txt = device.txtRecord;
      const name = txt.fn;

      if (name.toLowerCase() === this.chromecastDeviceName.toLowerCase()) {
        const ipAddress = device.addresses[0];
        const { port } = device;

        this.log(`Chromecast found on ${ipAddress}:${port}. Connecting...`);

        browser.stop();
        this.clientConnect(ipAddress, port);
      }
    });

    browser.start();
  }

  clientConnect(host, port) {
    this.chromecastClient = new Client();

    const connectionDetails = { host, port };

    this.chromecastClient.connect(connectionDetails, () => {
      debug('Connected. Launching app');

      this.launchPlayer();
    });
  }

  handleStatusChange(status) {
    if (status.playerState === 'BUFFERING') {
      this.log('Buffering');
    } else if (status.playerState === 'PLAYING') {
      this.log('Playing');
      this.chromecastClient.close();
    }
  }

  launchPlayer() {
    this.chromecastClient.launch(DefaultMediaReceiver, (launchError, player) => {
      if (launchError) {
        debug(launchError);
        return;
      }

      const media = {
        contentId: this.fileToPlay,
        contentType: this.mimeType,
        streamType: this.streamType,

        metadata: {
          type: 0,
          metadataType: 0,
          title: 'Chromecast Play content',
          images: [
          ],
        },
      };

      player.on('status', (status) => {
        debug(`Status broadcast playerState=${status.playerState}`);
        this.handleStatusChange(status);
      });

      debug(`App "${player.session.displayName}" launched, loading media ${media.contentId}...`);

      player.load(media, { autoplay: true }, (loadError, status) => {
        if (loadError) {
          debug(loadError);
          return;
        }

        this.handleStatusChange(status);
      });
    });
  }
}

module.exports = ChromecastPlay;
