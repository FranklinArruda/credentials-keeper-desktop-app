
    /* //const credentialsTitle = document.querySelector('.credentials-title');
    const credentialsTitle = document.querySelector('.credentials-title');

    function setActive(element) {
        credentialsTitle.classList.remove('add');
      //  phoneTitle.classList.remove('add');
        element.classList.add('add');
    }

    // Set credentialsTitle as active by default
    setActive(credentialsTitle);*/
  
    const uploadIcon = document.querySelector('.upload-icon');
    const uploadMessage = document.querySelector('.upload-message');

  function Show(element) {
    element.classList.add('show');
    element.classList.remove('hide');
  }

  function hide(element) {
    element.classList.remove('show');
    element.classList.add('hide');
  }



      uploadIcon.addEventListener('mouseover', function () {
        Show(uploadMessage);
       });

       uploadIcon.addEventListener('mouseout', function () {
        hide(uploadMessage);
       });
      
      // uploadIcon.addEventListener('mouseout', function () {
      // showUploadMessage();
      // });
    



      // Get all elements with the class 'element'
  const elements = document.querySelectorAll('.title');

  // Add click event listeners to each element
  elements.forEach(element => {
    element.addEventListener('click', () => {
      // Remove 'active' class from all elements
      elements.forEach(el => el.classList.remove('active'));

      // Add 'active' class to the clicked element
      element.classList.add('active');
    });
  });



  // testing end session  button from system
   

  const endSession = document.querySelector('.end-session');
 
   
  endSession.addEventListener('click', () => {
    window.location.href = './1-home-page.html';
    });
   