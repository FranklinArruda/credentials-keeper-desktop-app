
// Function to get values of input fields
function getInputValues() {

    const fullName = document.getElementById("fullName").value.trim();
    const userName = document.getElementById("userName").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const hint = document.getElementById("hint-question").value.trim();

    return {
        fullName,
        userName,
        password,
        confirmPassword,
        hint
    };
};

//const inputValues = getInputValues();
//console.log(inputValues);


const popUp = document.getElementById("popup");
//const form = document.querySelector(".form-btn");
// show pop up when form is filled out and reCAPCHA is checked
function showPopup() {
    popUp.style.display = "block";
    //formCenter.style.display = "none";
}


function handleFormClick(event) {

    // Extract values from the returned object
    const inputValues = getInputValues();
    const { fullName, userName, password, confirmPassword, hint } = inputValues; 

    

    if (!(fullName && userName && password && confirmPassword && hint)) {
        alert(" the fields must be filled out!!!");
        return false;
    } 
    else {
        
        showPopup();
        return true;
    }
}

export{
    handleFormClick
}














/*
const popupBtn = document.querySelector(".popup-btn");
popupBtn.addEventListener("click", hidePopup);  */