

/**
 * It gets all the input values with by ID
 * @returns input values from credentials form system
 */
function getPhoneInputValues(){
    let personsName = document.getElementById("name").value; 
    let phoneNumber = document.getElementById("phone-number").value; 
return { personsName, phoneNumber };
}

/**
* Get form inputs values and set to 'empty' string 
* It clear all inputs when 'add' button is clicked
*/
function clearInputsCredentials() { 
    document.getElementById("name").value = ""; 
    document.getElementById("phone-number").value = ""; 
console.log("Phone Input fields cleared out successfully!");
}; 

/**
* Get form inputs values 
* Event prevent page from reload
* It sends a request to server through IPC to insert data into DB
* @returns true if data is being sent
*/
function sendPhoneData(event, LOGGED_IN_USER_ID) { 
// Get input values 
const { personsName, phoneNumber } = getPhoneInputValues();

  // Check if 'window.ipcRenderer' is defined
  if (window.credentialsSystem) {
    const userPhoneData = { 
        LOGGED_IN_USER_ID: LOGGED_IN_USER_ID, // sending logged in user ID as reference
        personsName: personsName,
        phoneNumber: phoneNumber
    };

    console.log("User phone object", userPhoneData)

   //Send Request to server to Insert user data into DB
   window.phoneSystem.sendPhoneToDatabase('sendPhoneData', JSON.stringify(userPhoneData));
   console.log("Phone data sent Succcessfully from Renderer to Main:", userPhoneData)
  
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
function updatePhoneTableOnPageLoad(LOGGED_IN_USER_ID){
  
  console.log('Phone session Page ---loaded successfully!');

  // Request data on Page load
  window.phoneSystem.requestPhoneData('requestPhoneData', LOGGED_IN_USER_ID);

  // Retrieved data Response when 'add button' is clicked
  window.phoneSystem.receivePhoneData('phoneDataResponse', (phoneDataRetrieved) => {
  console.log("Retrieved Phone data from server to Renderer on 'PAGE LOAD' successfully:", phoneDataRetrieved);

  // Parse the string into a JSON object
  let phoneData;

  try {
    phoneData = JSON.parse(phoneDataRetrieved);
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return; // Stop further execution if parsing fails
  }

 // Clear existing rows in the table
 let table = document.getElementById("outputTablePhone");

 // Keep the header row and remove all other rows
for (let i = table.rows.length - 1; i > 0; i--) {
  table.deleteRow(i);
}

// Check if credentialsData is an array
if (Array.isArray(phoneData)) {

  // Iterate through each object in phone data
  phoneData.forEach((dataObject) => {

      // Get the table and insert a new row at the end 
     // let table = document.getElementById("outputTableCredentials"); 
      let newRow = table.insertRow(table.rows.length); 
      
      // Insert data into cells of the new row
      // Ensure that the property names used in your JavaScript code match the actual property names of the data you are working with
      newRow.insertCell(0).innerHTML = dataObject.name || '';
      newRow.insertCell(1).innerHTML = dataObject.number || '';
      newRow.insertCell(2).innerHTML =
        '<button class="action phone-delete-btn button">Delete</button>';
  });

  // call copy to clipboard function
  copyToClipboard();

} else {
  // Handle the case when credentialsData is not an array
  console.error("phoneData is not an array. It may be of type:", typeof phoneData);
}  
}); 
}



function copyToClipboard() {
  console.log("copyToClipBoard function called (phone session)");
  document.getElementById("outputTablePhone").addEventListener("click", function (e) {
    if (e.target.tagName === "TD") {
        const textToCopy = e.target.textContent;

        // Use the Clipboard API to copy text to the clipboard
        navigator.clipboard.writeText(textToCopy)
            .then(() => {
                // Show the clipboard message
                const clipboardMessage = document.getElementById("clipboardMessagePhone");
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
function deletePhoneREQUEST(event, LOGGED_IN_USER_ID) {

  // Accessing information from the clicked element or its related elements
  const row = event.target.closest('tr'); // Assuming the button is inside a table row
  const name = row.cells[0].textContent;
  const phoneNumber = row.cells[1].textContent;


  // You can now use the extracted information as needed
  console.log('Name:', name);
  console.log('Phone Number:', phoneNumber);

  // data object with all inputs
  const userPhoneData = {
      LOGGED_IN_USER_ID: LOGGED_IN_USER_ID, // sending logged in user ID as reference
      name: name,
      phoneNumber: phoneNumber,
  };

  // Serialize the object into a JSON-formatted string before sending
  const jsonString = JSON.stringify(userPhoneData);
  console.log('Sending Phone delete request from the Renderer to main:', jsonString);
  window.deletePhone.deletePhoneRequest('deletePhoneRequest', jsonString);

}



/**
 * Every time 'delete' button is clicked the page will be refreshed
 * It then triggers the 'window' event listeners on (load) page
 * It removes all child elements (rows)
 * So every time page is loaded it will retrieve the data from server
 * It sends request to retrive the data referencing User ID
 */
function refreshPhoneTable(LOGGED_IN_USER_ID) {
  let table = document.getElementById("outputTablePhone");
 
  // Keep the header row and remove all other rows
  for (let i = table.rows.length - 1; i > 0; i--) {
    table.deleteRow(i);
}

// here I send a request to to be returned to table response with data
window.phoneSystem.requestPhoneData('requestPhoneData', LOGGED_IN_USER_ID);
}



/**
* It handles the delete Request
* It call the RefreashTable function to trigger the retrieve on loadpage function
*/
function deletePhoneRESPONSE(LOGGED_IN_USER_ID){
  // Event listener for the delete response
  window.deletePhone.deletePhoneResponse('deletePhoneResponse', (userPhoneData) => {
  console.log('Received delete response in the Renderer from Main:', userPhoneData);
  
  // Refresh the table after successful deletion with a transition
  refreshPhoneTable(LOGGED_IN_USER_ID);
  });
  }







// credentials system
export{
  sendPhoneData,
  updatePhoneTableOnPageLoad,
  deletePhoneREQUEST,
  deletePhoneRESPONSE
}




