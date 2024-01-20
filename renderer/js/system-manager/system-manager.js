
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
endSessions.forEach(counter => {
  counter.addEventListener('click', () => {
    window.location.href = './1-home-page.html';
  });
});


////////////////////////////////    TABLE   credentials system  ////////////////////////////////////////////////////



// ADD DATA TO TABLE (credentials systems)
function addCredentialsData(event) { 
  // Get input values 
  let subject = document.getElementById("subject").value; 
  let userName = document.getElementById("username").value; 
  let password = document.getElementById("password").value; 
  
  // Get the table and insert a new row at the end 
  let table = document.getElementById("outputTableCredentials"); 
  let newRow = table.insertRow(table.rows.length); 
  
   // Insert data into cells of the new row 
  //ADDS TEMPORALY TO THE BROWSER 
  newRow.insertCell(0).innerHTML = subject; 
  newRow.insertCell(1).innerHTML = userName; 
  newRow.insertCell(2).innerHTML = password; 
  newRow.insertCell(3).innerHTML = 
    //'<button class="button action" onclick="editCredentialsData(this)">Edit</button>'+ 
    '<button class="button action" onclick="deleteCredentialsData(this)">Delete</button>';
    
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
				
				console.log("DATA IN THE SYSTEM MANAGER: ",DATA); // print out object to check if it worked
			} 
			else {
				console.error('window.ipcRenderer is not defined.');
				return false;
			}
  
  // Clear input fields 
  clearInputsCredentials();  
} 


//Event listener that sends data from (CREDENTIALS SYSTEM) to database 
const buttonAddCredentials = document.querySelector(".add-button.credentials");
buttonAddCredentials.addEventListener("click", function(event) {
 
  // Prevent the default form submission
  event.preventDefault();
  addCredentialsData(event);
});

// It deletes a specific row of data in the system
function deleteCredentialsData(button) { 
  // Get the parent row of the clicked button 
  let row = button.parentNode.parentNode; 
  // Remove the row from the table 
  row.parentNode.removeChild(row); 
};

// Clear Inputs once data is being sent and 'ADD' button is clicked 
function clearInputsCredentials() { 
  // Clear input fields 
  document.getElementById("subject").value = ""; 
  document.getElementById("username").value = ""; 
  document.getElementById("password").value = ""; 
}; 








/**
 * Event listener that triggers when page is loaded.
 * When loaded it sends request through IPC
 * Returns JSON data that correspont to (CREDENTIALS SYSTEM) & (PHONE KEEPER)
 */
window.addEventListener('load', (event) => {
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

  // Check if credentialsData is an array
  if (Array.isArray(credentialsData)) {
    // Iterate through each object in credentialsData
    credentialsData.forEach((dataObject) => {
      // Check if the element is an object
      if (typeof dataObject === 'object' && dataObject !== null) {

        // Get the table and insert a new row at the end 
        let table = document.getElementById("outputTableCredentials"); 
        let newRow = table.insertRow(table.rows.length); 
        
        // Insert data into cells of the new row
        newRow.insertCell(0).innerHTML = dataObject.subject || '';
        newRow.insertCell(1).innerHTML = dataObject.userName || '';
        newRow.insertCell(2).innerHTML = dataObject.password || '';
        newRow.insertCell(3).innerHTML =
          //'<button class="button action" onclick="editCredentialsData(this)">Edit</button>' +
          '<button class="button action" onclick="deleteCredentialsData(this)">Delete</button>';
      } else {
        console.error("Invalid data object:", dataObject);
      }
    });
  } else {
    // Handle the case when credentialsData is not an array
    console.error("credentialsData is not an array. It may be of type:", typeof credentialsData);
  }
});

//-----------------------PHONE KEEPER

});







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




function deleteCredentialsData(button) { 
  
  // Get the parent row of the clicked button 
  let row = button.parentNode.parentNode; 

  // Remove the row from the table 
  row.parentNode.removeChild(row); 
} 


function clearInputsCredentials() { 
  // Clear input fields 
  document.getElementById("subject").value = ""; 
  document.getElementById("username").value = ""; 
  document.getElementById("password").value = ""; 
} 


  

////////////////////////////////    TABLE   phone keeper  ////////////////////////////////////////////////////



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


		   


