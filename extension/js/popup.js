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

document.querySelector('#disable').onclick = () => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tab => {
    const url = extractDomain(tab[0].url);

    chrome.storage.sync.get(['disabledSites'], options => {
      let arr;
      if (options.disabledSites) {
        if (options.disabledSites.indexOf(url) > -1) {
          document.body.classList.add('saved');
          setTimeout(() => {
            window.close();
          }, 1250);
        } else {
          arr = [...options.disabledSites, url];
        }
      } else {
        arr = [url];
      }

      chrome.storage.sync.set({
        disabledSites: arr
      }, () => {
        document.body.classList.add('saved');
        chrome.tabs.executeScript(tab[0].id, { code: 'window.location.reload();' });
        setTimeout(() => {
          window.close();
        }, 1250);
      });
    });
  });
}
