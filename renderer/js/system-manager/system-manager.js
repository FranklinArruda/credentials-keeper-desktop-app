
//ImportPDF, ExportPDF (csv data)
// import PDF handler that send srequest to server to generate CSV
import { CSVgenerate, CSVimportRequest } from "./csv-handler.js";

// import PDF handler that send srequest to server to generate PDF
import {  deleteCredentialsREQUEST,
          deleteCredentialsRESPONSE,
          updateCredentialsTableOnPageLoad,
          sendCredentialsData } from "./credentials-session.js";

// import PDF handler that send srequest to server to generate PDF
import {  sendPhoneData,
          updatePhoneTableOnPageLoad,
          deletePhoneREQUEST,
          deletePhoneRESPONSE
         } from "./phone-session.js";


// import CSV handler that send srequest to server to generate CSV FILE
import { tableSearchWrapper } from "./search-list.js";




// Get logged in/out User ID session to use to reference during insertion to DB
const LOGGED_IN_USER_ID = sessionStorage.getItem('loggedInUserID');  // add userID
const LOGGED_OUT_USER_ID = sessionStorage.removeItem('loggedInUserID'); // removes userID


// It get elements (icon and message on hover)
const uploadIcons = document.querySelectorAll('.upload-icon');
const uploadMessages = document.querySelectorAll('.upload-message');

// it show message on 'hover'
function show(element) {
  element.classList.add('show');
  element.classList.remove('hide');
};

// it hides message when 'hover' is out
function hide(element) {
  element.classList.remove('show');
  element.classList.add('hide');
};




// event listener with for each loop that TRIGERS both ICON's (Credentials and Phone System)
// loop through class of the icon for both system
uploadIcons.forEach((uploadIcon, index) => { 

  //when mouse (hover over)
  uploadIcon.addEventListener('mouseover', event => {
    show(uploadMessages[index]); // it adds message
  });

  // when mouse (hover is out)
  uploadIcon.addEventListener('mouseout', event => {
  hide(uploadMessages[index]); // it hides message
  });
});




//------------------Accessible tabs for (CREDENTIALS & PHONE SYSTEMS)
// It gets title of the systems
const credentialsTitle = document.querySelector('.credentials-title');
const phoneTitle = document.querySelector('.phone-title');

// It gets system Elements
const credentialsSystemMenu = document.querySelector('.credentials-manager');
const phoneSystemMenu = document.querySelector('.phone-keeper');

  // event listner to when credentials is clicked === shows system credentials
  credentialsTitle.addEventListener('click', function() {
      showSection(credentialsSystemMenu);
});
  
  // event listner to when phone is clicked === shows system phone
  phoneTitle.addEventListener('click', function() {
    showSection(phoneSystemMenu);
});






/**
 * Add credentials systems to be true always
 * If phone system is clicked hides credentials systems 
 * if credentials system is clicked hides the phone system
 * @param {it holds both phone and credentials system session}  
 */
function showSection(section) {

  // hides both systems
  credentialsSystemMenu.style.display = 'none';
  phoneSystemMenu.style.display = 'none';

  // remove both actives
  credentialsTitle.classList.remove('active');
  phoneTitle.classList.remove('active');

  // display block when either of the conditions is true
  section.style.display = 'block';

  // adds credentials section to be displayed always / add active
  if (section === credentialsSystemMenu) {
    credentialsTitle.classList.add('active');
  } else {
    phoneTitle.classList.add('active');
  }
}



/**
 * Event listener that targets all 'end-session' elements
 * It removes user ID from session - Print out on the console logged out User
 * It redirects User to Home page
 */
const endSessions = document.querySelectorAll('.end-session');

endSessions.forEach(counter => {
counter.addEventListener('click', () => {
    console.log("User with ID:", LOGGED_OUT_USER_ID, " Logged Out Successfully!");
    window.location.href = './1-home-page.html';
  });
});
 



/**
 * Event listener DELIGATION that sends data from both (CREDENTIALS & PHONE SYSTEM) to database 
 * it checks first the data being sent then call clear input fields
 */
 document.addEventListener('click', function(event){
        
  // both genarate PDF buttons elements for each system
  const addButtonCredentials = document.querySelector(".add-button.credentials"); 
  const addButtonPhone = document.querySelector(".add-button.phone");
 
   // Check if the clicked element is genarateCredentialsPDF
  if (event.target === addButtonCredentials) {  
      sendCredentialsData(event, LOGGED_IN_USER_ID);
      

  } else if (event.target === addButtonPhone) {
      sendPhoneData(event, LOGGED_IN_USER_ID);
      console.log("ADDED PHONE SYSTEM");
  }
});



// ----------- LOADING PAGE ------------- //

// event page load that tirgger the update credentials table
window.addEventListener('load', updateCredentialsTableOnPageLoad(LOGGED_IN_USER_ID));

// event page load that tirgger the update credentials table
window.addEventListener('load', updatePhoneTableOnPageLoad(LOGGED_IN_USER_ID));




// Event listener for delete requests in the Credentials and Phone Systems
document.addEventListener('click', function (event) {
  event.preventDefault(); // Prevent the default form submission

  const credentialsDeleteBtn = event.target.closest('.credentials-delete-btn');
  const phoneDeleteBtn = event.target.closest('.phone-delete-btn');

  if (credentialsDeleteBtn) {
      deleteCredentialsREQUEST(event, LOGGED_IN_USER_ID);

  } else if (phoneDeleteBtn) {
      deletePhoneREQUEST(event, LOGGED_IN_USER_ID);
  }
});




/**
 * -------------  REFRESH  page ICON AFTER 'CSV' IS IMPORTED  ---------------
 * 
 * Event listener DELIGATION that REFRESH page to load data from both (CREDENTIALS & PHONE SYSTEM) from DATABASE once CSV is imported 
 * It triggers the load data on page load earlier created to populate tables dinamically.
 * Here it was just created a button to trigger the same function by calling in the even delegation below that listen the entire DOM document
 */
document.addEventListener('click', function(event){

  // both REFRASH page on elements for each system
  const refreshPageButtonCredentials = document.getElementById('reloadPageButtonCredentials');
  const refreshPageButtonPhone = document.getElementById('reloadPageButtonPhone');
 
   // Check if the clicked element is genarateCredentialsPDF
  if (event.target === refreshPageButtonCredentials) { 
    updateCredentialsTableOnPageLoad(LOGGED_IN_USER_ID);
    
  } 

  // Check if the clicked element is genarateCredentialsPDF
  if (event.target === refreshPageButtonPhone) {  
    updatePhoneTableOnPageLoad(LOGGED_IN_USER_ID);
} 
});


// -----------  CSV data populates the table by calling on page load function

// IT HANDLES BOTH CREDENTIALS AND PHONE
  function CSVimportResponse(LOGGED_IN_USER_ID){
  
  // response CREDENTIALS
   window.importCSVcredentials.CSVimportResponseCredentials('CSVimportResponseCredentials', (userID) => {
    console.log('Received CSV import Request from Main for CREDENTIALS IN THE RENDERER:', userID);
    
    updateCredentialsTableOnPageLoad(LOGGED_IN_USER_ID);
    console.log("CSV RESPONSE IN THE RENDERER")
    });

    //-----------------------------------------------------


    // response PHONE
   window.importCSVphone.CSVimportResponsePhone('CSVimportResponsePhone', (userID) => {
    console.log('Received CSV import Request from Main for PHONE IN THE RENDERER:', userID);
    
    updatePhoneTableOnPageLoad(LOGGED_IN_USER_ID);
    console.log("CSV RESPONSE IN THE RENDERER")
    });
  }

/**
 * ----------------  CSV IMPORT request-reposne  ---------------
 * 
 * OPTION 1: TO Load the data to the table once CSV is imported BY clicking on ICON
 * 
 * OPTION 2: Load the data to the table when response is received from Main upon SUCCESSFULL IMPORTING
 * 
 * EITHER WAY the table will be populated with the data...
 * 
 */

deleteCredentialsRESPONSE(LOGGED_IN_USER_ID);

deletePhoneRESPONSE(LOGGED_IN_USER_ID);

CSVgenerate(LOGGED_IN_USER_ID);

CSVimportRequest(LOGGED_IN_USER_ID);

CSVimportResponse(LOGGED_IN_USER_ID);

tableSearchWrapper();




