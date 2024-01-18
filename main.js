const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const myServer = require('./server/database-manager.js'); // requiring the server side application (connection and functions etc)


let mainWindow;
let connectDb = myServer.createDbConnection(); // variable that holds the connection of the function return type value.

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

});


// ----------------------- Receives REGISTRATION
ipcMain.on('user:registration', (event, data) => {
  const { fullName, userName, password, hint } = JSON.parse(data);
  myServer.insertUser(connectDb,fullName, userName, password, hint);
});



// ----------------------- Receives LOGIN (REQUEST)
ipcMain.on('login:request', async (event, userEnteredPassword) => {

   // Log the userEnteredPassword for debugging
   console.log('Received login request from renderer process with password:', userEnteredPassword);
   
   // Calls the retrievePass function + assings the request pass in the parameter as well as connection
   const storedPassword = await myServer.retrieveLoginPass(connectDb, userEnteredPassword);
    
   //Authentication logic (boolean flag) and it sends back to renderer (Login section js)
    const isAuthenticated = userEnteredPassword === storedPassword;

    //it sends the boolean flag to the renderer
    mainWindow.webContents.send('login:response', isAuthenticated);
});


// ----------------------- Receives HINT (REQUEST)
ipcMain.on('hint:request', async (event, userEnteredHint) => {

  // Log the userEnteredPassword for debugging
  console.log('Received hint request from renderer process with password:', userEnteredHint);
  
  // Calls the retrievePass function + assings the request pass in the parameter as well as connection
  const storedHint = await myServer.retrieveHintPass(connectDb, userEnteredHint);
   
  //Authentication logic (boolean flag) and it sends back to renderer (Login section js)
  // const isAuthenticated = userEnteredHint === storedHint;

   //it sends the boolean flag to the renderer
   mainWindow.webContents.send('hint:response', storedHint);
});

/*
// working one finally
async function hint(db, hint){
  const hintPass = await myServer.retrieveHintPass(db,hint);
  //console.log("hind retrieved correctly", hintPass);
}

let id="casa";
hint(connectDb,id);*/


// working one finally
async function test(db, pass){
  const breakdown = await myServer.retrieveLoginPass(db,pass);
  console.log(breakdown);
}
let id="2908";
test(connectDb,id);



async function hint(db, hint){
  const breakdown = await myServer.retrieveHintPass(db,hint);
  console.log(breakdown);
}
let casahint= "casa";
hint(connectDb,casahint);





} //  'main' window ends here




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
