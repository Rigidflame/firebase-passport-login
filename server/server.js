var http = require('http');
var express = require('express');
var passport = require('passport');
var serverConfig = require('./config');
var TokenGenerator = require('firebase-token-generator');
var Firebase = require('firebase');
var app = express();

app.configure(function() {
    app.use(express.cookieParser(serverConfig.COOKIE_SECRET));
    app.use(express.bodyParser());
    app.use(express.session({ secret: serverConfig.COOKIE_SECRET }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
});

var tokGen = new FirebaseTokenGenerator(serverConfig.FIREBASE_SECRET);
var port = Number(process.env.PORT || 5000);

serverConfig.SERVICES.forEach(function (service) {
    var serviceObject = require('./services/' + service).setup(passport);

    app.get('/auth/' + service, function(req, res, next){
        res.cookie('passportAnonymous', req.query.oAuthTokenPath, {signed: true});
        passport.authenticate(service, serviceObject.options)(req, res, next);
    });

    app.get('/auth/' + service + '/callback', function (req, res, next) {
        var ref = new Firebase(serverConfig.FIREBASE_URL)
        passport.authenticate(service, function(err, auth, info) {
            var user = auth.user,
                thirdPartyUserData = auth.thirdPartyUserData;

            ref.auth(serverConfig.FIREBASE_SECRET, function (err, data) {
                var tok = null;
                if( user ) {
                    tok = tokGen.createToken(user);
                }
                user.thirdPartyUserData = JSON.stringify(thirdPartyUserData);

                ref.child('oAuthUsers').child(tok.replace(/\./g, '')).set(user);
                ref.child(req.signedCookies.passportAnonymous).set(tok);
            })
        })(req, res, next);
    });
});

app.listen(port);