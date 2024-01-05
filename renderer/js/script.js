// import: Welcome message and Button container
import {
	showWelcomeMsg, showBtnContainer
} from "./home-section/home-section.js";

// import: validation
import {
	validateName, validateEmail, validatePassword, validateHint,
	eventListenersFormValidation, showPopup
} from "./form-handling/form-validation.js";

// calling function after delay
setTimeout(showWelcomeMsg, 1500);
setTimeout(showBtnContainer, 2500);

eventListenersFormValidation();


// MAKE A FUNCTION TO EXPORT THIS OF LEAVE IT WHAETEVER
// ?
// ?
// ?
// ?
// ?
// ?

const submitButton = document.querySelector(".register-button");

submitButton.addEventListener("click", function(event) {
	// Prevent the default form submission
	event.preventDefault();

	// Call your validation functions here
	const isNameValid = validateName();
	const isEmailValid = validateEmail();
	const isPasswordValid = validatePassword();
	const isHintValid = validateHint();

	// Check if all validations pass
	if (!(isNameValid && isEmailValid && isPasswordValid && isHintValid)) {
		alert("All field must be filled out and Validated.") 
        return false;
	} else {
		showPopup();
		// Refresh the page
		// location.reload(true);
		return true;
	}
});