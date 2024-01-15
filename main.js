const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const myServer = require('./server/system-manager.js'); // requiring the server side application (connection and functions etc)

let mainWindow;
let connectDb; // variable that holds the connection of the function return type value.

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Credencials Keeper",
    width: 1024,
    height: 600,
    icon: path.join(__dirname, 'renderer/assets/icon/keys-holder.png'), // Set the path to your icon file
    //frame: false, // hide defaut title bar
    resizable: false, // Prevent window resizing
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'), // it load the prealod.js file
    },
  });

   // Open DevTools for debugging
    mainWindow.webContents.openDevTools();

  // Remove the default menu bar
  Menu.setApplicationMenu(null);

  mainWindow.loadFile(path.join(__dirname, 'renderer/html/1-home-page.html')); // entry point html
  mainWindow.on("ready-to-show", () => {
  mainWindow.show();


    /**
     * creating database connection when main window is loaded
     * 
     * Adding that check ensures that the database connection is only created if it doesn't exist, 
     * preventing multiple connections and related issues
     */
        if (!connectDb) {
          connectDb = myServer.createDbConnection();
        }  
});
}


// Getting the User data (Registration process) from formValidation
ipcMain.on('user:registration', (event, data) => {
  const { fullName, userName, password, hint } = JSON.parse(data);

  myServer.insertUser(connectDb,fullName, userName, password, hint);
});






// Handle the "quit-app" message from the renderer process
ipcMain.on('quit-app', function () {
  app.quit();
});



app.whenReady().then(() => {
    createMainWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {

    }
  });
});



app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
