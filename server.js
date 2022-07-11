'use strict';

const Hapi = require('@hapi/hapi');;
const Inert = require('@hapi/inert');
const Vision = require('@hapi/vision');
const HapiSwagger = require('hapi-swagger');
const Pack = require('./package');
var env = require('./env');
var app = require('./configs/appCredentials')[env.instance];
var db = require('./configs/dbCredentials')[env.instance];
var url = "mongodb://" + db.host + ":" + db.port + "/" + db.database;
var fs = require('fs');
var path = require('path');
const Mongoose = require('mongoose');

(async () => {

    var serverOption = {
        host: app.serverHost,
        port: app.port,
        routes: {
            cors: {
                origin: ['*'],
                additionalHeaders: ['x-logintoken'],
                additionalExposedHeaders: ['x-logintoken']
            }
        }
    }


    const server = await Hapi.Server(serverOption);

    var swaggerOptions = {
        info: {
            'title': app.projectName + ' Documentation',
            'version': Pack.version
        },
        pathPrefixSize: '2',
        basePath: '/v1'
    };

    await server.register([
        Inert,
        Vision,
        {
            plugin: HapiSwagger,
            options: swaggerOptions
        }
    ]);


    var options = {
        user: db.username,
        pass: db.password
    }


    //Connect to MongoDB
    Mongoose.connect(url, options, function (err) {
        if (err) { console.log("\nMONGO DB ERROR: ", err); throw err; }
        console.log('\nMONGO RUNNING AT:', url)
    });

    try {

        //socket web server connection

        await server.start();
        console.log('\nSERVER RUNNING AT :', server.info);

        server.route(require('./src/user/route'));
        server.route(require('./src/admin/route'));
        server.route([
            {
                //to get images
                method: 'GET',
                path: '/images/{name}',
                handler: function (request, reply) {

                    if (request.params.name != 'default_user.png') {  //|| request.params.name != 'adminImage.jpeg'

                        return reply.file('uploads/' + request.params.name);

                    } else {
                        return reply.file('images/' + request.params.name);
                    }
                },

            },
            
        ])

    } catch (err) {

        console.log('\nERROR WHILE STARTING SERVER :', err);
        process.exit(1)
    }


})();


