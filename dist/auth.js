const { BrowserWindow } = require('electron')
const firebase = require('firebase')
const FB = require('fb');

function facebookLogin(mainWindow) {
    // Generate a random lock state.
    let state = Math.random().toString(36).substring(7);

    // Our options to get sign-ins.
    var options = {
        client_id: '698162067221362',
        scopes: ["default", "user_events", "user_friends", "groups_access_member_info", "email"],
        redirect_uri: "https://www.facebook.com/connect/login_success.html",
        state: state
    };

    // Create the authentication window
    var authWindow = new BrowserWindow({
        title: 'Where You At? - Login',
        width: 450, height: 300, show: false,
        parent: mainWindow, modal: true, webPreferences: { webSecurity: false, nodeIntegration: false }
    });

    var facebookAuthURL = generateFacebookAuthURL(options);

    // Load the FB Auth URL
    authWindow.loadURL(facebookAuthURL);
    authWindow.show();

    authWindow.webContents.on('will-navigate', function (event, newUrl, isInPlace) {
        var raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
        var access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
        var error = /\?error=(.+)$/.exec(newUrl);

        if (access_token) {
            // Set the facebook access token.
            FB.setAccessToken(access_token);
            
            // Sign in to Firebase with credential from the Facebook user.
            var credential = firebase.auth.FacebookAuthProvider.credential(access_token);
            firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                var email = error.email;
                var credential = error.credential;
            });
            authWindow.close();
        }
    });
}

function generateFacebookAuthURL(options) {
    if (Object.keys(options).length < 4) {
        return null;
    }

    var url = "https://www.facebook.com/v3.1/dialog/oauth?client_id=" + options.client_id
        + "&scopes=" + options.scopes
        + "&state=" + options.state
        + "&display=popup"
        + "&response_type=token&redirect_uri=" + options.redirect_uri;
    return url;
}

// Module exports
module.exports = { facebookLogin, generateFacebookAuthURL };
