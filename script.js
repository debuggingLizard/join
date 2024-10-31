/**
 * Renders sidebar and header content.
 * Clears existing content in sidebar and header, then inserts new templates.
 */
function renderSidebarHeader() {
  let sidebarRef = document.getElementById("sidebar");
  sidebarRef.innerHTML = "";
  sidebarRef.innerHTML = getSidebarTemplate();
  let headerRef = document.getElementById("header");
  headerRef.innerHTML = "";
  headerRef.innerHTML = getHeaderTemplate();
}

/**
 * Returns the template for the sidebar.
 * @returns {string} The HTML template for the sidebar.
 */
function getSidebarTemplate() {
  return /*html*/ `
        <div class="logo">
            <img src="./assets/img/JoinLogo.svg" alt="JoinLogo">
        </div>
        <nav>
            <a href="summary.html" id="sidebar-nav-summary" class="sidebar-nav-a"><img src="./assets/buttons/Summary.svg" alt="SummaryButton"><span>Summary</span></a>
            <a href="addTask.html" id="sidebar-nav-task" class="sidebar-nav-a"><img src="./assets/buttons/AddTask.svg" alt="AddTask"><span>Add Task</span></a>
            <a href="board.html" id="sidebar-nav-board" class="sidebar-nav-a"><img src="./assets/buttons/Board.svg" alt="Board"><span>Board</span></a>
            <a href="contacts.html" id="sidebar-nav-contacts" class="sidebar-nav-a"><img src="./assets/buttons/Contacts.svg" alt="Contacts"><span>Contacts</span></a>
        </nav>
        <footer>
            <a tabindex="0" href="privacy-policy.html" onclick="saveCurrentPage()">Privacy Policy</a>
            <a tabindex="0" href="legal-notice.html"onclick="saveCurrentPage()">Legal notice</a>
        </footer>
    `;
}

/**
 * Returns the template for the header.
 * @returns {string} The HTML template for the header.
 */
function getHeaderTemplate() {
  return /*html*/ `
         <div class="header-content">
            <img class="header-responsive-logo" src="./assets/img/JoinLogoResponsive.svg" alt="">
            <h2>Kanban Project Management Tool</h2>
            <div class="user-info">
                <a href="help.html" onclick="saveCurrentPage()" class="help-icon"><img src="./assets/buttons/help.svg" alt="Help"></a>
                <div class="user-info-profile" onclick="openHeaderProfileInfo()">SM</div>
            </div>
            <div id="user-info-links" class="user-info-links d-none">
                <a href="help.html" onclick="saveCurrentPage()" class="user-info-links-help">Help</a>
                <a href="legal-notice.html" onclick="saveCurrentPage()">Legal Notice</a>
                <a href="privacy-policy.html" onclick="saveCurrentPage()">Privacy Policy</a>
                <a href="">Log Out</a>
            </div>
        </div>
    `;
}

/**
 * Toggles the visibility of the header profile info dropdown.
 */
function openHeaderProfileInfo() {
  document.getElementById("user-info-links").classList.toggle("d-none");
}

/**
 * Saves the current page URL in session storage under 'previousPage' key.
 */
function saveCurrentPage() {
  sessionStorage.setItem("previousPage", window.location.href);
}

/**
 * Navigates to the stored previous page if available, otherwise goes back in history.
 */
function goBack() {
  let previousPage = sessionStorage.getItem("previousPage");
  if (previousPage) {
    window.location.href = previousPage;
  } else {
    window.history.back();
  }
}

/**
 * Updates the active state of navigation links.
 * @param {string} navLinkID - ID of the navigation link to activate.
 */
function updateActiveStateNavLink(navLinkID) {
  document
    .querySelectorAll("sidebar-nav-a")
    .forEach((link) => link.classList.remove("nav-a-active"));
  document.getElementById(navLinkID).classList.add("nav-a-active");
}
