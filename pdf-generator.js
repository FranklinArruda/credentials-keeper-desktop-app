const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const path = require('path');

/**
 * Creates a CSV for the Credentials System
 * It holds the parameters: event, dialog, path, app, and retrieved data that is used when being called in the main.
 * Using the parameters this way I would not have to duplicate a 'require' module in every file
 * It is then output the CSV to the working directory as well as the option to save it locally by opening a window
 * 
 */
function credentialsPDFgenerator(event, dialog, path, app, credentialsDataRetrieved) {
  
  // Define the CSV file path and headers
  const csvFilePath = path.join(app.getPath('desktop'), 'output.csv');
  const csvWriter = createCsvWriter({
      path: csvFilePath,
      header: [
          { id: 'subject', title: 'Subject' },
          { id: 'userName', title: 'Username' },
          { id: 'password', title: 'Password' }
      ]
  });

  // Write the data to the CSV file
  csvWriter.writeRecords(credentialsDataRetrieved)
      .then(() => {
          console.log('CSV file created successfully');
          console.log('Data written to CSV:', credentialsDataRetrieved);
          event.reply('csv-generation-complete', 'CSV file created successfully');
      })
      .catch(err => {
          console.error('Error generating CSV file:', err);
          event.reply('csv-generation-error', 'Error generating CSV file');
      });

      // IT USES (dialog) to open an window so the user can save it anywhere he wants

  // Show a save dialog to get the destination path from the user
  dialog.showSaveDialog({
    title: 'Save CSV',
    defaultPath: path.join(app.getPath('desktop'), 'output.csv'),
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






  
  

 
  


/**
 * Creates a PDF for the Phone System
 * It holds the parameters: event, dialog, path, app, and retrieved data that is used when being called in the main.
 * Using the parameters this way I would not have to duplicate a 'require' moduel in every file
 * It is then output the PDG to working directory as well as the option to save it locally by opening window
 * 
 */
function phonePDFgenerator(event, dialog, path, app, phoneDataRetrieved){
    
  // Create an array of arrays representing the table body based on retrieved data
  const tableBody = phoneDataRetrieved.map(row => [row.PersonName, row.PhoneNumber]);
  console.log("Table Body:", tableBody);

  // Define the content structure for the PDF
  const pdfContent = {
      content: [
      { text: 'Hello, this is your PDF!', fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
      { text: 'Contact List:', fontSize: 14, bold: true, margin: [0, 0, 0, 10] },

      // Table structure with header and dynamically generated body
      {
          table: {
          headerRows: 1,
          widths: ['auto', 'auto'],
          body: [
              [
              { text: 'Name', style: 'tableHeader', fillColor: '#eb5e28', color: '#FFFFFF', bold: true, alignment: 'center'},
              { text: 'Phone Number', style: 'tableHeader', fillColor: '#eb5e28', color: '#FFFFFF', bold: true, alignment: 'center'}

          ],

                    // Data rows with centered text, dynamically generated based on tableBody
              ...tableBody.map(row => row.map(cell => ({ text: cell, alignment: 'center' }))),
              
              // table without styling

              //...tableBody,
          ],
          },
      },
      ],
  };


console.log("PHONE PDF Content:", pdfContent);



const pdfDoc = pdfmake.createPdf(pdfContent);

/**
  // output PDF in the files directory
  pdfDoc.getBase64((pdfData) => {
      const filePath = path.join(__dirname, 'phone.pdf');
      require('fs').writeFileSync(filePath, pdfData, 'base64');
      event.sender.send('phone pdf Generated', filePath);
  });
 */


// output PDF by opening a window to save on the desktop
pdfDoc.getBuffer(async (buffer) => {

  // Show a save dialog to get the destination path from the user
  const result = await dialog.showSaveDialog({
    title: 'Save PDF',
    defaultPath: path.join(app.getPath('desktop'), 'phone.pdf'),
    filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
  });

  // Check if the user didn't cancel the save dialog and a file path is provided
  if (!result.canceled && result.filePath) {
    fs.writeFileSync(result.filePath, buffer);
    event.sender.send('PHONE pdf Generated', 'PDF generated and saved successfully');
  }
});
};

module.exports = {
    credentialsPDFgenerator,
    phonePDFgenerator
 }