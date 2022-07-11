

'use strict';

module.exports = {
    //node modules
    hapiSwagger         : require('hapi-swagger'),
    joi                 : require('joi'),
    async               : require('async'),
    fs                  : require('fs'),
    moment              : require('moment'),
    md5                 : require('md5'),
    path                : require('path'),
    jwt                 : require('jsonwebtoken'),
    mongoose            : require('mongoose'),
    path                : require('path'),
    nodemailer          : require('nodemailer'),
    smtpTransport       : require('nodemailer-smtp-transport'),
    _                   : require('underscore'),
    request             : require('request'),
    //internal files 
    appConstants         : require('../../configs/appCredentials')[require('../../env').instance],
    dbConstants          : require('../../configs/dbCredentials')[require('../../env').instance],
    constants            : require('../../configs/constants'),
    userModel            : require('../../src/models/users'),
    RESPONSES            : require('../../configs/response')
};

