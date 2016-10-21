// Saves options to chrome.storage.sync.
function save_options() {
 const simple = document.getElementById('simple').checked;
 chrome.storage.sync.set({
	 simple
 }, () => {
	 // Update status to let user know options were saved.
	 const status = document.getElementById('status');
	 status.textContent = 'Options saved.';
	 setTimeout(function() {
		 status.textContent = '';
	 }, 750);
 });
}

function restore_options() {
 chrome.storage.sync.get({
	 simple: true
 }, items => {
	 document.getElementById('simple').checked = items.simple;
 });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
