window.XMLSocket ||  (window.XMLSocket = function() {

    function __XMLSocket(XSEName) {
        this.close = function() {
            __checkFlash();
            __flash.TCallLabel("_root", "__close")
        };
        this.connect = function(url, port) {
            __checkFlash();
            __flash.SetVariable("__serverUrl", url);
            __flash.SetVariable("__serverPort", port);
            __flash.TCallLabel("_root", "__connect");
            return __flash.GetVariable("__sentinel")
        };
        this.getFlashPlayerVersion = function() {
            var FPV = 'function flashPlayerVersion() {' + '	var version = 0;' + '	if(navigator.plugins && navigator.plugins.length) {' + '		var __fi = navigator.plugins["Shockwave Flash"];' + '		if(__fi && __fi.description) {' + '			__fi = __fi.description;' + '			version = Number(__fi.charAt(__fi.indexOf(".")-1));' + '		};' + '	}' + '	else if(navigator.mimeTypes && navigator.mimeTypes.length) {' + '		var __fi = navigator.mimeTypes["application/x-shockwave-flash"];' + '		if (__fi && __fi.enabledPlugin && __fi.enabledPlugin.description) {' + '			__fi = __fi.enabledPlugin.description;' + '			version = Number(__fi.charAt(__fi.indexOf(".")-1));' + '		};' + '	}' + '	else {' + '		for(var a = 0; a < 12; a++) {' + '			try{' + '				var b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + a);' + '				version = a;' + '			}' + '			catch(e){ /** do nothing */ }' + '		}' + '	};' + '	return version;' + '};';
            if (navigator.userAgent.toLowerCase().indexOf('msie 4') < 0) {
                eval(FPV);
                FPV = flashPlayerVersion()
            } else
                FPV = 0;
            return FPV
        };
        this.init = function(divId) {
            var playerVersion = this.getFlashPlayerVersion(), swfName = (playerVersion >= 8 ? "XMLSocket" : "XMLSocketMX"), dname = 'swf' + Math.round((Math.random() * 1234567890)).toString(), flash = ['<object id="', dname, '" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ', 'codebase="http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,0,0" ', 'width="0" height="0">', '<param name="movie" value="', swfName, '.swf" />', '<embed swliveconnect="true" ', 'name="', dname, '" src="', swfName, '.swf" ', 'type="application/x-shockwave-flash" ', 'pluginspage="http://www.macromedia.com/go/getflashplayer" width="0" height="0" /></object>'].join('');
            if (swfName === "XMLSocket")
                __notConnected = false;
            divId = !document.getElementById ? document.all[divId] : document.getElementById(divId);
            divId.style.display = "inline";
            divId.style.position = "absolute";
            divId.style.top = divId.style.left = "0px";
            divId.innerHTML += flash;
            __flash.initName = dname
        };
        this.send = function(data) {
            __checkFlash();
            __flash.SetVariable("__JSData", data);
            __flash.TCallLabel("_root", "__send")
        };
        this.__callBackManager = function(evt) {
            var dom = null, xml;
            if (this[evt]) {
                if (__notConnected) {
                    if (evt === "onConnect")
                        __notConnected = false;
                    else if (evt === "onData" || evt === "onXML") {
                        __notConnected = false;
                        this["onConnect"](true)
                    }
                }
                ;
                xml = __flash.GetVariable("__lastData");
                switch (evt) {
                    case"onConnect":
                        this[evt](arguments[1]);
                        break;
                    case"onClose":
                        this[evt]();
                        break;
                    case"onXML":
                        if (typeof(DOMParser) === "function")
                            dom = new DOMParser().parseFromString(xml, "text/xml");
                        else if (window.ActiveXObject) {
                            dom = new ActiveXObject("Microsoft.XMLDOM");
                            dom.loadXML(xml)
                        }
                        ;
                        if (dom !== null)
                            xml = dom;
                    case"onData":
                        this[evt](xml);
                        break
                }
            }
        };
        function __checkFlash() {
            if (__flash.initName) {
                __flash = document[__flash.initName];
                __flash.SetVariable("__JSObject", "document." + XSEName)
            }
        }
        ;
        var __notConnected = true;
        var __flash = {}

    }

    var XSE = (navigator.userAgent.toLowerCase().indexOf('opera') >= 0 && !navigator.javaEnabled());
    if (!XSE) {
        XSE = 'XSE' + Math.round((Math.random() * 1234567890)).toString();
        document[XSE] = new __XMLSocket(XSE);
        XSE = document[XSE]
    }

    return XSE

});



