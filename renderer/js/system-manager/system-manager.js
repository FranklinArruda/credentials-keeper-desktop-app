// Hover effect on upload icons
const uploadIcons = document.querySelectorAll('.upload-icon');
const uploadMessages = document.querySelectorAll('.upload-message');

function show(element) {
  element.classList.add('show');
  element.classList.remove('hide');
}

function hide(element) {
  element.classList.remove('show');
  element.classList.add('hide');
}

// Add hover effect for upload icons
uploadIcons.forEach((uploadIcon, index) => {
  uploadIcon.addEventListener('mouseover', event => {
    show(uploadMessages[index]);
  });

  uploadIcon.addEventListener('mouseout', event => {
    hide(uploadMessages[index]);
  });
});

// Click event listener for expandable elements
const expandableElements = document.querySelectorAll('.expandable');

function expandableEventListener(event, expandableElement) {
  // Your logic for handling the click event on the expandable element
  // For example, toggle a class or perform some other action
  expandableElement.classList.toggle('expanded');
}

// Add click event listener to each expandable element
expandableElements.forEach(expandableElement => {
  expandableElement.addEventListener('click', event => {
    expandableEventListener(event, expandableElement);
  });
});



       const credentialsMenu = document.querySelector('.credentials-title');
       const phoneMenu = document.querySelector('.phone-title');
       
       const credentialsItem = document.querySelector('.credentials-manager');
       const phoneItem = document.querySelector('.phone-keeper');
       
       credentialsMenu.addEventListener('click', function() {
           showSection(credentialsItem);
       });
       
       phoneMenu.addEventListener('click', function() {
           showSection(phoneItem);
       });
       
       function showSection(section) {
           credentialsItem.style.display = 'none';
           phoneItem.style.display = 'none';
       
           credentialsMenu.classList.remove('active');
           phoneMenu.classList.remove('active');
       
           section.style.display = 'block';
       
           if (section === credentialsItem) {
               credentialsMenu.classList.add('active');
           } else {
               phoneMenu.classList.add('active');
           }
       }


  // testing end session  button from system
  const endSession = document.querySelector('.end-session');
  endSession.addEventListener('click', () => {
    window.location.href = './1-home-page.html';
    });




    

////////////////////////////////    TABLE   credentials system  ////////////////////////////////////////////////////



// ADD DATA TO TABLE (credentials systems)
function addCredentialsData(event) { 
  // Get input values 
  let subject = 
    document.getElementById("subject").value; 
  let userName = 
    document.getElementById("username").value; 
  let password = 
    document.getElementById("password").value; 
  
  // Get the table and insert a new row at the end 
  let table = document.getElementById("outputTableCredentials"); 
  let newRow = table.insertRow(table.rows.length); 
  
  // Insert data into cells of the new row 
  newRow.insertCell(0).innerHTML = subject; 
  newRow.insertCell(1).innerHTML = userName; 
  newRow.insertCell(2).innerHTML = password; 
  newRow.insertCell(3).innerHTML = 
    '<button class="button action" onclick="editCredentialsData(this)">Edit</button>'+ 
    '<button class="button action" onclick="deleteCredentialsData(this)">Delete</button>'; 
  
  // Clear input fields 
  clearInputsCredentials(); 
} 

/*
const buttonAddCredentials = document.querySelector(".add-button.credentials");
buttonAddCredentials.addEventListener("click", function(event) {
 
  // Prevent the default form submission
  event.preventDefault();
  addCredentialsData(event);
});*/


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






const userPass = sessionStorage.getItem('userPass');
console.log("THISIS THE USE PASS IN THE RENDERER",userPass);
		   


