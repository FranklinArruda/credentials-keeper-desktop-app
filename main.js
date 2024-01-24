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
   console.log('Received login request from Renderer to Main with password:', userEnteredPassword);

   // Calls the retrieveID function + assings the request pass in the parameter as well as connection
   const retrievedUserId = await myServer.retrieveUserID(connectDb, userEnteredPassword);

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






//  1. Receives credentials Request from Renderer to be (stored in the Database)
// ----------------------------------------------------------------------------
ipcMain.on('sendCredentialsData', async (event, userCredentialsData) => {

  // extract data sent from renderer
  const { LOGGED_IN_USER_ID, subject, userName, password} = JSON.parse(userCredentialsData);
  console.log("Credentials Data received in the main from Renderer:", LOGGED_IN_USER_ID, subject, userName, password);  // logging out data to test 
  
  // insert into DATABASE 
  myServer.insertCredentialsSystem(connectDb,LOGGED_IN_USER_ID,subject,userName,password);

  // retrieve from DATABASE and send back to the renderer to have data persistency in there when app is opened again
  const credentialsDataRetrieved = await myServer.retrieveCredentialsManager(connectDb, LOGGED_IN_USER_ID);
  
  // it sends back a response with the data
  console.log("Credentials data Response from Main to Renderer on 'ADD' button clicked:", credentialsDataRetrieved);
  mainWindow.webContents.send('credentialsDataResponse', JSON.stringify(credentialsDataRetrieved));
});



//  2. Receives credentials Request from Renderer to when the app is starting again (retrieve data on page load)
//  3. Receives credentials Request from Renderer to when data is being DELETED (so it forces retrieves and page load)
// -------------------------------------------------------------------------------------------------------------
ipcMain.on('requestCredentialsData', async (event, userID) => {

  // retrieve from DATABASE and send back to the renderer to have data persistency in there when app is opened again
  const credentialsDataRetrieved = await myServer.retrieveCredentialsManager(connectDb, userID);

  // Checks the null value for empty table / or when the system is being started firt time
  // since it will always tries to retrive I check before 
  if(credentialsDataRetrieved === null){
     console.log("table is empty!")
  }else{
    console.log("Credentials data Retrieved and sent from Main to Renderer on 'PAGE LOAD': ", credentialsDataRetrieved);
    mainWindow.webContents.send('credentialsDataResponse', JSON.stringify(credentialsDataRetrieved));
  }
});





ipcMain.on('deleteRequest', (event, userCredentialsData) => {
  // extract data sent from renderer
  const { LOGGED_IN_USER_ID, subject, userName, password} = JSON.parse(userCredentialsData);

  console.log('Delete request received in the Main from Renderer:', userCredentialsData);

  console.log('ID:', LOGGED_IN_USER_ID);
  console.log('SUBJECT:', subject);
  console.log('USERNAME:', userName);
  console.log('PASSWORD:', password);

  myServer.deleteCredentialsRow(connectDb,LOGGED_IN_USER_ID, subject, userName, password)

  // Sending a response back to the renderer process
  mainWindow.webContents.send('deleteResponse', userCredentialsData);
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
