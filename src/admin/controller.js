var service = require('./service');
const accessModule = require('../utils/index');

module.exports = {


   
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
    user_detail: (request) => {

        return new Promise(function (resolve, reject) {

            service.user_detail(request.query, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    },
   
    user_management: (request) => {

        return new Promise(function (resolve, reject) {

            service.user_management(request.query, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    },


    deleteUser: (request) => {

        return new Promise(function (resolve, reject) {

            service.deleteUser(request.payload, function (err, res) {
                if (err) {
                    reject(err);
                } else {
                    resolve(res);
                }
            })
        })
    },
    
}