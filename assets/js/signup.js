let signUpFormErrors = {
  name: false,
  email: false,
  password: false,
  confirm_password: false,
  accept: false,
};

/**
 * Initializes the signup functionality by executing various setup functions.
 */
function initSignup() {
  signUpFormEvent();
}

/**
 * Attaches an event listener to the sign-up form to handle the submit event.
 * Prevents the default form submission behavior, retrieves the name, email, password, confirm password,
 * and accept privacy policy values. Validates the form inputs and calls the signup function if there are no validation errors.
 */
async function signUpFormEvent() {
  document.getElementById("signup-form").addEventListener("submit", async function (e) {
    e.preventDefault();
    const name = document.querySelector("#signup-form input[name = name]").value;
    const email = document.querySelector("#signup-form input[name = email]").value;
    const password = document.querySelector("#signup-form input[name = password]").value;
    const confirmPassword = document.querySelector("#signup-form input[name = confirm_password]").value;
    checkPasswordAndConfirmPassword(password, confirmPassword);
    checkSignUpFormValidation();
    if (Object.values(signUpFormErrors).every((value) => value === false)) {
      signup(name, email, password);
    }
  });
}

function checkSignupButtonActivity() {
  const inputs = document.querySelectorAll("#signup-form input");
  let allValid = true;

  inputs.forEach(input => {
    if (input.value.length < 1) {
      allValid = false;
    }
  });

  if (allValid) {
    document.querySelector('#signup-form button[type=submit]').disabled = false;
  } else {
    document.querySelector('#signup-form button[type=submit]').disabled = true;
  }
}

/**
 * Validates the sign-up form by checking the input validity for name, email, password, and confirm password fields.
 * Updates the signUpFormErrors object with error messages if the inputs are invalid.
 */
function checkSignUpFormValidation(showError = true) {
  checkInputValidity("signup-form", "name", signUpFormErrors);
  checkInputValidity("signup-form", "email", signUpFormErrors);
  checkInputValidity("signup-form", "password", signUpFormErrors);
  checkInputValidity("signup-form", "confirm_password", signUpFormErrors);
  checkAcceptPrivacyPolicyValidity();

  if (showError) {
    showInputValidity("signup-form", "name", signUpFormErrors, "Enter a valid name.");
    showInputValidity("signup-form", "email", signUpFormErrors, "Enter a valid email address.");
    showInputValidity(
      "signup-form", "password", signUpFormErrors,
      "Enter a valid password. Password must be at least 4 characters, with at least one letter and one number."
    );
    showInputValidity("signup-form", "confirm_password", signUpFormErrors, "Your passwords don't match. Please try again.");
    showAcceptPrivacyPolicyValidity();
  }
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
 * Checks if the password and confirm password fields match.
 * If they do not match, sets a custom validity message on the confirm password input.
 * If they match, clears any custom validity message.
 *
 * @param {string} password - The password value.
 * @param {string} confirmPassword - The confirm password value.
 */
function checkPasswordAndConfirmPassword(password, confirmPassword) {
  if (password !== confirmPassword) {
    document.querySelector(`#signup-form input[name = confirm_password]`).setCustomValidity("Passwords do not match.");
  } else {
    document.querySelector(`#signup-form input[name = confirm_password]`).setCustomValidity("");
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
function checkAcceptPrivacyPolicyValidity() {
  const accept = document.querySelector("#signup-form input[name = accept]").checked;
  if (accept == false) {
    signUpFormErrors["accept"] = true;
  } else {
    signUpFormErrors["accept"] = false;
  }
}

function showAcceptPrivacyPolicyValidity() {
  if (signUpFormErrors["accept"]) {
    document.querySelector(`#signup-form .accept`).classList.add("error");
    document.getElementById("accept_change").innerHTML = "Please";
  } else {
    document.querySelector(`#signup-form .accept`).classList.remove("error");
    document.getElementById("accept_change").innerHTML = "I";
  }
}

/**
* Generates a profile image string based on a user's name.
* @param {string} name - The user's name.
* @returns {string} The profile image string.
*/
function getProfileImage(name) {
  const parts = name.trim().split(" ");
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts.length < 2 ? '' : parts[1].charAt(0).toUpperCase();
  return firstInitial + lastInitial;
}