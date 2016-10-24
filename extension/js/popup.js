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

      console.log(domain, protocol);
    } else {
      domain = url.split('/')[0];
      console.log(domain, "NOPE!");
    }
    // Find & remove port number
    domain = domain.split(':')[0];
    return protocol + domain;
}

document.querySelector('#disable').onclick = () => {
  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, tab => {
    console.log(tab[0].url);
  });
  const url = `${location.protocol}//${location.host}`;
  let arr;

  chrome.storage.sync.get(['disabledSites'], options => {
    if (options.disabledSites) {
      arr = [...options.disabledSites, url];
    } else {
      arr = [url];
    }

    chrome.storage.sync.set({
      disabledSites: arr
    }, () => {
      console.log('Saved!');
    });
  });

}

  // chrome.storage.sync.set({
  //   disabledSites
  // }, () => {
  //   // Update status to let user know options were saved.
  //   const status = document.getElementById('status');
  //   status.textContent = 'Options saved.';
  //
  //   setTimeout(() => {
  //     status.textContent = '';
  //   }, 1250);
  // });
  // }
