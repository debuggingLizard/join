let editFormErrors = {
  name: 0,
  email: 0,
  phone: 0,
};

/**
 * Adds event listeners to the edit contact form and overlay.
 */
function eventListenerEditContact() {
  document
    .getElementById("edit-contact-form")
    .addEventListener("submit", handleEditContactSubmit);
  document
    .getElementById("edit-contact-overlay")
    .addEventListener("click", handleEditContactOverlayClick);
}

/**
 * Handles the submit event for the edit contact form.
 * Prevents the default form submission behavior, validates the input fields,
 * and edits the contact if all fields are valid (no errors).
 *
 * @param {Event} event - The submit event object.
 */
function handleEditContactSubmit(event) {
  event.preventDefault();
  validateEditContactInputs();
  if (
    editFormErrors.name === 0 &&
    editFormErrors.email === 0 &&
    editFormErrors.phone === 0
  ) {
    editContact();
  }
}

/**
 * Validates the input fields in the edit contact form.
 * Checks the validity of the name, email, and phone fields,
 * and displays appropriate validation error messages if the fields are invalid.
 */
function validateEditContactInputs() {
  checkEditInputValidation("name", "Enter name & surname.");
  checkEditInputValidation("email", "Enter a valid email address.");
  checkEditInputValidation(
    "phone",
    "Enter a valid phone number with country code."
  );
}

/**
 * Handles the click event for the edit contact overlay.
 * If the click target is not the overlay itself, the function returns early.
 * Otherwise, it hides the edit contact overlay.
 *
 * @param {Event} event - The click event object.
 */
function handleEditContactOverlayClick(event) {
  if (event.target !== event.currentTarget) return;
  hideEditContactOverlay();
}

/**
 * Opens the edit contact modal and populates it with the user's data.
 * @param {string} userId - The ID of the user to edit.
 */
async function openEditContactModal(userId) {
  let user = await getData("users/" + userId);
  document.querySelector("#edit-contact-form input[name = id]").value = userId;
  document.querySelector("#edit-contact-form input[name = name]").value =
    user.name;
  document.querySelector("#edit-contact-form input[name = email]").value =
    user.email;
  document.querySelector("#edit-contact-form input[name = phone]").value =
    user.mobile;
  document.querySelector(
    "#edit-contact-overlay .person-img"
  ).style.backgroundColor = user.color;
  document.querySelector("#edit-contact-overlay .person-img").innerHTML =
    user.profileImage;
  showEditContactOverlay();
}

/**
 * Edits the contact information for a user.
 */
async function editContact() {
  let id = document.querySelector("#edit-contact-form input[name = id]").value;
  let name = document.querySelector(
    "#edit-contact-form input[name = name]"
  ).value;
  let email = document.querySelector(
    "#edit-contact-form input[name = email]"
  ).value;
  let mobile = document.querySelector(
    "#edit-contact-form input[name = phone]"
  ).value;
  let currentUserDetail = await getData("users/" + id);
  if ((await isEmailExist(email)) && currentUserDetail.email != email) {
    showInputValidationError(
      "#edit-contact-form",
      "email",
      "Email already exists, please choose another!"
    );
  } else {
    await editValidContact(name, mobile, email, currentUserDetail, id);
  }
}

/**
 * Edits a valid contact by gathering the updated contact data, posting it to the server,
 * rendering the updated contact detail and contact list, hiding the edit contact overlay,
 * and displaying a success notification.
 *
 * @param {string} name - The updated name of the contact.
 * @param {string} mobile - The updated mobile number of the contact.
 * @param {string} email - The updated email address of the contact.
 * @param {Object} currentUserDetail - The current details of the contact before the update.
 * @param {string} id - The ID of the contact to be updated.
 * @returns {Promise<void>}
 */
async function editValidContact(name, mobile, email, currentUserDetail, id) {
  const data = gatherEditedContactData(name, mobile, email, currentUserDetail);
  await putData("users", id, data);
  renderContactDetail(id, "detail");
  renderContactList();
  hideEditContactOverlay();
  showNotification("Contact succesfully updated");
}

/**
 * Gathers the edited contact data, including the updated name, mobile, email, and profile image.
 * Retains the existing color from the current user details.
 *
 * @param {string} name - The updated name of the contact.
 * @param {string} mobile - The updated mobile number of the contact.
 * @param {string} email - The updated email address of the contact.
 * @param {Object} currentUserDetail - The current details of the contact before the update.
 * @returns {Object} - An object containing the gathered contact data.
 */
function gatherEditedContactData(name, mobile, email, currentUserDetail) {
  return {
    name: name,
    mobile: mobile,
    email: email,
    color: currentUserDetail.color,
    profileImage: getProfileImage(name),
  };
}

/**
 * Shows the edit contact overlay.
 */
function showEditContactOverlay() {
  document.getElementById("edit-contact-overlay").style.zIndex = 999;
  document.getElementById("edit-contact-overlay").style.backgroundColor =
    "rgb(0 0 0 / 30%)";
  document.getElementById("edit-contact-overlay-container").style.transform =
    "translateX(0)";
}

/**
 * Hides the edit contact overlay.
 */
function hideEditContactOverlay() {
  document.getElementById("edit-contact-overlay").style.backgroundColor =
    "rgb(0 0 0 / 0%)";
  document.getElementById("edit-contact-overlay-container").style.transform =
    "translateX(200%)";
  document.getElementById("edit-contact-overlay").style.zIndex = -1;
  removeAllErrors();
}

/**
 * Validates the input element specified by its name within the edit contact form.
 * If the input is invalid, it shows an error message and updates the error state in the `editFormErrors` object.
 *
 * @param {string} inputName - The name attribute of the input element to validate.
 * @param {string} message - The validation error message to display if the input is invalid.
 */
function checkEditInputValidation(inputName, message) {
  let inputElement = document.querySelector(
    `#edit-contact-form input[name = ${inputName}]`
  );
  if (!inputElement.checkValidity()) {
    showInputValidationError("#edit-contact-form", inputName, message);
    editFormErrors[inputName] = 1;
  } else {
    hideInputValidationError("#edit-contact-form", inputName);
    editFormErrors[inputName] = 0;
  }
}
