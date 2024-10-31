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
 * Groups users by the first letter of their name and sorts them alphabetically.
 * Each user is added to the `groupedUsers` object under the corresponding first letter.
 *
 * @param {Object} users - An object containing user data, where the key is the user ID and the value is the user details.
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
 * Displays the contact list grouped by the first letter of users' names.
 * Iterates over the grouped users and adds the HTML templates for each letter group
 * and each user contact list item to the specified list reference.
 *
 * @param {Element} listRef - The DOM element where the contact list will be rendered.
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
        <div id="contact-list-user-${user.key}" class="contact-list-contact" onclick="updateActiveStateContactList(this); renderContactDetail('${user.key}', 'detail')">
                        <div class="contact-list-profile" style="background-color: ${user.color};">${user.profileImage}</div>
                        <div class="contact-list-contact-info">
                            <p>${user.name}</p>
                            <a href="mailto:${user.email}">${user.email}</a>
                        </div>
                    </div>
    `;
}

/**
 * Renders the contact detail view for a specific user.
 * Fetches user data, updates the contact detail view, and handles responsive view adjustments
 * for smaller screens by rendering edit buttons, activating slide-in close functionality,
 * and toggling the visibility of the contact detail element.
 *
 * @param {string} id - The ID of the user whose details are to be rendered.
 * @param {string} showElement - The element to show for responsive visibility handling.
 * @returns {Promise<void>}
 */
async function renderContactDetail(id, showElement) {
  let detailRef = document.getElementById("contact-detail-view");
  let detailUser = await getData("users/" + id);
  detailRef.innerHTML = "";
  detailRef.innerHTML = getContactDetailTemplate(id, detailUser);
  if (window.innerWidth <= 860) {
    renderResponsiveEditButtons(id);
    activateCloseSlideIn();
    toggleResponsiveVisibilityContact(showElement);
  }
}

/**
 * Toggles visibility for contact sections based on the specified element.
 * @param {string} showElement - Element to show (e.g., "list" or "detail").
 */
function toggleResponsiveVisibilityContact(showElement) {
  document.body.classList.remove("show-list", "show-detail");
  document.body.classList.add("show-" + showElement);
}

/**
 * Renders the responsive edit and delete buttons for a specific contact.
 * Clears the current content of the edit button container and appends the edit and delete button templates.
 *
 * @param {string} id - The ID of the user for whom the edit and delete buttons are to be rendered.
 */
function renderResponsiveEditButtons(id) {
  let responsiveEditRef = document.getElementById(
    "contact-detail-responsive-edit-delete-wrapper"
  );
  responsiveEditRef.innerHTML = "";
  responsiveEditRef.innerHTML += getResponsiveEditDeleteBtnTemplate(id);
}

/**
 * Generates the HTML template for the responsive edit and delete buttons.
 * The template includes a button with three dots that triggers the `openSlideIn` function
 * and a slide-in container for additional content.
 *
 * @param {string} id - The ID of the user for whom the edit and delete buttons are to be generated.
 * @returns {string} - The HTML string for the responsive edit and delete buttons.
 */
function getResponsiveEditDeleteBtnTemplate(id) {
  return /*html*/ `
    <div class="edit-delete-btn-responsive" onclick="openSlideIn('${id}')">
                    <span class="dot"></span>
                    <span class="dot"></span>
                    <span class="dot"></span>
                </div>
                <div class="slide-in" id="slideIn">
                  <div class="slide-in-content"></div>
                </div>
  `;
}

/**
 * Updates the active state of the contact list.
 * @param {Element} contact - The contact element to activate.
 */
function updateActiveStateContactList(contact) {
  document
    .querySelectorAll(".contact-list-contact")
    .forEach((contactInList) =>
      contactInList.classList.remove("contact-list-contact-active")
    );
  contact.classList.add("contact-list-contact-active");
}

/**
 * Returns the template for the contact details.
 * @param {string} id - The ID of the contact.
 * @param {Object} detailUser - The contact details.
 * @returns {string} The HTML template for the contact details.
 */
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

/**
 * Opens the slide-in menu and populates it with edit and delete buttons for the specified contact.
 *
 * @param {string} id - The unique identifier of the contact for which the edit and delete actions will be performed.
 */
function openSlideIn(id) {
  const slideInContent = document.querySelector(".slide-in-content");
  slideInContent.innerHTML = getSlideInTemplate(id);
  const slideIn = document.getElementById("slideIn");
  slideIn.classList.add("visible");
}

/**
 * Generates the HTML template for the slide-in menu.
 * The template includes buttons for editing and deleting a contact, each with their corresponding icons and actions.
 *
 * @param {string} id - The ID of the user for whom the slide-in menu is generated.
 * @returns {string} - The HTML string for the slide-in menu.
 */
function getSlideInTemplate(id) {
  return /*html*/ `
    <button class="contact-detail-btn" onclick="openEditContactModal('${id}'); closeSlideIn()">
          <img src="./assets/img/edit.svg" alt="">
          <span>Edit</span>
      </button>
      <button class="contact-detail-btn" onclick="deleteContact('${id}'); toggleResponsiveVisibilityContact('list')">
          <img src="./assets/img/delete.svg" alt="">
          <span>Delete</span>
      </button>
  `;
}

/**
 * Clears content from the responsive edit/delete wrapper.
 */
function removeResponsiveEditAfterDelete() {
  let responsiveEditRef = document.getElementById(
    "contact-detail-responsive-edit-delete-wrapper"
  );
  responsiveEditRef.innerHTML = "";
}

/**
 * Closes the slide-in menu by removing the 'visible' class.
 */
function closeSlideIn() {
  const slideIn = document.getElementById("slideIn");
  slideIn.classList.remove("visible");
}

/**
 * Activates the functionality to close the slide-in menu when clicking outside of it.
 */
function activateCloseSlideIn() {
  document.addEventListener("click", function (event) {
    const slideIn = document.getElementById("slideIn");
    const button = document.querySelector(".edit-delete-btn-responsive");
    if (
      slideIn.classList.contains("visible") &&
      !slideIn.contains(event.target) &&
      !button.contains(event.target)
    ) {
      closeSlideIn();
    }
  });
}
