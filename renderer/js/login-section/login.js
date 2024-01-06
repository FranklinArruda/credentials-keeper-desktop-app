

const alertMessage = document.querySelector(".alert-message");
//const passInput = document.getElementById("login-pass");


function showAlertMessage() {
	// Display the popup
	alertMessage.classList.add('show');
  
	// Set a timeout to remove the 'show' class after 6 seconds
	setTimeout(function () {
	  alertMessage.classList.remove('show');
	}, 4000); 
  }



  function login(event) {

	var goodMsg = document.querySelector('.good');

	// Get the password input element by ID
    var passwordInput = document.getElementById('login-pass');

    // Get the value of the password input and trim it
    var passwordValue = passwordInput.value.trim();

    if (!/^[a-zA-Z\s]+$/.test(passwordValue) || !isNaN(passwordValue)) {
		showAlertMessage();
		return false;
	} 

    else{
		goodMsg.classList.add('show');
    }
}

/**
 * LOGIN HANDLER
 */
const loginButton = document.querySelector(".login-button-2");
loginButton.addEventListener("click", function(event) {
	
	 	// Prevent the default form submission
	 	event.preventDefault();
	 	login(event);
});