function setScreenshotUrl() {

  let currScreenShots = window.screenShots;
  console.log(window.screenShots);

  currScreenShots.forEach((screenShot) => {

    var currDiv = document.createElement("DIV");

    var par     = document.createElement("P");
    par.innerText = screenShot.message;

    currDiv.style.cssText = "margin: 20px;"

    var currImg = document.createElement("IMG");
    currImg.setAttribute('src', screenShot.screenshotUrl);
    currImg.setAttribute('id', "target");
    currImg.setAttribute('height', "480");

    currDiv.append(par);
    currDiv.append(currImg)
    document.body.appendChild(currDiv);

  })
  
}

