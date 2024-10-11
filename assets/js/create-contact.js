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
    };

    postData("users", data);

    document.getElementById('name').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
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

