
// import: validation (FORM VALIDATIOON)
 import {
 	eventListenersFormValidation, isValid
} from "./form-validation.js";

// real time validation
eventListenersFormValidation();

/**
 * REGISTRATION HANDLER
 * additional validaton with event listener + alert message in js
 */
 const submitButton = document.querySelector(".register-button");
 submitButton.addEventListener("click", function(event) {
	
 	// Prevent the default form submission
 	event.preventDefault();
 	isValid(event);
});