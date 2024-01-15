
// testing if the preload file is beiing loaded correclty
window.addEventListener('DOMContentLoaded', () => {
    console.log('PRELOAD LOADED SUCCESSFULLY!!!.');
});


const { contextBridge, ipcRenderer } = require('electron');

// API from Renderer.js to Main.js sending(User Registration data)
const rendererToMain = {
  send: (channel, data) => ipcRenderer.send(channel, data), // send
  on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func(...args)), // receives
};

// Expose indexBridge and ipcRenderer in the main world
contextBridge.exposeInMainWorld("ipcRenderer", rendererToMain);