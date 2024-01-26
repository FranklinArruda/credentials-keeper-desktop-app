const fs = require('fs');
const pdfmake = require('pdfmake/build/pdfmake');
const vfsFonts = require('pdfmake/build/vfs_fonts');

// install: npm install pdfmake
pdfmake.vfs = vfsFonts.pdfMake.vfs;

/**
 * Creates a PDF for the Credentials System
 * It holds the parameters: event, dialog, path, app, and retrieved data that is used when being called in the main.
 * Using the parameters this way I would not have to duplicate a 'require' moduel in every file
 * It is then output the PDG to working directory as well as the option to save it locally by opening window
 * 
 */
function credentialsPDFgenerator(event, dialog, path, app, credentialsDataRetrieved){
    

    // Create an array of arrays representing the table body based on retrieved data
    const tableBody = credentialsDataRetrieved.map(row => [row.subject, row.userName, row.password]);
    console.log("Table Body:", tableBody);

    // Define the content structure for the PDF
    const pdfContent = {
        content: [
        { text: 'Hello, this is your PDF!', fontSize: 16, bold: true, margin: [0, 0, 0, 10] },
        { text: 'Table Example:', fontSize: 14, bold: true, margin: [0, 0, 0, 10] },

        // Table structure with header and dynamically generated body
        {
            table: {
            headerRows: 1,
            widths: ['auto', 'auto', 'auto'],
            body: [
                [
                { text: 'Subject', style: 'tableHeader', fillColor: '#eb5e28', color: '#FFFFFF', bold: true, alignment: 'center'},
                { text: 'Username', style: 'tableHeader', fillColor: '#eb5e28', color: '#FFFFFF', bold: true, alignment: 'center'},
                { text: 'Password', style: 'tableHeader', fillColor: '#eb5e28', color: '#FFFFFF', bold: true, alignment: 'center'}

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

  
  console.log("PDF Content:", pdfContent);

 
  const pdfDoc = pdfmake.createPdf(pdfContent);

    // output PDF in the files directory
    pdfDoc.getBase64((pdfData) => {
        const filePath = path.join(__dirname, 'output.pdf');
        require('fs').writeFileSync(filePath, pdfData, 'base64');
        event.sender.send('pdfGenerated', filePath);
    });


  // output PDF by opening a window to save on the desktop
  pdfDoc.getBuffer(async (buffer) => {

    // Show a save dialog to get the destination path from the user
    const result = await dialog.showSaveDialog({
      title: 'Save PDF',
      defaultPath: path.join(app.getPath('desktop'), 'output.pdf'),
      filters: [{ name: 'PDF Files', extensions: ['pdf'] }],
    });

    // Check if the user didn't cancel the save dialog and a file path is provided
    if (!result.canceled && result.filePath) {
      fs.writeFileSync(result.filePath, buffer);
      event.sender.send('pdfGenerated', 'PDF generated and saved successfully');
    }
  });
}
  

module.exports = {
    credentialsPDFgenerator
 }