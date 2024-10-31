const loginPage = './login.html';

function checkLogin() {
    const now = new Date();
    let keepLogin = false;

    if (localStorage.getItem("joinLoginValidTime") !== null) {
        if (localStorage.getItem("joinLoginValidTime") > now.getTime()) {
            keepLogin = true;
        } else {
            if (localStorage.getItem("joinLoginRemember") == 'true') {
                localStorage.setItem("joinLoginValidTime", getNextOneHourTime());
                keepLogin = true;
            }
        }
    }

    if (localStorage.getItem("joinGuestLoginValidTime") !== null) {
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