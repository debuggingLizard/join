/**
 * Deletes a contact by its ID.
 * @param {string} id - The ID of the contact to delete.
 */
async function deleteContact(id) {
    await deleteData('users', id);
    await renderContactList();
    document.getElementById('contact-detail-view').innerHTML = '';
    hideEditContactOverlay();
}

/**
 * Deletes the contact currently open in Edit form.
 */
function deleteContactFromEditForm() {
    let id = document.querySelector('#edit-contact-form input[name = id]').value;    
    deleteContact(id);
}