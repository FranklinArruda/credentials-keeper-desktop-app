const createCsvWriter = require('csv-writer').createObjectCsvWriter;

/**
 * Creates a CSV for the Credentials System
 * It holds the parameters: event, dialog, path, app, and retrieved data that is used when being called in the main.
 * Using the parameters this way I would not have to duplicate a 'require' module in every file
 * It is then output the CSV to the working directory as well as the option to save it locally by opening a window
 * 
 */
function credentialsCSVgenerator(event, dialog, path, fs, app, credentialsDataRetrieved) {

    // IT USES (dialog) to open a window so the user can save it anywhere they want
    openDialogForCSV(event, dialog, path, fs, app, credentialsDataRetrieved, "CredentialsData.csv");
}


/**
 * Creates a CSV for the Phone System
 * It holds the parameters: event, dialog, path, app, and retrieved data that is used when being called in the main.
 * Using the parameters this way I would not have to duplicate a 'require' module in every file
 * It is then output the CSV to the working directory as well as the option to save it locally by opening a window
 * 
 */
function phoneCSVgenerator(event, dialog, path, fs, app, phoneDataRetrieved) {

  // IT USES (dialog) to open a window so the user can save it anywhere they want
  openDialogForCSV(event, dialog, path, fs, app, phoneDataRetrieved,"PhoneNumberData.csv");
}

function openDialogForCSV(event, dialog, path, fs, app, dataRetrieved,defaultFileName) {
  
  // Show the save dialog to get the destination path from the user
  dialog.showSaveDialog({
    title: 'Save CSV',
    defaultPath: path.join(app.getPath('desktop'), defaultFileName), // Default file path (Desktop)
    filters: [{ name: 'CSV Files', extensions: ['csv'] }],
  }).then(result => {
    // Check if the user didn't cancel and a file path is provided
    if (!result.canceled && result.filePath) {

      // Define the CSV file path and headers based on data type (credentials or phone)
      const csvWriter = createCsvWriter({
        path: result.filePath, // Save to the user-selected file path
        header: dataRetrieved[0].subject ? [
          { id: 'subject', title: 'Subject' },
          { id: 'userName', title: 'Username' },
          { id: 'password', title: 'Password' }
        ] : [
          { id: 'name', title: 'Name' },
          { id: 'number', title: 'Number' }
        ]
      });

      // Validate data before writing
      const validData = dataRetrieved.filter(item => {
        return (item.subject && item.userName && item.password) || (item.name && item.number);
      });

      // Write the data to the CSV file
      csvWriter.writeRecords(validData)
        .then(() => {
          console.log('CSV file saved successfully at ' + result.filePath);
          event.reply('csv-save-complete', 'CSV file saved successfully');
        })
        .catch(err => {
          console.error('Error generating CSV file:', err);
          event.reply('csv-save-error', 'Error generating CSV file');
        });
    }
  }).catch(err => {
    console.error('Error showing save dialog:', err);
    event.reply('csv-save-error', 'Error showing save dialog');
  });
}




module.exports = {
    credentialsCSVgenerator,
    phoneCSVgenerator
 }