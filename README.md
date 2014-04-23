FirebasePassportLogin (Beta!)
=======================

Use [Express](http://expressjs.com/)'s [Passport](http://passportjs.org/) middleware authentication libraries with Firebase to authenticate users with an interface identical to Firebase Simple Login for over 100 different providers.

**Do not use Firebase Passport Login in production yet! We are still doing a lot of testing for stability and security. A production ready version is coming soon!**

Why not use Firebase Simple Login?
---
[Firebase Simple Login](https://www.firebase.com/docs/security/simple-login-overview.html) is great and we would highly recommend you use it if you want your users to be able to log in with Google, Facebook, Twitter, Github, or with email/password. However, there are still a ton of oAuth providers which aren't supported by Firebase Simple Login. Instead of reinventing the wheel, we integrated Passport and it's [100+ compatible services](http://passportjs.org/guide/providers/) with Firebase. 

Does this mean I have to run my own server?
---
Yes it does. Firebase Passport Login requires you run your own public HTTP server for the providers to redirect to after successful logins. Don't worry though, this is all taken care of. All you need to do is run our server script.

Getting Started
---

### 1. Set up Anonymous Login in your Firebase
Open your Firebase in a browser and navigating to Simple Login tab. Then click "Anonymous" and make sure "Enabled" is checked.

*Note: Firebase Passport Login uses Anonymous login interally to create a secure communication line between a Firebase Passport Login client and server.* 

### 2. Set up the Security Rules in your Firebase
We've included proper security rules for using Firebase Passport Login under `/server/security-rules.json`, make sure to apply these to your Firebase. This is extremely important for keeping user tokens secure!

### 3. Include Firebase and Firebase Passport Login on our client

    <script type='text/javascript' src='https://cdn.firebase.com/js/client/1.0.11/firebase.js'></script>
    <script type='text/javascript' src='client/firebase-passport-login.js'></script>
            
### 4. Create a new FirebasePassportLogin on your Client
If you've used Firebase Simple Login, the next JavaScript snippet will look very familiar.

    var ref = new Firebase('https://<Your Firebase>.firebaseio.com/');
    var auth = new FirebasePassportLogin(ref, function(error, user) {
      if (error) {
        // an error occurred while attempting login
        console.log(error);
      } else if (user) {
        // user authenticated with Firebase
        console.log('User ID: ' + user.uid + ', Provider: ' + user.provider);
      } else {
        // user is logged out
      }
    }, "http://localhost:1337/auth/");
    
    auth.login('reddit');
    
The only difference between setting up a Simple Login client and a Passport Login client, is that FirebasePassportLogin takes an additional URL parameter, which points to the URL of your authentication server.
    
### 5. Configure your Server
The FPL server has two kinds of config files. The server config file, located at `/server/config.js` and service specific config files located at `/server/services/*/config.js`. These files are self-explanatory and require basic informaiton like which services to load, your Firebase URL, your Firebase Secret, and your oAuth Key/Secret for each service.
    
### 6. Start your Server
On your server (or localhost), navigate to `/server/` and run:

    node server.js

### 7. Log in!
Open your HTML file in a browser and watch the magic!

Adding Services
--------

To add a service, copy one of the two included example services (Reddit and Foursquare) to a new folder under `/server/services` then modify the `index.js` to use whichever `passport-*` library you'd like. 

The rest of the code is just initializes the passport strategy which varies slightly between services. The most important part is the translation of `profile` to `user`. The data a provider returns will vary a lot, so this is your chance to normalize the data to match the normal Firebase Simple Login standard (which is used in the included services). This normalization is optional, it's just helps to ensure that the data given to a client is consistent regardless of provider. 

Once your service is set up, make sure to enable the service in your `/server/config.js` file and you should be ready to call `auth.login(SERVICE)` on your client!

## Credits
Development of this library is sponsored by [Rigidflame Consultants](http://www.rigidflame.com).