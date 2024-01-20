

const alertMessage = document.querySelector(".alert-message");
const passwordInput = document.getElementById('login-pass');
const loginButton = document.querySelector(".login-button-2");

//Alert message if wrong / empty pass
function showAlertMessage() {
	alertMessage.classList.add('show');// Display the popup
	setTimeout(function () {// Set a timeout to remove the 'show' class after 2 seconds
	  alertMessage.classList.remove('show');
	}, 2000); 
  };

 
//event listener that triggers the LOGIN REQUEST when button is clicked
loginButton.addEventListener('click', (e) => {
	e.preventDefault();

	// if pass is empty call alert message function
	if (passwordInput === 0 ) {
		 showAlertMessage();
	 } else{
	
		// since the pass is string, it gets value and convert so String
		let passwordValue = String(passwordInput.value).trim();

		// Send LOGIN REQUEST to the (main) process with the entered password
		window.loginRequest.send('login:request', passwordValue);
	 }
  });

  // Listen for the LOGIN REQUEST from the preload script
window.loginRequest.receive('login:response', (loggedinUserID) => {
	// console message for debbuging
	console.log('Received processed password in renderer:', loggedinUserID);

	/**
	 * VERY IMPORTANT: 
	 * 
	 * it stores the user ID in the sessionStorage
	 * it helps to be used across all parts of the project
	 */
	sessionStorage.setItem('loggedInUserID', loggedinUserID);
    
	// if login failed, display message/ if success go to system
	if (!loggedinUserID ) {
       console.log('Login failed!');
		showAlertMessage();

    } else {
         console.log('Login successful!');
		 
			// It gets the clogged in user's ID
			const userID = sessionStorage.getItem('loggedInUserID');
			console.log("Current Logged in user in Log Section with ID:", userID);
		    window.location.href = './5-system-credencials-manager.html'; // system section
    }
  });
  

