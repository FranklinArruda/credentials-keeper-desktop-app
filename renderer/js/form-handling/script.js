// // import: Welcome message and Button container (HOME SECTIOON)
// import {
// 	showWelcomeMsg, showBtnContainer
// } from "./home-section/home-section.js";

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