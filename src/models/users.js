
 //user schema
var mongoose = require('mongoose').set('debug',require('../../env').instance == 'local'? true: false);
var moment   = require('moment');
var Schema   = mongoose.Schema;
var CONSTANTS=  require('../../configs/constants');
const { number } = require('joi');

var userSchema = new Schema({
   
    username                : { type: String,  default:''  },
    fullName                : { type: String,  default:'' },
    name                    : { type: String,  default:'' },
    description             : { type: String,  default:'' },
    firstName                : { type: String, default:'' },
    lastName                : { type: String,  default:'' },
    email                   : { type: String,  default:'' }, 
    profilePic              : { type: String,  default:'' },
    password                : { type: String },
    createdAt               : { type: Number },
    isDeleted               : { type: Boolean, default: false },
    isBlocked               : { type: Boolean, default: false },
    isBlockedByAdmin               : { type: Boolean, default: false },
    isActive                : { type: Boolean, default: true },
    //isActivity              : { type: Boolean, default: true },
    isVerified              : { type: Boolean, default: false },
    verificationToken       : { type: String },
  
    deviceToken             : { type: String },
    deviceType              : { type: String },
    appVersion              : { type: String },
    deviceModal             : { type: String },   
    deviceManufacturer      : { type: String },   
    deviceVersion           : { type: String },   

    adminAccess             : { type: String },
    accessToken             : { type: String },
    mobileNumber            : { type: String },
    countryCode             : { type: String },
    flag                    : { type: String },
    isNotification          : { type: Boolean, default: true },
    role                    : { type: String, default: CONSTANTS.USERTYPE.USER }, // User,  Employer, Employee, Admin
    address                 : { type:   { type: String, enum: "Point", default: "Point" }, coordinates: { type: [Number], default: [0, 0] }},
    address_name            : { type: String , default:''},
    socialId                : { type: String },
    loginType               : { type: String },

   
    createdBy               : { type: Schema.Types.ObjectId, ref: 'user' },
    // recoveryEmail           : { type: String , default:''},
    // recoveryMobile          : { type: String , default: ''},
    otp                     : { type: String },
    // isRecoveryEmailVerified : { type: Boolean, default: false },
    // is_phone_verified       : { type: Number, default: 0 },    
    // isOtpVerified           : { type: Boolean, default: false },
    // isRecoverMobileVerified : { type: Boolean, default: false },
    // isCardDetailsFilled     : { type: Boolean, default: false },
    // isPaymentNotification   : { type: Boolean, default: true },

    isEmailNotification     : { type: Boolean, default: true },
    isPushNotification      : { type: Boolean, default: true },
    // isEmailAllNotification     : { type: Boolean, default: true },   //true | false - send email all notificaion   
    // isEmailAcivityNotification     : { type: Boolean, default: true }, //true | false - send activity all notificaion  
    
    // isCardDetailsFilled     : { type: Boolean, default: false },
    avgRating               : { type: Number, default: 0 },
    dob                     : { type: String },
    // invite_code             : { type: String },
    // defence_reason          : { type: String },            
    // chat_access             : { type: Boolean, default: true },
    // team_mate_access        : { type: Boolean, default: false },
    // socketId                : { type: String },
    // new_request_notification: { type: Boolean, default: true },

    country                 : { type: String },
    state                   : { type: String },
    city                    : { type: String },

    // bar_asso_code           : { type: String },
    // category                : [{ type: Schema.Types.ObjectId, ref: 'category' }],
    // certification           : [{ type: Schema.Types.ObjectId, ref: 'certifications' }],
    // invitation              : [{ type: Schema.Types.ObjectId, ref: 'invitation' }],
    favoriteHotel            : [{ type:Schema.Types.ObjectId, ref: 'user' }],
    // bussiness_website       : { type: String },
    // bussiness_address_name  : { type: String },
    // bussiness_address       : { type:   { type: String, enum: "Point", default: "Point" }, coordinates: { type: [Number], default: [0, 0] }},
    // bussiness_phoneNumber   : { type: String },
    // play_store_link         : { type: String , default: ''},
    // support_email           : { type: String , default: ''},  
    // days_of_operation      : { type: String , default: ''},  
    // start_time              : { type: String , default: ''},  
    // end_time               : { type: String , default: ''},  
    // is_stripe_connected    : { type: Boolean, default: false },
    // charity_type            : { type: String , default: 'VOL'},
    about                   : { type: String , default: ''},  
    //accountId               : { type: String , default : ''},
  
});

function getTimeStamp() {
    return moment().unix()
}

userSchema.index({ address: '2dsphere' });
module.exports = mongoose.model('user', userSchema)

