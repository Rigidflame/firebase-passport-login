// Copyright (c) 2013 Abraham Haskins, https://github.com/abeisgreat https://github.com/rigidflame/firebase-passport-login
var FirebasePassportLogin = (function (ref, callback, oAuthServerURL) {
    var self = this;
    self._ref = ref;
    self._tokenPath = "oAuthLogin";
    self._oAuthServerURL = oAuthServerURL;
    self._oAuthServerWindow = "width=1024, height=650";
    self._callback = callback;
    self._ready = true;
    
    self._anonymous_login = function (callback) {
        var firebaseName = self._ref.toString().match(/https:\/\/(.+)\.firebaseio.com/)[1];
        var callbackName = "fpl_" + self._ref.push().name().replace(/-/g, '');
        window[callbackName] = function (data) {
            self._ref.auth(data.token, function (err, auth) {
                callback(err, auth.auth);   
            });
        };
        
        var script = document.createElement('script');
        var url = "https://auth.firebase.com/auth/anonymous?transport=jsonp&firebase=" + firebaseName + "&callback=" + callbackName;
        script.setAttribute("type", "text/javascript");
        script.setAttribute("src", url);
        
        document.getElementsByTagName("head")[0].appendChild(script);   
    }
    
    self._handleAnonymousLogin = function (error, user) {
        if (error) {
            self._log("Anonymous login failed. Make sure Anonymous login is enabled in your Firebase");
        }else if (user) {
            self._anonymous_user = user;
            self._initializePassportLogin();
        }
    };
    
    self._initializePassportLogin = function () {
        var oAuthTokenPath = [
            self._tokenPath, 
            self._anonymous_user.uid
        ].join('/');
        var oAuthTokenRef = self._ref.child(oAuthTokenPath);
        
        oAuthTokenRef.on("value", function (snapshot) {
            var value = snapshot.val();
            if (value) {
                oAuthTokenRef.remove();
                oAuthTokenRef.off();
                self._oAuthWindow.close();
                self._ref.unauth();
                self._handleOAuthLogin(value);
            }
        });
    
        var oAuthWindowURL = self._oAuthServerURL + self._provider + "?oAuthTokenPath=" + oAuthTokenPath;
        self._oAuthWindow = window.open(oAuthWindowURL, "", self._oAuthServerWindow);  
    };
    
    self._handleOAuthLogin = function (token) {
        self._setToken(token);
    };
    
    self._setToken = function (token) {
        if (!token) return;
        document.cookie = 'passportSession=' + token + '; path=/';
        self._ref.auth(token, function (error, data) {
            var auth = data? data.auth : {};
            
            if (error && error.code == "EXPIRED_TOKEN") {
                cookie.set("passportSession", "");   
            }
            
            self._callback(error, auth);
        });
    };
            
    self._log = function (message) {
        if (console.log) {
            console.log("FirebasePassportLogin: " + message); 
        }
    };
    
    self.login = function (provider) {
        self._provider = provider;
        self._anonymous_login(self._handleAnonymousLogin) 
    };
    
    self.logout = function () {
        self._ref.unauth();
        cookie.set("passportSession", "");
        self._callback(null, null);
    };
    
    setTimeout(function () {
        self._setToken(cookie.get("passportSession"));
    });
    
    // Copyright (c) 2012 Florian H., https://github.com/js-coder https://github.com/js-coder/cookie.js
!function(e,t){var n=function(){return n.get.apply(n,arguments)},r=n.utils={isArray:Array.isArray||function(e){return Object.prototype.toString.call(e)==="[object Array]"},isPlainObject:function(e){return!!e&&Object.prototype.toString.call(e)==="[object Object]"},toArray:function(e){return Array.prototype.slice.call(e)},getKeys:Object.keys||function(e){var t=[],n="";for(n in e)e.hasOwnProperty(n)&&t.push(n);return t},escape:function(e){return String(e).replace(/[,;"\\=\s%]/g,function(e){return encodeURIComponent(e)})},retrieve:function(e,t){return e==null?t:e}};n.defaults={},n.expiresMultiplier=86400,n.set=function(n,i,s){if(r.isPlainObject(n))for(var o in n)n.hasOwnProperty(o)&&this.set(o,n[o],i);else{s=r.isPlainObject(s)?s:{expires:s};var u=s.expires!==t?s.expires:this.defaults.expires||"",a=typeof u;a==="string"&&u!==""?u=new Date(u):a==="number"&&(u=new Date(+(new Date)+1e3*this.expiresMultiplier*u)),u!==""&&"toGMTString"in u&&(u=";expires="+u.toGMTString());var f=s.path||this.defaults.path;f=f?";path="+f:"";var l=s.domain||this.defaults.domain;l=l?";domain="+l:"";var c=s.secure||this.defaults.secure?";secure":"";e.cookie=r.escape(n)+"="+r.escape(i)+u+f+l+c}return this},n.remove=function(e){e=r.isArray(e)?e:r.toArray(arguments);for(var t=0,n=e.length;t<n;t++)this.set(e[t],"",-1);return this},n.empty=function(){return this.remove(r.getKeys(this.all()))},n.get=function(e,n){n=n||t;var i=this.all();if(r.isArray(e)){var s={};for(var o=0,u=e.length;o<u;o++){var a=e[o];s[a]=r.retrieve(i[a],n)}return s}return r.retrieve(i[e],n)},n.all=function(){if(e.cookie==="")return{};var t=e.cookie.split("; "),n={};for(var r=0,i=t.length;r<i;r++){var s=t[r].split("=");n[decodeURIComponent(s[0])]=decodeURIComponent(s[1])}return n},n.enabled=function(){if(navigator.cookieEnabled)return!0;var e=n.set("_","_").get("_")==="_";return n.remove("_"),e},typeof define=="function"&&define.amd?define(function(){return n}):typeof exports!="undefined"?exports.cookie=n:window.cookie=n}(document);
    //
});
