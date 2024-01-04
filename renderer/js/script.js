
// import: Welcome message and Button container 
import { showWelcomeMsg, showBtnContainer } from "./home-section/home-section.js";

// import: validation
import { eventListenersFormValidation } from "./form-handling/form-validation.js";

// import: handle form click (submission etc)
import { handleFormClick } from './form-handling/form-submission.js'; // Adjust the filename accordingly


// calling function after delay
setTimeout(showWelcomeMsg, 1500); 
setTimeout(showBtnContainer, 2500); 

// call validations
eventListenersFormValidation();

// call dandle form click with event listener
const formButtonRegister = document.querySelector(".register-btn");
formButtonRegister.addEventListener("click", function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    handleFormClick(); // call and submit form
});

