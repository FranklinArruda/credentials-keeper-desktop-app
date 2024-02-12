
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




// -------------------- CREDENTIANSL SYSTEM --------------------------------

//sendCredentialsToDatabase: Request to store data in the (Database)
//requestCredentialsData: Request retrieve data on (page load)
const credentialsSystem = {

  // send request
  sendCredentialsToDatabase: (channel, data) => ipcRenderer.send(channel, data), 
  requestCredentialsData: (channel, data) => ipcRenderer.send(channel, data),

  // response for both request
  receiveCredentialsData: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)) // receives
};
// Expose indexBridge and ipcRenderer in the main world
contextBridge.exposeInMainWorld("credentialsSystem", credentialsSystem);




// SEND 'request' to (RETRIEVE CREDENTIALS) TO PDF generator 
const credentilasDataPDF = { 
  requestCredentialsDataPDF: (channel, data) => {
    ipcRenderer.send(channel, data),
    console.log('Request from Renderer received in the Preload for CREDENTIALS PDF GENERATOR with userID:', data);
  },
  receive: (channel, func) => { 
    ipcRenderer.on(channel, (event, ...args) => {
      console.log('Response from Main to Renderer received in the Preload for CREDENTIALS PDF GENERATOR with data:', args[0]);
      func(...args);
    });
  }
};
// Expose loginRequest to the window object
contextBridge.exposeInMainWorld('credentialsDataPDF', credentilasDataPDF);



// DELETE CREDENTIALS Request 
const deleteCredentialsOnClick = {
  deleteCredentialsRequest: (channel, data) => {
    ipcRenderer.send(channel, data);
    console.log('Sending CREDENTIALS delete request from the renderer to main:', data);
  },

  deleteCredentialsResponse: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => {
      console.log('Received CREDENTIALS delete response in the preload from main:', args);
      func(...args);
    });
  },
};

contextBridge.exposeInMainWorld('deleteCredentials', deleteCredentialsOnClick);




// -------------------- PHONE SYSTEM --------------------------------


//sendPhonetoDatabase: Request to store data in the (Database)
//requestPhoneData: Request retrieve data on (page load)
const phoneSystem = {

  // send request
  sendPhoneToDatabase: (channel, data) => ipcRenderer.send(channel, data), 
  requestPhoneData: (channel, data) => ipcRenderer.send(channel, data),

  // response for both request
  receivePhoneData: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)) // receives
};
// Expose indexBridge and ipcRenderer in the main world
contextBridge.exposeInMainWorld("phoneSystem", phoneSystem);




// DELETE CREDENTIALS Request 
const deletePhoneOnClick = {
  deletePhoneRequest: (channel, data) => {
    ipcRenderer.send(channel, data);
    console.log('Sending PHONE delete request from the renderer to main:', data);
  },

  deletePhoneResponse: (channel, func) => {
    ipcRenderer.on(channel, (event, ...args) => {
      console.log('Received PHONE delete response in the preload from main:', args);
      func(...args);
    });
  },
};

contextBridge.exposeInMainWorld('deletePhone', deletePhoneOnClick);





























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