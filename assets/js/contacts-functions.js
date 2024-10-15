async function isEmailExist(email) {
  const users = await getData("users");

  if (users === null || users === undefined) {
    return false;
  }

  const foundUsers = Object.values(users).filter(
    (user) => user.email === email
  );

  return foundUsers.length > 0 ? true : false;
}

function getRandomColor() {
  const colors = [
    '#FF7A00',
    '#FF5EB3',
    '#6E52FF',
    '#9327FF',
    '#00BEE8',
    '#1FD7C1',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
    '#FFC701',
    '#0038FF',
    '#C3FF2B',
    '#FFE62B',
    '#FF4646',
    '#FFBB2B',
  ]

  const rndInt = randomIntFromInterval(0, colors.length - 1);
  return colors[rndInt];
}

function getProfileImage(name) {
  const parts = name.trim().split(" ");
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts.length < 2 ? parts[0].charAt(0).toUpperCase() : parts[1].charAt(0).toUpperCase();
  return firstInitial + lastInitial;
}

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function removeAllErrors(){
  let createInputElements = document.querySelectorAll(`#create-contact-form input`);
  createInputElements.forEach((element) => {
    element.classList.remove("input-error");
  });

  let editInputElements = document.querySelectorAll(`#edit-contact-form input`);
  editInputElements.forEach((element) => {
    element.classList.remove("input-error");
  });

  let createErrorMessageElements = document.querySelectorAll("#create-contact-form [class$='-error']");
  createErrorMessageElements.forEach((element) => {
    element.classList.add("d-none");
  });

  let editErrorMessageElements = document.querySelectorAll("#edit-contact-form [class$='-error']");
  editErrorMessageElements.forEach((element) => {
    element.classList.add("d-none");
  });
}

function hideValidationByTyping(inputName) {
  let createInputElement = document.querySelector(`#create-contact-form input[name = ${inputName}]`);
  let editInputElement = document.querySelector(`#edit-contact-form input[name = ${inputName}]`);
  let createErrorMessageElement = document.querySelector(`#create-contact-form .${inputName}-error`);
  let editErrorMessageElement = document.querySelector(`#edit-contact-form .${inputName}-error`);
  
  createInputElement.classList.remove("input-error");
  editInputElement.classList.remove("input-error");
  createErrorMessageElement.classList.add("d-none");
  editErrorMessageElement.classList.add("d-none");
}