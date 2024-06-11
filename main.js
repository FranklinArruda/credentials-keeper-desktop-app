const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
//const pdfmake = require('pdfmake/build/pdfmake');
//const vfsFonts = require('pdfmake/build/vfs_fonts');


const myServer = require('./server/database-manager.js'); // requiring the server side application (connection and functions etc)
const generateCSV = require('./server/csv-generator.js'); // requiring PDF generator function for both system

const importCSV = require('./server/csv-import.js');
// const importCSV to database


// install: npm install pdfmake

//pdfmake.vfs = vfsFonts.pdfMake.vfs;

let mainWindow;
let connectDb; // variable that holds the connection of the function return type value.

// MAIN WINDOW
function createMainWindow() {
  
// Ensure a new connection when creating the main window
 connectDb = myServer.createDbConnection();

  mainWindow = new BrowserWindow({
    title: "Credencials Keeper",
    width: 1050,
    height: 635,
    resizable: false,
   icon: path.join(__dirname, 'renderer/assets/icon/appIcon.png'),
   //icon: path.join(__dirname, 'appIcon.png'), 
   
   webPreferences: {
      nodeIntegration: true, // disable nodeIntegration
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

   // Open DevTools for debugging
   //mainWindow.webContents.openDevTools();

  // Remove the default menu bar
  Menu.setApplicationMenu(null);

  mainWindow.loadFile(path.join(__dirname, 'renderer/html/1-home-page.html')); // entry point html
  mainWindow.on("ready-to-show", () => {
  mainWindow.show(); 
  createMenu();      

});

  

//MENU WINDOW
function createMenu() {

  
  /* const template = [
     {
       label: 'Settings',
       submenu: [
         {
           label: 'About',
           click: createAboutWindow,
         },
         { role: 'quit' },
       ],
     },
   ];*/
   const template = [
     {
       
           label: 'About',
           click: createAboutWindow,
         },
         { role: 'quit' },
       ];
   
   
 
   const menu = Menu.buildFromTemplate(template);
   Menu.setApplicationMenu(menu);
 }
 
 function createAboutWindow() {
   aboutWindow = new BrowserWindow({
    height: 300,
    width: 450,
    icon: path.join(__dirname, 'renderer/assets/icon/appIcon.png'),
     title: 'About',
   });
 
   aboutWindow.loadFile(path.join(__dirname, 'renderer/html/6-about-window.html'));
 }

 
// ----------------------- Receives REGISTRATION
ipcMain.on('user:registration', async (event, data) => {
  console.log("user DATA registration received in the main", data)

  const { fullName, userName, password, hint } = JSON.parse(data);
  
  myServer.insertUser(connectDb,fullName, userName, password, hint);

  // testing database
  let userEnteredPassword ="000";

  // Calls the retrieveID function + assings the request pass in the parameter as well as connection
  const retrievedUserId = await myServer.retrieveUserID(connectDb, userEnteredPassword);

  console.log("User_ID: " ,retrievedUserId)
   //it sends the boolean flag to the renderer
   mainWindow.webContents.send('user:registration', retrievedUserId);
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



// -------------------------- CREDENTIALS SYSTEM ------------------------------

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




/**
 * It listen for the dele request from renderer and it returns the delete reponse in which will trigger the 
 * retrive function to update the table on page load. (That way just refresh the table in the renderer).
 * 
 * Response back to renderer will be sent only when table row is actually is deleted
 */
ipcMain.on('deleteCredentialsRequest', (event, userCredentialsData) => {

  // extract data sent from renderer
  const { LOGGED_IN_USER_ID, subject, userName, password} = JSON.parse(userCredentialsData);

  console.log('Delete request received in the Main from Renderer:', userCredentialsData);

  console.log('ID:', LOGGED_IN_USER_ID);
  console.log('SUBJECT:', subject);
  console.log('USERNAME:', userName);
  console.log('PASSWORD:', password);

  myServer.deleteCredentialsRow(connectDb,LOGGED_IN_USER_ID, subject, userName, password)

  console.log("delete response:", userCredentialsData)
  // Sending a response back to the renderer process
  mainWindow.webContents.send('deleteCredentialsResponse', userCredentialsData);
});



// listen for the CSV Creation request from Renderer on button click for (CREDENTIALS SYSTEM)
ipcMain.on('requestCredentialsDataCSV', async (event, userID) => {

  console.log("CSV > Request from Renderer received in the Main for PHONE SYSTEM with userID:", userID)
  // retrieve from DATABASE and send back to the renderer to have data persistency in there when app is opened again
  const credentialsDataRetrieved = await myServer.retrieveCredentialsManager(connectDb, userID);

  // Checks the null value for empty table / or when the system is being started firt time
  // since it will always tries to retrive I check before 
  if(credentialsDataRetrieved === null){
     console.log("table is empty!")
  }else{
    console.log("Credentials data Retrieved and sent from Main to Renderer for PDF:", credentialsDataRetrieved);
  }

  // it calls the CSV function that holds the parameters values accordingly
  generateCSV.credentialsCSVgenerator(event, dialog, path, fs, app, credentialsDataRetrieved);
});






// -------------------------- PHONE SYSTEM ------------------------------

//  1. Receives Phone Request from Renderer to be (stored in the Database)
// ----------------------------------------------------------------------------
ipcMain.on('sendPhoneData', async (event, userPhoneData) => {

  // extract data sent from renderer
  const { LOGGED_IN_USER_ID, personsName, phoneNumber } = JSON.parse(userPhoneData);
  console.log("Phone Data received in the main from Renderer:", "UserID:", LOGGED_IN_USER_ID, ", Persons Name:", personsName, ", Phone No.:", phoneNumber );  // logging out data to test 
  
  // insert into DATABASE 
   myServer.insertPhoneSystem(connectDb, LOGGED_IN_USER_ID, personsName, phoneNumber );
  
  // retrieve from DATABASE and send back to the renderer to have data persistency in there when app is opened again
  const phoneDataRetrieved = await myServer.retrievePhoneManager(connectDb, LOGGED_IN_USER_ID);
  
  // it sends back a response with the data
  console.log("Phone data Response from Main to Renderer on 'ADD' button clicked:", phoneDataRetrieved);
  mainWindow.webContents.send('phoneDataResponse', JSON.stringify(phoneDataRetrieved));

  if(mainWindow){
    console.log("data sent")

  }else{
    console.log("data not sent")
  }
});





//  2. Receives credentials Request from Renderer to when the app is starting again (retrieve data on page load)
//  3. Receives credentials Request from Renderer to when data is being DELETED (so it forces retrieves and page load)
// -------------------------------------------------------------------------------------------------------------
ipcMain.on('requestPhoneData', async (event, userID) => {

  // retrieve from DATABASE and send back to the renderer to have data persistency in there when app is opened again
  const phoneDataRetrieved = await myServer.retrievePhoneManager(connectDb, userID);

  // Checks the null value for empty table / or when the system is being started firt time
  // since it will always tries to retrive I check before 
  if(phoneDataRetrieved === null){
     console.log("table is empty!")
  }else{
    console.log("Phone data Retrieved and sent from Main to Renderer on 'PAGE LOAD': ", phoneDataRetrieved);
    mainWindow.webContents.send('phoneDataResponse', JSON.stringify(phoneDataRetrieved));
  }
});




/**
 * It listen for the dele request from renderer and it returns the delete reponse in which will trigger the 
 * retrive function to update the table on page load. (That way just refresh the table in the renderer).
 * 
 * Response back to renderer will be sent only when table row is actually is deleted
 */
ipcMain.on('deletePhoneRequest', (event, userPhoneData) => {

  // extract data sent from renderer
  const { LOGGED_IN_USER_ID, name, phoneNumber} = JSON.parse(userPhoneData);

  console.log('Delete phone request received in the Main from Renderer:', userPhoneData);

  console.log('ID:', LOGGED_IN_USER_ID);
  console.log('NAME:', name);
  console.log('PHONE NUMBER:', phoneNumber);
  

  myServer.deletePhoneRow(connectDb,LOGGED_IN_USER_ID, name, phoneNumber)

  console.log("delete response:", userPhoneData)
  // Sending a response back to the renderer process
  mainWindow.webContents.send('deletePhoneResponse', userPhoneData);
});




// listen for the CSV Creation request from Renderer on button click for (CREDENTIALS SYSTEM)
ipcMain.on('requestPhoneDataCSV', async (event, userID) => {

  console.log("CSV > Request from Renderer received in the Main for PHONE SYSTEM with userID:", userID)

  // retrieve from DATABASE and send back to the renderer to have data persistency in there when app is opened again
  const phoneDataRetrieved = await myServer.retrievePhoneManager(connectDb, userID);

  // Checks the null value for empty table / or when the system is being started firt time
  // since it will always tries to retrive I check before 
   if(phoneDataRetrieved === null){
    console.log("table is empty!")
    }else{
    console.log("Phone data Retrieved and sent from Main to Renderer for PDF:", phoneDataRetrieved);
    }

  // it calls the PDF function that holds the parameters values accordingly
  generateCSV.phoneCSVgenerator(event, dialog, path, fs, app, phoneDataRetrieved);
});







////////// ----- import CSV request (CREDENTIALS)-----

// listen for the CSV Creation request from Renderer on button click for (CREDENTIALS SYSTEM)
ipcMain.on('CSVimportRequestCredentials', async (event, userID) => {

  console.log("CSV IMPORT: Request from Renderer received in the Main for CREDENTIALS SYSTEM with userID:", userID)

  const CSVimport = await importCSV.parseCSVcredentials(connectDb, userID);
 
  if (CSVimport){
    console.log("CSV credentials data PROCESSED!!!")
    // sending a CSV response to triger the load data on "page load"
  mainWindow.webContents.send('CSVimportResponseCredentials', userID);
  }  
});



////////// ----- import CSV request (PHONE)-----

// listen for the CSV Creation request from Renderer on button click for (CREDENTIALS SYSTEM)
ipcMain.on('CSVimportRequestPhone', async (event, userID) => {

  console.log("CSV IMPORT: Request from Renderer received in the Main for PHONE SYSTEM with userID:", userID)

  const CSVimport = await importCSV.parseCSVphone(connectDb, userID);
 
  if (CSVimport){
    console.log("CSV phone data PROCESSED!!!")
    // sending a CSV response to triger the load data on "page load"
  mainWindow.webContents.send('CSVimportResponsePhone', userID);
  }  
});

} //--------- MAIN window ends here  ------------//








// Handle the "quit-app" message from the renderer process
ipcMain.on('quit-app', function () {
  app.quit();

  // CLOSE database when closing the app
  myServer.closeDbConnection();
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
