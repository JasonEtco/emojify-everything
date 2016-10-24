const disabledList = document.getElementById('disabled-sites');
document.getElementById('add-disabled').onsubmit = e => {
  e.preventDefault();
  const inp = document.getElementById('disable');
  addToDisabledList(inp.value);
  e.target.reset();
}

function addToDisabledList(str) {
  const li = document.createElement('li');
  li.textContent = str;
  li.classList.add('disabledList__item');

  const delBtn = document.createElement('button');
  delBtn.innerHTML = '&times;'
  delBtn.onclick = e => {
    deleteFromList(e.target.parentElement);
  }
  li.appendChild(delBtn);

  disabledList.appendChild(li);
}

function deleteFromList(el) {
  el.parentElement.removeChild(el);
}

// Saves options to chrome.storage.sync.
function save_options() {
  const simple = document.getElementById('simple').checked;
  const disabledSites = [];
  document.querySelectorAll('.disabledList__item').forEach(itm => {
    const str = itm.textContent.substring(0, itm.textContent.length - 1);
    disabledSites.push(str);
  });

  chrome.storage.sync.set({
    simple,
    disabledSites
  }, () => {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options saved.';

    setTimeout(() => {
      status.textContent = '';
    }, 1250);
  });
}

function restore_options() {
  chrome.storage.sync.get([
    'simple',
    'disabledSites'
  ], itm => {
    document.getElementById('simple').checked = itm.simple;
    itm.disabledSites.map(site => addToDisabledList(site));
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
