const accessModule = require('../utils/index');
const commonFunctions = require('../utils/commonFunctions');
const bootstrapping = require('../utils/bootstraping');

module.exports = {


    login: (request, callback) => {
        accessModule.async.auto({

            checkEmail: (cb) => {

                //check if email already exists?
                obj = {
                    email: request.email,
                    role: accessModule.constants.USERTYPE.ADMIN
                }

                accessModule.userModel.find(obj, (err, res) => {
                    if (err) {
                        callback(err)
                    } else {

                        if (res.length > 0) {

                            if (res[0].password == accessModule.md5(request.password)) {

                                cb(null, res[0])

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

            },
            generateAccessToken: ['checkEmail', function (data, cb) {
                //generating jwt access token
                commonFunctions.createLoginToken(request, function (err, token) {
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, token)
                    }
                })

            }],
            gentoken: ['generateAccessToken', (data, cb) => {

                request.accessToken = commonFunctions.generate_access_token(15) + getTimeStamp();

                //user saving in db
                let obj = {
                    accessToken: data.generateAccessToken,
                    deviceToken: request.deviceToken,
                    deviceType: request.deviceType
                }
                accessModule.userModel.findOneAndUpdate({
                    _id: data.checkEmail._id
                }, obj, {
                    lean: true,
                    new: true
                }, (err, res) => {
                    delete res.password;
                    delete res.isActive;
                    delete res.isBlocked;
                    delete res.isVerified;

                    err ? callback(err) : cb(null, {
                        status: true,
                        message: accessModule.RESPONSES.MESSAGES.LOGIN_SUCCESS,
                        data: res
                    })

                })
            }]
        },
            function (err, res) {
                err ? callback(err) : callback(null, res.gentoken)
            })
    },

    update_profile: (request, callback) => {

        if (request.email != '') {
            if (request.email == request.userInfo.result.email) {
                request.email_change = false;
            } else {
                request.email_change = true;
            }
        } else {
            request.email = false;
        }
        accessModule.async.waterfall([
            function (cb) {
                if (request.email_change) {

                    accessModule.userModel.find({
                        email: request.email
                    }, (err, res) => {

                        if (err) {
                            callback(err)
                        } else {

                            if (res.length > 0) {

                                callback(null, {
                                    code: 201,
                                    status: false,
                                    message: request.email == res[0].email ? 'Email already registered.' : 'Username already exist.'
                                })

                            } else {
                                cb(null, request.email)
                            }
                        }
                    })
                } else {
                    cb(null, null)
                }
            },
            function (data, cb) {
                if (request.profilePic != '') {
                    request.type = 'profile_pic'
                    request.user_id = request.userInfo.result._id;
                    request.file = request.profilePic;
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
                if (request.password != '') {
                    if (request.userInfo.result.password == accessModule.md5(request.currentPassword)) {

                        cb(null, accessModule.md5(request.password));
                    } else {
                        callback(null, {
                            status: false,
                            message: accessModule.RESPONSES.MESSAGES.INCORRECT_PASSWORD
                        })
                    }

                } else {
                    cb(null, data)
                }
            },
            function (data, cb) {
                let obj = {};
               
                if (request.email_change) {
                    obj.email = request.email
                }
                if (request.password) {
                    obj.password = accessModule.md5(request.password);
                }
                if (request.fullName) {
                    obj.fullName = request.fullName;
                }
                if (request.profilePic != '') {
                    obj.profilePic = request.profilePic;
                }

                accessModule.userModel.findOneAndUpdate({
                    _id: request.userInfo.result._id
                }, obj, {
                    new: true
                }, function (err, res) {
                    err ? callback(err) : callback(null, {
                        status: true,
                        message: 'Profile updated successfully.',
                        data: res
                    })

                })
            }
        ], function (err, res) {
            err ? callback(err) : callback(null, res);
        })

    },

    change_password: function (request, callback) {

        accessModule.userModel.find({
            _id: request.userInfo.result._id
        }, {}, {}, function (err, res) {
            if (err) {
                callback(err)
            } else {
                if (res.length > 0) {

                    if (res[0].password == accessModule.md5(request.currentPassword)) {

                        accessModule.userModel.findOneAndUpdate({
                            _id: request.userInfo.result._id
                        }, {
                            password: accessModule.md5(request.password)
                        }, {}, function (err, res) {
                            if (err) {
                                callback(err)
                            } else {

                                callback(null, {
                                    status: true,
                                    message: accessModule.RESPONSES.MESSAGES.PASSWORD_CHANGED
                                })
                            }
                        })

                    } else {

                        callback(null, {
                            status: false,
                            message: accessModule.RESPONSES.MESSAGES.INCORRECT_PASSWORD
                        })

                    }
                } else {
                    callback(null, {
                        status: false,
                        message: 'Invalid User.'
                    })
                }
            }
        })
    },

   
    user_detail: function (request, callback) {

        accessModule.userModel.find({
            _id: request._id
        }, {}, {
            new: true,
            lean: true
        }).populate({
            path: 'user'
        }).exec(function (err, res) {
            if (res.length > 0) {
                res[0].mobileNumber = res[0].mobileNumber == undefined ? '' : res[0].mobileNumber;
                res[0].username = res[0].username == undefined ? '' : res[0].username;
                // res[0].categoryName = res[0].category.map(value => value['category_name'])
            }
            if (err) {
                callback(err)
            } else {
                callback(null, {
                    status: true,
                    code: 200,
                    message: 'Users list fetched successfully.',
                    data: res
                })
            }
        })
    },

   
    user_management: function (request, callback) {

        let obj = {
            isDeleted: false
        }
        obj.role = {
            $nin: [accessModule.constants.USERTYPE.USER]
        }

        if (request.search) {
            obj.$or = [{
                fullName: new RegExp(request.search, "i")
            }, {
                email: new RegExp(request.search, "i")
            }]
        }
        if (request.role != '') {
            obj.role = request.role
        }

        console.log("++++++++++++", obj)
        accessModule.async.auto({
            //total records 
            'totalrecords': (cb) => {

                accessModule.userModel.find(obj, {}, {}, function (err, res) {
                    console.log("ddfd", err)
                    if (err) {
                        cb(err)
                    } else {
                        cb(null, res.length)
                    }
                })

            },
            // data of users
            'users': ['totalrecords', (data, cb) => {

                accessModule.userModel.find(obj, {}, {
                    skip: request.skip,
                    limit: request.limit,
                    sort: {
                        createdAt: -1
                    },
                    lean: true,
                    new: true
                }, function (err, res) {
                    if (err) {
                        cb(err)
                    } else {

                        cb(null, {
                            status: true,
                            code: 200,
                            message: 'Users list fetched successfully.',
                            totalCount: data.totalrecords,
                            data: res
                        })
                    }
                })
            }]
        }, function (err, result) {
            if (err) {
                callback(err)
            } else {
                callback(null, result.users)
            }
        })
    },
    
    blockUnBlockUser: function (request, callback) {
        var obj = {
            isBlocked: request.block
        }
        if (request.block) {
            obj.$unset = {
                accessToken: 1
            }
        }
        accessModule.userModel.findOneAndUpdate({
            _id: request.user_id
        }, obj, {
            new: true
        }, function (err, res) {
            err ? callback(err) : callback(null, {
                status: true,
                code: 200,
                message: 'Success'
            })
        })
    },
    deleteUser: function (request, callback) {
        var obj = {
            isDeleted: true
        }
        obj.$unset = {
            accessToken: 1
        }
        accessModule.userModel.deleteMany({
            createdby: request.user_id
        }, function (err, res) {

                accessModule.userModel.deleteOne({
                    _id: request.user_id
                }, function (err, res) {

                    err ? callback(err) : callback(null, {
                        status: true,
                        code: 200,
                        message: 'User deleted successfully.'
                    })


                })
        });
    },
    
    logout: (request, callback) => {

        accessModule.userModel.findOneAndUpdate({
            _id: request.userInfo.result._id
        }, {
            $unset: {
                accessToken: 1
            }
        }, {}, function (err, res) {
            err ? callback(err) : res == null ? callback(null, accessModule.RESPONSES.sessionExpired()) : callback(null, {
                status: true,
                message: accessModule.RESPONSES.LOGOUT_SUCCESS
            })
        })
    },

    
    dashboard: (request, callback) => {
        accessModule.async.auto({
            userCount: function (cb) {
                accessModule.userModel.count({
                    role: {
                        $in: [
                            accessModule.constants.USERTYPE.USER,
                        ]
                    }

                }, function (err, res) {
                    err ? cb(err) : cb(null, res)
                })
            },
            
            sessions: ['userCount',function (data, cb) {
                accessModule.sessionModel.count({}, function (err, res) {
                    err ? cb(err) : cb(null, {
                        code: 200,
                        status: true,
                        data: {
                            userCount: data.userCount,
                          
                            sessions: res
                        }
                    })
                })
            }],


        }, function (err, result) {

            err ? callback(err) : callback(null, result.sessions)

        })
    },

}

function getTimeStamp() {
    return accessModule.moment().unix()
}