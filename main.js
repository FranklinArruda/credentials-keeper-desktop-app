const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const myServer = require('./server/database-manager.js'); // requiring the server side application (connection and functions etc)


let mainWindow;
let connectDb = myServer.createDbConnection(); // variable that holds the connection of the function return type value.

function createMainWindow() {
  mainWindow = new BrowserWindow({
    title: "Credencials Keeper",
    width: 1400,
    height: 615,
    icon: path.join(__dirname, 'renderer/assets/icon/keys-holder.png'), // Set the path to your icon file
    //frame: false, // hide defaut title bar
   // resizable: false, // Prevent window resizing
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


// ----------------------- Receives (LOGIN REQUEST)
ipcMain.on('login:request', async (event, userEnteredPassword) => {

   // Log the userEnteredPassword for debugging
   console.log('Received login request from renderer process with password:', userEnteredPassword);

   // Calls the retrieveID function + assings the request pass in the parameter as well as connection
   const retrievedUserId = await myServer.retrieveUserID(connectDb, userEnteredPassword);
    console.log("This is the USER ID ;", retrievedUserId);

    //it sends the boolean flag to the renderer
    mainWindow.webContents.send('login:response', retrievedUserId);
});


// ----------------------- Receives HINT for (PASSWORD REQUEST)
ipcMain.on('password:request', async (event, userEnteredHint) => { 

  // Log the userEnteredPassword for debugging
  console.log('Received hint request from renderer process with password:', userEnteredHint);
  
  // Calls the retrievePass function + assings the request pass in the parameter as well as connection
  const storedHint = await myServer.retrieveHintPass(connectDb, userEnteredHint);
  console.log('Sending it back to preload from the main process with password:', storedHint);

   //it sends the boolean flag to the renderer
   mainWindow.webContents.send('password:response', storedHint);
});





// ----------------------- Receives CREDENTIALS DATA (from renderer system manager)
ipcMain.on('send:credentialData', async (event, data) => {

  // extract data sent from renderer
  const { userID, subject, userName, password} = JSON.parse(data);
  console.log("RECEIVED in the MAIN :", subject, userName,password, userID);  // logging out data to test 
  
  // insert into DATABASE 
  myServer.insertCredentialsSystem(connectDb,userID,subject,userName,password);

  // retrieve from DATABASE and send back to the renderer to have data persistency in there when app is opened again
  const credentialsDataRetrieved = await myServer.retrieveCredentialsManager(connectDb, userID);
  console.log("RETRIEVED DATA FROM CREDENTIALS SYSTEM IN THE MAIN:", credentialsDataRetrieved)

  // it sends to the renderer (CREDENTIALS SYSTEM) to append to HTML ELEMENTS as 
  // JSON data with stringfy so I can extarct the received data in the and populate all however I want
  mainWindow.webContents.send('update:credentialData', JSON.stringify(credentialsDataRetrieved));
  console.log("Sent data to renderer:", JSON.stringify(credentialsDataRetrieved));
});




// ----------------- RETRIEVE CREDENTIALS SYSTEM WHEN PAGE IS LOADED
ipcMain.on('userID', async (event, userID) => {

  console.log("user ID RECEIVED IN THE MAIN:",userID);
  
  // retrieve from DATABASE and send back to the renderer to have data persistency in there when app is opened again
  const credentialsDataRetrieved = await myServer.retrieveCredentialsManager(connectDb, userID);

  if(credentialsDataRetrieved === null){
     console.log("table is empty!")
  }else{
     console.log("RETRIEVED DATA FROM CREDENTIALS SYSTEM IN THE MAIN:", credentialsDataRetrieved);
  
  // it sends to the renderer (CREDENTIALS SYSTEM) to append to HTML ELEMENTS as 
  // JSON data with stringfy so I can extarct the received data in the and populate all however I want
  mainWindow.webContents.send('update:credentialData', JSON.stringify(credentialsDataRetrieved));
  console.log("Sent data to renderer:", JSON.stringify(credentialsDataRetrieved));
  }

  
});



ipcMain.on('deleteRequest', (event, data) => {

  // extract data sent from renderer
  const { userID, subject, userName, password} = JSON.parse(data);

  console.log('Received data in the main process:', data);

  console.log('ID:', userID);
  console.log('SUBJECT:', subject);
  console.log('USERNAME:', userName);
  console.log('PASSWORD:', password);

  myServer.deleteCredentialsRow(connectDb,userID,subject,userName,password)
  
  // Sending a response back to the renderer process
  mainWindow.webContents.send('deleteResponse', data);

});







/*
// retrieve test (credentials system)
async function retrieveCredentials(db,id){
  const retrieveCredentialsData = await myServer.retrieveCredentialsManager(db,id);
  console.log(retrieveCredentialsData)
}
const currentID = 3;
retrieveCredentials(connectDb,currentID)
*/


} //MAIN window ends here








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
