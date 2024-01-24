
// geeting electron
const { contextBridge, ipcRenderer } = require('electron');


//----------------------SEND USER REGISTRATION DATA TO MAIN --------------------------------------------
const rendererToMain = {
  register: (channel, data) => ipcRenderer.send(channel, data), // send
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)) // receives
};
// Expose indexBridge and ipcRenderer in the main world
contextBridge.exposeInMainWorld("userRegistration", rendererToMain);


//----------------------SEND LOGIN REQUEST MESSAGE TO MAIN --------------------------------------------
const loginRequest = { 
    send: (channel, data) =>  ipcRenderer.send(channel, data),
    receive: (channel, func) => { ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
};
// Expose loginRequest to the window object
contextBridge.exposeInMainWorld('loginRequest', loginRequest);


//----------------------SEND 'forgot' PASSWORD REQUEST TO MAIN --------------------------------------------
const passwordRequest = { 
  send: (channel, data) =>  ipcRenderer.send(channel, data),
  receive: (channel, func) => { ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
};
// Expose loginRequest to the window object
contextBridge.exposeInMainWorld('passwordRequest', passwordRequest);




// ---------------------- sendCredentialsToDatabase: Request to store data in the (Database)
// ---------------------- requestCredentialsData: Request retrieve data on (page load)
const credentialsSystem = {

  // send request
  sendCredentialsToDatabase: (channel, data) => ipcRenderer.send(channel, data), 
  requestCredentialsData: (channel, data) => ipcRenderer.send(channel, data),

  // response for both request
  receiveCredentialsData: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)) // receives
};
// Expose indexBridge and ipcRenderer in the main world
contextBridge.exposeInMainWorld("credentialsSystem", credentialsSystem);





/**
 * Request Message from (CREDENTIALS SYSTEM)
 * 
 * It sends request to main with ID as data and retrieve data from dabase when page is loaded
 * It returns a JSON data format with stringfy 
 */
/*
const requestDataCredentialsSystem = {
  send: (channel, data) => ipcRenderer.send(channel, data), // send
  receive: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)) // receives
};
// Expose indexBridge and ipcRenderer in the main world
contextBridge.exposeInMainWorld("requestDataCredentialsSystem", requestDataCredentialsSystem);
*/







const deleteRequest = {
  deleteRequest: (channel, data) => {
    ipcRenderer.send(channel, data);
    console.log('Sending delete request from the renderer to main:', data);
  },

  deleteResponse: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => {
      console.log('Received delete response in the preload from main:', args);
      func(...args);
    });
  },
};

contextBridge.exposeInMainWorld('deleteRequest', deleteRequest);































/*
//----------------------LISTEN for the JSON data from main (credentials system)
ipcRenderer.on('update:credentialData', (event, data) => {
    console.log('Received CREDENTIALS DATA IN THE PRELOAD:', data);

    // window object to access password 
    // window.userId = userId;

      // Send the password back to the renderer process
  ipcRenderer.send('send:credentials', data);
  });
*/