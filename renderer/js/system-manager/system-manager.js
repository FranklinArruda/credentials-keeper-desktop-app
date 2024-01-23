


import {  } from "./pdf-genarator.js";



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
 * Add credentials systems tobe true always
 * If phone system is clicked hides credentials systems 
 * if credentials system is clicked hides the phone system
 * @param {it holds both phone and credentials system} section 
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



// Select all elements with the class 'end-session'
const endSessions = document.querySelectorAll('.end-session');

// Add click event listener to each end session element
// it is redirect the the start page
// remove the current logged in USER ID
endSessions.forEach(counter => {
  counter.addEventListener('click', () => {

    // storeage session to use to reference during insertion to DB
    const loggedInUser = sessionStorage.getItem('loggedInUserID');
    console.log("User with ID:", loggedInUser, " Logged Out Successfully!");
    window.location.href = './1-home-page.html';
  });
});



////////////////////////////////    TABLE   credentials system  ////////////////////////////////////////////////////

/**
 * ADD data to credentials system table (temporarily as well as the button so the user can interact with)
 * Then , data is being sent to database
 * The button and data that is added temporarilly will be lost when page is loaded, I did that way to prevent blank space etc.
 * @param {event prevent default} event 
 * @returns true if data is being sent
 */
function addCredentialsData(event) { 
  // Get input values 
  let subject = document.getElementById("subject").value; 
  let userName = document.getElementById("username").value; 
  let password = document.getElementById("password").value; 

    // storeage session to use to reference during insertion to DB
    const userID = sessionStorage.getItem('loggedInUserID');
    console.log("Current Logged in user in System Section with ID:", userID);

    //IPC RENDERER (sending user registration data to Main)
			// Check if window.ipcRenderer is defined
			if (window.credentialsSystem) {
				
				// data object with all inputs
				const DATA = { 
					userID: userID, // SENDING THE LOGGED IN USER (ID)
          subject: subject,
					userName: userName,
					password: password
				};

				// Stringify the data before sending
				window.credentialsSystem.send('send:credentialData', JSON.stringify(DATA));
				
				console.log("DATA IN THE SYSTEM MANAGER: ", DATA); // print out object to check if it worked
        console.log("data added succcessfully")
        return true;
        
      } 
			else {
				console.error('window.ipcRenderer is not defined.');
				return false;
			}
};



// Clear Inputs once data is being sent and 'ADD' button is clicked 
function clearInputsCredentials() { 
  // Clear input fields 
  document.getElementById("subject").value = ""; 
  document.getElementById("username").value = ""; 
  document.getElementById("password").value = ""; 

  console.log("Input fields cleared out successfully.");
}; 



/**
 * Event listener that sends data from (CREDENTIALS SYSTEM) to database 
 * it checks first the data being sent then call clear input fields
 */
const buttonAddCredentials = document.querySelector(".add-button.credentials");
buttonAddCredentials.addEventListener("click", function(event) {
 
  // Prevent the default form submission
  event.preventDefault();
 
  // assign them to a const since I had them as return type in function
  const addData = addCredentialsData(event);

  // if data is sent then clear input fields
    if(addData){
      clearInputsCredentials();
    }else{
      console.log("data not added")
    }
});


/**
 * (RETRIEVE DATA WHEN PAGE IS LOADED)
 * 
 * It adds back the button that relates to each row permanenetly, meaning,
 * every time the page is loaded and populated with data the button will too. 
 * 
 * Event listener that triggers when page is loaded.
 * When loaded it sends request through IPC
 * Returns JSON data that correspont to (CREDENTIALS SYSTEM) & (PHONE KEEPER)
 */
  function handleLoadEvent(){
   console.log('Page loaded successfully!');

  // It gets the clogged in user's ID
  const userID = sessionStorage.getItem('loggedInUserID');
  console.log("Current Logged in user in System Section with ID:", userID);

  // window that listen to prealod and sends to main the user ID as request message
  window.requestDataCredentialsSystem.send('userID', userID);

  //-----------------------CREDENTIALS SYSTEM
  // window that listen to the main and return data JSON objects retrieved from DATABASE
  window.requestDataCredentialsSystem.receive('update:credentialData', (credentialsDataRetrieved) => {
    console.log("DATA RECEIVED IN THE SYSTEM MANAGER OK MAN");
    console.log("Raw data received:", credentialsDataRetrieved);

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
          //'<button class="button action" onclick="editCredentialsData(this)">Edit</button>' +
          '<button class="action credentials-delete-btn button">Delete</button>';
    });
  } else {
    // Handle the case when credentialsData is not an array
    console.error("credentialsData is not an array. It may be of type:", typeof credentialsData);
  }
    
}); 

//-----------------------PHONE KEEPER

}

// EVENT LISTENER on page load (retrive data from database)
window.addEventListener('load', handleLoadEvent);


// Document EVENT LISTENER (delegate the button class and data to be deleted)
document.addEventListener('click', function(event) {
  deleteCredentialsData(event);
});






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
function deleteCredentialsData(event) {
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

    const userID = sessionStorage.getItem('loggedInUserID');
    console.log("Current Logged in user in System Section with ID:", userID);

    // data object with all inputs
    const DATA = {
      userID: userID, // SENDING THE LOGGED IN USER (ID)
      subject: subject,
      userName: userName,
      password: password
    };

    console.log("OBJECT DATA: ", DATA);

    // Add a log statement to check if the delete request is being sent
    console.log("Sending delete request...");
// Serialize the object into a JSON-formatted string before sending
const jsonString = JSON.stringify(DATA);
console.log('Sending name from the renderer process:', jsonString);
window.callName.deleteRequest('deleteRequest', jsonString);


  }
}




// Event listener for the delete response
window.callName.deleteResponse('deleteResponse', (response) => {
  console.log('Received DELETION response in the renderer:', response);

  // Refresh the table after successful deletion with a transition
  refreshTable();
});

// every time the delete button is clciked
// this function will be called if the response from the data delete request is successfull
// Function to refresh the HTML table
function refreshTable() {
  // Clear existing rows in the table with fade-out transition
  let table = document.getElementById("outputTableCredentials");
  table.innerHTML = ''; // This will remove all child elements (rows)

  // It gets the clogged in user's ID
  const userID = sessionStorage.getItem('loggedInUserID');

  // Trigger a request to reload the data from the database
  // window that listen to prealod and sends to main the user ID as request message
  window.requestDataCredentialsSystem.send('userID', userID);
}


/*Hover Interaction:

The code includes functionality to show/hide messages associated with icons when hovered over.
Accessible Tabs:

Clicking on tabs for the Credentials and Phone systems toggles the display of corresponding sections.
End Session:

Clicking on elements with the class 'end-session' logs out the user and redirects to the home page.
Credentials System Table:

Adding data to the credentials system table and sending it to the database.
Deleting rows from the credentials system table with a corresponding request to the main process.
Refresh Table Functionality:

A function (refreshTable) to clear existing rows in the table and trigger a request to reload data from the database.
Editing Table Data:

A function (editCredentialsData) for editing data in the credentials system table.
Phone Keeper Table:

Code for adding, editing, and deleting data in the phone keeper table (commented out)

*/




// EDIT TABLE
function editCredentialsData(button) { 
  
  // Get the parent row of the clicked button 
  let row = button.parentNode.parentNode; 
  
  // Get the cells within the row 
  let nameCell = row.cells[0]; 
  let emailCell = row.cells[1]; 
  let mobileCell = row.cells[2]; 
  
  // Prompt the user to enter updated values 
  let nameInput = 
    prompt("Enter the updated name:", 
      nameCell.innerHTML); 
  let emailInput = 
    prompt("Enter the updated email:", 
      emailCell.innerHTML); 
  let numberInput = 
    prompt("Enter the updated mobile details:", 
      mobileCell.innerHTML 
    ); 
  
  
  // Update the cell contents with the new values 
  nameCell.innerHTML = nameInput; 
  emailCell.innerHTML = emailInput; 
  mobileCell.innerHTML = numberInput; 

} 








  









































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