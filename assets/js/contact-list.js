let groupedUsers = {};

async function renderContactList() {
  let users = await getData("users");
  getFirstLetter(users);
  displayContactList();
}

function getFirstLetter(users) {
  Object.keys(users).forEach((key) => {
    let user = users[key];
    let firstLetter = user.name[0].toUpperCase();
    if (!groupedUsers[firstLetter]) {
      groupedUsers[firstLetter] = [];
    }
    groupedUsers[firstLetter].push(user);
  });
}

function displayContactList() {
  Object.keys(groupedUsers).forEach((letter) => {
    let listRef = document.getElementById("contact-list-list");
    listRef.innerHTML += getLetterGroupTemplate(letter);
    groupedUsers[letter].forEach((user) => {
      let letterRef = document.getElementById("contact-list-item-" + letter);
      letterRef.innerHTML += getUserContactListTemplate(user);
    });
  });
}

function getLetterGroupTemplate(letter) {
  return /*html*/ `
        <div id="contact-list-item-${letter}" class="contact-list-item">
                    <div class="contact-list-letter">${letter}</div>
                    <div class="contact-list-hr"></div>
            </div>
    `;
}

function getUserContactListTemplate(user) {
  return /*html*/ `
        <div id="contact-list-user-${user.id}" class="contact-list-contact" onclick="contactListUpdateActiveState()">
                        <div class="contact-list-profile">AM</div>
                        <div class="contact-list-contact-info">
                            <p>${user.name}</p>
                            <a href="mailto:${user.email}">${user.email}</a>
                        </div>
                    </div>
    `;
}
