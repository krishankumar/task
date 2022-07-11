

'use strict';

var STATUS_CODE = {

    SUCCESS: 200,
    ERROR: 201,
    SESSION_EXPIRE: 203,
    DATA_NOT_FOUND: 202,
    ROLE_UNDEFINED: 205,
    BLOCKEDBYADMIN: 204,
    FOR_LOGGEDIN_NOT: 208,
    INVALID_PATH_ACCESS: 404,

}


var MESAGES = {

    DATA_NOT_FOUND: 'DATA NOT FOUND',

    LOGIN_SUCCESS: 'User logged in successfully.',

    REGISTER_SUCCESS: 'Thank you for your registration! Your account is now ready to use.',

    INCORRECT_PASSWORD: 'Please enter correct password.',

   


}

module.exports = {

    MESSAGES: MESAGES,

    STATUS_CODE: STATUS_CODE,

    MANAGE_RESP: function (request) {
        // message, data, totalCount
        let response = {};

        if (request.status) { //STATUS TRUE

            if (request.data != undefined) {

                response["code"] = (request.data.length != 0) ? STATUS_CODE.SUCCESS : STATUS_CODE.DATA_NOT_FOUND
                response["message"] = (request.data.length != 0) ? request.message : MESAGES.DATA_NOT_FOUND
                response["status"] = request.status;

                if (Array.isArray(request.data)) {

                    if (request.totalCount != undefined) {
                        response["totalCount"] = request.totalCount
                    }
                    response["data"] = request.data;


                } else {

                    response["result"] = request.data
                }

            } else {

                response["code"] = STATUS_CODE.SUCCESS
                response["message"] = request.message
                response["status"] = request.status;

            }
        } else { //STATUS FALSE

            response["code"] = STATUS_CODE.ERROR
            response["message"] = request.message
            response["status"] = request.status;

        }

        return response;

    },

    warning: function (reply, message, data) {
        if (data) {
            reply({
                status: false,
                code: STATUS_CODE.ERROR,
                message: message,
                data: data
            });
        } else {
            reply({
                status: false,
                statusCode: STATUS_CODE.ERROR,
                message: message
            });
        }

    },
   
    sessionExpired: function () {
        let obj = {
            status: false,
            code: 203,
            message: "Your session is expired. Please login again to continue."
        }
        return obj;
    },

    unauthorizedUser: function (reply) {
        reply({
            status: false,
            statusCode: 401,
            message: "You are not authorized user."
        });
    }

};