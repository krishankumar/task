// //access modules
const accessModule = require('./index');

module.exports = {

    insertAdmin: function (callback) {
        var adminDetail = [{

                email: 'admin@mailinator.com',
                password: accessModule.md5('1234'),
                role: accessModule.constants.USERTYPE.ADMIN

            },

        ]
        accessModule.async.eachSeries(adminDetail, function (data, InnerCb) {

            insertAdminAccount(data, function (err, result) {
                if (err) return InnerCb(err);
                return InnerCb();
            });

        }, function (err, result) {
            if (err) return callback(err);
            return callback();
        });
    },


}
