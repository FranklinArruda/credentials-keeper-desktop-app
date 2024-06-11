const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/**
 * Creates a CSV for the Credentials System
 * It holds the parameters: event, dialog, path, app, and retrieved data that is used when being called in the main.
 * Using the parameters this way I would not have to duplicate a 'require' module in every file
 * It is then output the CSV to the working directory as well as the option to save it locally by opening a window
 * 
 */
function credentialsCSVgenerator(event, dialog, path, fs, app, credentialsDataRetrieved) {

  // Output CSV in the current working director
  //const csvFilePath = path.join(process.cwd(), 'output.csv'); 

  // Define the CSV file path and headers
  const csvFilePath = path.join(app.getPath('desktop'), 'credentialsData.csv');
  
  const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: [
          { id: 'subject', title: 'Subject' },
          { id: 'userName', title: 'Username' },
          { id: 'password', title: 'Password' }
      ]
  });

  // Log the data to be written to CSV
  console.log('Data to be written to CSV:', credentialsDataRetrieved);

  // Validate data before writing
  const validData = credentialsDataRetrieved.filter(item => 
    item.subject && item.userName && item.password);

  // Write the data to the CSV file
  csvWriter.writeRecords(credentialsDataRetrieved)
      .then(() => {
          console.log('CSV file created successfully');
          console.log('Data written to CSV:', validData);
          event.reply('csv-generation-complete', 'CSV file created successfully');
      })
      .catch(err => {
          console.error('Error generating CSV file:', err);
          event.reply('csv-generation-error', 'Error generating CSV file');
      });

      // IT USES (dialog) to open an window so the user can save it anywhere he wants
      openDialogForCSV(event,dialog,csvFilePath,fs)
}


/**
 * Creates a CSV for the Phone System
 * It holds the parameters: event, dialog, path, app, and retrieved data that is used when being called in the main.
 * Using the parameters this way I would not have to duplicate a 'require' module in every file
 * It is then output the CSV to the working directory as well as the option to save it locally by opening a window
 * 
 */
function phoneCSVgenerator(event, dialog, path, fs, app, phoneDataRetrieved) {

  // Output CSV in the current working director
  //const csvFilePath = path.join(process.cwd(), 'output.csv'); 

  // Define the CSV file path and headers
  const csvFilePath = path.join(app.getPath('desktop'), 'phoneNumberData.csv');
  
  const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: [
          { id: 'PersonName', title: 'PersonName' },
          { id: 'PhoneNumber', title: 'PhoneNumber' }
      ]
  });

  // Log the data to be written to CSV
  console.log('Data to be written to CSV:', phoneDataRetrieved);

  // Validate data before writing
  const validData = phoneDataRetrieved.filter(item => 
    item.PersonName && item.PhoneNumber);

  // Write the data to the CSV file
  csvWriter.writeRecords(phoneDataRetrieved)
      .then(() => {
          console.log('CSV file created successfully');
          console.log('Data written to CSV:', validData);
          event.reply('csv-generation-complete', 'CSV file created successfully');
      })
      .catch(err => {
          console.error('Error generating CSV file:', err);
          event.reply('csv-generation-error', 'Error generating CSV file');
      });

      // IT USES (dialog) to open an window so the user can save it anywhere he wants

      openDialogForCSV(event,dialog,csvFilePath,fs)
}




function openDialogForCSV(event,dialog,csvFilePath,fs){

  // Show a save dialog to get the destination path from the user
dialog.showSaveDialog({
title: 'Save CSV',
defaultPath: csvFilePath, // Set default path to current working directory

filters: [{ name: 'CSV Files', extensions: ['csv'] }],
}).then(result => {
// Check if the user didn't cancel the save dialog and a file path is provided
if (!result.canceled && result.filePath) {
// Move the generated CSV file to the user-selected location
fs.rename(csvFilePath, result.filePath, err => {
  if (err) {
    console.error('Error saving CSV file:', err);
    event.reply('csv-save-error', 'Error saving CSV file');
  } else {
    console.log('CSV file saved successfully');
    event.reply('csv-save-complete', 'CSV file saved successfully');
  }
});
}
});
}





  
  

 
  




module.exports = {
    credentialsCSVgenerator,
    phoneCSVgenerator
 }