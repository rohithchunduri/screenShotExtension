var port = chrome.runtime.connect({name: "screenShotCapture"});

var changeState = (currState) => {

    if(currState == "start"){

        $("#start").prop('disabled', false);

        $("#click").prop('disabled', true);
        $("#view").prop('disabled', true);
        $("#undo").prop('disabled', true);
        $("#cancel").prop('disabled', true);
        $("#generatePDF").prop('disabled', true);
        $("#comments").prop('disabled', true);
        $("#fileName").prop('disabled', true);
    }

    if(currState == "progress"){
        $("#start").prop('disabled', true);

        $("#click").prop('disabled', false);
        $("#view").prop('disabled', false);
        $("#undo").prop('disabled', false);
        $("#cancel").prop('disabled', false);
        $("#generatePDF").prop('disabled', false);
        $("#comments").prop('disabled', false);
        $("#fileName").prop('disabled', false);
    }
}

window.onload = function(){

    document.getElementById("start").addEventListener("click", startScreenShot);
    document.getElementById("click").addEventListener("click", takeScreenShot);
    document.getElementById("view").addEventListener("click", stopScreenShot);
    document.getElementById("cancel").addEventListener("click", cancelScreenShot);
    document.getElementById("undo").addEventListener("click", undoScreenShot);
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
    let currMessage = $('#comments').val();
    port.postMessage({"event" : "takeScreenShot", "message" : currMessage});
    $('#comments').val('');
}

function stopScreenShot(){
    console.log("stop screen shot");
    port.postMessage({"event": "stopScreenShot"});
}

function cancelScreenShot(){
    console.log("cancel screen shot");
    chrome.storage.local.set({"state": "start"}, () => {});
}

function undoScreenShot(){
    console.log("Cleared recent screen shot");
    chrome.storage.local.get('screenShots', result => {
        var currShots = result.screenShots;
        currShots.pop();
        chrome.storage.local.set({'screenShots' : currShots}, ()=>{});
    })
}

function generatePDF(){

    var fileName = $('#fileName').val() + ".pdf";

    var doc = new jsPDF();
    doc.setFontSize(10);

    var maxHeight = doc.internal.pageSize.height;

    chrome.storage.local.get("screenShots", (data) => {
        
        let height = 10;

        data.screenShots.forEach((screenShot, idx) => {
            if(height + 80 > maxHeight){
                doc.addPage();
                height = 10;
            }
            doc.text(screenShot.message, 10, height - 4);
            doc.addImage(screenShot.screenshotUrl, 'JPEG', 10 , height, 180, 80);
            height = height + 10 + 80;
        });

        doc.save(fileName);

        chrome.storage.local.set({'screenShots' : []}, ()=>{});
        chrome.storage.local.set({"state": "start"}, () => {});

        $('#fileName').val("");
    })
}

port.onMessage.addListener(function(msg) {
    console.log(msg)
})

