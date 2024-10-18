let createFormErrors = {
  name: 0,
  email: 0,
  phone: 0
};

/**
 * Adds event listeners to the create contact form and overlay.
 */
function eventListenerCreateContact() {
  let formElement = document.getElementById('create-contact-form');

  formElement.addEventListener("submit", function (e) {
    e.preventDefault();
    checkCreateInputValidation('name', 'Enter name & surname.');
    checkCreateInputValidation('email', 'Enter a valid email address.');
    checkCreateInputValidation('phone', 'Enter a valid phone number with country code.');

    if (createFormErrors.name === 0 && createFormErrors.email === 0 && createFormErrors.phone === 0) {
      createContact();
    }

  });

  document.getElementById('add-contact-overlay').addEventListener('click', function (e) {
    if (e.target !== e.currentTarget) return;
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
    showInputValidationError('#create-contact-form', 'email', 'Email already exists, please choose another!');
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
    showNotification('Contact succesfully created');
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
  document.getElementById('add-contact-overlay').style.zIndex = 999;
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

  resetCreateContactForm();
  removeAllErrors();
}

/**
 * Check create form input field validation
 */
function checkCreateInputValidation(inputName, message) {
  let inputElement = document.querySelector(`#create-contact-form input[name = ${inputName}]`);

  if (!inputElement.checkValidity()) {
    showInputValidationError('#create-contact-form', inputName, message)
    createFormErrors[inputName] = 1;
  } else {
    hideInputValidationError('#create-contact-form', inputName)
    createFormErrors[inputName] = 0;
  }
}