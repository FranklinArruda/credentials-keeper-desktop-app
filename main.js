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

// ----------------------- Receives (LOGIN REQUEST)
ipcMain.on('login:request', async (event, userEnteredPassword) => {

   // Log the userEnteredPassword for debugging
   console.log('Received login request from renderer process with password:', userEnteredPassword);
   
   // getting USER ID to send as cookie
   //const getUserId = await myServer.getUserInfo(connectDb, userEnteredPassword);

   // Calls the retrievePass function + assings the request pass in the parameter as well as connection
   const retrievedUserId = await myServer.retrieveLoginPass(connectDb, userEnteredPassword);
    console.log("this is the USER ID IDIDIDIDID;", retrievedUserId);


   //Authentication logic (boolean flag) and it sends back to renderer (Login section js)
   // const isAuthenticatedID = getUserId === retrievedUserId;
/*
        if (getUserId) {
          // userInfo contains the entire row from the database
          console.log(`User Info:`, getUserId);

          // Extract UserID from userInfo
        const userId = getUserId.UserID;;
        console.log(`THIS IS THE User ID:`, userId);

      

        } else {
          console.log('User not found');
        }    */
        
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






// insert test (credentials system)
async function InsertCredentials(db,id,subject,usernama,password){
  const insertCredentialsData = await myServer.insertCredentialsSystem(db,id,subject,usernama,password);
  console.log(insertCredentialsData)
}
const subject = "new_web";
const username = "user_name.com";
const password = "Pass.pass03220";
const id = 3;
InsertCredentials(connectDb,id,subject,username,password)



// retrieve test (credentials system)
async function retrieveCredentials(db,id){
  const retrieveCredentialsData = await myServer.retrieveCredentialsManager(db,id);
  console.log(retrieveCredentialsData)
}
const currentID = 3;
retrieveCredentials(connectDb,currentID)



/*
// retrieve LOG INFO (User)
async function getUserID(db, username){

  const getUserId = await myServer.getUserInfo(db,username);

  if (getUserId) {
    // userInfo contains the entire row from the database
    console.log(`User Info:`, getUserId);

    // Extract UserID from userInfo
   
   const userId = getUserId.UserID;;
   console.log(`User ID:`, userId);

  } else {
    console.log('User not found');
  }
}
const userName = "ale_98@gmail.com";
getUserID(connectDb,userName)*/




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
