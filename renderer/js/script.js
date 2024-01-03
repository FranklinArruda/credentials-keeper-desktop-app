

import { showWelcomeMsg,showBtnContainer } from "./_homeSection.js";
import { eventListenersFormValidation } from "./_formValidation.js";

// calling function after delay
setTimeout(showWelcomeMsg, 1500); 
setTimeout(showBtnContainer, 2500); 

// event listener from form validation
eventListenersFormValidation();