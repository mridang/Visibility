function ReadabilityStartup() {
}
ReadabilityStartup.prototype = {
  classID: Components.ID("{530fe457-58ea-493a-94c3-2616a2dc54f0}"),
  contractID: "@readability/startup;1",
  classDescription: "Readability Startup",

  QueryInterface: function(aIID) {
    if(!aIID.equals(CI.nsISupports) && !aIID.equals(CI.nsIObserver))
      throw CR.NS_ERROR_NO_INTERFACE;
    return this;
  },

  observe: function(aSubject, aTopic, aData) {
    switch(aTopic) {
	
      case "xpcom-startup":
		//prefs not loaded yet
		var obsSvc = CC["@mozilla.org/observer-service;1"].getService(CI.nsIObserverService);
		var xulRuntime = Components.classes["@mozilla.org/xre/app-info;1"].getService(Components.interfaces.nsIXULRuntime);
		obsSvc.addObserver(this, "http-on-modify-request", false);
		/*if (xulRuntime.OS!="WINNT")*/ /*obsSvc.addObserver(this, "http-on-examine-response", false);*/
		/*obsSvc.addObserver(this, "profile-after-change", false);*/
		
        break;
	
      case "profile-after-change":
		//prefs loaded

		break;

      case "http-on-modify-request":
       
		var oHttp = aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
		
		if (oHttp.name.toString().search("use.typekit.com/v/sxt6vzy-d.css")!=-1) {
			
			oHttp.cancel(Components.results.NS_ERROR_ABORT);

			try{
			
				var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);  
				var win = wm.getMostRecentWindow("navigator:browser");  			
				var doc=win.content.document;
				var link=doc.createElement("link");
				link.setAttribute("href","chrome://readability/content/fonts/sxt6vzy-d.css");
				link.setAttribute("type","text/css");
				link.setAttribute("rel","stylesheet");
				
				doc.getElementsByTagName("head")[0].appendChild(link);
				//win.document.getAnonymousElementByAttribute(win.document.getElementById("statusbar-display"), "class", "statusbarpanel-text").value="Done";	
				
			}
			catch(e){

			}			
		}
			
		if (oHttp.name.toString().search("use.typekit.com/v/bae8ybu-d.css")!=-1) {
			
			oHttp.cancel(Components.results.NS_ERROR_ABORT);

			try{
				var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);  
				var win = wm.getMostRecentWindow("navigator:browser");  			
				var doc=win.content.document;
				var link=doc.createElement("link");
				link.setAttribute("href","chrome://readability/content/fonts/bae8ybu-d.css");
				link.setAttribute("type","text/css");
				link.setAttribute("rel","stylesheet");
				
				doc.getElementsByTagName("head")[0].appendChild(link);
				//win.document.getAnonymousElementByAttribute(win.document.getElementById("statusbar-display"), "class", "statusbarpanel-text").value="Done";		
			}
			catch(e){

			}			
		}
		
		if (oHttp.name.toString().search("http://use.typekit.com/sxt6vzy.js")!=-1) {
			
			oHttp.cancel(Components.results.NS_ERROR_ABORT);

			try{
			
				var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);  
				var win = wm.getMostRecentWindow("navigator:browser");  			
				var doc=win.content.document;
				var link=doc.createElement("script");
				link.setAttribute("src","https://use.typekit.com/sxt6vzy.js");
				link.setAttribute("type","text/javascript");
				
				doc.getElementsByTagName("head")[0].appendChild(link);
				
				//win.document.getAnonymousElementByAttribute(win.document.getElementById("statusbar-display"), "class", "statusbarpanel-text").value="Done";
						
			}
			catch(e){

			}			
		}
 		
		if (oHttp.name.toString().search("http://use.typekit.com/bae8ybu.js")!=-1) {
			
			oHttp.cancel(Components.results.NS_ERROR_ABORT);

			try{
			
				var wm = Components.classes["@mozilla.org/appshell/window-mediator;1"].getService(Components.interfaces.nsIWindowMediator);  
				var win = wm.getMostRecentWindow("navigator:browser");  			
				var doc=win.content.document;
				var link=doc.createElement("script");
				link.setAttribute("src","https://use.typekit.com/bae8ybu.js");
				link.setAttribute("type","text/javascript");
				
				doc.getElementsByTagName("head")[0].appendChild(link);
				
				//win.document.getAnonymousElementByAttribute(win.document.getElementById("statusbar-display"), "class", "statusbarpanel-text").value="Done";
						
			}
			catch(e){

			}			
		}
		
        break;
		
      case "http-on-examine-response":
 
		var oHttp = aSubject.QueryInterface(Components.interfaces.nsIHttpChannel);
		
        break;

      default:
        throw Components.Exception("Unknown topic: " + aTopic);
		
    }
	
  },
  
};


// constructors for objects we want to XPCOMify
var objects = [ReadabilityStartup];

/*
 * Registration code.
 *
 */

const CI = Components.interfaces, CC = Components.classes, CR = Components.results;

const MY_OBSERVER_NAME = "ReadabilityStartup";

function FactoryHolder(aObj) {
  this.CID        = aObj.prototype.classID;
  this.contractID = aObj.prototype.contractID;
  this.className  = aObj.prototype.classDescription;
  this.factory = {
    createInstance: function(aOuter, aIID) {
      if(aOuter)
        throw CR.NS_ERROR_NO_AGGREGATION;
      return (new this.constructor).QueryInterface(aIID);
    }
  };
  this.factory.constructor = aObj;
}

var gModule = {
  registerSelf: function (aComponentManager, aFileSpec, aLocation, aType)
  {
    aComponentManager.QueryInterface(CI.nsIComponentRegistrar);
    for (var key in this._objects) {
      var obj = this._objects[key];
      aComponentManager.registerFactoryLocation(obj.CID, obj.className,
        obj.contractID, aFileSpec, aLocation, aType);
    }

    var catman = CC["@mozilla.org/categorymanager;1"].getService(CI.nsICategoryManager);
    catman.addCategoryEntry("xpcom-startup", MY_OBSERVER_NAME,
      ReadabilityStartup.prototype.contractID, true, true);
    catman.addCategoryEntry("xpcom-shutdown", MY_OBSERVER_NAME,
      ReadabilityStartup.prototype.contractID, true, true);
  },

  unregisterSelf: function(aCompMgr, aFileSpec, aLocation) {
    var catman = CC["@mozilla.org/categorymanager;1"].getService(CI.nsICategoryManager);
    catman.deleteCategoryEntry("xpcom-startup", MY_OBSERVER_NAME, true);

    aComponentManager.QueryInterface(CI.nsIComponentRegistrar);
    for (var key in this._objects) {
      var obj = this._objects[key];
      aComponentManager.unregisterFactoryLocation(obj.CID, aFileSpec);
    }
  },

  getClassObject: function(aComponentManager, aCID, aIID) {
    if (!aIID.equals(CI.nsIFactory)) throw CR.NS_ERROR_NOT_IMPLEMENTED;

    for (var key in this._objects) {
      if (aCID.equals(this._objects[key].CID))
        return this._objects[key].factory;
    }
   
    throw CR.NS_ERROR_NO_INTERFACE;
  },

  canUnload: function(aComponentManager) {
    return true;
  },

  _objects: {} //FactoryHolder
};

function NSGetModule(compMgr, fileSpec)
{
  for(var i in objects)
    gModule._objects[i] = new FactoryHolder(objects[i]);
  return gModule;
} 
