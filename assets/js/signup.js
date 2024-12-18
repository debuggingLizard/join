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
 * Validates all input fields in the sign-up form and checks the password confirmation.
 * Toggles the submit button's disabled status based on the validation results.
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
 * Validates the entire sign-up form by checking and showing validation messages
 * for each input field (name, email, password, confirm password) and the privacy policy checkbox.
 */
function checkSignUpFormValidation() {
  checkPasswordAndConfirmPassword();
  checkAndShowNameInputValidationSignUpForm();
  checkAndShowEmailInputValidationSignUpForm();
  checkAndShowPasswordInputValidationSignUpForm();
  checkAndShowConfirmPasswordInputValidationSignUpForm();
  checkAndShowPrivacyCheckboxValidationSignUpForm();
}

/**
 * Validates and shows the name input validation status in the sign-up form.
 * Displays an error message if the name is not valid.
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
 * Validates and shows the email input validation status in the sign-up form.
 * Displays an error message if the email address is not valid.
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
 * Validates and shows the password input validation status in the sign-up form.
 * Displays an error message if the password is not valid.
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
 * Validates and shows the confirmation password input validation status
 * in the sign-up form.
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
 * Checks the validity of the privacy policy acceptance checkbox and shows the validation status
 * in the sign-up form.
 */
function checkAndShowPrivacyCheckboxValidationSignUpForm() {
  checkAcceptPrivacyPolicyValidity();
  showAcceptPrivacyPolicyValidity();
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
    document.getElementById("privacy-error").innerHTML = "Please accept the privacy policy";
  } else {
    document.getElementById("privacy-error").innerHTML = "";
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
