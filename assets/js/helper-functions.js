/**
 * Shows the validation error message for a specific input field in a form.
 * Adds the error class to the input field and displays the error message element.
 * 
 * @param {string} form - The CSS selector for the form element.
 * @param {string} inputName - The name attribute of the input field to show validation errors for.
 * @param {string} message - The validation message to be displayed.
 */
function showInputValidationError(form, inputName, message) {
  let inputElement = document.querySelector(`${form} *[name = ${inputName}]`);
  let errorMessageElement = document.querySelector(
    `${form} .${inputName}-error`
  );
  inputElement.classList.add("input-error");
  errorMessageElement.innerHTML = message;
  errorMessageElement.classList.remove("d-none");
}

/**
 * Hides the validation error message for a specific input field in a form.
 * Removes the error class from the input field and hides the error message element.
 * 
 * @param {string} form - The CSS selector for the form element.
 * @param {string} inputName - The name attribute of the input field to hide validation errors for.
 */
function hideInputValidationError(form, inputName) {
  let inputElement = document.querySelector(`${form} *[name = ${inputName}]`);
  let errorMessageElement = document.querySelector(
    `${form} .${inputName}-error`
  );
  inputElement.classList.remove("input-error");
  errorMessageElement.innerHTML = "";
  errorMessageElement.classList.add("d-none");
}
