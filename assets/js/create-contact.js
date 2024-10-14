function init() {
  let formElement = document.getElementById('create-contact-form');

  formElement.addEventListener("submit", function (e) {
    e.preventDefault();
    createContact();
  });
}

async function createContact() {
  let name = document.getElementById('name').value;
  let email = document.getElementById('email').value;
  let mobile = document.getElementById('phone').value;

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

    postData("users", data);
    resetCreateContactForm();
  }
}

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
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function getProfileImage(name) {
  const parts = name.trim().split(" ");
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts.length < 2 ? parts[0].charAt(0).toUpperCase() : parts[1].charAt(0).toUpperCase();
  return firstInitial + lastInitial;
}

function resetCreateContactForm() {
  document.getElementById('name').value = '';
  document.getElementById('email').value = '';
  document.getElementById('phone').value = '';
}