const { app, BrowserWindow } = require('electron');
const path = require('path');

const env = process.env.NODE_ENV || 'development';

// If dev environment, enable auto-reloading during dev
if (env === 'development') {
  try {
    const electronReloader = require('electron-reloader');
    electronReloader(module, {
      ignore: [path.join(__dirname), path.join(__dirname, '..', 'src')],
    });
  } catch {
    console.log('electron reloader failed');
  }
}

// Open web page in a browser window
const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    
  });

  // Load the index.html file
  win.loadFile(path.join(__dirname, '../src/index.html'));
};

// Open a window on activation (macOS)
app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit the app when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
