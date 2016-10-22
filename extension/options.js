// Saves options to chrome.storage.sync.
function save_options() {
  const simple = document.getElementById('simple').checked;
  chrome.storage.sync.set({ simple }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';

    setTimeout(() => {
      status.textContent = '';
    }, 1250);
  });
}

function restore_options() {
  chrome.storage.sync.get('simple', itm => {
    document.getElementById('simple').checked = itm.simple;
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
