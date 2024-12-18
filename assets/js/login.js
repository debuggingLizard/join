let loginFormErrors = {
  email: false,
  password: false,
};

/**
 * Initializes the login functionality by executing various setup functions.
 */
function initLogin() {
  logoAnimation();
  loginFormEvent();
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
 * Checks the validity of all input fields in the login form.
 * If all inputs have a value, enables the submit button; otherwise, disables it.
 */
function checkLoginButtonActivity() {
  let inputValidations = true;
  document.querySelectorAll("#login-form input").forEach((input) => {
    validateInputValidity("login-form", input.name, loginFormErrors);
    if (loginFormErrors[input.name]) {
      inputValidations = false;
    }
  });
  toggleButtonStatus(inputValidations, 'login-form');
}

/**
 * Validates the login form by checking the validity of email and password fields.
 */
function checkLoginFormValidation() {
  checkAndShowEmailInputValidationLoginForm();
  checkAndShowPasswordInputValidationLoginForm();
}

/**
 * Validates and shows the email input validation status in the login form.
 * Displays an error message if the email address is not valid.
 */
function checkAndShowEmailInputValidationLoginForm() {
  validateInputValidity("login-form", "email", loginFormErrors);
  checkInputValidity(
    "login-form",
    "email",
    loginFormErrors,
    "Enter a valid email address."
  );
}

/**
 * Validates and shows the password input validation status in the login form.
 * Displays an error message if the password is not valid.
 */
function checkAndShowPasswordInputValidationLoginForm() {
  validateInputValidity("login-form", "password", loginFormErrors);
  checkInputValidity(
    "login-form",
    "password",
    loginFormErrors,
    "Enter a valid password."
  );
}

/**
 * Authenticates the user by verifying email and password, then stores login data
 * and redirects to the specified page if successful. Shows an error message if authentication fails.
 *
 * @param {string} email - The email address of the user.
 * @param {string} password - The password of the user.
 * @param {boolean} remember - Whether to remember the login for future sessions.
 */
async function login(email, password, remember) {
  let foundAdmin = await findAdminByEmail(email);
  if (!foundAdmin) {
    showLoginError();
    return;
  }
  const hashPassword = await hashingPassword(password, foundAdmin.salt);
  if (hashPassword !== foundAdmin.password) {
    showLoginError();
    return;
  }
  storeLoginData(foundAdmin, remember);
  window.location.href = redirectPage;
}

/**
 * Searches for an admin by email within the retrieved admin data.
 * Converts the admin data to an array of entries, then searches for an admin with a matching email.
 * Returns the found admin object or null if no match is found.
 *
 * @param {string} email - The email address to search for.
 * @returns {Object|null} - The admin object if found, otherwise null.
 */
async function findAdminByEmail(email) {
  const admins = await getData("admins");
  const adminsArray = Object.entries(admins);
  let foundAdmin = adminsArray.find((admin) => admin[1].email === email);
  return foundAdmin ? foundAdmin[1] : null;
}

/**
 * Stores the admin login data in local storage and removes any guest login valid time.
 * Sets the login information, remember me status, login validity time, and a flag indicating redirection from login.
 *
 * @param {Object} admin - The admin object containing login information.
 * @param {boolean} remember - Whether to remember the login for future sessions.
 */
function storeLoginData(admin, remember) {
  localStorage.removeItem("joinGuestLoginValidTime");
  localStorage.setItem(
    "joinLoginInfo",
    JSON.stringify({
      name: admin.name,
      email: admin.email,
      profileImage: admin.profileImage,
    })
  );
  localStorage.setItem("joinLoginRemember", remember);
  localStorage.setItem("joinLoginValidTime", getNextOneHourTime());
  localStorage.setItem("redirectFromLogin", true);
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
  localStorage.setItem("redirectFromLogin", true);
  window.location.href = redirectPage;
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
