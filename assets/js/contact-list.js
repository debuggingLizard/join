let groupedUsers = {};

async function renderContactList() {
  let users = await getData("users");
  getFirstLetter(users);
  displayContactList();
}

function getFirstLetter(users) {
  let sortedUsers = Object.keys(users).sort((a, b) => {
    return users[a].name.localeCompare(users[b].name);
  });
  sortedUsers.forEach((key) => {
    let user = users[key];
    let firstLetter = user.name[0].toUpperCase();
    let initials = user.name.split(" ").map((name, index, array) => {
        if (index === 0 || index === array.length - 1) {
          return name[0].toUpperCase();
        }
        return "";
      }).join("");
    if (!groupedUsers[firstLetter]) {
      groupedUsers[firstLetter] = [];
    }
    groupedUsers[firstLetter].push({ ...user, initials });
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
        <div id="contact-list-user-${user.id}" class="contact-list-contact" onclick="console.log('Open Contact with id ${user.id}')">
                        <div class="contact-list-profile" style="background-color: ${user.color};">${user.initials}</div>
                        <div class="contact-list-contact-info">
                            <p>${user.name}</p>
                            <a href="mailto:${user.email}">${user.email}</a>
                        </div>
                    </div>
    `;
}
