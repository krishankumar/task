var service = require('./service');
const accessModule = require('../utils/index');

module.exports = {

   
    register: (request) => {

        return new Promise(function (resolve, reject) {

            service.register(request.payload, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })

    },

    login: (request) => {

        return new Promise(function (resolve, reject) {


            if (request.payload.socialId && request.payload.socialId != '' && request.payload.loginType != accessModule.constants.LOGIN_TYPE.NORMAL) {

                service.socialLogin(request.payload, function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                })

            } else {

                service.login(request.payload, function (err, res) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(res);
                    }
                })
            }

        })

    },
    update_profile: (request) => {

        return new Promise(function (resolve, reject) {
            request.payload.file = request.payload.profilePic;
            if ((request.payload.user_id && request.payload.user_id != '') || request.payload.user_id != undefined) {
                request.payload.userInfo.result._id = request.payload.user_id
            }
            service.update_profile(request.payload, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })

    },

    dashboard: (request) => {

        return new Promise(function (resolve, reject) {

            service.dashboard(request.query, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })

    },
   
    logout: (request) => {

        return new Promise(function (resolve, reject) {

            service.logout(request.payload, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })

    },

    


    view_profile: (request) => {
        return new Promise(function (resolve, reject) {

            service.view_profile(request.query, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    },

   
}