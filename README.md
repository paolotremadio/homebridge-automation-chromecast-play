

# Automation - Chromecast Play  

## Intro
This accessory will play/cast audio and/or video to your Chromecast on demand. It can be used for automation.

The list of media (audio/video) to be played must be stored on a file. The plugin will pick a random media from the file every time you turn on the switch. If you want to apply always the same, create a json file with only one media.

## Media file

Example:

```json
[
  {
    "name": "Ukulele Song",
    "url": "https://freepd.com/music/Ukulele%20Song.mp3",
    "author": {
      "name": "Rafael Krux"
    }
  },
  {
    "name": "Pond",
    "url": "https://freepd.com/music/Pond.mp3",
    "author": {
      "name": "Rafael Krux"
    },
    "mimeType": "audio/mp3",
    "streamType": "BUFFERED"
  }
]
```

The JSON file must contain an array of objects. Each object will be a media.

Format of each media object:

| Attribute | Required | Description | Example |
|-----------|----------|-------------|---------|
| name | Yes | The name of the media | `Ukulele Song` |
| url | Yes | The URL of the media to be streamed | `https://freepd.com/music/Ukulele%20Song.mp3` |
| author.name | No (default: `unknown`) | The name of the author of the media | `Rafael Krux` |
| mimeType | No (default: autodetect based on file extension) | The MIME type of the file. See [Chromecast supported types](https://developers.google.com/cast/docs/media) | `audio/mp3` |
| streamType | No (default: `BUFFERED`) | The type of stream. For files, use `BUFFERED`, for live feeds use `LIVE` | `BUFFERED` |


You can find an example file in this repo under `media.json`. This file contains some public domain audio (but you can stream video too). 


## Config
  
Example config.json:  
  
```json
{
  "accessories": [
    {
      "accessory": "AutomationChromecastPlay",
      "name": "Living Room Play",
      "chromecastDeviceName": "Living Room",
      "mediaFile": "./media.json"
    }
  ]
}
```

This accessory will create a switch. Turning on the switch will stream the media to your Chromecast. The switch will turn off automatically after 1 second.

The switch has the following properties:

| Name | Description | Example |
|------|-------------|---------|
| Author | The name of the author of the current media | `Rafael Krux` |
| Media |The name of the current applied media | `Ukulele Song` |
| Status |The current media status | `Playing` |

Note: some properties are not compatible with iOS Home app, use [Elgato Eve app](https://itunes.apple.com/us/app/elgato-eve/id917695792?mt=8) instead.
  
## Configuration options  
  
| Attribute | Required | Usage | Example |
|-----------|----------|-------|---------|
| name | Yes | A unique name for the accessory. It will be used as the accessory name in HomeKit. | `Living Room Play` |
| chromecastDeviceName | Yes | The name of your Chromecast device as shown in your Google Home App (case insensitive). This plugin will use Bonjour/mdns to detect the IP address of the Chromecast based on this name. | `Living Room` |
| mediaFile | Yes | The path of the media file (relative to the Homebridge current working directory) | `./media.json` |

## Other useful plugins
Do you want to automatically turn on the speakers when you stream some audio? Or adjust the volume of the speakers?

Check my [homebridge-automation-chromecast](https://github.com/paolotremadio/homebridge-automation-chromecast) plugin.
