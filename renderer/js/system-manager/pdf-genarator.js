




/**
 * It wrapps up the entire event listeners deligation and have it Imported from GENARATE PDF JS FILE to system manager 
 * event listener deligation that look up at the doc level
 * if credentials PDF is clicked call Genarate PDF, else genarate PHONE PDF system
 */
function generatePDF(){
   
    // event listener deligation that look up for both systems buttons ID's element
    document.addEventListener('click', function(event){
        
        // both genarate PDF buttons elements for each system
        const credentialsPDF = document.getElementById("generateCredentialsSystemPDF"); 
        const phonePDF = document.getElementById("generatePhoneSystemPDF");

        // Check if the clicked element is genarateCredentialsPDF
        if (event.target === credentialsPDF) {
            
            // call function genarate PDF for credentials system
            console.log("Credentials PDF clicked! Performing action A.");
        } else if (event.target === phonePDF) {
            
            // call function genarate PDF for phone system
            console.log("Phone PDF clicked! Performing action B.");
        }
    });
}

//generatePDF();


/**
 * CREDENTIALS SYSTEM
 * 
 * When genarate PDF is clicked it sends a (request) to Server through IPC (API)
 * It returns back all the data retrieved from the database using Logged user ID as response
 * If data is true, it will be appeneded to a PDF document with PDF.window object 
 * Download the PDF into the machine desktop
 * 
 */
function extractDataTest(){


// Retrieved data Response 
window.credentialsSystem.receiveCredentialsData('credentialsDataResponse', (credentialsDataRetrieved) => {
  console.log("Retrieved Credentials data from server to PDF GENERATE on 'PAGE LOAD' successfully:",credentialsDataRetrieved);

  window.jsPDF = window.jspdf.jsPDF; // without this line of code wont run. add this line of code
	
  let doc = new jsPDF();


  const titleText = "HERE IS YOUR BREAKDOWN";
  const titleFontSize = 18;
  const textFontSize = 12;
  const margin = 10;
  
  // Set font size for the title
  doc.setFontSize(titleFontSize);
  doc.setTextColor(200, 0, 0); // Set font color to black (RGB)
  doc.text(titleText, 20, 20); // Display the title at position (20, 20)

  // Set font size and styles for the content text
  doc.setFontSize(textFontSize);
  doc.setFont("Helvetica"); // Set font type to bold
  doc.setTextColor(0, 0, 0); // Set font color to black (RGB)

  // Calculate the y-coordinate position for the content text
  const titleHeight = titleFontSize * 1; // Adjust multiplier as needed for spacing
  const contentY = 20 + titleHeight + margin;

   
 
   
  // Display the content TEXT at the adjusted position
  doc.text(20, contentY, credentialsDataRetrieved, { align: "left" }); // Align the text to the left


	doc.save('HELPER.Results.pdf');
  
  });
}
/*
function extractDataTest() {
   // Retrieved data Response 
   window.credentialsSystem.receiveCredentialsData('credentialsDataResponse', (credentialsDataRetrieved) => {
    console.log("Retrieved Credentials data from server to PDF GENERATE on 'PAGE LOAD' successfully:",credentialsDataRetrieved);
   });
}
*/
// Call the function to extract data when needed
//extractDataTest();













/**
 * PHONE SYSTEM
 * 
 * When genarate PDF is clicked it sends a (request) to Server through IPC (API)
 * It returns back all the data retrieved from the database using Logged user ID as response
 * If data is true, it will be appeneded to a PDF document with PDF.window object 
 * Download the PDF into the machine desktop
 */
function genaratePhonePDF(){
    
}


export{
    extractDataTest
}