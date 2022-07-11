
//access modules
const accessModule = require('./index');
const FCM = require('fcm-node');
var server_key = ''




module.exports = {
    //create jwt token
    createLoginToken: function (payload, cb) {
        accessModule.jwt.sign(payload, "SESSIONJWTTOKENCHS512TICKETWIZARDSECRETKEY", {
            algorithm: 'HS512'
        }, function (err, token) {
            if (err) {
                cb(err)
            } else {
                cb(null, token)
            }
        })
    },
    getRandomNum: (length) => {
        var randomNum =
            (Math.pow(10, length).toString().slice(length - 1) +
                Math.floor((Math.random() * Math.pow(10, length)) + 1).toString()).slice(-length);
        return randomNum;

    },
    //function to check user authentication
    verifyLoginToken: async (request, h) => {

        return new Promise(function (resolve, reject) {
            let token = (request.headers && request.headers['x-logintoken']) ? request.headers['x-logintoken'] : request.payload ? request.payload.accessToken : request.query ? request.query.accessToken : request.params.accessToken

            if (token != '' && token != undefined) {

                accessModule.userModel.find({
                    accessToken: token
                }, function (err, response) {
                    if (err) {
                        err ? err : reject(accessModule.RESPONSES.sessionExpired())
                    } else {

                        if (response.length == 0) {

                            resolve(accessModule.RESPONSES.sessionExpired())
                        } else {

                            if (response[0].isBlocked == true) {
                                resolve(accessModule.RESPONSES.userBlocked())

                            } else if (response[0].isActive == false) {
                                resolve(accessModule.RESPONSES.userSuspended())
                            } else {
                                resolve({
                                    code: 200,
                                    status: true,
                                    message: 'Data fetched successfully.',
                                    result: response[0]
                                })

                            }
                        }
                    }
                });


            } else {
                resolve({ code: accessModule.RESPONSES.STATUS_CODE.FOR_LOGGEDIN_NOT, status: true, message: '' , result: {}})
                // reject({
                //     code: 203,
                //     status: false,
                //     message: 'Your session is expired.'
                // })
            }
        })

    },

    //function to check user authentication
    adminverifyLoginToken: async (request, h) => {

        return new Promise(function (resolve, reject) {

            let token = (request.headers && request.headers['x-logintoken']) ? request.headers['x-logintoken'] : request.payload ? request.payload.accessToken : request.query ? request.query.accessToken : request.params.accessToken

            if (token != '' && token != undefined) {

                accessModule.userModel.find({
                    accessToken: token,
                    role: accessModule.constants.USERTYPE.ADMIN
                }, {}, { lean: true, new: true }, function (err, response) {
                    if (err) {
                        err ? err : reject({
                            code: 203,
                            status: false,
                            message: 'Your session expired.'
                        })
                    } else {
                        accessModule.userModel.find({
                            idBlocked: true
                        }, function (err, blockedResp) {
                            if (response.length == 0) {

                                resolve(accessModule.RESPONSES.sessionExpired())

                            } else {
                                response[0].blockedUsers = blockedResp.map(value => value['_id'])
                                resolve(accessModule.RESPONSES.MANAGE_RESP({
                                    status: true,
                                    data: response[0]
                                }))
                            }
                        })

                    }
                });


            } else {
                reject({
                    code: 203,
                    status: false,
                    message: 'Your session is expired.'
                })
            }
        })
    },

    //function to generate random string
    randomString: (length) => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    },

    //gen access token
    generate_access_token: (length) => {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() *
                possible.length));

        let secret_code = text + (parseInt(Date.now / 1000))
        accessToken = accessModule.md5(secret_code)

        return accessToken;

    },

   
    uploadFile: (request, cb) => {
        var path = accessModule.path.join(__dirname, "../../uploads" );
        var mode = "0777";
        var extension = request.file.hapi.filename.split('.').pop();

        console.log("Step 1 of uploading files the process started and user details collected");
        // console.log("wew-------", request)
        accessModule.async.waterfall([
            function (callback) {

                accessModule.fs.mkdir(path, mode, function (err, res) {
                    if (err) {

                        if (err.code == 'EEXIST') {
                            console.log("Step 2 of uploading files directory already exists for user");
                            callback(null, path)
                        } else {
                            callback(err)
                        }
                    } else {
                        console.log("Step 2 of uploading files new directory successfully created");
                        callback(null, path)
                    }
                })

            },

            function (file, callback) {

                console.log("Step 3 of uploading files writing the file stream to the directory");

                if (request.type == 'profile_pic') {

                    var filename = 'profile_pic_' + accessModule.moment().unix() + '.' + extension;

                } else if (request.type == 'modelNames') {

                    var filename = request.modelNames + '.' + extension;

                } else if (request.type == 'model_thumbnail') {

                    var filename = request.modelNames + '.' + extension;

                } else {


                }

                var writePath = path + '/' + filename;

                var fileStream = accessModule.fs.createWriteStream(writePath);

                fileStream.on('finish', function () {
                    console.log("Step 4 of uploading files finished writing stream", filename);
                    callback(null, filename)
                });

                request.file.pipe(fileStream);
            }
        ], function (err, res) {
            if (err) {
                console.log(err);
                cb(true)
            } else {
                cb(null, res)
            }
        })
    },
    
    checkDir(request, callback) {
        var path = accessModule.path.join(__dirname, "../../uploads/" + request.user_id);
        var mode = "0777";
        accessModule.fs.mkdir(path, mode, function (err, res) {
            if (err) {
                if (err.code == 'EEXIST') {
                    console.log("Step 2 of uploading files directory already exists for user");
                    callback(null, path)
                } else {
                    callback(err)
                }
            } else {
                console.log("Step 2 of uploading files new directory successfully created");
                callback(null, path)
            }
        })
    },

    errResponse: (h, err) => {
        console.log("Error============", err)
        var customErrorMessage;
        var codeVar = 201;
        if (err.output.payload.code == 400 || err.output.payload.statusCode == 400) { // bad request

            if (err.output.payload.validation.keys.length > 0) {

                if (err.output.payload.message.indexOf("[") > -1) {
                    customErrorMessage = err.output.payload.message.substr(err.output.payload.message.indexOf("["));
                } else {
                    customErrorMessage = err.output.payload.message;
                }
                customErrorMessage = customErrorMessage.replace(/"/g, '');
                customErrorMessage = customErrorMessage.replace('[', '');
                customErrorMessage = customErrorMessage.replace(']', '');

                //email message customise
                if (err.output.payload.validation.keys[0] == 'email') {
                    customErrorMessage = ' Please enter valid email, eg: test@gmail.com '
                }
                //accessToken message customise
                if (err.output.payload.validation.keys[0] == 'accessToken') {
                    codeVar = 203
                    customErrorMessage = '  Your session expired. Please login again to continue. '
                }
                return h.response({
                    code: codeVar,
                    status: false,
                    message: customErrorMessage
                }).takeover()

            } else {

                return h.response({
                    code: codeVar,
                    status: false,
                    message: 'Bad Request'
                }).takeover();
            }
        } else if (err.output.payload.code == 500) {
            return h.response({
                code: 500,
                status: false,
                message: 'Technical Error !!!! Please try again after some time.'
            }).takeover();
        } else {

            var messageText = err.details[0].message
            messageText = messageText.replace(/"/g, '');

            //accessToken message customise
            if (err.output.payload.validation.keys[0] == 'accessToken') {
                codeVar = 203
                messageText = ' Your session expired. Please login again to continue. '
            }
            return h.response({
                code: codeVar,
                status: false,
                message: messageText
            }).takeover();
        }
    },
    notification: (request) => {
        var objToFind = {}

        if (request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.RATING) {
            objToFind = {
                isBlocked: false,
                accessToken: {
                    $exists: true
                },
                _id: {
                    $in: request.receiver_id,
                }
            }
            request.clickActionType = 'open_main_screen'
        } else if (request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.UPDATEPROFILE) {
            objToFind = {
                isBlocked: false,
                accessToken: {
                    $exists: true
                },
                _id: {
                    _id: request.receiver_id
                }
            }
            request.clickActionType = 'open_main_screen'

         } else if (request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.BOOKHOTEL) {
            objToFind = {
                isBlocked: false,
                accessToken: {
                    $exists: true
                },
                _id: {
                    _id: request.receiver_id
                }
            }
            request.clickActionType = 'open_main_screen'
        
        } else if (request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.BOOKINGCANCEL) {
            objToFind = {
                isBlocked: false,
                accessToken: {
                    $exists: true
                },
                _id: {
                    _id: request.receiver_id
                }
            }
            request.clickActionType = 'open_main_screen'
        } else if (request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.REBOOKING) {
            objToFind = {
                isBlocked: false,
                accessToken: {
                    $exists: true
                },
                _id: {
                    _id: request.receiver_id
                }
            }
            request.clickActionType = 'open_main_screen'
        }

        // if (request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.CREATED) {
        //     objToFind = {
        //         isBlocked: false,
        //         accessToken: {
        //             $exists: true
        //         },
        //         _id: {
        //             $in: request.receiver_id,
        //         }
        //     }
        //     request.clickActionType = 'open_main_screen'
        // } else if (request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.LIKE) {
        //     objToFind = {
        //         isBlocked: false,
        //         accessToken: {
        //             $exists: true
        //         },
        //         _id: {
        //             _id: request.receiver_id
        //         }
        //     }
        //     request.clickActionType = 'open_main_screen'
        // } else if (request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.FOLLOW) {
        //     objToFind = {
        //         isBlocked: false,
        //         accessToken: {
        //             $exists: true
        //         },
        //         _id: {
        //             _id: request.receiver_id
        //         }
        //     }
        //     request.clickActionType = 'open_main_screen'
        // } else if (request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.UPDATEPROFILE || request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.ADDCERTIFICATION || request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.CREATE_SERVICES || request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.ADD_SERVICES || request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.PAYMENTSETUP) {
        //     objToFind = {
        //         _id: request.receiver_id
        //     }
        //     request.clickActionType = 'open_notification_screen'
        // } else if (request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.DONATEYBYDONOR || request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.CHARITYBYDONOR) {
        //     objToFind = {
        //         _id: request.receiver_id
        //     }
        //     request.clickActionType = 'open_notification_screen'

        // } else if (request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.SENT_INVITATION) {
        //     objToFind = {
        //         _id: request.receiver_id
        //     }
        //     request.clickActionType = 'open_notification_screen'

        // }
        // else if (request.type == accessModule.constants.SEND_NOTIFICATION_TYPES.SCANE_VOUCHER) {
        //     objToFind = {
        //         _id: request.receiver_id
        //     }
        //     request.clickActionType = 'open_notification_screen'

        // }
        // else if (request.type == 'MESSAGE') {

        //     objToFind = {
        //         _id: request.receiver_id
        //     }
        //     request.clickActionType = 'open_inbox_screen'

        // }

        console.log("++++++++++++", request, objToFind)

        if(request.rate_to){

            objToFind = {
                isBlocked: false,
                // accessToken: {
                //     $exists: true
                // },
                _id: {
                    $in: request.receiver_id,
                }
            }
            request.clickActionType = 'open_main_screen'


            accessModule.userModel.find(objToFind, {}, {}, function (err, res) {
                if (err) {
                    console.log("Error----------", err)
                } else {

                    if (res.length > 0) {

                        for (var i in res) {

                            for (var i in res) {
                                sendPushNotiAndSaveData(res[i], request)

                            }
                        }
                    } else {
                        console.log("No Transporter found")
                    }
                }
            })


        }else{


            accessModule.userModel.find(objToFind, {}, {}, function (err, res) {
                if (err) {
                    console.log("Error----------", err)
                } else {

                    if (res.length > 0) {

                        for (var i in res) {

                            for (var i in res) {
                                sendPushNotiAndSaveData(res[i], request)

                            }
                        }
                    } else {
                        console.log("No Transporter found")
                    }
                }
            })
        }
    },

}

function sendPushNotiAndSaveData(receiver, info) {

    //console.log("++++++ +++++++++++++++++++++++++++deviceToken +++++++",info)
    let title = info.hotelname ? info.hotelname : '';
    if (info.type && info.type == 'MESSAGE') {
        title = 'MESSAGE'
    } else if (info.type && info.type == 'RATING') {
        title = 'RATING'
    } else if (info.type && info.type == 'UPDATEPROFILE') {
        title = 'UPDATEPROFILE'
    }
    else if (info.type && info.type == 'BOOKHOTEL') {
        title = 'BOOKHOTEL'
    }
    else if (info.type && info.type == 'BOOKINGCANCEL') {
        title = 'BOOKINGCANCEL'
    }else if (info.type && info.type == 'REBOOKING') {
        title = 'REBOOKING'
    }
    var notification = {
        title: title,
        body: 'Notification',
        message: info.message,
        click_action: info.clickActionType
    }
    delete info.clickActionType;

    let sendData = Object.assign(notification, info)
    sendData.body = sendData.message;

    if (receiver.isNotification) {
        var message = { //this may vary according to the message type (single recipient, multicast, topic, creteria)
            to: receiver.deviceToken,
            notification: sendData,
            data: sendData
        };
      
        //console.log("SENDER daa------",message)
        //console.log("++++++++++server_key++++++++", server_key)

        var fcm = new FCM(server_key);
        fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!", err);
            } else {
                console.log({
                    status: true,
                    code: 200,
                    message: 'Successfully sent with response',
                    data: response,
                    dataSend: message
                })
                // callback(null, { status: true, code: 200, message: 'Successfully sent with response', data: response })
            }
        });

    } else {

        console.log("Notification set to false")
    }
    let obj = {
        sender: info.sender_id,
        receiver: receiver._id,
        notificationType: info.type,
        createdAt: accessModule.moment().unix(),
        message: info.message,
        paymentId: info.paymentId,
        message: info.message
    }

    accessModule.notificationModel(obj).save((err, res) => {
        err ? console.log("ERROR while saving data in notification") : console.log("SUCCESS, Data saved in notification..")

    })
}