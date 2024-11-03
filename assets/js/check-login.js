const loginPage = "./login.html";

/**
 * Checks the login status of the user (admin or guest) and determines if the session should be kept alive or the user should be logged out.
 * It extends the login session if the remember me option is set, or if the current page is a privacy policy or legal notice.
 */
function checkLogin() {
  const now = new Date();
  let keepLogin = false;
  if (isAdminLogin()) {
    if (localStorage.getItem("joinLoginValidTime") > now.getTime()) {
      keepLogin = true;
    } else {
      if (localStorage.getItem("joinLoginRemember") == "true") {
        localStorage.setItem("joinLoginValidTime", getNextOneHourTime());
        keepLogin = true;
      }
    }
  }
  if (isGuestLogin()) {
    if (localStorage.getItem("joinGuestLoginValidTime") > now.getTime()) {
      keepLogin = true;
    }
  }
  const pageName = getPageName();
  if (pageName === "privacy-policy.html" || pageName === "legal-notice.html") {
    keepLogin = true;
  }
  if (keepLogin === false) {
    logout();
  }
}

/**
 * Retrieves the name of the current page from the URL pathname.
 * Extracts and returns the substring following the last slash in the pathname.
 *
 * @returns {string} - The name of the current page.
 */
function getPageName() {
  const path = window.location.pathname;
  return path.substring(path.lastIndexOf("/") + 1);
}

/**
 * Calculates the timestamp one hour from the current time.
 * Adds one hour (in milliseconds) to the current time and returns the resulting timestamp.
 *
 * @returns {number} - The timestamp one hour from now.
 */
function getNextOneHourTime() {
  const validTime = new Date();
  // Add 1 hour (1 hour = 60 minutes * 60 seconds * 1000 milliseconds)
  validTime.setTime(validTime.getTime() + 1 * 60 * 60 * 1000);
  return validTime.getTime();
}

/**
 * Retrieves the profile image URL of the admin user if the admin is logged in.
 * Parses the login information from local storage to get the profile image.
 * If the user is not an admin, returns the default 'G' character.
 *
 * @returns {string} - The URL of the admin's profile image or 'G' if not an admin.
 */
function getAdminProfileImage() {
  if (isAdminLogin()) {
    return JSON.parse(localStorage.getItem("joinLoginInfo")).profileImage;
  } else {
    return "G";
  }
}

/**
 * Displays the admin's name in the HTML element with the ID 'user-name'.
 * If the admin is logged in, retrieves the name from local storage and sets it as the inner HTML of the element.
 * If the user is not an admin, clears the inner HTML of the element.
 */
function showAdminName() {
  adminNameElement = document.getElementById("user-name");
  if (isAdminLogin()) {
    adminNameElement.innerHTML = JSON.parse(
      localStorage.getItem("joinLoginInfo")
    ).name;
  } else {
    adminNameElement.innerHTML = "";
  }
}

/**
 * Checks if the admin user is currently logged in.
 * Determines the login status by verifying the presence of 'joinLoginValidTime' in local storage.
 *
 * @returns {boolean} - True if the admin is logged in, false otherwise.
 */
function isAdminLogin() {
  return localStorage.getItem("joinLoginValidTime") !== null;
}

/**
 * Checks if a guest user is currently logged in.
 * Determines the login status by verifying the presence of 'joinGuestLoginValidTime' in local storage.
 *
 * @returns {boolean} - True if a guest is logged in, false otherwise.
 */
function isGuestLogin() {
  return localStorage.getItem("joinGuestLoginValidTime") !== null;
}

/**
 * Logs the user out by removing all relevant login information from local storage
 * and redirecting the user to the login page.
 */
function logout() {
  localStorage.removeItem("joinLoginInfo");
  localStorage.removeItem("joinLoginRemember");
  localStorage.removeItem("joinLoginValidTime");
  localStorage.removeItem("joinGuestLoginValidTime");
  window.location.href = loginPage;
}

checkLogin();

setInterval(() => {
  checkLogin();
}, 5000);
