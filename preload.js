
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



//----------------------SEND PASSWORD REQUEST TO MAIN --------------------------------------------
const passwordRequest = { 
  send: (channel, data) =>  ipcRenderer.send(channel, data),
  receive: (channel, func) => { ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
};
// Expose loginRequest to the window object
contextBridge.exposeInMainWorld('passwordRequest', passwordRequest);



//----------------------LISTEN for the login response from MAIN to RENDERER(LOGIN)
ipcRenderer.on('login', (event, userEnteredPassword) => {
    console.log('Received password in preload:', userEnteredPassword);

    // window object to access password 
     window.userEnteredPassword = userEnteredPassword;

      // Send the password back to the renderer process
  ipcRenderer.send('login', userEnteredPassword);
  });


/*
//----------------------LISTEN for the login response from MAIN to RENDERER(LOGIN)
ipcRenderer.on('login:response', (event, userId) => {
    console.log('Received id the in preload:', userId);

    // window object to access password 
     window.userId = userId;

      // Send the password back to the renderer process
  ipcRenderer.send('user:id', userId);
  });
*/