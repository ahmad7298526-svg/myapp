const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: 'icon.png',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
  
  // غيّر index.html باسم ملفك الرئيسي
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});