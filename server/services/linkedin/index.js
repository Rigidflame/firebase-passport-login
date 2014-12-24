exports.setup = function (passport) {
    var config = require('./config');
    var LinkedInStrategy = require('passport-linkedin').Strategy;

    passport.use(new LinkedInStrategy({
        consumerKey: config.LINKEDIN_CLIENT_ID,
        consumerSecret: config.LINKEDIN_CLIENT_SECRET,
        callbackURL: config.LINKEDIN_CALLBACK_URL
      },
      function(accessToken, refreshToken, profile, done) {
            var user = {
                refreshToken: refreshToken || "",
                accessToken: accessToken,
                provider: profile.provider,
                id: profile.id,
                uid: profile.provider + ':' + profile.id,
                displayName: profile.name  
            };
            return done(0, {user: user, thirdPartyUserData: profile._json});
      }
    ));

    return {
        options: {
            "state": "_____"
        }
    };
}
