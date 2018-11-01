const { BrowserWindow } = require('electron')
const firebase = require('firebase')
const FB = require('fb')

function facebookLogin () {
  // Generate a random lock state.
  let state = Math.random().toString(36).substring(7)

  // Our options to get sign-ins.
  var options = {
    client_id: '698162067221362',
    scopes: ['user_profile', 'user_events', 'user_friends', 'groups_access_member_info', 'email'],
    redirect_uri: 'https://www.facebook.com/connect/login_success.html',
    state: state
  }

  // Create the authentication window
  var authWindow = new BrowserWindow({
    title: 'Where You At? - Login',
    width: 450,
    height: 300,
    show: false,
    modal: true,
    webPreferences: { webSecurity: false, nodeIntegration: false }
  })

  var facebookAuthURL = generateFacebookAuthURL(options)

  // Load the FB Auth URL
  authWindow.loadURL(facebookAuthURL)
  authWindow.show()

  authWindow.webContents.on('will-navigate', function (event, newUrl) {
    var rawCode = /access_token=([^&]*)/.exec(newUrl) || null
    var accessToken = (rawCode && rawCode.length > 1) ? rawCode[1] : null

    // eslint-disable-next-line no-unused-vars
    var error = /\?error=(.+)$/.exec(newUrl)

    if (accessToken) {
      // Set the facebook access token.
      FB.setAccessToken(accessToken)

      // Sign in to Firebase with credential from the Facebook user.
      var credential = firebase.auth.FacebookAuthProvider.credential(accessToken)
      // eslint-disable-next-line handle-callback-err
      firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function (error) {
        // Handle Errors here.
      })
      authWindow.close()
    }
  })
}

function generateFacebookAuthURL (options) {
  if (Object.keys(options).length < 4) {
    return null
  }

  var url = 'https://www.facebook.com/v3.1/dialog/oauth?client_id=' + options.client_id +
        '&scopes=' + options.scopes +
        '&state=' + options.state +
        '&display=popup' +
        '&response_type=token&redirect_uri=' + options.redirect_uri
  return url
}

// Module exports
module.exports = { facebookLogin, generateFacebookAuthURL }
