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

var Options = {

    prefInstance:Components.classes["@mozilla.org/preferences-service;1"]
                .getService(Components.interfaces.nsIPrefBranch),

    /**
     * Handles the showing of the options window.
     *
     * @method handleDOMContentLoaded
     * @param  event
     * @return
     */
    handleDOMContentLoaded:function(event) {
        var hotkeyField = document.getElementById("hotkeyField");
        var hotkeyValue = Options.getPrefValue("extensions.visibility.hotKey", "char");
        if (hotkeyValue)
            hotkeyField.setAttribute("value", hotkeyValue.toUpperCase());
        else
            hotkeyField.setAttribute("value", "r".toUpperCase());

        var hotkeyLabel = document.getElementById("hotkeyLabel");
        if (Options.isMac())
            hotkeyLabel.firstChild.nodeValue="Cmd+Option+"
        else
            hotkeyLabel.firstChild.nodeValue="Ctrl+Alt+"
    },

    /**
     * Gets a preference from the preferences file
     *
     * @method getPrefValue
     * @param  pref
     * @return String
     */
    getPrefValue:function(pref,type) {
        if (type = "char")
            return Options.prefInstance.getCharPref(pref);
        else if (type = "bool")
            return Options.prefInstance.getBoolPref(pref);
        else if (type = "int")
            return Options.prefInstance.getIntPref(pref);
    },

    /**
     * Sets a preference in the preferences file
     *
     * @method setPrefValue
     * @param  pref
     * @param  value
     * @return String
     */
    setPrefValue:function(pref,type,value) {
        if (type = "char")
            Options.prefInstance.setCharPref(pref, value);
        else if (type = "bool")
            Options.prefInstance.setBoolPref(pref, value);
        else if (type = "int")
            Options.prefInstance.setIntPref(pref, value);
    },

    /**
     * Creates a prompt asking the user to confrim his choice
     *
     * @method saveKeyboardShortcutChanges
     * @return
     */
    saveKeyboardShortcutChanges:function(event) {
        var hotkeyField = document.getElementById("hotkeyField");
        var hotkeyValue = hotkeyField.value.toLowerCase();
        Options.setPrefValue("extensions.visibility.hotKey", "char", hotkeyValue);

        Options.showAlert("Please restart your browser to make the changes take effect!")

        window.close();
    },

    /**
     * Creates a prompt asking the user to confrim his choice
     *
     * @method showAlert
     * @return
     */
    showAlert:function(promptString) {
        var prompt = Components.classes["@mozilla.org/embedcomp/prompt-service;1"]
                    .getService(Components.interfaces.nsIPromptService);

        prompt.alert(null, "Visibility", promptString);
    },

    /**
     * Checks whether the OS is a Macintosh or not
     *
     * @method isMac
     * @return Boolean
     */
    isMac : function () {
        var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
                     .getService(Components.interfaces.nsIXULRuntime);

        if (appInfo) {
            if (appInfo.OS == "Darwin" || navigator.platform.indexOf("Mac") == 0) {
                return true;
            }
        }
        return false;
    }

  }

  window.addEventListener("DOMContentLoaded",Options.handleDOMContentLoaded,false);