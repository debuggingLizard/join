/**
 * Checks if an email already exists in the users database.
 * @param {string} email - The email to check.
 * @returns {Promise<boolean>} True if the email exists, false otherwise.
 */
async function isEmailExist(email) {
  const users = await getData("users");

  if (users === null || users === undefined) {
    return false;
  }

  const foundUsers = Object.values(users).filter(
    (user) => user.email === email
  );

  return foundUsers.length > 0 ? true : false;
}

/**
 * Returns a random color from a predefined set of colors.
 * @returns {string} A random color.
 */
function getRandomColor() {
  const colors = [
    '#FF7A00',
    '#FF5EB3',
    '#6E52FF',
    '#9327FF',
    '#00BEE8',
    '#1FD7C1',
    '#FF745E',
    '#FFA35E',
    '#FC71FF',
    '#FFC701',
    '#0038FF',
    '#C3FF2B',
    '#FFE62B',
    '#FF4646',
    '#FFBB2B',
  ]

  const rndInt = randomIntFromInterval(0, colors.length - 1);
  return colors[rndInt];
}

/**
 * Generates a profile image string based on a user's name.
 * @param {string} name - The user's name.
 * @returns {string} The profile image string.
 */
function getProfileImage(name) {
  const parts = name.trim().split(" ");
  const firstInitial = parts[0].charAt(0).toUpperCase();
  const lastInitial = parts.length < 2 ? parts[0].charAt(0).toUpperCase() : parts[1].charAt(0).toUpperCase();
  return firstInitial + lastInitial;
}

/**
 * Returns a random integer between the specified min and max values, inclusive.
 * @param {number} min - The minimum value.
 * @param {number} max - The maximum value.
 * @returns {number} A random integer between min and max.
 */
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}