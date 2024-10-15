let createFormErrors = {
  name: 0,
  email: 0,
  phone: 0
};

function eventListenerCreateContact() {
  let formElement = document.getElementById('create-contact-form');

  formElement.addEventListener("submit", function (e) {
    e.preventDefault();
    checkCreateInputValidation('name');
    checkCreateInputValidation('email');
    checkCreateInputValidation('phone');

    if (createFormErrors.name === 0 && createFormErrors.email === 0 && createFormErrors.phone === 0) {
      createContact();
    }

  });

  document.getElementById('add-contact-overlay').addEventListener('click', function (e) {
    if (e.target !== e.currentTarget) return;
    hideAddContactOverlay();
  });

}

async function createContact() {
  let name = document.querySelector('#create-contact-form input[name = name]').value
  let email = document.querySelector('#create-contact-form input[name = email]').value
  let mobile = document.querySelector('#create-contact-form input[name = phone]').value

  if (await isEmailExist(email)) {
    console.error("this email already exist");
  } else {
    const data = {
      name: name,
      mobile: mobile,
      email: email,
      color: getRandomColor(),
      profileImage: getProfileImage(name)
    };

    await postData("users", data);
    resetCreateContactForm();
    renderContactList();
    hideAddContactOverlay();
  }
}

function resetCreateContactForm() {
  document.querySelector('#create-contact-form input[name = name]').value = '';
  document.querySelector('#create-contact-form input[name = email]').value = '';
  document.querySelector('#create-contact-form input[name = phone]').value = '';
}

function showAddContactOverlay() {
  document.getElementById('add-contact-overlay').style.zIndex = 100;
  document.getElementById('add-contact-overlay').style.backgroundColor = 'rgb(0 0 0 / 30%)'
  document.getElementById('add-contact-overlay-container').style.transform = 'translateX(0)';
}

function hideAddContactOverlay() {
  document.getElementById('add-contact-overlay').style.backgroundColor = 'rgb(0 0 0 / 0%)'
  document.getElementById('add-contact-overlay-container').style.transform = 'translateX(200%)';
  document.getElementById('add-contact-overlay').style.zIndex = -1;
}

function checkCreateInputValidation(inputName) {
  let inputElement = document.querySelector(`#create-contact-form input[name = ${inputName}]`);
  let errorMessageElement = document.querySelector(`#create-contact-form .${inputName}-error`);

  if (!inputElement.checkValidity()) {
    inputElement.classList.add("input-error");
    errorMessageElement.classList.remove("d-none");
    createFormErrors[inputName] = 1;
  } else {
    inputElement.classList.remove("input-error");
    errorMessageElement.classList.add("d-none");
    createFormErrors[inputName] = 0;
  }

}