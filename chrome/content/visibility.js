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

var Visibility = {

    prefInstance:Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefBranch),

    /**
     * Triggered when the window is loaded
     *
     * @method mainWindowLoadHandler
     * @param  event
     * @return
     */
    mainWindowLoadHandler: function (event) {
        this.hookHotKey();
    },

    /**
     * Assigns the hotkey to an element so that when the user clicks the hotkey,
     * vsibility runs and boom.
     *
     * @method hookHotKey
     * @return
     */
    hookHotKey:function() {
        var hotkeyElement = document.getElementById("action-key");
        var hotkeyValue = this.getPrefValue("hotkey");

        hotkeyElement.setAttribute("key", hotkeyValue);
    },

    /**
     * Gets a preference from the preferences file
     *
     * @method getPrefValue
     * @param  prefSuffix
     * @return String
     */
    getPrefValue: function (prefSuffix) {
        var prefPrefix = "extensions.visibility.";
        var prefName = prefPrefix + prefSuffix;
        var prefType = this.prefInstance.getPrefType(prefName);

        switch (prefType) {
            case 32:
                return this.prefInstance.getCharPref(prefName);
                break;
            case 128:
                return this.prefInstance.getBoolPref(prefName);
                break;
            case 64:
                return this.prefInstance.getIntPref(prefName);
                break;
        }
    },

    /**
     * Sets a preference in the preferences file
     *
     * @method setPrefValue
     * @param  prefSuffix
     * @param  prefValue
     * @return String
     */
    setPrefValue: function (prefSuffix, prefValue) {
        var prefPrefix = "extensions.visibility.";
        var prefName = prefPrefix + prefSuffix;
        var prefType = this.prefInstance.getPrefType(prefName);

        switch (prefType) {
            case 32:
                return this.prefInstance.setCharPref(prefName, prefValue);
                break;
            case 128:
                return this.prefInstance.setBoolPref(prefName, prefValue);
                break;
            case 64:
                return this.prefInstance.setIntPref(prefName, prefValue);
                break;
        }
    },

    /**
     * Shows the panel
     *
     * @method onVisibilityPanelShowing
     * @param  event
     * @return
     */
    onVisibilityPanelShowing:function(event) {
        this.updateOpacityRadioGroup();
        this.updateSizeRadioGroup();
        this.updateModeRadioGroup();
        this.updatekeepARGroup();
    },

    /**
     * Invoked when the statubar/toolbar icon is clicked
     *
     * @method updateOpacityRadioGroup
     * @param  event
     * @return
     */
    updateOpacityRadioGroup:function(event) {
        if (event) {
            var opacityGroup = event.currentTarget;
            this.setPrefValue("opacity", opacityGroup.selectedIndex);
            var modeValue = this.getPrefValue("mode");
            if (isLightsOn())
                setOpacity(opacityGroup.selectedIndex, modeValue);
        }
        else {
            var opacityGroupSB = document.getElementById("opacity-group-sb");
            if (opacityGroupSB)
                opacityGroupSB.selectedIndex = this.getPrefValue("opacity");
            var opacityGroupTB = document.getElementById("opacity-group-tb");
            if (opacityGroupTB)
                opacityGroupTB.selectedIndex = this.getPrefValue("opacity");
        }
    },

    /**
     * Invoked when the statubar/toolbar icon is clicked
     *
     * @method updateSizeRadioGroup
     * @param  event
     * @return
     */
    updateSizeRadioGroup:function(event) {
        if (event) {
            var sizeGroup = event.currentTarget;
            this.setPrefValue("size", sizeGroup.selectedIndex);
            var keepARValue = this.getPrefValue("keepar") ? 1 : 0;
            if (isLightsOn())
                setSize(sizeGroup.selectedIndex, keepARValue);
        }
        else {
            var sizeGroupSB = document.getElementById("size-group-sb");
            if (sizeGroupSB)
                sizeGroupSB.selectedIndex = this.getPrefValue("size");
            var sizeGroupTB = document.getElementById("size-group-tb");
            if (sizeGroupTB)
                sizeGroupTB.selectedIndex = this.getPrefValue("size");
        }
    },

    /**
     * Invoked when the statubar/toolbar icon is clicked
     *
     * @method updateModeRadioGroup
     * @param  event
     * @return
     */
    updateModeRadioGroup:function(event) {
        if (event) {
            var modeGroup = event.currentTarget;
            this.setPrefValue("mode", modeGroup.selectedIndex);
        }
        else {
            var modeGroupSB = document.getElementById("mode-group-sb");
            if (modeGroupSB)
                modeGroupSB.selectedIndex = this.getPrefValue("mode");
            var modeGroupTB = document.getElementById("mode-group-tb");
            if (modeGroupTB)
                modeGroupTB.selectedIndex = this.getPrefValue("mode");
        }
    },

    /**
     * Invoked when the statubar/toolbar icon is clicked
     *
     * @method updatekeepARGroup
     * @param  event
     * @return
     */
    updatekeepARGroup:function(event) {
        if (event) {
            var keepARGroup = event.currentTarget;
            this.setPrefValue("keepar", keepARGroup.selectedIndex);
        }
        else {
            var keepARGroupSB = document.getElementById("keepar-group-sb");
            if (keepARGroupSB)
                keepARGroupSB.firstChild.checked = this.getPrefValue("keepar");
            var keepARGroupTB = document.getElementById("keepar-group-tb");
            if (keepARGroupTB)
                keepARGroupTB.firstChild.checked = this.getPrefValue("keepar");
        }
    },

    /**
     * Injects the JS and the CSS into the page
     *
     * @method injectCode
     * @return
     */
    injectCode: function() {
        var headElement = window.content.document.getElementsByTagName("head")[0];
        var fileLocation = "chrome://visibility/content/scripts/";

        //Add the script
        var jsFile = window.content.document.createElement("script");
        jsFile.setAttribute("type", "text/javascript");
        jsFile.setAttribute("charset", "UTF-8");
        jsFile.setAttribute("src", fileLocation + "visibility.js");
        headElement.appendChild(jsFile);

        //Add the stylesheet
        var cssFile = window.content.document.createElement("link");
        cssFile.setAttribute("rel", "stylesheet");
        cssFile.setAttribute("type", "text/css");
        cssFile.setAttribute("href", fileLocation + "visibility.css");
        headElement.appendChild(cssFile);

        this.scriptInject = true;
    },

    /**
     * Turns the lights off
     *
     * @method lightsOff
     * @return
     */
    lightsOff: function() {
        var opacityValue = this.getPrefValue("opacity");
        var sizeValue = this.getPrefValue("size");
        var modeValue = this.getPrefValue("mode");
        var keepARValue = this.getPrefValue("keepar");
        lightsOff(opacityValue, sizeValue, modeValue, keepARValue);
    },

    /**
     * Turns the lights om
     *
     * @method lightsOn
     * @return
     */
    lightsOn: function() {
        lightsOn();
    },

    /**
     * Invoked when the statubar/toolbar icon is clicked
     *
     * @method enableVisibility
     * @param  event
     * @return
     */
    enableVisibility: function (event) {
        if (event.button == 1 || event.button == 2)
            return;

        if (event.target.nodeName == "radio")
            return;

        if (event.target.nodeName == "checkbox")
            return;

        if (isLightsOn() == false)
            this.lightsOff();
        else
            this.lightsOn();
    }

}

window.addEventListener("load", this.mainWindowLoadHandler, false);