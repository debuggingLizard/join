const loginPage = './login.html';

function checkLogin() {
    const now = new Date();
    let keepLogin = false;

    if (isAdminLogin()) {
        if (localStorage.getItem("joinLoginValidTime") > now.getTime()) {
            keepLogin = true;
        } else {
            if (localStorage.getItem("joinLoginRemember") == 'true') {
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

    if (keepLogin === false) {
        logout();
    }
}

function getNextOneHourTime() {
    const validTime = new Date();
    // Add 1 hour (1 hour = 60 minutes * 60 seconds * 1000 milliseconds)
    validTime.setTime(validTime.getTime() + (1 * 60 * 60 * 1000));

    return validTime.getTime();
}

function getAdminProfileImage() {
    if (isAdminLogin()) {
        return JSON.parse(localStorage.getItem("joinLoginInfo")).profileImage;
    } else {
        return 'G';
    }
}

function showAdminName() {
    adminNameElement = document.getElementById('user-name');
    if (isAdminLogin()) {
        adminNameElement.innerHTML = JSON.parse(localStorage.getItem("joinLoginInfo")).name;
    } else {
        adminNameElement.innerHTML = '';
    }
}

function isAdminLogin() {
    return localStorage.getItem("joinLoginValidTime") !== null;
}

function isGuestLogin() {
    return localStorage.getItem("joinGuestLoginValidTime") !== null;
}

function logout() {
    localStorage.removeItem("joinLoginInfo");
    localStorage.removeItem("joinLoginRemember");
    localStorage.removeItem("joinLoginValidTime");
    localStorage.removeItem("joinGuestLoginValidTime");
    window.location.href = loginPage;
}

setInterval(() => {
    checkLogin();
}, 5000);