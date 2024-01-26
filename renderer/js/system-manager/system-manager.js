

// import PDF handler that send srequest to server to generate PDF
import { generatePDF } from "./pdf-handler.js";

 // Get logged in/out User ID session to use to reference during insertion to DB
 const LOGGED_IN_USER_ID = sessionStorage.getItem('loggedInUserID');  // add userID
 const LOGGED_OUT_USER_ID = sessionStorage.removeItem('loggedInUserID'); // removes userID

 
 // Create PDF
 generatePDF(LOGGED_IN_USER_ID);

 



// It get elements (icon and message on hover)
const uploadIcons = document.querySelectorAll('.upload-icon');
const uploadMessages = document.querySelectorAll('.upload-message');

// it show message on 'hover'
function show(element) {
  element.classList.add('show');
  element.classList.remove('hide');
}

// it hides message when 'hover' is out
function hide(element) {
  element.classList.remove('show');
  element.classList.add('hide');
}


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

  // It get title of the systems
  const credentialsTitle = document.querySelector('.credentials-title');
  const phoneTitle = document.querySelector('.phone-title');

  // It get system Elements
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
function sendCredentialsData(event) { 

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
 * 
 * MAYBE HERE I CAN MAKE A EVENT DELEGATION IN BETWEEN THE SYSTEM
 * 
 * Event listener that sends data from (CREDENTIALS SYSTEM) to database 
 * it checks first the data being sent then call clear input fields
 */
const addButtonCredentials = document.querySelector(".add-button.credentials");
addButtonCredentials.addEventListener("click", function(event) {

  event.preventDefault();
 
  // assign them to a const since I had them as return type in function
  const addData = sendCredentialsData(event);

  // if data is sent then clear input fields
    if(addData){
    
    
    console.log("data added")
    }
    else{
      console.log("data not added.")
    }
});



/**
 * Sends a request to insert data into the database and triggers a response to populate the table in real time.
 * This process is handled within the loadPage function, where the initial response is forced using a helper function.
 * Additionally, a second request is made during the page load, retrieving the same data when the application is reopened.
 */
  function updateCredentialsTableOnPageLoad(){
    
    console.log('Page loaded successfully!');
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

   table.innerHTML = ''; // This will remove all child elements (rows)

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

 
  } else {
    // Handle the case when credentialsData is not an array
    console.error("credentialsData is not an array. It may be of type:", typeof credentialsData);
  }  
}); 
}

// event page load that tirgger the update credentials table
 window.addEventListener('load', updateCredentialsTableOnPageLoad);


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
function deleteCredentialsREQUEST(event) {

  // Check if the clicked element has the target class
  if (event.target.classList.contains('credentials-delete-btn')) {

    // Prevent the default form submission
    event.preventDefault();

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
    window.deleteRequest.deleteRequest('deleteRequest', jsonString);
  }
}


/**
 * It handles the delete Request
 * It call the RefreashTable function to trigger the retrieve on loadpage function
 */
function deleteCredentialsRESPONSE(){
  // Event listener for the delete response
  window.deleteRequest.deleteResponse('deleteResponse', (response) => {
    console.log('Received delete response in the Renderer from Main:', response);
  
    // Refresh the table after successful deletion with a transition
    refreshTable();
  });
  }

  deleteCredentialsRESPONSE();

/**
 * Every time 'delete' button is clicked the page will be refreshed
 * It then triggers the 'window' event listeners on (load) page
 * It removes all child elements (rows)
 * So every time page is loaded it will retrieve the data from server
 * It sends request to retrive the data referencing User ID
 */
function refreshTable() {
        let table = document.getElementById("outputTableCredentials");
        table.innerHTML = ''; 
    window.credentialsSystem.requestCredentialsData('requestCredentialsData', LOGGED_IN_USER_ID);
}

// Document EVENT LISTENER (delegate the button class and data to be deleted)
document.addEventListener('click', function(event) {
  deleteCredentialsREQUEST(event);
});

























  









































////////////////////////////////    TABLE   phone keeper  ////////////////////////////////////////////////////
/*


// ADD DATA TO TABLE (phone keeper)
function addPhoneData(event) { 
  // Get input values 
  let subject = 
    document.getElementById("name").value; 
  let userName = 
    document.getElementById("phone-number").value; 
  
  
  // Get the table and insert a new row at the end 
  let table = document.getElementById("outputTablePhone"); 
  let newRow = table.insertRow(table.rows.length); 
  
  // Insert data into cells of the new row 
  newRow.insertCell(0).innerHTML = subject; 
  newRow.insertCell(1).innerHTML = userName;  
  newRow.insertCell(2).innerHTML = 
    '<button class="button action" onclick="editDataPhone(this)">Edit</button>'+ 
    '<button class="button action" onclick="deleteDataPhone(this)">Delete</button>'; 
  
  // Clear input fields 
  clearInputsPhone(); 
} 


const buttonAddPhone = document.querySelector(".add-button.phone");
buttonAddPhone.addEventListener("click", function(event) {
 
  // Prevent the default form submission
  event.preventDefault();
  addPhoneData(event);
});


// EDIT TABLE
function editDataPhone(button) { 
  
  // Get the parent row of the clicked button 
  let row = button.parentNode.parentNode; 
  
  // Get the cells within the row 
  let name = row.cells[0]; 
  let phonenumber = row.cells[1]; 
 
  
  
  // Prompt the user to enter updated values 
  let nameInput = 
    prompt("Enter the updated name:", 
    name.innerHTML);

  let phoneNumberInput = 
    prompt("Enter the updated phone number:", 
    phonenumber.innerHTML); 

 
  
  // Update the cell contents with the new values 
  name.innerHTML = nameInput; 
  phonenumber.innerHTML = phoneNumberInput; 
  
} 




function deleteDataPhone(button) { 
  
  // Get the parent row of the clicked button 
  let row = button.parentNode.parentNode; 

  // Remove the row from the table 
  row.parentNode.removeChild(row); 
} 


function clearInputsPhone() { 
  // Clear input fields 
  document.getElementById("name").value = ""; 
  document.getElementById("phone-number").value = ""; 
 
} 


		   


*/