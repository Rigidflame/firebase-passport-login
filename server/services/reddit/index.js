exports.setup = function (passport) {
    var config = require('./config');
    var RedditStrategy = require('passport-reddit').Strategy;

    passport.use(new RedditStrategy({
        clientID: config.REDDIT_CLIENT_ID,
        clientSecret: config.REDDIT_CLIENT_SECRET,
        callbackURL: config.REDDIT_CALLBACK_URL
      },
      function(accessToken, refreshToken, profile, done) {
            var user = {
                refreshToken: refreshToken || "",
                accessToken: accessToken,
                provider: profile.provider,
                id: profile.id,
                uid: profile.provider + ':' + profile.id,
                displayName: profile.name,
                thirdPartyUserData: profile._json  
            };
            return done(0, user);
      }
    ));

    return {
        options: {
            "state": "_____"
        }
    };
}