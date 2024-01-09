// Hover effect on upload icons
const uploadIcons = document.querySelectorAll('.upload-icon');
const uploadMessages = document.querySelectorAll('.upload-message');

function show(element) {
  element.classList.add('show');
  element.classList.remove('hide');
}

function hide(element) {
  element.classList.remove('show');
  element.classList.add('hide');
}

// Add hover effect for upload icons
uploadIcons.forEach((uploadIcon, index) => {
  uploadIcon.addEventListener('mouseover', event => {
    show(uploadMessages[index]);
  });

  uploadIcon.addEventListener('mouseout', event => {
    hide(uploadMessages[index]);
  });
});

// Click event listener for expandable elements
const expandableElements = document.querySelectorAll('.expandable');

function expandableEventListener(event, expandableElement) {
  // Your logic for handling the click event on the expandable element
  // For example, toggle a class or perform some other action
  expandableElement.classList.toggle('expanded');
}

// Add click event listener to each expandable element
expandableElements.forEach(expandableElement => {
  expandableElement.addEventListener('click', event => {
    expandableEventListener(event, expandableElement);
  });
});







       

       const credentialsMenu = document.querySelector('.credentials-title');
       const phoneMenu = document.querySelector('.phone-title');
       
       const credentialsItem = document.querySelector('.credentials-manager');
       const phoneItem = document.querySelector('.phone-keeper');
       
       credentialsMenu.addEventListener('click', function() {
           showSection(credentialsItem);
       });
       
       phoneMenu.addEventListener('click', function() {
           showSection(phoneItem);
       });
       
       function showSection(section) {
           credentialsItem.style.display = 'none';
           phoneItem.style.display = 'none';
       
           credentialsMenu.classList.remove('active');
           phoneMenu.classList.remove('active');
       
           section.style.display = 'block';
       
           if (section === credentialsItem) {
               credentialsMenu.classList.add('active');
           } else {
               phoneMenu.classList.add('active');
           }
       }


    


  // testing end session  button from system
  const endSession = document.querySelector('.end-session');
  endSession.addEventListener('click', () => {
    window.location.href = './1-home-page.html';
    });




    












    
//     function myFunction() {
//         // Get the elements corresponding to the phone and credentials systems
// const phoneSystem = document.querySelector('.phone-system');
// const credentialsSystem = document.querySelector('.credentials-system');

//        var x = document.getElementById("myDIV");
//       if (x.style.display === "none") {
//         x.style.display = "block";
//       } else {
//         x.style.display = "none";
//       }
//     }
