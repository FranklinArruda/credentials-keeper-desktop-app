

const { dialog } = require('electron');
//const Papa = require('papaparse');
   // Read the file content using Node.js 'fs' module
   const fs = require('fs');

   const csv = require('csv-parser');

   const myServer = require('./database-manager.js');
   


// This function is for opening the file dialog using Electron's dialog API 
// with a return type 
async function openFileDialog() {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'CSV Files', extensions: ['csv'] }
    ]
  });
  return result.filePaths;
}

// parseCSVfile credentials
//parameter database connection + logged in user id
async function parseCSVcredentials(connectDb, LOGGED_IN_USER_ID){

  const filePaths = await openFileDialog();

  const filePath = filePaths[0];

  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', data => results.push(data))
      .on('end', () => {
        console.log('CSV Data:', results);

        // extractdata using for loop
        results.forEach(credential => {
          const { Subject, Username, Password } = credential;
          
          if (Subject && Username && Password) {

            // log data to check 
            console.log("Subject:" + Subject + "Username:" + Username + "Password: " + Password )
            
            // call insert credentials from database management server 
            // this will insert here
            myServer.insertCredentialsSystem(connectDb, LOGGED_IN_USER_ID, Subject, Username, Password);
          } else {
            console.error('Invalid data:', credential);
          }
        });



        resolve(results);
      })
      .on('error', error => {
        console.error('Error parsing CSV:', error);
        reject(error);
      });
  });
}



// parseCSVfile credentials
//parameter database connection + logged in user id
async function parseCSVphone(connectDb, LOGGED_IN_USER_ID){

  const filePaths = await openFileDialog();

  const filePath = filePaths[0];
  return new Promise((resolve, reject) => {
    const results = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', data => results.push(data))
      .on('end', () => {
        console.log('CSV Data:', results);

        // extractdata using for loop
        results.forEach(phone => {
          const { Name, Number} = phone;

          if (Name && Number) {

            // log data to check 
            console.log("Name:" + Name + "Phone Number:" + Number)
            
            // call insert credentials from database management server 
            // this will insert here
            myServer.insertPhoneSystem(connectDb, LOGGED_IN_USER_ID, Name, Number);
          } else {
            console.error('Invalid data:', phone);
          }
        });

        resolve(results);
      })
      .on('error', error => {
        console.error('Error parsing CSV:', error);
        reject(error);
      });
  });
}

module.exports = {
  parseCSVcredentials,
  parseCSVphone
}