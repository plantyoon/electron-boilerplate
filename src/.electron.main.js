const {app, BrowserWindow} = require('electron');

const fs = require('fs');
const path = require('path');
const mode = process.env.NODE_ENV;
const port = process.argv[2];

let win = null;
const createWindow = () => {
  win = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      webSecurity: mode === 'development' ? false : true,
    },
    frame: mode === 'development',
  });
  win.loadURL(`http://localhost:${port}`);
  mode === 'development' && win.webContents.openDevTools();
  win.on('closed', () => win = null);
}

app.on('ready', createWindow);
app.on('window-all-closed', () => process.platform !== 'darwin' && app.quit());
app.on('activate', () => win === null && createWindow());

const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
} else {
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.on('ready', () => {
  });
}
