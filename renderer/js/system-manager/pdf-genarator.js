




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

generatePDF();


/**
 * CREDENTIALS SYSTEM
 * 
 * When genarate PDF is clicked it sends a (request) to Server through IPC (API)
 * It returns back all the data retrieved from the database using Logged user ID as response
 * If data is true, it will be appeneded to a PDF document with PDF.window object 
 * Download the PDF into the machine desktop
 * 
 */
function genarateCredentialsPDF(){

}













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
    
}