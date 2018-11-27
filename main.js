// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const firebase = require('firebase')
var authentication = require('./dist/auth')
var event = require('./dist/event')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 800, height: 600, show: false })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // DevTools
  // mainWindow.webContents.openDevTools()

  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyBKOGWZtv9h0dLHEhvTWewbvPQsajxa3Kw',
    authDomain: 'wya-electron.firebaseapp.com',
    databaseURL: 'https://wya-electron.firebaseio.com',
    projectId: 'wya-electron',
    storageBucket: 'wya-electron.appspot.com',
    messagingSenderId: '604404649711'
  }
  var fbapp = firebase.initializeApp(config, 'WYA')
  fbapp.auth().useDeviceLanguage()

  // Update eventbrite events in database
  event.updateEventbriteEvents(false, fbapp.firestore())
  event.updateTicketmasterEvents(false, fbapp.firestore())

  // Listener for Firebase auth state changes.
  fbapp.auth().onAuthStateChanged(function (user) {
    if (user) {
      // User is logged in.
      console.log(user.displayName)
      mainWindow.show()
    } else {
      // User is not logged in.
      // authentication.facebookLogin(mainWindow)
      mainWindow.show()
    }
  })

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
