document.title = "Завантаження 50% « SalesBase";
require.once ("sys/GV.js") && window.GV.set ({hash: window.location.hash}) && (window.location.hash = "");

document.title = "Завантаження 60% « SalesBase";
if (!sapi ("SYS_ALTERNATE")) require.once ("ui/layout.js");
else require.once ("ui/layoutAlternative.js");
require.once ("lib/effect/texturizeFormElements.js", "lib/effect/titleToolTip.js", "ui/UI.report.js", "ui/UI.lock.js", "sys/AJAX.events.js", "sys/AJAXLinks.js", "sys/urlTrack.js", "lib/date/dowOffset.js", "lib/core/dbg.js");
Date.dowOffset (1);

document.title = "Завантаження 70% « SalesBase";
require.once ("sys/ntlm.js", "lib/core/Cookie.js");
if (Cookie ("__ntlm")) NTLM.auth ();

document.title = "Завантаження 80% « SalesBase";
require.once ("sys/_Request.js");
window.location.hash = sapi ("URL_MOD") + "core/login.php";
