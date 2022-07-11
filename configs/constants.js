
let app = require('./appCredentials')[require('../env').instance]




var USERTYPE = {

    USER: 'USER',
    ADMIN: 'ADMIN'
}

var DEVICE_TYPE = {

    ANDROID: 'ANDROID',
    IOS: 'IOS',
    WEB: 'WEB'
}


module.exports = {
    USERTYPE: USERTYPE,
    DEVICE_TYPE: DEVICE_TYPE,
   
}