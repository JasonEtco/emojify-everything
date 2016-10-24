document.querySelector('#go-to-options').onclick = () => {
  chrome.runtime.openOptionsPage();
};

document.querySelector('#disable').onclick = () => {
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
