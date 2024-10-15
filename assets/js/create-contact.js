/**
 * Adds event listeners to the create contact form and overlay.
 */
function eventListenerCreateContact() {
  let formElement = document.getElementById('create-contact-form');

  formElement.addEventListener("submit", function (e) {
    e.preventDefault();
    createContact();
  });

  document.getElementById('add-contact-overlay').addEventListener('click', function (e) {
    if(e.target !== e.currentTarget) return;
    hideAddContactOverlay();
  });

}

/**
 * Creates a new contact.
 * Checks whether an e-mail exists already (e-mails must be unique)
 * If e-mail doesn't exist, object data is created. 
 * data contains the input values, a randomly chosen color for the use and the initials of the user. 
 * Random color is chosen by function getRandomColor(). Initials are created by getprofileImage(name), using the name from the input.
 */
async function createContact() {
  let name = document.querySelector('#create-contact-form input[name = name]').value
  let email = document.querySelector('#create-contact-form input[name = email]').value
  let mobile = document.querySelector('#create-contact-form input[name = phone]').value

  if (await isEmailExist(email)) {
    console.error("this email already exist");
  } else {
    const data = {
      name: name,
      mobile: mobile,
      email: email,
      color: getRandomColor(),
      profileImage: getProfileImage(name)
    };

    await postData("users", data);
    resetCreateContactForm();
    renderContactList();
    hideAddContactOverlay();
  }
}

/**
 * Resets the create contact form fields.
 */
function resetCreateContactForm() {
  document.querySelector('#create-contact-form input[name = name]').value = '';
  document.querySelector('#create-contact-form input[name = email]').value = '';
  document.querySelector('#create-contact-form input[name = phone]').value = '';
}

/**
 * Shows the add contact overlay.
 */
function showAddContactOverlay() {
  document.getElementById('add-contact-overlay').style.zIndex = 100;
  document.getElementById('add-contact-overlay').style.backgroundColor = 'rgb(0 0 0 / 30%)'
  document.getElementById('add-contact-overlay-container').style.transform = 'translateX(0)';
}

/**
 * Hides the add contact overlay.
 */
function hideAddContactOverlay() {
  document.getElementById('add-contact-overlay').style.backgroundColor = 'rgb(0 0 0 / 0%)'
  document.getElementById('add-contact-overlay-container').style.transform = 'translateX(200%)';
  document.getElementById('add-contact-overlay').style.zIndex = -1;
}