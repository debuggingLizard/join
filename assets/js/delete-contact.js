/**
 * Deletes a contact by its ID.
 * @param {string} id - The ID of the contact to delete.
 */
async function deleteContact(id) {
  await removeContactFromTasks(id);
  await deleteData("users", id);
  await renderContactList();
  document.getElementById("contact-detail-view").innerHTML = "";
  await hideEditContactOverlay();
  showNotification("Contact succesfully deleted");
}

/**
 * Deletes the contact currently open in Edit form.
 */
function deleteContactFromEditForm() {
  let id = document.querySelector("#edit-contact-form input[name = id]").value;
  deleteContact(id);
}

async function removeContactFromTasks(userId) {
  try {
      const tasks = await getData("tasks");
      for (const taskId in tasks) {
          const task = tasks[taskId];
          if (task.users && task.users.includes(userId)) {
              task.users = task.users.filter(id => id !== userId);
              await putData("tasks", taskId, task);
          }
      }
  } catch (error) {
      console.error("Problem beim Entfernen des Benutzers von Aufgaben");
  }
}