const { Characteristic } = require('hap-nodejs');

const MediaNameUUID = 'ccd86e18-9a63-11e8-9eb6-529269fb1459';
function MediaName() {
  const char = new Characteristic('Media', MediaNameUUID);

  char.setProps({
    format: Characteristic.Formats.STRING,
    perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY],
  });
  char.value = char.getDefaultValue();

  return char;
}
MediaName.UUID = MediaNameUUID;

const MediaAuthorUUID = 'ccd8719c-9a63-11e8-9eb6-529269fb1459';
function MediaAuthor() {
  const char = new Characteristic('Author', MediaAuthorUUID);

  char.setProps({
    format: Characteristic.Formats.STRING,
    perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY],
  });
  char.value = char.getDefaultValue();

  return char;
}
MediaAuthor.UUID = MediaAuthorUUID;

const MediaStatusUUID = '34d198c6-9a70-11e8-9eb6-529269fb1459';
function MediaStatus() {
  const char = new Characteristic('Status', MediaStatusUUID);

  char.setProps({
    format: Characteristic.Formats.STRING,
    perms: [Characteristic.Perms.READ, Characteristic.Perms.NOTIFY],
  });
  char.value = char.getDefaultValue();

  return char;
}
MediaStatus.UUID = MediaStatusUUID;

module.exports = {
  MediaName,
  MediaAuthor,
  MediaStatus,
};
