
// import: Welcome message and Button container
import {
	showWelcomeMsg, showBtnContainer
} from "./home-section/home-section.js";

// import: validation
import {
	eventListenersFormValidation
} from "./form-handling/form-validation.js";


// calling function after delay
setTimeout(showWelcomeMsg, 1500);
setTimeout(showBtnContainer, 2500);

// additional validaton with event listener + alert message in js
const submitButton = document.querySelector(".register-button");
submitButton.addEventListener("click", function(event) {
	
	// Prevent the default form submission
	event.preventDefault();
	eventListenersFormValidation(event);
});