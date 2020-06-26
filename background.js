// To make sure we can uniquely identify each screenshot tab, add an id as a
// query param to the url that displays the screenshot.
let id = 100;


chrome.storage.local.set({"state" : "start"}, () => {});

chrome.commands.getAll(function(commands){
  console.log(commands)
})

function captureScreenShot(msg){
  chrome.tabs.captureVisibleTab((screenshotUrl) => {
    chrome.storage.local.get('screenShots', (result) => {
      let currShots = result.screenShots;
      let message = "";
      if(msg.message != undefined){
        message = msg.message;
      }
      currShots.push({"screenshotUrl": screenshotUrl, "message" : message});
      chrome.storage.local.set({'screenShots' : currShots}, ()=>{});
    })
  });
}

chrome.commands.onCommand.addListener(function(command) {
  
  if(command == "start-taking-screenshot"){
    alert("Enabled to Start Taking Screen Shots");
    chrome.storage.local.set({"state" : "progress"}, () => {});
    chrome.storage.local.set({'screenShots' : []}, ()=>{});
  }

  if(command == "capture-screen"){
    var message = prompt("Enter Comments for the ScreenShot");
    captureScreenShot({"message" : message});
  }

});

chrome.runtime.onConnect.addListener(function(port) {

  console.assert(port.name == "screenShotCapture");

  port.onMessage.addListener(function(msg) {

    if(msg.event == "startScreenShot"){
      chrome.storage.local.set({'screenShots' : []}, ()=>{});
    }

    if(msg.event == "takeScreenShot"){
      captureScreenShot(msg);
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

