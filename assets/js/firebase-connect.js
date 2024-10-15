const BASE_URL =
    "https://join-cb666-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Fetches data from the specified source.
 * @param {string} source - The source endpoint to fetch data from.
 * @returns {Promise<Object>} The data retrieved from the source.
 * @throws Will log an error message if there is a problem fetching the data.
 */
async function getData(source) {
    try {
        const response = await fetch(BASE_URL + source + "/.json");

        return await response.json();
    } catch (error) {
        console.error("Problem beim Abrufen von Daten aus der Datenbank");
    }
}

/**
 * Posts data to the specified source.
 * @param {string} source - The source endpoint to post data to.
 * @param {Object} [data={}] - The data to post.
 * @returns {Promise<Response>} The response from the server.
 * @throws Will log an error message if there is a problem posting the data.
 */
async function postData(source, data = {}) {
    try {
        return await fetch(BASE_URL + source + "/.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error("Problem beim Speichern der Daten in der Datenbank");
    }
}

/**
 * Updates data at the specified source and ID.
 * @param {string} source - The source endpoint to update data at.
 * @param {string} id - The ID of the data to update.
 * @param {Object} [data={}] - The updated data.
 * @returns {Promise<Response>} The response from the server.
 * @throws Will log an error message if there is a problem updating the data.
 */
async function putData(source, id, data = {}) {
    try {
        return await fetch(BASE_URL + source + "/" + id + "/.json", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error("Problem beim Bearbeiten von Daten in der Datenbank");
    }
}

/**
 * Deletes data at the specified source and ID.
 * @param {string} source - The source endpoint to delete data from.
 * @param {string} id - The ID of the data to delete.
 * @returns {Promise<Response>} The response from the server.
 * @throws Will log an error message if there is a problem deleting the data.
 */
async function deleteData(source, id) {
    try {
        return await fetch(BASE_URL + source + "/" + id + "/.json", {
            method: "DELETE"
        });
    } catch (error) {
        console.error("Problem beim Löschen von Daten in der Datenbank");
    }
}