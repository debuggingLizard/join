function eventListenerEditContact() {
  let formElement = document.getElementById('edit-contact-form');

  formElement.addEventListener("submit", function (e) {
    e.preventDefault();
    editContact();
  });

  document.getElementById('edit-contact-overlay').addEventListener('click', function (e) {
    if(e.target !== e.currentTarget) return;
    hideEditContactOverlay();
  });
}

async function openEditContactModal(userId) {
  let user = await getData("users/" + userId);

  document.querySelector('#edit-contact-form input[name = id]').value = userId;
  document.querySelector('#edit-contact-form input[name = name]').value = user.name;
  document.querySelector('#edit-contact-form input[name = email]').value = user.email;
  document.querySelector('#edit-contact-form input[name = phone]').value = user.mobile;
  document.querySelector('#edit-contact-overlay .person-img').style.backgroundColor = user.color;
  document.querySelector('#edit-contact-overlay .person-img').innerHTML = user.profileImage;

  showEditContactOverlay();
}

async function editContact() {
  let id = document.querySelector('#edit-contact-form input[name = id]').value;
  let name = document.querySelector('#edit-contact-form input[name = name]').value;
  let email = document.querySelector('#edit-contact-form input[name = email]').value;
  let mobile = document.querySelector('#edit-contact-form input[name = phone]').value;

  let currentUserDetail = await getData("users/" + id);

  if (await isEmailExist(email) && currentUserDetail.email != email) {
    console.error("this email already exist");
  } else {
    const data = {
      name: name,
      mobile: mobile,
      email: email,
      color: currentUserDetail.color,
      profileImage: getProfileImage(name)
    };

    await putData("users", id, data);
    renderContactDetail(id)
    renderContactList();
    hideEditContactOverlay();
  }
}

function showEditContactOverlay(){
  document.getElementById('edit-contact-overlay').style.zIndex = 100;
  document.getElementById('edit-contact-overlay').style.backgroundColor = 'rgb(0 0 0 / 30%)'
  document.getElementById('edit-contact-overlay-container').style.transform = 'translateX(0)';
}

function hideEditContactOverlay(){
  document.getElementById('edit-contact-overlay').style.backgroundColor = 'rgb(0 0 0 / 0%)'
  document.getElementById('edit-contact-overlay-container').style.transform = 'translateX(200%)';
  document.getElementById('edit-contact-overlay').style.zIndex = -1;
}