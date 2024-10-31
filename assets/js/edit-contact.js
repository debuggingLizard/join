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

function validateEditContactInputs() {
  checkEditInputValidation("name", "Enter name & surname.");
  checkEditInputValidation("email", "Enter a valid email address.");
  checkEditInputValidation(
    "phone",
    "Enter a valid phone number with country code."
  );
}

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

async function editValidContact(name, mobile, email, currentUserDetail, id) {
  const data = gatherEditedContactData(name, mobile, email, currentUserDetail);
  await putData("users", id, data);
  renderContactDetail(id, "detail");
  renderContactList();
  hideEditContactOverlay();
  showNotification("Contact succesfully updated");
}

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
  document.getElementById("edit-contact-overlay").style.zIndex = 100;
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
 * Check edit form input field validation
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
