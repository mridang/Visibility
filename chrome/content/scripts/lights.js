/*
 * Visibility. (http://github.com/mridang/visibility)
 *
 * Software License Agreement (BSD License)
 *
 * Copyright (c) 2010 Mridang Agarwalla
 * All rights reserved.
 *
 * Redistribution and use of this software in source and binary forms, with or
 * without modification, are permitted provided that the following conditions
 * are met:
 *
 * * Redistributions of source code must retain the above
 * * copyright notice, this list of conditions and the
 * * following disclaimer.
 *
 * * Redistributions in binary form must reproduce the above
 * * copyright notice, this list of conditions and the
 * * following disclaimer in the documentation and/or other
 * * materials provided with the distribution.
 *
 * * Neither the name of Parakey Inc. nor the names of its
 * * contributors may be used to endorse or promote products
 * * derived from this software without specific prior
 * * written permission of Parakey Inc.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
**/

var originalParent;
var originalWidth;
var originalHeight;
var newParent;
var IMG_OUT = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyAQMAAAAk" +
              "8RryAAAAA1BMVEUCAgJ4xuoaAAAADklEQVQYlWNgGAWDCQAAAZAAAdjzlT8AAA" +
              "AASUVORK5CYII=";

/**
 * Gets the largest EMBED/OBJECT tag in a page
 *
 * @method largestFlash
 * @return HTMLElement (The parent node containing the EMBED/OBJECT tag
 */
function largestFlash() {

    var largest;
    var largest_dimension = 0;

    //Find the largest EMBED tag
    var embed = window.content.document.getElementsByTagName("embed");

    if (embed.length > 0) {
        for (var i = embed.length; i--;) {
            var width  = parseInt(embed [i].width,  10);
            var height = parseInt(embed [i].height, 10);
            var dimension = width * height;
            if (dimension > largest_dimension) {
                largest = embed [i];
                largest_dimension = dimension;
            }
        }
    }

    //Find the largest OBJECT  tag
    var object = window.content.document.getElementsByTagName("object");

    if (object.length > 0) {
        for (var i = object.length; i--;) {
            var width  = parseInt(object [i].width,  10);
            var height = parseInt(object [i].height, 10);
            var dimension = width * height;
            if (dimension > largest_dimension) {
                largest = object [i];
                largest_dimension = dimension;
            }
        }
    }

    return (largest != null) ? largest.parentNode : null;
}

/**
 * Creates the modal box which will display the video
 *
 * @method createModal
 * @param  HTMLElement The parent node of the largest EMBED/OBJECT element
 *                     in the page
 * @return HTMLElement The modal box element that was created.
 */
function createModal() {

    var content = largestFlash();

    //Let's store the original location in a variable so that
    //we can put the video back to it's original place if the user decides
    //to quit.
    originalParent = content.parentNode;

    //We also store the height and width of the original node so that when We
    //restore the node back to it's orignal location, we can even set the size
    //back to what it was.
    originalWidth = content.clientWidth;
    originalHeight = content.clientHeight;

    //Create the elemment
    var modal = window.content.document.createElement("div");
    modal.id = "modal-frame";
    modal.style.display = "block";
    modal.style.backgroundColor = "#EEEEEE";
    modal.style.border = "1px solid black";
    modal.style.color = "#333333";
    modal.style.left = "50%";
    modal.style.marginLeft = "-300px";
    modal.style.padding = "12px";
    modal.style.position = "fixed";
    modal.style.top = "50%";
    modal.style.width = content.clientWidth + "px";
    modal.style.zIndex = "9999999999";

    //Append the content
    modal.appendChild(content);

    //Let's store the new location in a variable so that
    //we can put the video back to it's original place if the user decides
    //to quit.
    newParent = modal;

    //Add it to the end of the document but right before the cloding BODY tag
    var all_divs = window.content.document.getElementsByTagName("div");

    if (window.content.document.body.firstChild) {
        window.content.document.body.insertBefore(modal, all_divs[all_divs.length]);
    } else {
        window.content.document.body.appendChild(modal);
    }
}

/**
 * Change the opacity of the overlay
 *
 * Changes the opacity of the overlay of the page depending upon the level
 * requested by the user i.e. small, medium, large, full-screen
 *
 * @method setOpacity
 * @param Integer The opacity of the overlay
 * @return
 */
function setOpacity(opacityParam, modeParam) {
    var newOpacity;

    switch (opacityParam) {
        case 0:
            newOpacity = "0.00";
            break;
        case 1:
            newOpacity = "0.25";
            break;
        case 2:
            newOpacity = "0.50";
            break;
        case 3:
            newOpacity = "0.75";
            break;
        case 4:
            newOpacity = "1.00";
            break;
    }

    var oldOpacity = window.content.document.getElementById('page-overlay').style.opacity;

    if (modeParam == 1) {
        var millisec = 5000;
        var speed = Math.round(millisec / 100);
        var timer = 0;

        if (newOpacity > oldOpacity) {
            var interval = (newOpacity - oldOpacity) / (millisec / 150);
            for(i = oldOpacity; i <= newOpacity; i = i + interval) {
                code = "window.content.document.getElementById('page-overlay')."
                     + "style.opacity=" + (Math.round( i * 100) / 100) + ";";
                setTimeout(code ,(timer * speed));
                timer++;
            }
        }
        else {
            var interval = (oldOpacity - newOpacity) / (millisec / 150);
            for(i = oldOpacity; i >= newOpacity; i = i - interval) {
                code = "window.content.document.getElementById('page-overlay')."
                     + "style.opacity=" + (Math.round( i * 100) / 100) + ";";
                setTimeout(code ,(timer * speed));
                timer--;
            }
        }
    }
    else if (modeParam == 0) {
        var overlay = window.content.document.getElementById('page-overlay');
        overlay.style.opacity = newOpacity;
    }
}

/**
 * Change the size of the video
 *
 * Changes the size of the video depending upon the size requested by the user
 * i.e. small, medium, large, full-screen
 *
 * @method setSize
 * @param Integer The size of the video
 * @return
 */
function setSize(sizeParam, keeparParam) {
    var content = window.content.document.getElementById("modal-frame").firstChild;
    var modal = window.content.document.getElementById("modal-frame");

    switch (sizeParam) {
        case 0:
            modal.style.padding = "12px";
            modal.style.width = (originalWidth * 1.25) + "px";
            modal.style.marginLeft = ((originalWidth * -1.25) / 2) + "px";
            modal.style.height = (originalHeight * 1.25) + "px";
            modal.style.marginTop = ((originalHeight * -1.25) / 2) + "px";
            content.style.width = (originalWidth * 1.25) + "px";
            content.style.height = (originalHeight * 1.25) + "px";
            break;
        case 1:
            modal.style.padding = "12px";
            modal.style.width = (originalWidth * 1.50) + "px";
            modal.style.marginLeft = ((originalWidth * -1.50) / 2) + "px";
            modal.style.height = (originalHeight * 1.50) + "px";
            modal.style.marginTop = ((originalHeight * -1.50) / 2) + "px";
            content.style.width = (originalWidth * 1.50) + "px";
            content.style.height = (originalHeight * 1.50) + "px";
            break;
        case 2:
            modal.style.padding = "12px";
            modal.style.width = (originalWidth * 1.75) + "px";
            modal.style.marginLeft = ((originalWidth * -1.75) / 2) + "px";
            modal.style.height = (originalHeight * 1.75) + "px";
            modal.style.marginTop = ((originalHeight * -1.75) / 2) + "px";
            content.style.width = (originalWidth * 1.75) + "px";
            content.style.height = (originalHeight * 1.75) + "px";
            break;
        case 3:
            modal.style.padding = "0px";
            var ratioXY = originalWidth / originalHeight;
            modal.style.width = -(window.content.document.body.clientWidth) + "px";
            modal.style.marginLeft = (-(window.content.document.body.clientWidth) / 2) + "px";
            modal.style.height = (window.content.document.body.clientWidth / ratioXY) + "px";
            modal.style.marginTop = (-((window.content.document.body.clientWidth - 140) / ratioXY) / 2) + "px";
            content.style.width = (window.content.document.body.clientWidth) + "px";
            content.style.height = ((window.content.document.body.clientWidth - 140) / ratioXY) + "px";
            break;
    }
}

/**
 * Creates the modal box which will display the video
 *
 * @method createOverlay
 * @return HTMLElement The overlay element that was created.
 */
function createOverlay() {
    var pageOverlay = window.content.document.createElement("img");

    window.content.document.body.style.overflow = 'hidden';

    pageOverlay.src = IMG_OUT;
    pageOverlay.id = "page-overlay";
    pageOverlay.style.position = "fixed";
    pageOverlay.style.top = "0";
    pageOverlay.style.left = "0";
    pageOverlay.style.width = "100%";
    pageOverlay.style.height = window.content.document.documentElement.scrollHeight + "px";
    pageOverlay.style.zIndex = "99999";
    pageOverlay.style.display = "block";
    pageOverlay.style.opacity = "0";
    pageOverlay.addEventListener("click", lightsOn, false);

    window.content.document.body.appendChild(pageOverlay);
}

/**
 * Checks if the lights are on and off by searching for the overlay element
 * in the page
 *
 * @method isLightsOn
 * @return Boolean
 */
function isLightsOn() {
    return window.content.document.getElementById("page-overlay") ? true : false;
}

/**
 * Turns the lights off.
 *
 * Inserts a overlay over the page, streched to the height and width of the
 * page.
 *
 * @method lightsOff
 * @param  The modal box that was created containing the video.
 * @return
 */
function lightsOff(opacityParam, sizeParam, modeParam, keeparParam) {
    if (!window.content.document.getElementById("page-overlay")) {
        createOverlay();
        setOpacity(opacityParam, modeParam);
        createModal();
        setSize(sizeParam, keeparParam);
    }
}

/**
 * Turns the lights back on.
 *
 * When any part of the overlay is clicked, the lights turn back on and
 * the video returns to it's original position.
 *
 * @method lightsOn
 * @return
 */
function lightsOn() {
    window.content.document.body.style.overflow = 'scroll';
    window.content.document.body.removeChild(document.getElementById("page-overlay"));
    window.content.document.body.originalParent.appendChild(newParent.firstChild);
    window.content.document.body.removeChild(modal);
}

document.addEventListener("MyExtensionEvent", function(e) { myExtension.myListener(e); }, false, true);

//lightsOff(4, 0, 1, 1);
