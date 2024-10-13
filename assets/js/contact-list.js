let groupedUsers = {};

async function renderContactList() {
    let users = await getData('users');
    // console.log(users);
    getFirstLetter(users);
    // console.log(groupedUsers);
}

function getFirstLetter(users) {
    Object.keys(users).forEach(key => {
        let user = users[key];
        let firstLetter = user.name[0].toUpperCase();
        if (!groupedUsers[firstLetter]) {
            groupedUsers[firstLetter] = [];
        };
        groupedUsers[firstLetter].push(user);
    });
}

function displayContactList() {
    Object.keys(groupedUsers).forEach(letter => {
        
    })
}