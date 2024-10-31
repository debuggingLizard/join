/**
 * Zeigt einen Validierungsfehler für ein Eingabefeld an.
 * Fügt der Eingabe die Klasse "input-error" hinzu und zeigt die Fehlermeldung an.
 *
 * @param {string} form - Das Formular, in dem sich das Eingabefeld befindet.
 * @param {string} inputName - Der Name des Eingabefelds.
 * @param {string} message - Die anzuzeigende Fehlermeldung.
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
 * Versteckt den Validierungsfehler eines Eingabefelds.
 * Entfernt die Fehlerklasse und versteckt die zugehörige Fehlermeldung.
 *
 * @param {string} form - Das Formular, in dem sich das Eingabefeld befindet.
 * @param {string} inputName - Der Name des Eingabefelds.
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
