function renderSidebarHeader() {
  let sidebarRef = document.getElementById("sidebar");
  sidebarRef.innerHTML = "";
  sidebarRef.innerHTML = getSidebarTemplate();
  let headerRef = document.getElementById("header");
  headerRef.innerHTML = "";
  headerRef.innerHTML = getHeaderTemplate();
}

function getSidebarTemplate() {
  return /*html*/ `
        <div class="logo">
            <img src="./assets/img/JoinLogo.svg" alt="JoinLogo">
        </div>
        <nav>
            <ul>
                <li tabindex="0"><a href="#"><img src="./assets/buttons/summary.svg" alt="SummaryButton">Summary</a>
                </li>
                <li tabindex="0"><a href=" #"><img src="./assets/buttons/addTask.svg" alt="AddTask">Add Task</a></li>
                <li tabindex="0"><a href="#"><img src="./assets/buttons/board.svg" alt="Board">Board</a></li>
                <li tabindex="0"><a href="#"><img src="./assets/buttons/contacts.svg" alt="Contacts">Contacts</a></li>
            </ul>
        </nav>
        <footer>
            <a tabindex="0" href="#">Privacy Policy</a>
            <a tabindex="0" href="#">Legal notice</a>
        </footer>
    `;
}

function getHeaderTemplate() {
  return /*html*/ `
         <div class="header-content">
            <h2>Kanban Project Management Tool</h2>
            <div class="user-info">
                <a href="#" class="help-icon"><img src="./assets/buttons/help.svg" alt="Help"></a>
                <div class="user-info-profile" onclick="openHeaderProfileInfo()">SM</div>
            </div>
            <div id="user-info-links" class="user-info-links d-none">
                <p>Legal Notice</p>
                <p>Privacy Policy</p>
                <p>Log Out</p>
            </div>
        </div>
    `;
}

function openHeaderProfileInfo() {
    document.getElementById("user-info-links").classList.toggle("d-none");
  }
