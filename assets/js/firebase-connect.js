const BASE_URL =
    "https://join-cb666-default-rtdb.europe-west1.firebasedatabase.app/";


async function getData(source) {
    try {
        const response = await fetch(BASE_URL + source + "/.json");

        return await response.json();
    } catch (error) {
        console.error("Problem beim Abrufen von Daten aus der Datenbank");
    }
}

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
