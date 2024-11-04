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
  document.getElementById("login-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.querySelector("#login-form input[name = email]").value;
    const password = document.querySelector("#login-form input[name = password]").value;
    const remember = document.querySelector("#login-form input[name = remember]").checked;
    checkLoginFormValidation();
    if (Object.values(loginFormErrors).every((value) => value === false)) {
      login(email, password, remember);
    }
  });
}

function checkLoginButtonActivity() {
  checkLoginFormValidation(false);
  if (Object.values(loginFormErrors).every((value) => value === false)) {
    document.querySelector('#login-form button[type=submit]').disabled = false;
  } else {
    document.querySelector('#login-form button[type=submit]').disabled = true;
  }
}

/**
 * Validates the login form by checking the input validity for email and password fields.
 * Updates the loginFormErrors object with error messages if the inputs are invalid.
 */
function checkLoginFormValidation(showError = true) {
  checkInputValidity("login-form", "email", loginFormErrors);
  checkInputValidity("login-form", "password", loginFormErrors);

  if (showError) {
    showInputValidity("login-form", "email", loginFormErrors, "Enter a valid email address.");
    showInputValidity("login-form", "password", loginFormErrors, "Enter a valid password.");
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
  localStorage.setItem("redirectFromLogin", true);
  window.location.href = redirectPage;
}

/**
 * Displays a login error message by adding error classes to the email and password input fields,
 * making the password error message visible, and updating the error message content.
 */
function showLoginError() {
  document.querySelector(`#login-form input[name = email]`).classList.add("input-error");
  document.querySelector(`#login-form input[name = password]`).classList.add("input-error");
  document.querySelector(`#login-form .password-error`).classList.remove("d-none");
  document.querySelector(`#login-form .password-error`).innerHTML = "Check your email and password. Please try again.";
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