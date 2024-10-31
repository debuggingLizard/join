let createFormErrors = {
  name: 0,
  email: 0,
  phone: 0,
};

/**
 * Adds event listeners to the create contact form and add contact overlay elements.
 * The submit event listener triggers the handleCreateContactSubmit function,
 * while the click event listener on the overlay triggers the handleAddContactOverlayClick function.
 */
function eventListenerCreateContact() {
  document
    .getElementById("create-contact-form")
    .addEventListener("submit", handleCreateContactSubmit);
  document
    .getElementById("add-contact-overlay")
    .addEventListener("click", handleAddContactOverlayClick);
}

/**
 * Handles the submit event for the create contact form.
 * Prevents the default form submission behavior, validates the input fields,
 * and creates a new contact if all fields are valid (no errors).
 *
 * @param {Event} event - The submit event object.
 */
function handleCreateContactSubmit(event) {
  event.preventDefault();
  validateCreateContactInputs();
  if (
    createFormErrors.name === 0 &&
    createFormErrors.email === 0 &&
    createFormErrors.phone === 0
  ) {
    createContact();
  }
}

/**
 * Validates the input fields in the create contact form.
 * Checks the validity of the name, email, and phone fields,
 * and displays appropriate validation error messages if the fields are invalid.
 */
function validateCreateContactInputs() {
  checkCreateInputValidation("name", "Enter name & surname.");
  checkCreateInputValidation("email", "Enter a valid email address.");
  checkCreateInputValidation(
    "phone",
    "Enter a valid phone number with country code."
  );
}

/**
 * Handles the click event for the add contact overlay.
 * If the click target is not the overlay itself, the function returns early.
 * Otherwise, it hides the add contact overlay.
 *
 * @param {Event} event - The click event object.
 */
function handleAddContactOverlayClick(event) {
  if (event.target !== event.currentTarget) return;
  hideAddContactOverlay();
}

/**
 * Creates a new contact by gathering input values from the create contact form.
 * If the email already exists, it displays a validation error.
 * Otherwise, it proceeds to create a valid contact.
 *
 * @returns {Promise<void>}
 */
async function createContact() {
  let name = document.querySelector(
    "#create-contact-form input[name = name]"
  ).value;
  let email = document.querySelector(
    "#create-contact-form input[name = email]"
  ).value;
  let mobile = document.querySelector(
    "#create-contact-form input[name = phone]"
  ).value;
  if (await isEmailExist(email)) {
    showInputValidationError(
      "#create-contact-form",
      "email",
      "Email already exists, please choose another!"
    );
  } else {
    await createValidContact(name, mobile, email);
  }
}

/**
 * Creates a valid contact by gathering the contact data, posting it to the server,
 * resetting the create contact form, rendering the updated contact list, hiding the add contact overlay,
 * and displaying a success notification.
 *
 * @param {string} name - The name of the new contact.
 * @param {string} mobile - The mobile number of the new contact.
 * @param {string} email - The email address of the new contact.
 * @returns {Promise<void>}
 */
async function createValidContact(name, mobile, email) {
  const data = gatherNewContactData(name, mobile, email);
  await postData("users", data);
  resetCreateContactForm();
  renderContactList();
  hideAddContactOverlay();
  showNotification("Contact succesfully created");
}

/**
 * Gathers the data for a new contact, including name, mobile, email, color, and profile image.
 *
 * @param {string} name - The name of the new contact.
 * @param {string} mobile - The mobile number of the new contact.
 * @param {string} email - The email address of the new contact.
 * @returns {Object} - An object containing the gathered contact data.
 */
function gatherNewContactData(name, mobile, email) {
  return {
    name: name,
    mobile: mobile,
    email: email,
    color: getRandomColor(),
    profileImage: getProfileImage(name),
  };
}

/**
 * Resets the create contact form fields.
 */
function resetCreateContactForm() {
  document.querySelector("#create-contact-form input[name = name]").value = "";
  document.querySelector("#create-contact-form input[name = email]").value = "";
  document.querySelector("#create-contact-form input[name = phone]").value = "";
}

/**
 * Shows the add contact overlay.
 */
function showAddContactOverlay() {
  document.getElementById("add-contact-overlay").style.zIndex = 999;
  document.getElementById("add-contact-overlay").style.backgroundColor =
    "rgb(0 0 0 / 30%)";
  document.getElementById("add-contact-overlay-container").style.transform =
    "translateX(0)";
}

/**
 * Hides the add contact overlay.
 */
function hideAddContactOverlay() {
  document.getElementById("add-contact-overlay").style.backgroundColor =
    "rgb(0 0 0 / 0%)";
  document.getElementById("add-contact-overlay-container").style.transform =
    "translateX(200%)";
  document.getElementById("add-contact-overlay").style.zIndex = -1;
  resetCreateContactForm();
  removeAllErrors();
}

/**
 * Validates the input element specified by its name within the create contact form.
 * If the input is invalid, it shows an error message and updates the error state in the `createFormErrors` object.
 *
 * @param {string} inputName - The name attribute of the input element to validate.
 * @param {string} message - The validation error message to display if the input is invalid.
 */
function checkCreateInputValidation(inputName, message) {
  let inputElement = document.querySelector(
    `#create-contact-form input[name = ${inputName}]`
  );
  if (!inputElement.checkValidity()) {
    showInputValidationError("#create-contact-form", inputName, message);
    createFormErrors[inputName] = 1;
  } else {
    hideInputValidationError("#create-contact-form", inputName);
    createFormErrors[inputName] = 0;
  }
}
