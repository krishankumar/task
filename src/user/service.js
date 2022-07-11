const accessModule = require('../utils/index');
const commonFunctions = require('../utils/commonFunctions');
const bootstraping = require('../utils/bootstraping');
const sgMail = require('@sendgrid/mail');

module.exports = {

    register: (request, callback) => {

        accessModule.async.auto({


            checkEmail: (cb) => {

                if (request.email) {
                    //check if email already exists?
                    accessModule.userModel.find({
                        isDeleted: false,
                        $or: [{
                            email: request.email,
                            role: request.role
                        },]
                    }, (err, res) => {
                        if (err) {
                            callback(err)
                        } else {

                            if (res.length > 0) {
                                callback(null, {
                                    status: false,
                                    message: accessModule.RESPONSES.MESSAGES.EMAIL_ALREADY_REGISTERED
                                })
                            } else {

                                if (request.email) {
                                    if (!request.password) {
                                        callback(null, {
                                            status: false,
                                            message: accessModule.RESPONSES.MESSAGES.PASSWORD_REQUIRED
                                        })

                                    } else {
                                        cb(null, null)

                                    }

                                } else {

                                    cb(null, null)
                                }
                            }
                        }
                    })
                } else {

                    cb(null, null)

                }
            },
            checkPhone: (cb) => {
                //check if mbile already exists?

                if (request.mobileNumber) {
                    accessModule.userModel.find({
                        isDeleted: false,
                        $or: [{
                            mobileNumber: request.mobileNumber
                        },]
                    }, (err, res) => {
                        if (err) {
                            callback(err)
                        } else {

                            if (res.length > 0) {
                                callback(null, {
                                    status: false,
                                    message: accessModule.RESPONSES.MESSAGES.MOBILE_ALREADY_REGISTERED
                                })
                            } else {
                                cb(null, null)
                            }
                        }
                    })
                } else {
                    cb(null, null)
                }
            },
            generateAccessToken: ['checkEmail', 'checkPhone', function (data, cb) {

                if (request.email === '' && request.mobileNumber === '') {

                    callback(null, {
                        status: false,
                        message: accessModule.RESPONSES.MESSAGES.INVALID_INPUT
                    })

                } else {
                    //generating jwt access token
                    commonFunctions.createLoginToken({
                        role: request.role,
                        email: request.email
                    }, function (err, token) {
                        if (err) {
                            cb(err)
                        } else {
                            cb(null, token)
                        }
                    })
                }

            }],
            saveUser: ['generateAccessToken', (data, cb) => {
                request.adminAccess = request.password;
                request.password = accessModule.md5(request.password);
                request.accessToken = data.generateAccessToken;
                request.otp =  commonFunctions.getRandomNum(4);
                request.role = request.role;

                if (request.longitude != null && request.latitude != null && request.longitude != '' && request.latitude != '') {

                    request.address = {
                        type: "Point",
                        coordinates: [request.longitude, request.latitude]
                    }
                }

                if (request.bussiness_latitude != null && request.bussiness_latitude != '' && request.bussiness_longitude != null && request.bussiness_longitude != '') {

                    request.bussiness_address = {
                        type: "Point",
                        coordinates: [request.bussiness_longitude, request.bussiness_latitude]
                    }
                }
                // if (request.category == '') {
                //     delete request.category;
                // }
                request.createdAt = getTimeStamp()
                //user saving in db
                accessModule.userModel(request).save((err, res) => {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, res)
                    }


                })
            }],
            
            updateProfile: ['saveUser', (data, cb) => {
                console.log("Profile Pic------", request)
                if (request.profileImage && request.profileImage != '') {

                    request.type = 'profile_pic'
                    request.user_id = data.saveUser._id;
                    request.file = request.profileImage;

                    commonFunctions.uploadFile(request, function (err, res) {
                        if (err) {
                            cb(err)
                        } else {

                            request.profileImage = res;
                            accessModule.userModel.findOneAndUpdate({
                                _id: data.saveUser._id
                            }, {
                                profilePic: request.profileImage
                            }, {
                                new: true
                            }, (err, res) => {

                                err ? cb(err) : cb(null, {
                                    status: true,
                                    message: request.role == accessModule.constants.USERTYPE.DONOR ? `Registration successful. A verification link has been sent to your email. Verify that link to login.` : accessModule.RESPONSES.MESSAGES.REGISTER_SUCCESS,
                                    data: {

                                        email: res.email,
                                        fullName: res.fullName,
                                        mobileNumber: res.mobileNumber,
                                        countryCode: res.countryCode,
                                        flag: res.flag,
                                        profilePic: res.profilePic != '' ? res.profilePic : "",
                                        _id: res._id,
                                        role: res.role,
                                        otp: request.email === '' ? res.otp : '',
                                        deviceToken: res.deviceToken,
                                        deviceType: res.deviceType,
                                        deviceModal: res.deviceModal,
                                        accessToken: res.accessToken,
                                       

                                    }

                                })
                            })
                        }
                    })
                } else {

                    data.saveUser.play_store_link = accessModule.appConstants.play_store_link;
                    data.saveUser.support_email = accessModule.appConstants.support_email;
                    data.saveUser.profilePic = '';
                    cb(null, {
                        status: true,
                        message: request.role == accessModule.constants.USERTYPE.LAWYER ? `Registration successful. A verification link has been sent to your email. Verify that link to login.` : accessModule.RESPONSES.MESSAGES.REGISTER_SUCCESS,
                        data:
                        {
                            email: data.saveUser.email,
                            fullName: data.saveUser.fullName,
                            countryCode: data.saveUser.countryCode,
                            flag: data.saveUser.flag,
                            mobileNumber: data.saveUser.mobileNumber,
                            profilePic: data.saveUser.profilePic != '' ? data.saveUser.profilePic : "",
                            _id: data.saveUser._id,
                            otp: request.email === '' ? data.saveUser.otp : '',
                            role: data.saveUser.role,
                            deviceToken: data.saveUser.deviceToken,
                            deviceType: data.saveUser.deviceType,
                            deviceModal: data.saveUser.deviceModal,
                            accessToken: data.saveUser.accessToken,

                        }
                    })
                }
            }],
        },
            function (err, res) {
                var objTOSent = res.updateProfile
             
                err ? callback(err) : callback(null, objTOSent)
            })
    },
    login: (request, callback) => {

        accessModule.async.auto({

            checkEmail: (cb) => {
                if (request.email) {
                    //check if email already exists?
                    let obj = {
                        $or: [
                           
                            {
                                email: request.email,
                                isDeleted: false,
                                role: request.role
                            }
                        ],
                        // role: request.role
                    }

                    accessModule.userModel.find(obj, (err, res) => {

                        if (err) {
                            callback(err)
                        } else {
                            if (res.length > 0) {
                                if (res[0].password == accessModule.md5(request.password)) {
                                    if (!res[0].isBlocked) {
                                        if (res[0].role == accessModule.constants.USERTYPE.DONOR) {
                                            res[0].is_phone_verified == 1 ? cb(null, res[0]) : callback(null, {
                                                status: false,
                                                message: accessModule.RESPONSES.MESSAGES.VERIFY_ACCOUNT
                                            })

                                        } else {
                                            cb(null, res[0])
                                        }

                                    } else {
                                        callback(null, accessModule.RESPONSES.userBlocked())
                                    }

                                } else {

                                    callback(null, {
                                        status: false,
                                        message: accessModule.RESPONSES.MESSAGES.INCORRECT_PASSWORD
                                    })
                                }

                            } else {
                                callback(null, {
                                    status: false,
                                    message: accessModule.RESPONSES.MESSAGES.EMAIL_NOT_RESGISTERED
                                })
                            }

                        }
                    })
                } else {

                    cb(null, null)
                }

            },
            checkPhone: (cb) => {

                if (request.mobileNumber) {
                    //check if email already exists?
                    let obj = {
                        $or: [
                           
                            {
                                mobileNumber: request.mobileNumber,
                                isDeleted: false,
                                role: request.role
                            }
                        ],
                        // role: request.role
                    }

                    accessModule.userModel.find(obj, (err, res) => {

                        if (err) {
                            callback(err)
                        } else {
                            if (res.length > 0) {
                                if (!res[0].isBlocked) {
                                    if (res[0].role == accessModule.constants.USERTYPE.DONOR) {
                                        res[0].is_phone_verified == 1 ? cb(null, res[0]) : callback(null, {
                                            status: false,
                                            message: accessModule.RESPONSES.MESSAGES.VERIFY_ACCOUNT
                                        })

                                    } else {
                                        cb(null, res[0])
                                    }

                                } else {
                                    callback(null, accessModule.RESPONSES.userBlocked())
                                }

                            } else {
                                callback(null, {
                                    status: false,
                                    message: accessModule.RESPONSES.MESSAGES.INVALID_USER
                                })
                            }

                        }
                    })
                } else {

                    cb(null, null)
                }

            },
            generateAccessToken: ['checkEmail', 'checkPhone', function (data, cb) {


                if (request.email == '' && request.mobileNumber == '') {

                    callback(null, {
                        status: false,
                        message: accessModule.RESPONSES.MESSAGES.INVALID_USER
                    })

                } else {

                    let obj = {}
                    if (request.email) {
                        obj = { email: request.email }


                    }

                    if (request.mobileNumber) {
                        obj = { mobileNumber: request.mobileNumber }


                    }


                    //generating jwt access token
                    commonFunctions.createLoginToken({
                        obj
                    }, function (err, token) {
                        if (err) {
                            cb(err)
                        } else {
                            cb(null, token)
                        }
                    })
                }

            }],
            gentoken: ['generateAccessToken', (data, cb) => {

                // request.accessToken = commonFunctions.generate_access_token(15) + getTimeStamp();

                //user saving in db
                let obj = {
                    accessToken: data.generateAccessToken,
                    deviceToken: request.deviceToken,
                    deviceType: request.deviceType,
                    appVersion: request.appVersion,
                    deviceModal: request.deviceModal,
                    deviceVersion: request.deviceVersion,
                    deviceManufacturer: request.deviceManufacturer,
                }

                let objLogin = {}
                if (request.email) {
                    objLogin = { _id: data.checkEmail._id }


                }

                if (request.mobileNumber) {
                    objLogin = { _id: data.checkPhone._id }


                }
                accessModule.userModel.findOneAndUpdate(
                    objLogin
                    , obj, {
                    new: true,
                    lean: true
                }, (err, res) => {
                    if (err) {
                        callback(err)
                    } else {
                     
                        cb(null, {
                            status: true,
                            message: accessModule.RESPONSES.MESSAGES.LOGIN_SUCCESS,
                            data:
                            {

                                email: res.email,
                                fullName: res.fullName,
                                mobileNumber: res.mobileNumber,
                                countryCode: res.countryCode,
                                otp: res.otp,
                                flag: res.flag,
                                profilePic: res.profilePic != '' ? res.profilePic : "",
                                _id: res._id,
                                role: res.role,
                                deviceToken: res.deviceToken,
                                deviceType: res.deviceType,
                                deviceModal: res.deviceModal,
                                accessToken: res.accessToken,

                            }
                        })
                    }
                })
            }],
        },
            function (err, res) {

                err ? callback(err) : callback(null, res.gentoken)
            })
    },
   update_profile: (request, callback) => {
        if (request.email != '' && (request.email != request.userInfo.result.email)) {
            request.changeEmail = true
        }
      
        if (request.mobileNumber != '' && (request.mobileNumber != request.userInfo.result.mobileNumber)) {
            request.changeMobileNumber = true
        }
       
        accessModule.async.waterfall([
            function (cb) {
               
                    cb(null, null)
            },
            function (data, cb) {
                if (request.changeEmail) {

                    accessModule.userModel.find({
                        email: request.email
                    }, (err, res) => {

                        if (err) {
                            callback(err)
                        } else {

                            if (res.length > 0) {

                                callback(null, {
                                    status: false,
                                    message: 'Email already exist.'
                                })

                            } else {
                                cb(null, request.username)
                            }
                        }
                    })
                } else {
                    cb(null, null)
                }
            },
            function (data, cb) {

                if (request.changeMobileNumber) {

                    accessModule.userModel.find({
                        $or: [{
                            mobileNumber: request.mobileNumber
                        }, {
                            bussiness_phoneNumber: request.mobileNumber
                        }]
                    }, (err, res) => {

                        if (err) {
                            callback(err)
                        } else {

                            if (res.length > 0) {

                                if (res[0]._id.toString() != request.userInfo.result._id.toString()) {
                                    callback(null, {
                                        status: false,
                                        message: 'Mobile number already exist.'
                                    })
                                } else {
                                    cb(null, request.username)
                                }

                            } else {
                                cb(null, request.username)
                            }
                        }
                    })
                } else {
                    cb(null, null)
                }
            },
            function (data, cb) {

                if (request.changeBussinessNumber) {

                    accessModule.userModel.find({
                        $or: [{
                            mobileNumber: request.bussiness_phoneNumber
                        }, {
                            bussiness_phoneNumber: request.bussiness_phoneNumber
                        }]

                    }, (err, res) => {

                        if (err) {
                            callback(err)
                        } else {
                            if (res.length > 0) {
                                if (res[0]._id.toString() != request.userInfo.result._id.toString()) {
                                    callback(null, {
                                        status: false,
                                        message: 'Bussiness number already exist.'
                                    })
                                } else {
                                    cb(null, request.username)
                                }

                            } else {
                                cb(null, request.username)
                            }
                        }
                    })
                } else {
                    cb(null, data)
                }
            },
            function (data, cb) {
                if ((request.profilePic && request.profilePic != '') || request.profilePic != undefined) {
                    request.file = request.profilePic;
                    request.type = 'profile_pic'
                    request.user_id = request.userInfo.result._id;
                    commonFunctions.uploadFile(request, function (err, res) {
                        if (err) {
                            cb(err)
                        } else {
                            request.profilePic = res;
                            cb(null, res)
                        }
                    })
                } else {
                    cb(null, data)
                }
            },

            function (data, cb) {
                let obj = {};
                if (request.latitude && request.latitude != null && request.longitude != null && request.longitude) {
                    obj.address_name = request.address_name;
                    obj.address = {
                        type: "Point",
                        coordinates: [request.latitude, request.longitude]
                    }
                }

                if (request.bussiness_latitude && request.bussiness_latitude != null && request.bussiness_longitude != null && request.bussiness_longitude) {

                    obj.bussiness_address = {
                        type: "Point",
                        coordinates: [request.bussiness_longitude, request.bussiness_latitude]
                    }
                }

                obj.bussiness_address_name = request.bussiness_address_name;
                obj.address_name = request.address_name;

                if (request.changeEmail) {
                    obj.email = request.email
                }
                if (request.changeMobileNumber) {
                    obj.mobileNumber = request.mobileNumber;
                }
                if (request.changeBussinessNumber) {
                    obj.bussiness_phoneNumber = request.bussiness_phoneNumber;
                }
                if (request.bussiness_website) {
                    obj.bussiness_website = request.bussiness_website;
                }
                if (request.bar_asso_code) {
                    obj.bar_asso_code = request.bar_asso_code;
                }
                if (request.changeUsername) {
                    obj.username = request.username;
                }
                if (request.profilePic && request.profilePic != '') {
                    obj.profilePic = request.profilePic;
                }
                if (request.flag) {
                    obj.flag = request.flag;
                }
               
                if (request.countryCode != '') {
                    obj.countryCode = request.countryCode;
                }
                
                if (request.fullName != '') {
                    obj.fullName = request.fullName;
                }

                obj.description = request.description;

                if (request.category != '' && request.userInfo.result.role == accessModule.constants.USERTYPE.LAWYER) {
                    obj.category = request.category
                }
                request.updatedAt = getTimeStamp()

                accessModule.userModel.findOneAndUpdate({
                    _id: request.userInfo.result._id
                }, obj, {
                    new: true
                }, function (err, res) {
                    if (res != null) {
                        request.imgURL = accessModule.appConstants.protocol + accessModule.appConstants.host + '/images/' + res._id + '/' + res.profilePic;

                    }
                    err ? callback(err) : cb(null, {
                        status: true,
                        message: 'Profile updated successfully.',
                        data: {

                                email: res.email,
                                fullName: res.fullName,
                                mobileNumber: res.mobileNumber,
                                countryCode: res.countryCode,
                                flag: res.flag,
                                profilePic: res.profilePic != '' ? res.profilePic : "",
                                _id: res._id,
                                role: res.role,
                                isEmailNotification: res.isEmailNotification,
                                isPushNotification: res.isPushNotification,
                                deviceToken: res.deviceToken,
                                deviceType: res.deviceType,
                                deviceModal: res.deviceModal,
                                accessToken: res.accessToken,
                        }
                    })

                })
            },
           
        ], function (err, res) {
            err ? callback(err) : callback(null, res);
        })

    },

    logout: (request, callback) => {
        accessModule.userModel.findOneAndUpdate({
            _id: request.userInfo.result._id
        }, {
            $unset: {
                accessToken: 1
            }
        }, {
            new: true
        }, function (err, res) {
            err ? callback(err) : callback(null, {
                status: true,
                message: accessModule.RESPONSES.MESSAGES.LOGOUT_SUCCESS
            })
        })
    },

    get_profile: (request, callback) => {

        accessModule.userModel.find({
            _id: request.userInfo.result._id
        }, {
            __v: 0,
            password: 0,
            isCardDetailsFilled: 0
        }, {
            lean: true,
            new: true
        })
        .exec(function (err, res) {

                if (err) {
                    callback(err)
                } else {
                    accessModule.ratingModel.find({
                        ratedTo: request.user_id
                    }, {

                    }, {
                        sort: {
                            createdAt: -1
                        },
                        lean: true,
                        new: true
                  
                    }).exec(function (err, certification) {
                        if (res.length > 0) {
                            delete res[0].verificationToken;
                        }


                        err ? callback(err) : (res.length == 0) ? callback(null, {
                            status: false,
                            message: accessModule.RESPONSES.MESSAGES.INVALID_USER
                        }) : callback(null, {
                            status: true,
                            message: accessModule.RESPONSES.MESSAGES.SUCCESS,
                            data: {

                                email: res[0].email,
                                fullName: res[0].fullName,
                                mobileNumber: res[0].mobileNumber,
                                countryCode: res[0].countryCode,
                                flag: res[0].flag,
                                profilePic: res[0].profilePic != '' ? res[0].profilePic : "",
                                _id: res[0]._id,
                                role: res[0].role,
                                isEmailNotification: res[0].isEmailNotification,
                                isPushNotification: res[0].isPushNotification,
                                deviceToken: res[0].deviceToken,
                                deviceType: res[0].deviceType,
                                deviceModal: res[0].deviceModal,
                                accessToken: res[0].accessToken,

                            },

                        })
                    })


                }

            })
    },
   
}

function getTimeStamp() {
    return accessModule.moment().unix()
}

function jsUcfirst(string) 
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}