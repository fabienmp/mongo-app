const url = require('url');
const uri = 'mongodb://sa_user:password987@ds261277.mlab.com:61277/heroku_4ztpbfkj';

if (!uri) {
    throw new Error('\033[31mYou need to provide the connection string. ' + 'You can open "db/connection-config.js" and export it or use the "setUri" command.\033[0m');
}

const uriObj = url.parse(uri);
if (uriObj.protocol !== 'mongodb:') {
    throw new Error('Must be a mongodb URI')
}
if (!uriObj.host || !uriObj.path) {
    throw new Error('Improperly formatted URI')
}

module.exports = uri;

