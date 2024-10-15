let groupedUsers = {};

/**
 * This function is called onload in body of contacts.html.
 * It fetches the user data from the database, writing it into users, and renders the contact list by calling two other functions
 */
async function renderContactList() {
  let users = await getData("users");
  groupedUsers = {};
  getFirstLetters(users);
  let listRef = document.getElementById("contact-list-list");
  listRef.innerHTML = "";
  displayContactList(listRef);
}

/**
 * This function sorts the users alphabetically (this is necessary because the contact list must be sorted alphabetically).
 * From these sortedUsers, it extracts the first letter of every name and creates an empty array in the groupedUsers object if that array doesn't exist already.
 * It also extracts the initials of the first and last name of a user and assigns them to initials.
 * Finally, it creates a copy of each user and adds the initials to it, pushing each user object with their initials into groupedUsers.
 * The keys of groupedUsers are the first letters that exist in the user database (for grouping), the values are the respective user objects that start with that letter.
 *
 * @param {object} users
 */
function getFirstLetters(users) {
  let sortedUsers = Object.keys(users).sort((a, b) => {
    return users[a].name.localeCompare(users[b].name);
  });
  sortedUsers.forEach((key) => {
    let user = users[key];
    let firstLetter = user.name[0].toUpperCase();
    if (!groupedUsers[firstLetter]) {
      groupedUsers[firstLetter] = [];
    }
    groupedUsers[firstLetter].push({ ...user, key });
  });
}

/**
 * This function uses the global groupedUsers object and creates HTML for every key-value pair of that object, i.e. displaying the users.
 * It first gets the template for the basic HTML structure for the letter category.
 * Then, it gets the template for every user, placing these within the respective letter category that they belong to.
 */
function displayContactList(listRef) {
  Object.keys(groupedUsers).forEach((letter) => {
    listRef.innerHTML += getLetterGroupTemplate(letter);
    groupedUsers[letter].forEach((user) => {
      let letterRef = document.getElementById("contact-list-item-" + letter);
      letterRef.innerHTML += getUserContactListTemplate(user);
    });
  });
}

/**
 * This template function returns the HTML structure for a letter category.
 * It takes a letter (i.e. 'A') and returns the HTML accordingly
 *
 * @param {string} letter
 * @returns HTML Structure
 */
function getLetterGroupTemplate(letter) {
  return /*html*/ `
        <div id="contact-list-item-${letter}" class="contact-list-item">
                    <div class="contact-list-letter">${letter}</div>
                    <div class="contact-list-hr"></div>
            </div>
    `;
}

/**
 * This template function returns the HTML structure for a user.
 * It takes the user object and returns the HTML accordingly.
 *
 * @param {object} user
 * @returns HTML Structure
 */
function getUserContactListTemplate(user) {
  return /*html*/ `
        <div id="contact-list-user-${user.key}" class="contact-list-contact" onclick="updateActiveStateContactList(this); renderContactDetail('${user.key}')">
                        <div class="contact-list-profile" style="background-color: ${user.color};">${user.profileImage}</div>
                        <div class="contact-list-contact-info">
                            <p>${user.name}</p>
                            <a href="mailto:${user.email}">${user.email}</a>
                        </div>
                    </div>
    `;
}

async function renderContactDetail(id) {
  let detailRef = document.getElementById("contact-detail-view");
  let detailUser = await getData("users/" + id);
  detailRef.innerHTML = "";
  detailRef.innerHTML = getContactDetailTemplate(id, detailUser);

  if (window.innerWidth <= 1240) {
    document.querySelector('.contact-list').classList.add('contact-list-hidden');
    document.querySelector('.contact-detail').classList.add('contact-detail-visible');
    document.querySelector('.contact-list').style.display = 'none'; 
    document.querySelector('.contact-detail').style.display = 'block'; 
}
}

function showContactList() {
  document.querySelector('.contact-list').classList.remove('contact-list-hidden');
  document.querySelector('.contact-detail').classList.remove('contact-detail-visible');
  document.querySelector('.contact-detail').style.display = 'none'; 
  document.querySelector('.contact-list').style.display = 'block';  
}

function updateActiveStateContactList(contact) {
  document.querySelectorAll('.contact-list-contact').forEach(contactInList => contactInList.classList.remove('contact-list-contact-active'));
  contact.classList.add('contact-list-contact-active');
}

function getContactDetailTemplate(id, detailUser) {
  return /*html*/ `
      <div class="contact-information">
                        <div class="contact-detail-profile" style="background-color: ${detailUser.color};">${detailUser.profileImage}</div>
                        <div class="contact-name">
                            <p>${detailUser.name}</p>
                            <div class="contact-detail-btn-wrapper">
                                <button class="contact-detail-btn" onclick="openEditContactModal('${id}')">
                                  <img src="./assets/img/edit.svg" alt="">
                                  <span>Edit</span>
                                </button>
                                <button class="contact-detail-btn" onclick="deleteContact('${id}')">
                                  <img src="./assets/img/delete.svg" alt="">
                                  <span>Delete</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="contact-access">
                        <h3>Contact Information</h3>
                        <div class="contact-details-access">
                            <p>Email</p>
                            <a href="mailto:${detailUser.email}">${detailUser.email}</a>
                        </div>
                        <div class="contact-details-access">
                            <p>Phone</p>
                            <p style="font-weight: 400;">${detailUser.mobile}</p>
                        </div>
                    </div>
  `;
}

function openSlideIn() {
  const slideIn = document.getElementById('slideIn');
  slideIn.classList.add('visible');
}

function closeSlideIn() {
  const slideIn = document.getElementById('slideIn');
  slideIn.classList.remove('visible');
}


document.addEventListener('click', function(event) {
  const slideIn = document.getElementById('slideIn');
  const button = document.querySelector('.edit-delete-btn-responsive');

  
  if (slideIn.classList.contains('visible') && !slideIn.contains(event.target) && !button.contains(event.target)) {
    closeSlideIn();
  }
});

