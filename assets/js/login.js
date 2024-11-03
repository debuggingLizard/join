const redirectPage = "./summary.html";

let loginFormErrors = {
  email: false,
  password: false,
};

let signUpFormErrors = {
  name: false,
  email: false,
  password: false,
  confirm_password: false,
  accept: false,
};

/**
 * Initializes the login functionality by executing various setup functions.
 * This includes logo animation, event listeners for the login and sign-up forms, password typing functionality, and toggling password visibility.
 */
function initLogin() {
  logoAnimation();
  loginFormEvent();
  signUpFormEvent();
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
 * Animates the login logo by setting its initial position and then applying CSS classes
 * to transition it to its final state. Adjusts the opacity of the header, main, and footer
 * elements to make them visible.
 */
function logoAnimation() {
  const loginLogoImage = document.querySelector(".login-logo");
  const loginLogoImageRect = loginLogoImage.getBoundingClientRect();
  loginLogoImage.style.top = loginLogoImageRect.top + "px";
  loginLogoImage.style.left = loginLogoImageRect.left + "px";
  setTimeout(() => {
    document
      .querySelector(".login-logo")
      .classList.add("login-logo-after-init");
    document
      .querySelector(".logo-wrapper")
      .classList.add("logo-wrapper-after-init");
    document.querySelector("header").style.opacity = 1;
    document.querySelector("main").style.opacity = 1;
    document.querySelector("footer").style.opacity = 1;
  }, 100);
}

/**
 * Attaches an event listener to the login form to handle the submit event.
 * Prevents the default form submission behavior, retrieves the email, password, and remember me values,
 * validates the login form, and calls the login function if there are no validation errors.
 */
async function loginFormEvent() {
  document
    .getElementById("login-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const email = document.querySelector(
        "#login-form input[name = email]"
      ).value;
      const password = document.querySelector(
        "#login-form input[name = password]"
      ).value;
      const remember = document.querySelector(
        "#login-form input[name = remember]"
      ).checked;
      checkLoginFormValidation();
      if (Object.values(loginFormErrors).every((value) => value === false)) {
        login(email, password, remember);
      }
    });
}

/**
 * Validates the login form by checking the input validity for email and password fields.
 * Updates the loginFormErrors object with error messages if the inputs are invalid.
 */
function checkLoginFormValidation() {
  checkInputValidity(
    "login-form",
    "email",
    loginFormErrors,
    "Enter a valid email address."
  );
  checkInputValidity(
    "login-form",
    "password",
    loginFormErrors,
    "Enter a valid password."
  );
}

/**
 * Attaches an event listener to the sign-up form to handle the submit event.
 * Prevents the default form submission behavior, retrieves the name, email, password, confirm password,
 * and accept privacy policy values. Validates the form inputs and calls the signup function if there are no validation errors.
 */
async function signUpFormEvent() {
  document
    .getElementById("signup-form")
    .addEventListener("submit", async function (e) {
      e.preventDefault();
      const name = document.querySelector(
        "#signup-form input[name = name]"
      ).value;
      const email = document.querySelector(
        "#signup-form input[name = email]"
      ).value;
      const password = document.querySelector(
        "#signup-form input[name = password]"
      ).value;
      const confirmPassword = document.querySelector(
        "#signup-form input[name = confirm_password]"
      ).value;
      checkPasswordAndConfirmPassword(password, confirmPassword);
      const accept = document.querySelector(
        "#signup-form input[name = accept]"
      ).checked;
      checkAcceptPrivacyPolicy(accept);
      checkSignUpFormValidation();
      if (Object.values(signUpFormErrors).every((value) => value === false)) {
        signup(name, email, password);
      }
    });
}

/**
 * Validates the sign-up form by checking the input validity for name, email, password, and confirm password fields.
 * Updates the signUpFormErrors object with error messages if the inputs are invalid.
 */
function checkSignUpFormValidation() {
  checkInputValidity(
    "signup-form",
    "name",
    signUpFormErrors,
    "Enter a valid name."
  );
  checkInputValidity(
    "signup-form",
    "email",
    signUpFormErrors,
    "Enter a valid email address."
  );
  checkInputValidity(
    "signup-form",
    "password",
    signUpFormErrors,
    "Enter a valid password."
  );
  checkInputValidity(
    "signup-form",
    "confirm_password",
    signUpFormErrors,
    "Your passwords don't match. Please try again."
  );
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
function checkInputValidity(form, input, errorsObject, message) {
  if (
    !document.querySelector(`#${form} input[name = ${input}]`).checkValidity()
  ) {
    errorsObject[input] = true;
    document
      .querySelector(`#${form} input[name = ${input}]`)
      .classList.add("input-error");
    document
      .querySelector(`#${form} .${input}-error`)
      .classList.remove("d-none");
    document.querySelector(`#${form} .${input}-error`).innerHTML = message;
  } else {
    errorsObject[input] = false;
    document
      .querySelector(`#${form} input[name = ${input}]`)
      .classList.remove("input-error");
    document.querySelector(`#${form} .${input}-error`).classList.add("d-none");
  }
}

/**
 * Checks if the password and confirm password fields match.
 * If they do not match, sets a custom validity message on the confirm password input.
 * If they match, clears any custom validity message.
 *
 * @param {string} password - The password value.
 * @param {string} confirmPassword - The confirm password value.
 */
function checkPasswordAndConfirmPassword(password, confirmPassword) {
  if (password !== confirmPassword) {
    document
      .querySelector(`#signup-form input[name = confirm_password]`)
      .setCustomValidity("Passwords do not match.");
  } else {
    document
      .querySelector(`#signup-form input[name = confirm_password]`)
      .setCustomValidity("");
  }
}

/**
 * Checks if the user has accepted the privacy policy.
 * If not accepted, marks the 'accept' field as having an error, updates the error message,
 * and applies an error class to the relevant element.
 * If accepted, clears the error and resets the error message.
 *
 * @param {boolean} accept - The acceptance status of the privacy policy.
 */
function checkAcceptPrivacyPolicy(accept) {
  if (accept == false) {
    signUpFormErrors["accept"] = true;
    document.querySelector(`#signup-form .accept`).classList.add("error");
    document.getElementById("accept_change").innerHTML = "Please";
  } else {
    signUpFormErrors["accept"] = false;
    document.querySelector(`#signup-form .accept`).classList.remove("error");
    document.getElementById("accept_change").innerHTML = "I";
  }
}

/**
 * Authenticates the user by checking the email and password against stored admin data.
 * If the credentials are valid, stores the login information in local storage and redirects to the specified page.
 * If the credentials are invalid, displays a login error message.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @param {boolean} remember - Whether to remember the login for future sessions.
 */
async function login(email, password, remember) {
  const admins = await getData("admins");
  const adminsArray = Object.entries(admins);
  let foundAdmin = adminsArray.filter((admin) => admin[1].email === email);
  if (foundAdmin.length <= 0) {
    showLoginError();
    return;
  }
  const hashPassword = await hashingPassword(password, foundAdmin[0][1].salt);
  if (hashPassword !== foundAdmin[0][1].password) {
    showLoginError();
    return;
  }
  localStorage.removeItem("joinGuestLoginValidTime");
  localStorage.setItem(
    "joinLoginInfo",
    JSON.stringify({
      name: foundAdmin[0][1].name,
      email: foundAdmin[0][1].email,
      profileImage: foundAdmin[0][1].profileImage,
    })
  );
  localStorage.setItem("joinLoginRemember", remember);
  localStorage.setItem("joinLoginValidTime", getNextOneHourTime());
  window.location.href = redirectPage;
}

/**
 * Displays a login error message by adding error classes to the email and password input fields,
 * making the password error message visible, and updating the error message content.
 */
function showLoginError() {
  document
    .querySelector(`#login-form input[name = email]`)
    .classList.add("input-error");
  document
    .querySelector(`#login-form input[name = password]`)
    .classList.add("input-error");
  document
    .querySelector(`#login-form .password-error`)
    .classList.remove("d-none");
  document.querySelector(`#login-form .password-error`).innerHTML =
    "Check your email and password. Please try again.";
}

/**
 * Logs the user in as a guest by clearing admin login data from local storage,
 * setting a valid time for the guest login session, and redirecting to the specified page.
 */
function guestLogin() {
  localStorage.removeItem("joinLoginInfo");
  localStorage.removeItem("joinLoginRemember");
  localStorage.removeItem("joinLoginValidTime");
  localStorage.setItem("joinGuestLoginValidTime", getNextOneHourTime());
  window.location.href = redirectPage;
}

/**
 * Registers a new user by generating a salt, hashing the password, and creating a new admin data object.
 * Posts the data to the server, then logs the user in with the provided credentials.
 *
 * @param {string} name - The name of the user.
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 */
async function signup(name, email, password) {
  const salt = generateSalt();
  const hashPassword = await hashingPassword(password, salt);
  let Data = {
    name: name,
    email: email,
    password: hashPassword,
    salt: salt,
    profileImage: getProfileImage(name),
  };
  await postData("admins", Data);
  await login(email, password, false);
}

/**
 * Calculates the timestamp one hour from the current time.
 * Adds one hour (in milliseconds) to the current time and returns the resulting timestamp.
 *
 * @returns {number} - The timestamp one hour from now.
 */
function getNextOneHourTime() {
  const validTime = new Date();
  // Add 1 hour (1 hour = 60 minutes * 60 seconds * 1000 milliseconds)
  validTime.setTime(validTime.getTime() + 1 * 60 * 60 * 1000);
  return validTime.getTime();
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
        iconElement.classList.remove("icon-lock");
        iconElement.classList.add("c-pointer");
        if (passwordInputElement.type === "password") {
          iconElement.classList.add("icon-visibility-off");
        } else {
          iconElement.classList.add("icon-visibility");
        }
      } else {
        passwordInputElement.type = "password";
        iconElement.classList.remove("icon-visibility-off");
        iconElement.classList.remove("icon-visibility");
        iconElement.classList.remove("c-pointer");
        iconElement.classList.add("icon-lock");
      }
    });
  });
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
          passwordInputElement.type = "text";
          iconLockInputElement.classList.add("icon-visibility");
          iconLockInputElement.classList.remove("icon-visibility-off");
        } else {
          passwordInputElement.type = "password";
          iconLockInputElement.classList.add("icon-visibility-off");
          iconLockInputElement.classList.remove("icon-visibility");
        }
      }
    });
  });
}

/**
 * Generates a profile image string based on a user's name.
 * @param {string} name - The user's name.
 * @returns {string} The profile image string.
 */
function getProfileImage(name) {
  const parts = name.trim().split(" ");
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial =
    parts.length < 2
      ? parts[0].charAt(0).toUpperCase()
      : parts[1].charAt(0).toUpperCase();
  return firstInitial + lastInitial;
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
