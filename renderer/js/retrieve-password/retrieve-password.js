

/*
* (retrieve password container)
*	-hides its container when button is clicked
*	-display (retrieved password container)
*	-hides back button
*
* (retrieved password container)
*	-style
*	-display when button is clicked
*	-display end session button
*/
  function retrievePasswrod(event) {

    // hides retrieves password continaer
	let retrievePasswordContainer = document.querySelector('.form-container');
    retrievePasswordContainer.classList.add("hide");

    // hides button
    let backButton = document.querySelector('.back-button');
    backButton.classList.add("hide");

    // display retrieved password
    let retrievedPassword = document.querySelector('.retrieved-password-container');
    retrievedPassword.classList.add("show");

    // display end session button
    let endSssionButton = document.querySelector('.end-session-button');
    endSssionButton.classList.add("show");
}

/**
 * RETRIEVE PASSWORD HANDLER
 */
const retrivePasswordButtoon = document.querySelector(".retrieve-pass-button");
retrivePasswordButtoon.addEventListener("click", function(event) {
	
	 	// Prevent the default form submission
	 	event.preventDefault();
	 	retrievePasswrod(event);
});