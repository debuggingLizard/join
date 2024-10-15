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
            <a href="#" id="sidebar-nav-summary" class="sidebar-nav-a"><img src="./assets/buttons/summary.svg" alt="SummaryButton"><span>Summary</span></a>
               <a href=" #" id="sidebar-nav-task" class="sidebar-nav-a"><img src="./assets/buttons/addTask.svg" alt="AddTask"><span>Add Task</span></a>
               <a href="#" id="sidebar-nav-board" class="sidebar-nav-a"><img src="./assets/buttons/board.svg" alt="Board"><span>Board</span></a>
              <a href="contacts.html" id="sidebar-nav-contacts" class="sidebar-nav-a"><img src="./assets/buttons/contacts.svg" alt="Contacts"><span>Contacts</span></a>
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

// muss in render-funktion von jeder HTML-Seite aufgerufen werden (bzw. im onload), damit die Nav-Links entsprechend optisch angepasst werden. 
// Der Parameter ist die ID des Links, z.B. 'sidebar-nav-board'
function updateActiveStateNavLink(navLinkID) {
    document.querySelectorAll('sidebar-nav-a').forEach(link => link.classList.remove('nav-a-active'));
    document.getElementById(navLinkID).classList.add('nav-a-active');
  }
