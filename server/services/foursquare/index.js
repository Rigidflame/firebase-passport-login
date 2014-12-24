exports.setup = function (passport) {
    var config = require('./config');
    var FoursquareStrategy = require('passport-foursquare').Strategy;

    passport.use(new FoursquareStrategy({
        clientID: config.FOURSQUARE_CLIENT_ID,
        clientSecret: config.FOURSQUARE_CLIENT_SECRET,
        callbackURL: config.FOURSQUARE_CALLBACK_URL
      },
      function(accessToken, refreshToken, profile, done) {
            var user = {
                refreshToken: refreshToken,
                provider: profile.provider,
                accessToken: accessToken,
                id: profile.id,
                uid: profile.provider + ':' + profile.id,
                displayName: profile.name.givenName + ' ' + profile.name.familyName 
            };
            return done(0, {user: user, thirdPartyUserData: profile._json});
      }
    ));

    return {
        options: {
        }
    };
}