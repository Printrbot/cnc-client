'use strict';
var app = require('app');
var BrowserWindow = require('browser-window');


let mainWindow;

function createWindow () {
  mainWindow = new BrowserWindow({width: 380, height: 430, x: 10, y:10});
  mainWindow.loadURL('file://' + __dirname + '/index.html');

  // Open the DevTools.
//  mainWindow.webContents.openDevTools();

  mainWindow.on('closed', function() {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
