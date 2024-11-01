const redirectPage = './summary.html';

let loginFormErrors = {
    email: false,
    password: false
}

let signUpFormErrors = {
    name: false,
    email: false,
    password: false,
    confirm_password: false,
    accept: false
}

function initLogin() {
    logoAnimation();
    loginFormEvent();
    signUpFormEvent();
    typePassword();
    togglePasswordVisible();
}

function showLoginForm() {
    document.getElementById('signup-form').classList.add('d-none');
    document.getElementById('login-form').classList.remove('d-none');
    document.getElementById('header-right').classList.remove('d-none');
}

function showSignupForm() {
    document.getElementById('login-form').classList.add('d-none');
    document.getElementById('header-right').classList.add('d-none');
    document.getElementById('signup-form').classList.remove('d-none');
}

function logoAnimation() {
    const loginLogoImage = document.querySelector('.login-logo');
    const loginLogoImageRect = loginLogoImage.getBoundingClientRect();
    loginLogoImage.style.top = loginLogoImageRect.top + 'px';
    loginLogoImage.style.left = loginLogoImageRect.left + 'px';

    setTimeout(() => {
        document.querySelector('.login-logo').classList.add('login-logo-after-init');
        document.querySelector('.logo-wrapper').classList.add('logo-wrapper-after-init');
        document.querySelector('header').style.opacity = 1;
        document.querySelector('main').style.opacity = 1;
        document.querySelector('footer').style.opacity = 1;
    }, 100);
}

async function loginFormEvent() {
    document.getElementById('login-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.querySelector('#login-form input[name = email]').value;
        checkInputValidity('login-form', 'email', loginFormErrors, 'Enter a valid email address.');

        const password = document.querySelector('#login-form input[name = password]').value;
        checkInputValidity('login-form', 'password', loginFormErrors, 'Enter a valid password.');

        const remember = document.querySelector('#login-form input[name = remember]').checked;

        if (Object.values(loginFormErrors).every(value => value === false)) {
            login(email, password, remember);
        }
    })
}

async function signUpFormEvent() {
    document.getElementById('signup-form').addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.querySelector('#signup-form input[name = name]').value;
        checkInputValidity('signup-form', 'name', signUpFormErrors, 'Enter a valid name.');

        const email = document.querySelector('#signup-form input[name = email]').value;
        checkInputValidity('signup-form', 'email', signUpFormErrors, 'Enter a valid email address.');

        const password = document.querySelector('#signup-form input[name = password]').value;
        const confirmPassword = document.querySelector('#signup-form input[name = confirm_password]').value;
        checkPasswordAndConfirmPassword(password, confirmPassword);
        checkInputValidity('signup-form', 'password', signUpFormErrors, 'Enter a valid password.');
        checkInputValidity('signup-form', 'confirm_password', signUpFormErrors, "Your passwords don't match. Please try again.");

        const accept = document.querySelector('#signup-form input[name = accept]').checked;
        checkAcceptPrivacyPolicy(accept);

        if (Object.values(signUpFormErrors).every(value => value === false)) {
            signup(name, email, password);
        }
    })
}

function checkInputValidity(form, input, errorsObject, message) {
    if (!document.querySelector(`#${form} input[name = ${input}]`).checkValidity()) {
        errorsObject[input] = true;
        document.querySelector(`#${form} input[name = ${input}]`).classList.add('input-error');
        document.querySelector(`#${form} .${input}-error`).classList.remove('d-none');
        document.querySelector(`#${form} .${input}-error`).innerHTML = message;
    } else {
        errorsObject[input] = false;
        document.querySelector(`#${form} input[name = ${input}]`).classList.remove('input-error');
        document.querySelector(`#${form} .${input}-error`).classList.add('d-none');
    }
}

function checkPasswordAndConfirmPassword(password, confirmPassword) {
    if (password !== confirmPassword) {
        document.querySelector(`#signup-form input[name = confirm_password]`).setCustomValidity("Passwords do not match.");
    } else {
        document.querySelector(`#signup-form input[name = confirm_password]`).setCustomValidity("");
    }
}

function checkAcceptPrivacyPolicy(accept) {
    if (accept == false) {
        signUpFormErrors['accept'] = true;
        document.querySelector(`#signup-form .accept`).classList.add('error');
        document.getElementById('accept_change').innerHTML = 'Please';
    } else {
        signUpFormErrors['accept'] = false;
        document.querySelector(`#signup-form .accept`).classList.remove('error');
        document.getElementById('accept_change').innerHTML = 'I';
    }
}

async function login(email, password, remember) {
    const admins = await getData('admins');
    const adminsArray = Object.entries(admins);
    let foundAdmin = adminsArray.filter((admin) => admin[1].email === email);
    if (foundAdmin.length <= 0) {
        showLoginError();
        return;
    }

    const hashPassword = await hashingPassword(password, foundAdmin[0][1].salt);
    if (hashPassword !== foundAdmin[0][1].password) {
        showLoginError();
        return;
    }

    localStorage.removeItem("joinGuestLoginValidTime");
    localStorage.setItem("joinLoginInfo", JSON.stringify({
        name: foundAdmin[0][1].name,
        email: foundAdmin[0][1].email,
        profileImage: foundAdmin[0][1].profileImage
    }));
    localStorage.setItem("joinLoginRemember", remember);
    localStorage.setItem("joinLoginValidTime", getNextOneHourTime());
    window.location.href = redirectPage;
}

function showLoginError() {
    document.querySelector(`#login-form input[name = email]`).classList.add('input-error');
    document.querySelector(`#login-form input[name = password]`).classList.add('input-error');
    document.querySelector(`#login-form .password-error`).classList.remove('d-none');
    document.querySelector(`#login-form .password-error`).innerHTML = 'Check your email and password. Please try again.';
}

function guestLogin() {
    localStorage.removeItem("joinLoginInfo");
    localStorage.removeItem("joinLoginRemember");
    localStorage.removeItem("joinLoginValidTime");
    localStorage.setItem("joinGuestLoginValidTime", getNextOneHourTime());
    window.location.href = redirectPage;
}

async function signup(name, email, password) {
    const salt = generateSalt();
    const hashPassword = await hashingPassword(password, salt);

    let Data = {
        name: name,
        email: email,
        password: hashPassword,
        salt: salt,
        profileImage: getProfileImage(name)
    }

    await postData("admins", Data);
    await login(email, password, false);
}

function getNextOneHourTime() {
    const validTime = new Date();
    // Add 1 hour (1 hour = 60 minutes * 60 seconds * 1000 milliseconds)
    validTime.setTime(validTime.getTime() + (1 * 60 * 60 * 1000));

    return validTime.getTime();
}

function typePassword() {
    let passwordInputElements = document.querySelectorAll('input[type = password]');
    passwordInputElements.forEach(passwordInputElement => {
        passwordInputElement.addEventListener('keyup', function () {
            let iconElement = passwordInputElement.nextElementSibling;
            if (passwordInputElement.value.length >= 1) {
                iconElement.classList.remove('icon-lock');
                iconElement.classList.add('c-pointer');
                if (passwordInputElement.type === 'password') {
                    iconElement.classList.add('icon-visibility-off');
                } else {
                    iconElement.classList.add('icon-visibility');
                }
            } else {
                passwordInputElement.type = 'password';
                iconElement.classList.remove('icon-visibility-off');
                iconElement.classList.remove('icon-visibility');
                iconElement.classList.remove('c-pointer');
                iconElement.classList.add('icon-lock');
            }
        })
    });
}

function togglePasswordVisible() {
    let iconLockInputElements = document.querySelectorAll('.icon-lock');
    iconLockInputElements.forEach(iconLockInputElement => {
        iconLockInputElement.addEventListener('click', function () {
            let passwordInputElement = iconLockInputElement.previousElementSibling;
            if (passwordInputElement.value.length >= 1) {
                if (passwordInputElement.type === 'password') {
                    passwordInputElement.type = 'text';
                    iconLockInputElement.classList.add('icon-visibility');
                    iconLockInputElement.classList.remove('icon-visibility-off');
                } else {
                    passwordInputElement.type = 'password';
                    iconLockInputElement.classList.add('icon-visibility-off');
                    iconLockInputElement.classList.remove('icon-visibility');
                }
            }
        })
    });
}

/**
 * Generates a profile image string based on a user's name.
 * @param {string} name - The user's name.
 * @returns {string} The profile image string.
 */
function getProfileImage(name) {
    const parts = name.trim().split(" ");
    const firstInitial = parts[0].charAt(0).toUpperCase();
    const lastInitial =
        parts.length < 2
            ? parts[0].charAt(0).toUpperCase()
            : parts[1].charAt(0).toUpperCase();
    return firstInitial + lastInitial;
}

// Generate a SHA-256 hash
async function hashingPassword(password, salt) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password + salt);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);

    // Convert ArrayBuffer to hex string
    return Array.from(new Uint8Array(hashBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Generate a random salt
function generateSalt(length = 16) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    return Array.from(array)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}