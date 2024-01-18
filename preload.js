
// geeting electron
const { contextBridge, ipcRenderer } = require('electron');


//----------------------SEND USER REGISTRATION DATA TO MAIN --------------------------------------------
const rendererToMain = {
  register: (channel, data) => ipcRenderer.send(channel, data), // send
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)) // receives
};
// Expose indexBridge and ipcRenderer in the main world
contextBridge.exposeInMainWorld("ipcRenderer", rendererToMain);



//----------------------SEND LOGIN REQUEST MESSAGE AND PASS TO MAIN --------------------------------------------
const loginRequest = { 
    send: (channel, data) =>  ipcRenderer.send(channel, data),
    receive: (channel, func) => { ipcRenderer.on(channel, (event, ...args) => func(...args));
    }
};
// Expose loginRequest to the window object
contextBridge.exposeInMainWorld('loginRequest', loginRequest);



//----------------------LISTEN for the login response from MAIN to RENDERER(LOGIN)
ipcRenderer.on('login:response', (event, userEnteredPassword) => {
    console.log('Received password in preload:', userEnteredPassword);

    // window object to access password 
     window.userEnteredPassword = userEnteredPassword;

      // Send the password back to the renderer process
  ipcRenderer.send('login:password', userEnteredPassword);
  });




//----------------------SEND HINT REQUEST MESSAGE AND VALUE TO MAIN --------------------------------------------
const hintRequest = { 
  send: (channel, data) =>  ipcRenderer.send(channel, data),
  receive: (channel, func) => { ipcRenderer.on(channel, (event, ...args) => func(...args));
  }
};
// Expose loginRequest to the window object
contextBridge.exposeInMainWorld('hintRequest', hintRequest);



//----------------------LISTEN for the login response from MAIN to RENDERER(LOGIN)
ipcRenderer.on('hint:response', (event, userEnteredHint) => {
  console.log('Received hint in preload:', userEnteredHint);

  // window object to access password 
   window.userEnteredHint = userEnteredHint;

    // Send the password back to the renderer process
ipcRenderer.send('hint:password', userEnteredHint);
});



