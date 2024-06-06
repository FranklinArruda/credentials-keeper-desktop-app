

/**
 * Event delegation for both Credentials and Phone System when clicked
 * It exports this function to be used the the system manager
 */
function generatePDF(LOGGED_IN_USER_ID){
   
    // event listener deligation that look up for both systems buttons ID's element
    document.addEventListener('click', function(event){
        
        // both genarate PDF buttons elements for each system
        const credentialsPDF = document.getElementById("generateCredentialsSystemPDF"); 
        const phonePDF = document.getElementById("generatePhoneSystemPDF");

        // Check if the clicked element is genarateCredentialsPDF
        if (event.target === credentialsPDF) {
            
            // call function genarate PDF for credentials system
            console.log("Credentials PDF clicked! Performing action A.");
            PDFcredentialsRequest(LOGGED_IN_USER_ID);

        } else if (event.target === phonePDF) {
            
            PDFphoneRequest(LOGGED_IN_USER_ID);
            // call function genarate PDF for phone system
            console.log("Phone PDF clicked! Performing action B.");
        }
    });
}


/**
 * CREDENTIALS SYSTEM
 * 
 * It sends a request to server with the logged in user on button clicked.
 */
function PDFcredentialsRequest(LOGGED_IN_USER_ID){
   window.credentialsDataPDF.requestCredentialsDataPDF('requestCredentialsDataPDF', LOGGED_IN_USER_ID); //OK
};



/**
 * PHONE SYSTEM
 * 
 * It sends a request to server with the logged in user on button clicked.
 */
function PDFphoneRequest(LOGGED_IN_USER_ID){
    window.credentialsDataPDF.requestCredentialsDataPDF('requestPhoneDataPDF', LOGGED_IN_USER_ID); //OK
 };






function importRequestCSV(LOGGED_IN_USER_ID){
    window.importCredentialsCSVfileTEST.requestImportCSV('requestImportCSV', LOGGED_IN_USER_ID);
}







        function importCSV(LOGGED_IN_USER_ID){

            
        const clickTest = document.querySelector(".upload-icon.credentials");


        if(clickTest){
        // Adding event listener to the button
        clickTest.addEventListener('click', function(event) {
            
            importRequestCSV(LOGGED_IN_USER_ID);
        });
        }else{
            console.log("bad thing")
        }
        

            }


        export{
            generatePDF,importCSV
        }