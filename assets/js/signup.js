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
      checkSignUpFormValidation();
      if (Object.values(signUpFormErrors).every((value) => value === false)) {
        signup(name, email, password);
      }
    });
}

/**
 * Checks the validity of all input fields in the sign-up form.
 * If all inputs have a value, enables the submit button; otherwise, disables it.
 */
function checkSignupButtonActivity() {
  let inputValidations = true;
  checkPasswordAndConfirmPassword();
  document.querySelectorAll("#signup-form input").forEach((input) => {
    validateInputValidity("signup-form", input.name, signUpFormErrors);
    if (signUpFormErrors[input.name]) {
      inputValidations = false;
    }
  });
  toggleButtonStatus(inputValidations, "signup-form");
}

/**
 * Validates the sign-up form by checking the validity of all input fields and
 * the acceptance of the privacy policy.
 */
function checkSignUpFormValidation() {
  checkPasswordAndConfirmPassword();
  checkAndShowNameInputValidationSignUpForm();
  checkAndShowEmailInputValidationSignUpForm();
  checkAndShowPasswordInputValidationSignUpForm();
  checkAndShowConfirmPasswordInputValidationSignUpForm();
  checkAcceptPrivacyPolicyValidity();
  showAcceptPrivacyPolicyValidity();
}

/**
 * Validate name input
 */
function checkAndShowNameInputValidationSignUpForm() {
  validateInputValidity("signup-form", "name", signUpFormErrors);
  checkInputValidity(
    "signup-form",
    "name",
    signUpFormErrors,
    "Enter a valid name."
  );
}

/**
 * Validate email input
 */
function checkAndShowEmailInputValidationSignUpForm() {
  validateInputValidity("signup-form", "email", signUpFormErrors);
  checkInputValidity(
    "signup-form",
    "email",
    signUpFormErrors,
    "Enter a valid email address."
  );
}

/**
 * Validate password input
 */
function checkAndShowPasswordInputValidationSignUpForm() {
  validateInputValidity("signup-form", "password", signUpFormErrors);
  checkInputValidity(
    "signup-form",
    "password",
    signUpFormErrors,
    "Enter a valid password. Password must be at least 4 characters, with at least one letter and one number."
  );
}

/**
 * Validate confirm_password input
 */
function checkAndShowConfirmPasswordInputValidationSignUpForm() {
  validateInputValidity("signup-form", "confirm_password", signUpFormErrors);
  checkInputValidity(
    "signup-form",
    "confirm_password",
    signUpFormErrors,
    "Your passwords don't match. Please try again."
  );
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
function checkPasswordAndConfirmPassword() {
  const password = document.querySelector(
    "#signup-form input[name = password]"
  ).value;
  const confirmPassword = document.querySelector(
    "#signup-form input[name = confirm_password]"
  ).value;

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
function checkAcceptPrivacyPolicyValidity() {
  const accept = document.querySelector(
    "#signup-form input[name = accept]"
  ).checked;

  signUpFormErrors["accept"] = accept == false ? true : false;
}

/**
 * Displays the validity of the acceptance of the privacy policy by adding or removing
 * an error class and updating the corresponding message. If the 'accept' field has errors,
 * the message is updated to 'Please'; otherwise, it is set to 'I'.
 */
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
  const lastInitial =
    parts.length > 1 ? parts[parts.length - 1].charAt(0).toUpperCase() : "";
  return firstInitial + lastInitial;
}
