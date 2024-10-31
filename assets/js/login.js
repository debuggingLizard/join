function initLogin() {
    logoAnimation();
    loginFormEvent();
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
        const password = document.querySelector('#login-form input[name = password]').value;
        const remember = document.querySelector('#login-form input[name = remember]').checked;

        login(email, password, remember);
    })
}

async function login(email, password, remember) {
    const admins = await getData('admins');
    const adminsArray = Object.entries(admins);
    let foundAdmin = adminsArray.filter((admin) => admin[1].email === email);
    if (foundAdmin.length > 0) {
        const hashPassword = await hashingPassword(password, foundAdmin[0][1].salt);
        if (hashPassword === foundAdmin[0][1].password) {
            localStorage.setItem("joinLoginInfo", JSON.stringify({
                name: foundAdmin[0][1].name,
                email: foundAdmin[0][1].email,
                profileImage: foundAdmin[0][1].profileImage
            }));
            localStorage.setItem("joinLoginRemember", remember);

            const validTime = new Date();
            // Add one hour (1 hour = 3600000 milliseconds)
            validTime.setTime(validTime.getTime() + 3600000);
            localStorage.setItem("joinLoginValidTime", validTime.getTime());
            window.location.href = './index.html';
        } else {
            console.log("email and password is wrong");
        }
    } else {
        console.log("email and password is wrong");
    }
}

function typePassword() {
    let passwordInputElement = document.getElementById('password-input');
    if (passwordInputElement.value.length >= 1) {
        document.querySelector('.password-label span').classList.remove('icon-lock');
        if (passwordInputElement.type === 'password') {
            document.querySelector('.password-label span').classList.add('icon-visibility-off');
        } else {
            document.querySelector('.password-label span').classList.add('icon-visibility');
        }
    } else {
        passwordInputElement.type = 'password';
        document.querySelector('.password-label span').classList.remove('icon-visibility-off');
        document.querySelector('.password-label span').classList.remove('icon-visibility');
        document.querySelector('.password-label span').classList.add('icon-lock');
    }
}

function togglePasswordVisible() {
    let passwordInputElement = document.getElementById('password-input');
    if (passwordInputElement.value.length >= 1) {
        if (passwordInputElement.type === 'password') {
            passwordInputElement.type = 'text';
            document.querySelector('.password-label span').classList.add('icon-visibility');
            document.querySelector('.password-label span').classList.remove('icon-visibility-off');
        } else {
            passwordInputElement.type = 'password';
            document.querySelector('.password-label span').classList.add('icon-visibility-off');
            document.querySelector('.password-label span').classList.remove('icon-visibility');
        }
    }
}

// async function newUser() {
//     const password = "admin1234";
//     const salt = generateSalt();

//     const hashPassword = await hashingPassword(password, salt);

//     let Data = {
//         name: "Super Admin",
//         email: "admin@gmail.com",
//         password: hashPassword,
//         salt: salt,
//         profileImage: "SA"
//     }

//     await postData("admins", Data);
// }

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