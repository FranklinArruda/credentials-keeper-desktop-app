


// ----------GENERATE CSV FILE --------------


/**
 * Event delegation for both Credentials and Phone System when clicked
 * It exports this function to be used the the system manager
 */
function CSVgenerate(LOGGED_IN_USER_ID){
   
    // event listener deligation that look up for both systems buttons ID's element
    document.addEventListener('click', function(event){
        
        // both genarate PDF buttons elements for each system
        const credentialsCSV = document.getElementById("generateCredentialsSystemPDF"); 
        const phoneCSV = document.getElementById("generatePhoneSystemPDF");

        // Check if the clicked element is genarateCredentialsPDF
        if (event.target === credentialsCSV) {
            
            // call function genarate PDF for credentials system
            console.log("Credentials PDF clicked! Performing action A.");
            CSVcredentialsRequest(LOGGED_IN_USER_ID);

        } else if (event.target === phoneCSV) {
            
            CSVphoneRequest(LOGGED_IN_USER_ID);
            // call function genarate PDF for phone system
            console.log("Phone CSV clicked! Performing action B.");
        }
    });
}


/**
 * CREDENTIALS SYSTEM
 * 
 * It sends a request to server with the logged in user on button clicked.
 */
function CSVcredentialsRequest(LOGGED_IN_USER_ID){
   window.credentialsDataCSV.requestCredentialsDataCSV('requestCredentialsDataCSV', LOGGED_IN_USER_ID); //OK
};



/**
 * PHONE SYSTEM
 * 
 * It sends a request to server with the logged in user on button clicked.
 */
function CSVphoneRequest(LOGGED_IN_USER_ID){
    window.credentialsDataCSV.requestCredentialsDataCSV('requestPhoneDataCSV', LOGGED_IN_USER_ID); //OK
 };





// ----------IMPORT CSV FILE --------------

/**
 * CREDENTIALS SYSTEM
 * 
 * It sends a request to server in order TO IMPORT CSV file and Insert into DATABASE
 */
function importRequestCSVcredentials(LOGGED_IN_USER_ID){
    window.importCSVcredentials.CSVimportRequestCredentials('CSVimportRequestCredentials', LOGGED_IN_USER_ID);

    if(window){
        console.log("CSV CREDNETIALS REQUEST MADE ")
    }
}


/**
 * CREDENTIALS SYSTEM
 * 
 * It sends a request to server in order TO IMPORT CSV file and Insert into DATABASE
 */
function importRequestCSVPhone(LOGGED_IN_USER_ID){
      window.importCSVphone.CSVimportRequestPhone('CSVimportRequestPhone', LOGGED_IN_USER_ID);

      if(window){
        console.log("CSV PHONE REQUEST MADE ")
    }
    }


/**
 * I t sends a request from Renderer to Server with logged in user ID
 * It handles the data transfer (import / read from csv) in the main from pdf-generator.js
 */
function CSVimportRequest(LOGGED_IN_USER_ID) {    
    const credentials = document.getElementById("uploadIconCredentials");
    const phone = document.getElementById("uploadIconPhone");

    if (credentials) {
        credentials.addEventListener('click', function(event) {
            importRequestCSVcredentials(LOGGED_IN_USER_ID);
        });
    }

    if (phone) {
        phone.addEventListener('click', function(event) {
            console.log("ICON PHONE CLICKED CSV IMPORT");
            importRequestCSVPhone(LOGGED_IN_USER_ID);
        });
    }
}


  // exports both (CSV generator and Import CSV from desktop to system)      
export{
    CSVgenerate,
    CSVimportRequest
}