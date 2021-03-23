const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const path = require('path');
const resolve = require('resolve');
const Store = require('electron-store');

require('./auth_server');


const protocol = 'prodtracker';
let mainWindow;
let deeplinkingUrl;

// Force single application instance
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  app.quit();
  return;
} else {
  app.on('second-instance', (e, argv) => {
    if (process.platform !== 'darwin') {
      // Find the arg that is our custom protocol url and store it
      deeplinkingUrl = argv.find((arg) => arg.startsWith(protocol + '://'));
    }

    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      nativeWindowOpen: true,
    }
  });
  const startURL = isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`;

  mainWindow.loadURL(startURL);

  if (process.platform == 'win32') {
    deeplinkingUrl = process.argv.slice(1)
  }

  mainWindow.once('ready-to-show', () => mainWindow.show());
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}


Store.initRenderer();
app.on('ready', createWindow);

if (isDev && process.platform === 'win32') {
  // Set the path of electron.exe and your app.
  // These two additional parameters are only available on windows.
  // Setting this is required to get this working in dev mode.
  console.log(process.execPath)
  app.setAsDefaultProtocolClient(protocol, process.execPath, process.argv.slice(1));
  console.log(res)
} else {
  if (!app.isDefaultProtocolClient(protocol)) {
    app.setAsDefaultProtocolClient(protocol);
  }
}

app.on('will-finish-launching', function() {
  app.on('open-url', function(event, url) {
    event.preventDefault()
    deeplinkingUrl = url;
  })
});

// app.on('open-url', (event, data) => {
//   event.preventDefault();
//   link = data;
//   console.log(data);
// });