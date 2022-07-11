
export const environment = {
  production: false,
  SERVER_URL: "http://3.136.252.37:5007/v1/",
  IMG_BASE_URL: "http://3.136.252.37:5007",
  STATUS_CODE: {
  
    SUCCESS: {
      CODE: 200,
      MESSAGE: 'SUCCESS'
    },
    FAILURE: {
      CODE: 201,
      MESSAGE: 'ERROR'
    },
    SESSION_EXPIRE: {
      CODE: 203,
      MESSAGE: 'SUCCESS'
    },
    DATA_NOT_FOUND: {
      CODE: 202,
      MESSAGE: 'SUCCESS'
    },
    INTERNEL_SERVER_ERROR: {
      CODE: 500,
      MESSAGE: 'ERROR'
    },
    API_NOT_FOUND: {
      CODE: 404,
      MESSAGE: 'ERROR'
    },
  }
};

