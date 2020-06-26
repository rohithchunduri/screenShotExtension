// To make sure we can uniquely identify each screenshot tab, add an id as a
// query param to the url that displays the screenshot.
let id = 100;

chrome.storage.local.set({"state" : "start"}, () => {});

chrome.runtime.onConnect.addListener(function(port) {

  console.assert(port.name == "screenShotCapture");

  port.onMessage.addListener(function(msg) {

    if(msg.event == "startScreenShot"){
      chrome.storage.local.set({'screenShots' : []}, ()=>{});
    }

    if(msg.event == "takeScreenShot"){
      chrome.tabs.captureVisibleTab((screenshotUrl) => {
        chrome.storage.local.get('screenShots', (result) => {
          let currShots = result.screenShots;
          currShots.push(screenshotUrl);
          chrome.storage.local.set({'screenShots' : currShots}, ()=>{});
        })
      });
    }

    if(msg.event == "stopScreenShot"){
      const viewTabUrl = chrome.extension.getURL('screenshot.html?id=' + id++)
        let targetId = null;
    
        chrome.tabs.onUpdated.addListener(function listener(tabId, changedProps) {
      
          if (tabId != targetId || changedProps.status != "complete"){
            return;
          }
    
          chrome.tabs.onUpdated.removeListener(listener);

          chrome.storage.local.get('screenShots', (result) => {
            var views = chrome.extension.getViews();
            for (var i = 0; i < views.length; i++) {
              var view = views[i];
              if (view.location.href == viewTabUrl) {
                view.screenShots = result.screenShots;
                view.setScreenshotUrl();
              break;
              }
            }
          })

        });
    
        chrome.tabs.create({url: viewTabUrl}, (tab) => {
          targetId = tab.id;
        });
    }

  });
});

