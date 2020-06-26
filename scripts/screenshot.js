function setScreenshotUrl() {

  let currScreenShots = window.screenShots;
  console.log(window.screenShots);

  currScreenShots.forEach((screenShot) => {

    var currDiv = document.createElement("DIV");
    currDiv.style.cssText = "margin: 20px;"

    var currImg = document.createElement("IMG");
    currImg.setAttribute('src', screenShot);
    currImg.setAttribute('id', "target");
    currImg.setAttribute('height', "480");

    currDiv.append(currImg)
    document.body.appendChild(currDiv);

  })
  
}

