const fullName = document.getElementById("fullName");
const fullNameError = document.getElementById("full-name-error");

const userName = document.getElementById("userName");
const userNameError = document.getElementById("username-error");

const password = document.getElementById("password");
const passwordError = document.getElementById("password-error");

const confirmPassword = document.getElementById("confirmPassword");
const confirmPassError = document.getElementById("confirm-password-error");

const hint = document.getElementById("hint-question");
const hintError = document.getElementById("hint-error");





/**
 * Display an error message for a form field.
 * Param The input element associated with the error.
 * Param errorElement - The element to display the error message.
 * Param errorMessage - The error message to be displayed.
 */
function showError(inputElement, errorElement, errorMessage) {

	// Remove the 'valid' class and add the 'invalid' class to highlight the error
	inputElement.classList.remove("valid");
	inputElement.classList.add("invalid");

	// Display the error message in the designated error element
	errorElement.innerHTML = errorMessage;
}





/**
 * Display a success state for a form field.
 * Parameter inputElement - The input element associated with the success state.
 * Parameter errorElement - The element to clear for successful validation.
 */
function showSuccess(inputElement, errorElement) {

	// Remove the 'invalid' class and add the 'valid' class to indicate successful validation
	inputElement.classList.remove("invalid");
	inputElement.classList.add("valid");

	// Clear the error message in the designated error element for successful validation
	errorElement.innerHTML = "";
}




// validate Full Name and hint for answer
function validateName() {
	let name = fullName.value.trim().toLowerCase();

	if (name.length === 0) {
		showError(fullName, fullNameError, "Name is required");
		return false;
	}
	// Use a regular expression to check if the name contains only letters
	else if (!/^[a-zA-Z\s]+$/.test(name) || !isNaN(name)) {
		showError(fullName, fullNameError, "Please enter letters only");
		return false;
	} else {
		showSuccess(fullName, fullNameError)
		return true;
	}
}




// Validate user Name
function validateEmail() {
	let email = userName.value;
	var emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

	// should not be empty
	if (email.length === 0) {
		showError(userName, userNameError, "Email is required")
		return false;
	}
	// email expression characters must match
	else if (!email.match(emailRegex)) {
		showError(userName, userNameError, "Enter a valid email")
		return false;
	} else {
		showSuccess(userName, userNameError);
	}

	return true;
}



// validate password
function validatePassword() {
	let pass1 = password.value.trim();
	let pass2 = confirmPassword.value.trim();

	// Check if both password fields are not empty
	if (pass1.length === 0 || pass2.length === 0) {
		showError(password, passwordError, "Both password fields are required");
		showError(confirmPassword, confirmPassError, "Both password fields are required");
		return false;
	} else if (pass1 !== pass2) {
		showError(password, passwordError, "Passwords do not match");
		showError(confirmPassword, confirmPassError, "Passwords do not match");
		return false;
	} else {
		showSuccess(password, passwordError);
		showSuccess(confirmPassword, confirmPassError);
		return true;
	}
}



// validate Hint Question
function validateHint() {
	let hintValue = hint.value.trim().toLowerCase();

	if (hintValue.length === 0) {
		showError(hint, hintError, "Hint is required");
		return false;
	}
	// Use a regular expression to check if the name contains only letters
	else if (!/^[a-zA-Z\s]+$/.test(hintValue) || !isNaN(hintValue)) {
		showError(hint, hintError, "Please enter letters only");
		return false;
	} else {
		showSuccess(hint, hintError);
		return true;
	}
}




// event listener for all the function on key up.
// real time validation with css
function eventListenersFormValidation() {
	fullName.addEventListener('keyup', validateName);
	userName.addEventListener('keyup', validateEmail);
	password.addEventListener('keyup', validatePassword);
	hint.addEventListener('keyup', validateHint);
}




const popUp = document.querySelector(".popup-container");
const formContainer = document.querySelector(".form-container");
const alertMessage = document.querySelector(".alert-message");

/**
 * it hides the form container, then it display pop up message
 */
function showPopup() {
	// Add the 'hidden' class to initiate the fade-out transition
	formContainer.classList.add('hidden');
	// Display the popup
	popUp.classList.add('show');
}



/**
 * alert message that display if user clicks the register/submt button if any of the inputs is empty
 * uses class list .add with css to show / hide alert
 * setTimeOut function that remove alert after 6 seconds
 */
function showAlertMessage() {
	// Display the popup
	alertMessage.classList.add('show');
  
	// Set a timeout to remove the 'show' class after 6 seconds
	setTimeout(function () {
	  alertMessage.classList.remove('show');
	}, 6000); 
}



/**
 * it validates all inputs agains empty values
 * if inputs is empty returns false
 * if inputs isn't empty returns true > send Data 
 * if data is sent to main > showpopUp() function is called.
 * 
 * @returns true / false
 */
function isValid(event){
	
// Call your validation functions here
const isNameValid = validateName();
const isEmailValid = validateEmail();
const isPasswordValid = validatePassword();
const isHintValid = validateHint();


// Check if all validations pass
if (!(isNameValid && isEmailValid && isPasswordValid && isHintValid)) {
	// alert("All field must be filled out and Validated.") 
	showAlertMessage();
	return false;
} else {

			//IPC RENDERER (sending user registration data to Main)
			// Check if window.ipcRenderer is defined
			if (window.ipcRenderer) {
				
				// data object with all inputs
				const data = { 
					fullName: fullName.value,
					userName: userName.value,
					password: password.value,
					hint: hint.value,
				};
				// Stringify the data before sending
				window.ipcRenderer.send('user:registration', JSON.stringify(data));
				
				console.log(data); // print out object to check if it worked

				// show popup once data is being sent
				showPopup();
			} 
			else {
				console.error('window.ipcRenderer is not defined.');
				return false;
			}
	return true;
}
}


// Exporting all function aloong with the isValid();
export {
	validateName,
	validateEmail,
	validatePassword,
	validateHint,
	eventListenersFormValidation,
	isValid
};