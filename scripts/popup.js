var port = chrome.runtime.connect({name: "screenShotCapture"});

var changeState = (currState) => {

    if(currState == "start"){

        $("#start").prop('disabled', false);

        $("#click").prop('disabled', true);
        $("#view").prop('disabled', true);
        $("#cancel").prop('disabled', true);
        $("#generatePDF").prop('disabled', true);
    }

    if(currState == "progress"){
        $("#start").prop('disabled', true);

        $("#click").prop('disabled', false);
        $("#view").prop('disabled', false);
        $("#cancel").prop('disabled', false);
        $("#generatePDF").prop('disabled', false);
        $("#start").prop('disabled', true);
    }
}

window.onload = function(){

    document.getElementById("start").addEventListener("click", startScreenShot);
    document.getElementById("click").addEventListener("click", takeScreenShot);
    document.getElementById("view").addEventListener("click", stopScreenShot);
    document.getElementById("cancel").addEventListener("click", cancelScreenShot);
    document.getElementById("generatePDF").addEventListener("click", generatePDF);

    chrome.storage.local.get("state", (data) => {

        let currState = data.state;
        console.log(currState);

        this.changeState(currState);
    })
}

chrome.storage.onChanged.addListener((changes, namespace) => {
    for(var key in changes){

        var storageChange = changes[key];
          console.log('Storage key "%s" in namespace "%s" changed. ' +
                      'Old value was "%s", new value is "%s".',
                      key,
                      namespace,
                      storageChange.oldValue,
                      storageChange.newValue);
        
        let currState = storageChange.newValue;

        this.changeState(currState);
    }
})

function startScreenShot(){
    console.log("start screen shot");
    port.postMessage({"event" : "startScreenShot"});
    chrome.storage.local.set({"state": "progress"}, () => {});
}

function takeScreenShot(){
    console.log("click screen shot");
    port.postMessage({"event" : "takeScreenShot"});
}

function stopScreenShot(){
    console.log("stop screen shot");
    port.postMessage({"event": "stopScreenShot"});
}

function cancelScreenShot(){
    console.log("cancel screen shot");
    port.postMessage({"event": "cancelScreenShot"});

    chrome.storage.local.set({"state": "start"}, () => {});
}

function generatePDF(){

    var doc = new jsPDF();

    var maxHeight = doc.internal.pageSize.height;

    chrome.storage.local.get("screenShots", (data) => {
        
        let height = 10;

        data.screenShots.forEach((screenShot, idx) => {
            if(height + 80 > maxHeight){
                doc.addPage();
                height = 10;
            }
            doc.addImage(screenShot, 'JPEG', 10 , height, 180, 80);
            height = height + 10 + 80;
        });

        doc.save('samplePDF.pdf');

        chrome.storage.local.set({'screenShots' : []}, ()=>{});
        chrome.storage.local.set({"state": "start"}, () => {});

    })
}

port.onMessage.addListener(function(msg) {
    console.log(msg)
})

