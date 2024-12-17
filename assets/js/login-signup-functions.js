const redirectPage = "./index.html";

/**
 * Initializes the signup functionality by executing various setup functions.
 */
function initLoginSignupFunctions() {
  typePassword();
  togglePasswordVisible();
}

/**
 * Displays the login form by hiding the sign-up form and showing the login form.
 * Also ensures that the header-right element is visible.
 */
function showLoginForm() {
  document.getElementById("signup-form").classList.add("d-none");
  document.getElementById("login-form").classList.remove("d-none");
  document.getElementById("header-right").classList.remove("d-none");
}

/**
 * Displays the sign-up form by hiding the login form and header-right element,
 * and showing the sign-up form.
 */
function showSignupForm() {
  document.getElementById("login-form").classList.add("d-none");
  document.getElementById("header-right").classList.add("d-none");
  document.getElementById("signup-form").classList.remove("d-none");
}

/**
 * Validates a specific input field within a form.
 * If the input is invalid, updates the errorsObject, adds an error class to the input,
 * displays an error message, and makes the error message visible.
 * If the input is valid, removes the error class and hides the error message.
 *
 * @param {string} form - The ID of the form containing the input field.
 * @param {string} input - The name of the input field to validate.
 * @param {Object} errorsObject - An object to track validation errors.
 * @param {string} message - The error message to display if the input is invalid.
 */
function validateInputValidity(form, input, errorsObject) {
  if (
    !document.querySelector(`#${form} input[name = ${input}]`).checkValidity()
  ) {
    errorsObject[input] = true;
  } else {
    errorsObject[input] = false;
  }
}

function checkInputValidity(form, input, errorsObject, message) {
  if (errorsObject[input]) {
    showInputValidation(form, input, message);
  } else {
    hideInputValidation(form, input);
  }
}

function showInputValidation(form, input, message) {
  document
    .querySelector(`#${form} input[name = ${input}]`)
    .classList.add("input-error");
  document.querySelector(`#${form} .${input}-error`).classList.remove("d-none");
  document.querySelector(`#${form} .${input}-error`).innerHTML = message;
}

function hideInputValidation(form, input) {
  document
    .querySelector(`#${form} input[name = ${input}]`)
    .classList.remove("input-error");
  document.querySelector(`#${form} .${input}-error`).classList.add("d-none");
}

function toggleButtonStatus(inputValidations, form) {
  if (inputValidations) {
    document.querySelector(`#${form} button[type=submit]`).disabled = false;
  } else {
    document.querySelector(`#${form} button[type=submit]`).disabled = true;
  }
}

/**
 * Toggles the visibility of password input fields when the lock icon is clicked.
 * Changes the input type between 'password' and 'text' based on the current state
 * and updates the icon to indicate the visibility status.
 */
function togglePasswordVisible() {
  let iconLockInputElements = document.querySelectorAll(".icon-lock");
  iconLockInputElements.forEach((iconLockInputElement) => {
    iconLockInputElement.addEventListener("click", function () {
      let passwordInputElement = iconLockInputElement.previousElementSibling;
      if (passwordInputElement.value.length >= 1) {
        if (passwordInputElement.type === "password") {
          convertToTextInput(passwordInputElement, iconLockInputElement);
        } else {
          convertToPasswordInput(passwordInputElement, iconLockInputElement);
        }
      }
    });
  });
}

/**
 * Changes the input type from 'password' to 'text'
 */
function convertToTextInput(passwordInputElement, iconLockInputElement) {
  passwordInputElement.type = "text";
  iconLockInputElement.classList.add("icon-visibility");
  iconLockInputElement.classList.remove("icon-visibility-off");
}

/**
 * Changes the input type from 'text' to 'password'
 */
function convertToPasswordInput(passwordInputElement, iconLockInputElement) {
  passwordInputElement.type = "password";
  iconLockInputElement.classList.add("icon-visibility-off");
  iconLockInputElement.classList.remove("icon-visibility");
}

/**
 * Adds event listeners to all password input fields to dynamically change the associated icon
 * based on the input value's length. If the input value is not empty, updates the icon to show
 * visibility options, otherwise resets to the lock icon.
 */
function typePassword() {
  let passwordInputElements = document.querySelectorAll(
    "input[type = password]"
  );
  passwordInputElements.forEach((passwordInputElement) => {
    passwordInputElement.addEventListener("keyup", function () {
      let iconElement = passwordInputElement.nextElementSibling;
      if (passwordInputElement.value.length >= 1) {
        showPasswordVisibilityIcon(passwordInputElement, iconElement);
      } else {
        resetPasswordIcon(passwordInputElement, iconElement);
      }
    });
  });
}

/**
 * Updates the icon next to a password input field to show password visibility options
 * when the input value is not empty.
 *
 * @param {HTMLInputElement} passwordInputElement - The password input field element.
 * @param {HTMLElement} iconElement - The icon element next to the password input field.
 */
function showPasswordVisibilityIcon(passwordInputElement, iconElement) {
  iconElement.classList.remove("icon-lock");
  iconElement.classList.add("c-pointer");
  if (passwordInputElement.type === "password") {
    iconElement.classList.add("icon-visibility-off");
  } else {
    iconElement.classList.add("icon-visibility");
  }
}

/**
 * Resets the icon next to a password input field to the lock icon
 * when the input value is empty.
 *
 * @param {HTMLInputElement} passwordInputElement - The password input field element.
 * @param {HTMLElement} iconElement - The icon element next to the password input field.
 */
function resetPasswordIcon(passwordInputElement, iconElement) {
  passwordInputElement.type = "password";
  iconElement.classList.remove("icon-visibility-off");
  iconElement.classList.remove("icon-visibility");
  iconElement.classList.remove("c-pointer");
  iconElement.classList.add("icon-lock");
}

/**
 * Hashes a password with a given salt using the SHA-256 algorithm.
 * Encodes the password and salt, computes the hash, and returns the hash as a hex string.
 *
 * @param {string} password - The password to hash.
 * @param {string} salt - The salt to use in the hashing process.
 * @returns {Promise<string>} - The hashed password as a hex string.
 */
async function hashingPassword(password, salt) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + salt);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  // Convert ArrayBuffer to hex string
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/**
 * Generates a cryptographic salt of the specified length using random values.
 * Converts the generated byte array to a hex string.
 *
 * @param {number} [length=16] - The length of the salt in bytes. Defaults to 16.
 * @returns {string} - The generated salt as a hex string.
 */
function generateSalt(length = 16) {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
