const controller = require('./controller');
const service = require('./service');
const commonFunctions = require('../utils/commonFunctions');
const accessModule = require('../utils/index');


module.exports = [

     {
        path: '/v1/Admin/login',
        method: 'POST',
        config: {
            handler: async (request, h) => {

                let response = await controller.login(request);
                return h.response(accessModule.RESPONSES.MANAGE_RESP(response));

            },
            description: 'Api to login.',
            notes: 'Admin login api',
            tags: ['api'],
            validate: {
                payload: {

                    email: accessModule.joi.string().trim().lowercase().required(),
                    password: accessModule.joi.string().trim().required(),
                    deviceToken: accessModule.joi.string().required(),
                    role: accessModule.joi.string().required(),
                    deviceType: accessModule.joi.string().optional().allow('')
                        .valid(
                            accessModule.constants.DEVICE_TYPE.ANDROID,
                            accessModule.constants.DEVICE_TYPE.IOS,
                            accessModule.constants.DEVICE_TYPE.WEB)
                        .default(accessModule.constants.DEVICE_TYPE.WEB)

                },

                failAction: (request, h, err) => {
                    return commonFunctions.errResponse(h, err);
                }
            }

        }
    },
    {
        path: '/v1/Admin/updateProfile',
        method: 'POST',
        config: {
            handler: async (request, h) => {

                if (request.pre.userDetails.code == accessModule.RESPONSES.STATUS_CODE.SUCCESS) {

                    request.payload.userInfo = request.pre.userDetails;
                    let response = await controller.update_profile(request);
                    return h.response(accessModule.RESPONSES.MANAGE_RESP(response));

                } else {

                    return h.response(request.pre.userDetails);

                }
            },
            description: 'Api to update profile.',
            notes: 'in this api: pass only changed parameters',
            tags: ['api'],
            pre: [{
                method: commonFunctions.adminverifyLoginToken,
                assign: "userDetails"
            }],
            validate: {
                headers: accessModule.joi.object({
                    'x-logintoken': accessModule.joi.string().required().trim()
                }).options({
                    allowUnknown: true
                }),
                payload: {
                    email: accessModule.joi.string().optional().allow('').default(''),
                    // mobileNumber: accessModule.joi.string().optional().allow(''),
                    profilePic: accessModule.joi.any().optional().allow(''),
                    fullName: accessModule.joi.string().optional().allow(''),
                    currentPassword: accessModule.joi.string().optional().allow(''),
                    password: accessModule.joi.string().optional().allow(''),
                    // description: accessModule.joi.string().optional().allow(''),
                },
                failAction: (request, h, err) => {
                    return commonFunctions.errResponse(h, err);
                }
            },
            payload: {
                maxBytes: 10 * 1000 * 1000,
                parse: true,
                output: 'stream',
                timeout: false
            }
        }
    },
   
    {
        path: '/v1/Admin/logout',
        method: 'POST',
        config: {
            handler: async (request, h) => {

                if (request.pre.userDetails.code == accessModule.RESPONSES.STATUS_CODE.SUCCESS) {

                    request.payload.userInfo = request.pre.userDetails;

                    let response = await controller.logout(request);
                    return h.response(accessModule.RESPONSES.MANAGE_RESP(response));

                } else {

                    return h.response(request.pre.userDetails);

                }
            },
            description: 'Api to logout.',
            tags: ['api'],
            pre: [{
                method: commonFunctions.adminverifyLoginToken,
                assign: "userDetails"
            }],
            validate: {
                headers: accessModule.joi.object({
                    'x-logintoken': accessModule.joi.string().required().trim()
                }).options({
                    allowUnknown: true
                }),
                payload: {},
                failAction: (request, h, err) => { 
                    return commonFunctions.errResponse(h, err);
                }
            },


        }
    },
   
    {
        path: '/v1/Admin/dashboard',
        method: 'GET',
        config: {
            handler: async (request, h) => {

                if (request.pre.userDetails.code == accessModule.RESPONSES.STATUS_CODE.SUCCESS) {

                    request.query.userInfo = request.pre.userDetails;

                    let response = await controller.dashboard(request);
                    return h.response(accessModule.RESPONSES.MANAGE_RESP(response));


                } else {
                    return h.response(request.pre.userDetails);

                }

            },
            description: 'Api to get dashboard.',
            tags: ['api'],
            pre: [{
                method: commonFunctions.adminverifyLoginToken,
                assign: "userDetails"
            }],
            validate: {
                headers: accessModule.joi.object({
                    'x-logintoken': accessModule.joi.string().required().trim()
                }).options({
                    allowUnknown: true
                }),
                query: {

                },
                failAction: (request, h, err) => {
                    return commonFunctions.errResponse(h, err);
                }
            },
        }
    },

    {
        path: '/v1/Admin/userManagement',
        method: 'GET',
        config: {
            handler: async (request, h) => {



                if (request.pre.adminDetails.code == accessModule.RESPONSES.STATUS_CODE.SUCCESS) {

                    request.query.userInfo = request.pre.userDetails;

                    let response = await controller.user_management(request);
                    return h.response(accessModule.RESPONSES.MANAGE_RESP(response));


                } else {

                    return h.response(request.pre.userDetails);

                }

            },
            description: 'Api to get user lists.',
            tags: ['api'],
            pre: [{
                method: commonFunctions.adminverifyLoginToken,
                assign: "adminDetails"
            }],
            validate: {
                headers: accessModule.joi.object({
                    'x-logintoken': accessModule.joi.string().required().trim()
                }).options({
                    allowUnknown: true
                }),
                query: {

                    skip: accessModule.joi.number().required(),
                    role: accessModule.joi.string().required(),
                    search: accessModule.joi.string().optional().allow(''),
                    limit: accessModule.joi.number().required()
                },
                failAction: (request, h, err) => {
                    return commonFunctions.errResponse(h, err);
                }
            },
        }
    },
    

    {
        path: '/v1/Admin/deleteUser',
        method: 'POST',
        config: {
            handler: async (request, h) => {

                if (request.pre.userDetails.code == 200) {

                    request.payload.userInfo = request.pre.userDetails;
                    let response = await controller.deleteUser(request);
                    return h.response(response);

                } else {

                    return h.response(request.pre.userDetails);

                }
            },
            description: 'Api to delete parent & child with apps.',
            tags: ['api'],
            pre: [{
                method: commonFunctions.adminverifyLoginToken,
                assign: "userDetails"
            }],
            validate: {
                headers: accessModule.joi.object({
                    'x-logintoken': accessModule.joi.string().required().trim()
                }).options({
                    allowUnknown: true
                }),
                payload: {
                    user_id: accessModule.joi.string().required()
                },
                failAction: (request, h, err) => {
                    return commonFunctions.errResponse(h, err);
                }
            },
        }
    },
    
       
    
    {
        path: '/v1/Admin/user_detail',
        method: 'GET',
        config: {
            handler: async (request, h) => {

                if (request.pre.userDetails.code == 200) {

                    request.query.userInfo = request.pre.userDetails;
                    let response = await controller.user_detail(request);
                    return h.response(response);

                } else {

                    return h.response(request.pre.userDetails);

                }

            },
            description: 'Api to get user deatils.',
            tags: ['api'],
            pre: [{
                method: commonFunctions.adminverifyLoginToken,
                assign: "userDetails"
            }],
            validate: {
                headers: accessModule.joi.object({
                    'x-logintoken': accessModule.joi.string().required().trim()
                }).options({
                    allowUnknown: true
                }),
                query: {

                    _id: accessModule.joi.string().required(),

                },
                failAction: (request, h, err) => {
                    return commonFunctions.errResponse(h, err);
                }
            },
        }
    },
    


]