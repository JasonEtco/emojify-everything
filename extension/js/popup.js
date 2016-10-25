document.querySelector('#go-to-options').onclick = () => {
  chrome.runtime.openOptionsPage();
};

function extractDomain(url) {
  let domain;
  let protocol;
  // Find & remove protocol (http, ftp, etc.) and get domain
  if (url.indexOf("://") > -1) {
    domain = url.split('/')[2];
    protocol = url.split('/')[0];
  } else {
    domain = url.split('/')[0];
  }
  // Find & remove port number
  domain = domain.split(':')[0];

  return `${protocol}//${domain}`;
}

function saveAndClose() {
  // Add the saved class to the popup
  document.body.classList.add('saved');

  // After some time, close the popup
  setTimeout(() => {
    window.close();
  }, 1250);
}

function saveToOptions(tabId, arr) {
  chrome.storage.sync.set({
    disabledSites: arr
  }, () => {
    chrome.tabs.reload(tabId);
    saveAndClose();
  });
}

chrome.storage.sync.get(['disabledSites'], options => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tab => {
    const url = extractDomain(tab[0].url);
    const enable = document.querySelector('#enable');
    const disable = document.querySelector('#disable');

    // Check if the current URL is on the blacklist
    if(options.disabledSites.indexOf(url) > -1) {
      // Hide the disable button, show the enable button
      enable.style.display = 'block';
      disable.style.display = 'none';
    }

    enable.onclick = () => {
      const arr = options.disabledSites;
      const index = arr.indexOf(url);
      // Split the array around the index of the current site's url
      const newArr = [
        ...arr.slice(0, index),
        ...arr.slice(index + 1),
      ];
      saveToOptions(tab[0].id, newArr);
    }

    disable.onclick = () => {
      // Check if the site already exists in the disabled list
      if (options.disabledSites && options.disabledSites.indexOf(url) > -1) {
        saveAndClose();
        return;
      }

      // If there are any disabledSites, append the current site to the list
      // Otherwise make a new array with just the current url
      const arr = options.disabledSites ? [...options.disabledSites, url] : [url];
      saveToOptions(tab[0].id, arr);
    }
  });
});
