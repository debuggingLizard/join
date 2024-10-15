async function deleteContact(id) {
    await deleteData('users', id);
    await renderContactList();
    document.getElementById('contact-detail-view').innerHTML = '';
    hideEditContactOverlay();
}

function deleteContactFromEditForm() {
    let id = document.querySelector('#edit-contact-form input[name = id]').value;    
    deleteContact(id);
}