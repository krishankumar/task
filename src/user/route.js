const controller = require('./controller');
const service = require('./service');
const accessModule = require('../utils/index');
const commonFunctions = require('../utils/commonFunctions');

module.exports = [

    {
        path: '/v1/User/register',
        method: 'POST',
        config: {
            handler: async (request, h) => {

                let response = await controller.register(request);
                return h.response(accessModule.RESPONSES.MANAGE_RESP(response));

            },
            description: 'Api to register User in db.',
            tags: ['api'],
            notes: "role:-  ADMIN, USER",
            validate: {
                payload: {

                   
                    fullName: accessModule.joi.string().trim().optional().allow('').default(''),
                    email: accessModule.joi.string().email().trim().lowercase().optional().allow('').default(''),
                    countryCode: accessModule.joi.string().trim().optional().allow('').default(''),
                    flag: accessModule.joi.string().trim().optional().allow('').default(''),

                    mobileNumber: accessModule.joi.string().trim().optional().allow('').default(''),
                    password: accessModule.joi.string().trim().optional().allow('').default(''),
                    deviceToken: accessModule.joi.string().required(),
                    deviceType: accessModule.joi.string().required().valid(accessModule.constants.DEVICE_TYPE.ANDROID, accessModule.constants.DEVICE_TYPE.IOS).default(accessModule.constants.DEVICE_TYPE.IOS),
                    deviceModal: accessModule.joi.string().required(),
                    role: accessModule.joi.string().valid(accessModule.constants.USERTYPE.USER, accessModule.constants.USERTYPE.ADMIN).default(accessModule.constants.USERTYPE.USER).required(),

                },
                failAction: (request, h, err) => {
                    return commonFunctions.errResponse(h, err);

                }
            },
            // payload: {
            //     maxBytes: 15 * 1000 * 1000,
            //     parse: true,
            //     output: 'stream',
            //     timeout: false
            // }
        }
    },

    {
        path: '/v1/User/login',
        method: 'POST',
        config: {
            handler: async (request, h) => {

                let response = await controller.login(request);

                if (response.code == 205 || response.code == 204) {
                    return h.response(response)
                } else {
                    return h.response(accessModule.RESPONSES.MANAGE_RESP(response));

                }

            },
            description: 'Api to login either normal or social .',
            tags: ['api'],
            validate: {
                payload: {

                    fullName: accessModule.joi.string().lowercase().optional().allow(''),
                    email: accessModule.joi.string().email().trim().lowercase().optional().allow(''),
                    socialId: accessModule.joi.string().trim().lowercase().optional().allow(''),
                    //socialType: accessModule.joi.string().trim().lowercase().optional().allow(''),
                    loginType: accessModule.joi.string()
                    .allow(
                        accessModule.constants.LOGIN_TYPE.NORMAL,
                        accessModule.constants.LOGIN_TYPE.GOOGLE,
                        accessModule.constants.LOGIN_TYPE.FACEBOOK,
                        accessModule.constants.LOGIN_TYPE.APPLE
                    ).required().default(accessModule.constants.LOGIN_TYPE.NORMAL),
                    password: accessModule.joi.string().trim().optional().allow(''),
                    countryCode: accessModule.joi.string().trim().optional().allow('').default(''),
                    flag: accessModule.joi.string().trim().optional().allow('').default(''),
                    mobileNumber: accessModule.joi.string().trim().optional().allow('').default(''),
                    role: accessModule.joi.string().valid(accessModule.constants.USERTYPE.USER, accessModule.constants.USERTYPE.ADMIN).default(accessModule.constants.USERTYPE.USER).required(),
                    deviceToken: accessModule.joi.string().optional().allow(''),
                    deviceType: accessModule.joi.string().required().valid(accessModule.constants.DEVICE_TYPE.ANDROID, accessModule.constants.DEVICE_TYPE.IOS).default(accessModule.constants.DEVICE_TYPE.IOS),
                    deviceModal: accessModule.joi.string().required(),
                },

                failAction: (request, h, err) => {
                    return commonFunctions.errResponse(h, err);
                }
            },

        }
    },

    {
        path: '/v1/User/logout',
        method: 'PUT',
        config: {
            handler: async (request, h) => {

                if (request.pre.userDetails.code == accessModule.RESPONSES.STATUS_CODE.SUCCESS) {
                    request.payload = {}
                    request.payload.userInfo = request.pre.userDetails;

                    let response = await controller.logout(request);
                    return h.response(accessModule.RESPONSES.MANAGE_RESP(response));


                } else {

                    return h.response(request.pre.userDetails);

                }
            },
            description: 'Api to logout.',
            notes: 'Request payload must contain.<br> <b>x-logintoken </b>: accessToken of donor',
            tags: ['api'],
            pre: [{
                method: commonFunctions.verifyLoginToken,
                assign: "userDetails"
            }],
            validate: {
                headers: accessModule.joi.object({
                    'x-logintoken': accessModule.joi.string().required().trim()
                }).options({
                    allowUnknown: true
                }),

                failAction: (request, h, err) => {
                    return commonFunctions.errResponse(h, err);
                }
            },
            plugins: {
                'hapi-swagger': {
                    payloadType: 'form',
                }
            }
        }
    },

    {
        path: '/v1/User/updateProfile',
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
            description: 'Api to update user profile.',
            tags: ['api'],
            pre: [{
                method: commonFunctions.verifyLoginToken,
                assign: "userDetails"
            }],
            validate: {
                headers: accessModule.joi.object({
                    'x-logintoken': accessModule.joi.string().required().trim()
                }).options({
                    allowUnknown: true
                }),
                payload: {
                    fullName: accessModule.joi.string().trim().lowercase().required(),
                    profilePic: accessModule.joi.any().optional().allow(''),
                    email: accessModule.joi.string().optional().allow('').default(''),
                    countryCode: accessModule.joi.string().trim().optional().allow('').default(''),
                    flag: accessModule.joi.string().trim().optional().allow('').default(''),
                    mobileNumber: accessModule.joi.string().optional().allow('').default(''),

                },
                failAction: (request, h, err) => {
                    return commonFunctions.errResponse(h, err);
                }
            },
            payload: {
                maxBytes: 15 * 1000 * 1000,
                parse: true,
                output: 'stream',
                timeout: false
            }
        }
    },
   
]