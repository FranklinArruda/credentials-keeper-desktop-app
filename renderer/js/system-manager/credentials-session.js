

/**
 * It gets all the input values with by ID
 * @returns input values from credentials form system
 */
function getCredentialsInputValues(){
    let subject = document.getElementById("subject").value; 
    let userName = document.getElementById("username").value; 
    let password = document.getElementById("password").value; 
return { subject, userName, password };
}

/**
* Get form inputs values and set to 'empty' string 
* It clear all inputs when 'add' button is clicked
*/
function clearInputsCredentials() { 
    document.getElementById("subject").value = ""; 
    document.getElementById("username").value = ""; 
    document.getElementById("password").value = ""; 
console.log("Credentials Input fields cleared out successfully!");
}; 

/**
* Get form inputs values 
* Event prevent page from reload
* It sends a request to server through IPC to insert data into DB
* @returns true if data is being sent
*/
function sendCredentialsData(event, LOGGED_IN_USER_ID) { 
// Get input values 
const { subject, userName, password } = getCredentialsInputValues();

  // Check if 'window.ipcRenderer' is defined
  if (window.credentialsSystem) {
    const userCredentialsData = { 
        LOGGED_IN_USER_ID: LOGGED_IN_USER_ID, // sending logged in user ID as reference
        subject: subject,
        userName: userName,
        password: password
    };

    //Send Request to server to Insert user data into DB
    window.credentialsSystem.sendCredentialsToDatabase('sendCredentialsData', JSON.stringify(userCredentialsData));
    console.log("Credentials data sent Succcessfully from Renderer to Main:", userCredentialsData)
    
    // call clear inputs function
    clearInputsCredentials();
    return true;
  }
  else {
    console.error('window.ipcRenderer is not defined.');
    return false;
  }
};


/**
 * Sends a request to insert data into the database and triggers a response to populate the table in real time.
 * This process is handled within the loadPage function, where the initial response is forced using a helper function.
 * Additionally, a second request is made during the page load, retrieving the same data when the application is reopened.
 */
function updateCredentialsTableOnPageLoad(LOGGED_IN_USER_ID){
  
  console.log('Credentials session Page ---loaded successfully!');
  // Request data on Page load
  window.credentialsSystem.requestCredentialsData('requestCredentialsData', LOGGED_IN_USER_ID);

  // Retrieved data Response 
  window.credentialsSystem.receiveCredentialsData('credentialsDataResponse', (credentialsDataRetrieved) => {
  console.log("Retrieved Credentials data from server to Renderer on 'PAGE LOAD' successfully:",credentialsDataRetrieved);
  


  // Parse the string into a JSON object
  let credentialsData;

  try {
    credentialsData = JSON.parse(credentialsDataRetrieved);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return; // Stop further execution if parsing fails
  }

 // Clear existing rows in the table
 let table = document.getElementById("outputTableCredentials");

// Keep the header row and remove all other rows
for (let i = table.rows.length - 1; i > 0; i--) {
  table.deleteRow(i);
}
// Check if credentialsData is an array
if (Array.isArray(credentialsData)) {

  // Iterate through each object in credentialsData
  credentialsData.forEach((dataObject) => {

    // Get the table and insert a new row at the end 
    // let table = document.getElementById("outputTableCredentials"); 
      let newRow = table.insertRow(table.rows.length); 
      
      // Insert data into cells of the new row
      newRow.insertCell(0).innerHTML = dataObject.subject || '';
      newRow.insertCell(1).innerHTML = dataObject.userName || '';
      newRow.insertCell(2).innerHTML = dataObject.password || '';
      newRow.insertCell(3).innerHTML =
        '<button class="action credentials-delete-btn button">Delete</button>';
  });

  // call copy to clipboard function
  copyToClipboard();

} else {
  // Handle the case when credentialsData is not an array
  console.error("credentialsData is not an array. It may be of type:", typeof credentialsData);
} 

}); 
}




  function copyToClipboard() {
      console.log("copyToClipBoar function called (credentials session)");
    document.getElementById("outputTableCredentials").addEventListener("click", function (e) {
        if (e.target.tagName === "TD") {
            const textToCopy = e.target.textContent;

            // Use the Clipboard API to copy text to the clipboard
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    // Show the clipboard message
                    const clipboardMessage = document.getElementById("clipboardMessageCredentials");
                    clipboardMessage.style.display = "flex";

                    // Hide the message after a short delay
                    setTimeout(() => {
                        clipboardMessage.style.display = "none";
                    }, 1500);
                })
                .catch((err) => {
                    console.error('Unable to copy to clipboard:', err);
                });
        }
    });
}

  


/**
 * DELETE ROW from (CREDENTIALS SYSTEM)
 * 
 * Use event delegation on a parent element that is present in the DOM
 * 
 * DELETE SPECIF ROW when 'delete'button is CLICKED
 * It gets the data from that spaecif row when button is clciked
 * Sends a request to main as JSON object data
 * Query the data to be deleted using that specific data sent dynamically
 */
function deleteCredentialsREQUEST(event, LOGGED_IN_USER_ID) {

   

    // Accessing information from the clicked element or its related elements
    const row = event.target.closest('tr'); // Assuming the button is inside a table row
    const subject = row.cells[0].textContent;
    const userName = row.cells[1].textContent;
    const password = row.cells[2].textContent;

    // You can now use the extracted information as needed
    console.log('Subject:', subject);
    console.log('Username:', userName);
    console.log('Password:', password);

    // data object with all inputs
    const userCredentialsData = {
        LOGGED_IN_USER_ID: LOGGED_IN_USER_ID, // sending logged in user ID as reference
        subject: subject,
        userName: userName,
        password: password
    };

    // Serialize the object into a JSON-formatted string before sending
    const jsonString = JSON.stringify(userCredentialsData);
    console.log('Sending delete request from the Renderer to main:', jsonString);
    window.deleteCredentials.deleteCredentialsRequest('deleteCredentialsRequest', jsonString);

}

/**
 * Every time 'delete' button is clicked the page will be refreshed
 * It then triggers the 'window' event listeners on (load) page
 * It removes all child elements (rows)
 * So every time page is loaded it will retrieve the data from server
 * It sends request to retrive the data referencing User ID
 */
function refreshCredentialsTable(LOGGED_IN_USER_ID) {
    let table = document.getElementById("outputTableCredentials");
   
    // Keep the header row and remove all other rows
    for (let i = table.rows.length - 1; i > 0; i--) {
      table.deleteRow(i);
  }
  
window.credentialsSystem.requestCredentialsData('requestCredentialsData', LOGGED_IN_USER_ID);
}

/**
* It handles the delete Request
* It call the RefreashTable function to trigger the retrieve on loadpage function
*/
function deleteCredentialsRESPONSE(LOGGED_IN_USER_ID){
  // Event listener for the delete response
  window.deleteCredentials.deleteCredentialsResponse('deleteCredentialsResponse', (userCredentialsData) => {
  console.log('Received delete response in the Renderer from Main:', userCredentialsData);
  
  // Refresh the table after successful deletion with a transition
  refreshCredentialsTable(LOGGED_IN_USER_ID);
  });
  }

// credentials system
export{
  deleteCredentialsREQUEST,
  deleteCredentialsRESPONSE,
  updateCredentialsTableOnPageLoad,
  sendCredentialsData
}






