
// import: Welcome message and Button container 
import { showWelcomeMsg, showBtnContainer } from "./home-section/home-section.js";

// import: validation
import { validateName,
    validateEmail,
    validatePassword,
    validateHint,
    eventListenersFormValidation,
    showPopup } from "./form-handling/form-validation.js";

// calling function after delay
setTimeout(showWelcomeMsg, 1500); 
setTimeout(showBtnContainer, 2500); 

eventListenersFormValidation();

const submitButton = document.querySelector(".register-btn");

submitButton.addEventListener("click", function (event) {
    // Prevent the default form submission
    event.preventDefault();
    
    // Call your validation functions here
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPasswordValid = validatePassword();
    const isHintValid = validateHint();

    // Check if all validations pass
    if (isNameValid && isEmailValid && isPasswordValid && isHintValid) {
        
        showPopup();
        return false;
    }
    else{
        alert("All field must be filled out")
        return true;
    }
});
