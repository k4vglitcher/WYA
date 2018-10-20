// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const firebase = require('firebase')
const FB = require('fb');
var access_token = null;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function doAuth() {
  let state = Math.random().toString(36).substring(7);
  console.log('state: ' + state)
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

  var facebookAuthURL = "https://www.facebook.com/v3.1/dialog/oauth?client_id=" + options.client_id
    + "&scopes=" + options.scopes
    + "&state=" + options.state
    + "&display=popup"
    + "&response_type=token&redirect_uri=" + options.redirect_uri;

  // Load the FB Auth URL
  console.log('loading fb auth url: ' + facebookAuthURL)
  authWindow.loadURL(facebookAuthURL);
  console.log('showing window')
  authWindow.show();

  authWindow.webContents.on('will-navigate', function (event, newUrl, isInPlace) {
    console.log('redirect request: ' + newUrl)
    var raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
    access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
    var error = /\?error=(.+)$/.exec(newUrl);

    if (access_token) {
      FB.setAccessToken(access_token);
      FB.api('/me', { fields: ['id', 'name'] }, function (res) {
        mainWindow.webContents.executeJavaScript("document.getElementById(\"fb-name\").innerHTML = \" Name: " + res.name + "\"");
        mainWindow.webContents.executeJavaScript("document.getElementById(\"fb-id\").innerHTML = \" ID: " + res.id + "\"");
      });
      var credential = firebase.auth.FacebookAuthProvider.credential(access_token);
      // Sign in with credential from the Google user.
      firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
      authWindow.close();
    }
  });
}

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600 })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')
  mainWindow.setVibrancy("sidebar")

  // Initialize Firebase
  var config = {
    apiKey: "AIzaSyBKOGWZtv9h0dLHEhvTWewbvPQsajxa3Kw",
    authDomain: "wya-electron.firebaseapp.com",
    databaseURL: "https://wya-electron.firebaseio.com",
    projectId: "wya-electron",
    storageBucket: "wya-electron.appspot.com",
    messagingSenderId: "604404649711"
  };

  firebase.initializeApp(config);
  firebase.auth().useDeviceLanguage();

  if (firebase.auth().currentUser) {
    // user signed in
    console.log('works!')
  } else {
    doAuth();
  }

  firebase.auth().onAuthStateChanged(function (user) {
    if (user) {
      console.log(user.displayName)
      console.log(user.email)
      console.log(user.metadata)
    }
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
