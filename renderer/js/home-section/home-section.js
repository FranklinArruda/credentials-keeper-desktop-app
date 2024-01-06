  // Delay and show welcoome message
  function showWelcomeMsg() {
  	let welcomeMsg = document.querySelector('.welcome-message');
  	welcomeMsg.style.display = 'block';
  }

  // Delay and show Btn Contaiiner
  function showBtnContainer() {
  	let welcomeMsg = document.querySelector('.button-box');
  	welcomeMsg.style.display = 'block';
  }


  // calling function after delay
setTimeout(showWelcomeMsg, 1500);
setTimeout(showBtnContainer, 2500);


  // export {
  // 	showWelcomeMsg, showBtnContainer
  // }