"use strict";

var _require = require('electron'),
  app = _require.app,
  BrowserWindow = _require.BrowserWindow;
var path = require('path');
var dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Express server to start when electron app is ready
var expressServer = require('./expressServer');

// Ensure .env file is included
var env = process.env.NODE_ENV || 'development';

// If dev environment, enable auto-reloading during dev
if (env === 'development') {
  try {
    var electronReloader = require('electron-reloader');
    electronReloader(module, {
      ignore: [path.join(__dirname), path.join(__dirname, '..', 'src')]
    });
  } catch (_unused) {
    console.log('electron reloader failed');
  }
}

// Open web page in a browser window
var createWindow = function createWindow() {
  var win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // Load the index.html file
  win.loadFile(path.join(__dirname, '../src/index.html'));
};

// Open a window on activation (macOS), boot up express server and run createWindow
app.whenReady().then(function () {
  expressServer.listen(3010, function (err) {
    if (err) {
      console.error('Error starting server:', err);
    } else {
      console.log('Server listening on port 3010');
      createWindow();
    }
  });
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit the app when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});